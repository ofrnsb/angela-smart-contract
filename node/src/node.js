import { v4 as uuidv4 } from 'uuid';

export class Node {
  constructor(nodeId, nodeType, bankId, consensus, contractEngine) {
    this.nodeId = nodeId;
    this.nodeType = nodeType;
    this.bankId = bankId;
    this.consensus = consensus;
    this.contractEngine = contractEngine;
    
    // State store (key-value)
    this.state = {
      accounts: {}, // accounts/{bankId}/{accountId} -> balance
      products: {}, // products/{merchantId}/{productId} -> { price, stock }
      transactions: {} // transactions/{txId} -> { payload, timestamp, status }
    };

    // Initialize with demo data
    this.initializeDemoData();
  }

  initializeDemoData() {
    // Demo accounts
    this.setBalance('BNI', '1234567890', 10000000);
    this.setBalance('BNI', '0987654321', 5000000);
    this.setBalance('BCA', '1111111111', 8000000);
    this.setBalance('BCA', '2222222222', 6000000);

    // Demo products
    this.setProduct('TELKOMSEL', 'PULSA_50K', { price: 50000, stock: 999 });
    this.setProduct('TELKOMSEL', 'PULSA_100K', { price: 100000, stock: 999 });
    this.setProduct('PLN', 'TOKEN_20KWH', { price: 50000, stock: 999 });
    this.setProduct('PLN', 'TOKEN_50KWH', { price: 125000, stock: 999 });
  }

  getBalance(bankId, accountId) {
    const key = `accounts/${bankId}/${accountId}`;
    return this.state.accounts[key] || null;
  }

  setBalance(bankId, accountId, balance) {
    const key = `accounts/${bankId}/${accountId}`;
    this.state.accounts[key] = balance;
  }

  getProduct(merchantId, productId) {
    const key = `products/${merchantId}/${productId}`;
    return this.state.products[key] || null;
  }

  setProduct(merchantId, productId, product) {
    const key = `products/${merchantId}/${productId}`;
    this.state.products[key] = product;
  }

  async start() {
    console.log(`Node ${this.nodeId} started`);
  }

  async executeTransfer(payload) {
    const txId = uuidv4();
    const tx = {
      id: txId,
      type: payload.fromBank === payload.toBank ? 'TransferIntraBank' : 'TransferInterBank',
      payload,
      timestamp: Date.now()
    };

    // Execute contract through consensus
    const result = await this.consensus.proposeTransaction(tx, (tx) => {
      return this.contractEngine.execute(tx, this.state);
    });

    if (result.error) {
      return { error: result.error };
    }

    // Apply state changes
    this.applyStateChanges(result.stateDiff);
    
    // Store transaction
    this.state.transactions[txId] = {
      ...tx,
      status: 'SUCCESS'
    };

    return { txId, ...result };
  }

  async executePurchase(payload) {
    const txId = uuidv4();
    const tx = {
      id: txId,
      type: 'PurchaseProduct',
      payload,
      timestamp: Date.now()
    };

    // Execute contract through consensus
    const result = await this.consensus.proposeTransaction(tx, (tx) => {
      return this.contractEngine.execute(tx, this.state);
    });

    if (result.error) {
      return { error: result.error };
    }

    // Apply state changes
    this.applyStateChanges(result.stateDiff);
    
    // Store transaction
    this.state.transactions[txId] = {
      ...tx,
      status: 'SUCCESS'
    };

    return { txId, price: result.price, ...result };
  }

  applyStateChanges(stateDiff) {
    // Apply account balance changes
    if (stateDiff.accounts) {
      for (const [key, balance] of Object.entries(stateDiff.accounts)) {
        this.state.accounts[key] = balance;
      }
    }

    // Apply product changes
    if (stateDiff.products) {
      for (const [key, product] of Object.entries(stateDiff.products)) {
        this.state.products[key] = product;
      }
    }
  }

  getTransactions(bankId, accountId, limit) {
    const transactions = Object.values(this.state.transactions)
      .filter(tx => {
        if (bankId && accountId) {
          return (tx.payload.fromBank === bankId && tx.payload.fromAcc === accountId) ||
                 (tx.payload.toBank === bankId && tx.payload.toAcc === accountId) ||
                 (tx.payload.buyerBank === bankId && tx.payload.buyerAcc === accountId);
        }
        return true;
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    return transactions;
  }

  getProducts(merchantId) {
    if (merchantId) {
      return Object.entries(this.state.products)
        .filter(([key]) => key.startsWith(`products/${merchantId}/`))
        .map(([key, product]) => ({
          id: key.split('/')[2],
          merchantId,
          ...product
        }));
    }
    
    return Object.entries(this.state.products).map(([key, product]) => {
      const parts = key.split('/');
      return {
        id: parts[2],
        merchantId: parts[1],
        ...product
      };
    });
  }
}

