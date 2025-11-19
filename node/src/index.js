import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Node } from './node.js';
import { Consensus } from './consensus/raft.js';
import { SmartContractEngine } from './contracts/engine.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Konfigurasi node dari environment
const NODE_ID = process.env.NODE_ID || 'node-1';
const NODE_TYPE = process.env.NODE_TYPE || 'bank'; // bank, merchant, regulator
const BANK_ID = process.env.BANK_ID || 'BNI';
const PORT = parseInt(process.env.PORT || '3001');
const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];

// Inisialisasi node
const consensus = new Consensus(NODE_ID, PEERS);
const contractEngine = new SmartContractEngine();
const node = new Node(NODE_ID, NODE_TYPE, BANK_ID, consensus, contractEngine);

// Start consensus
consensus.start().catch(console.error);
node.start().catch(console.error);

console.log(`Node ${NODE_ID} (${NODE_TYPE}) started on port ${PORT}`);
console.log(`Bank ID: ${BANK_ID}`);
console.log(`Peers: ${PEERS.join(', ') || 'none'}`);

// Health check
app.get('/health', (req, res) => {
  res.json({
    nodeId: NODE_ID,
    nodeType: NODE_TYPE,
    bankId: BANK_ID,
    status: 'healthy',
    peers: PEERS.length
  });
});

// Get balance
app.get('/balance', (req, res) => {
  const { bank, acc } = req.query;
  if (!bank || !acc) {
    return res.status(400).json({ error: 'Missing bank or acc parameter' });
  }

  const balance = node.getBalance(bank, acc);
  if (balance === null) {
    return res.status(404).json({ error: 'ACCOUNT_NOT_FOUND' });
  }

  res.json({ balance, bank, account: acc });
});

// Transfer
app.post('/transfer', async (req, res) => {
  const { fromBank, fromAcc, toBank, toAcc, amount } = req.body;

  if (!fromBank || !fromAcc || !toBank || !toAcc || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be positive' });
  }

  try {
    const result = await node.executeTransfer({
      fromBank,
      fromAcc,
      toBank,
      toAcc,
      amount: parseInt(amount)
    });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      status: 'SUCCESS',
      transactionId: result.txId,
      fromBank,
      fromAcc,
      toBank,
      toAcc,
      amount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase product
app.post('/purchase', async (req, res) => {
  const { buyerBank, buyerAcc, merchantId, productId } = req.body;

  if (!buyerBank || !buyerAcc || !merchantId || !productId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await node.executePurchase({
      buyerBank,
      buyerAcc,
      merchantId,
      productId
    });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      status: 'SUCCESS',
      transactionId: result.txId,
      buyerBank,
      buyerAcc,
      merchantId,
      productId,
      price: result.price
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transactions
app.get('/transactions', (req, res) => {
  const { bank, acc, limit = 50 } = req.query;
  const transactions = node.getTransactions(bank, acc, parseInt(limit));
  res.json({ transactions });
});

// Get products
app.get('/products', (req, res) => {
  const { merchantId } = req.query;
  const products = node.getProducts(merchantId);
  res.json({ products });
});

// Start server
app.listen(PORT, () => {
  console.log(`RPC API server listening on port ${PORT}`);
});

