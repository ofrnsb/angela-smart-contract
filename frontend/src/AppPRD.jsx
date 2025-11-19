import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './index.css';
import AboutPage from './components/AboutPage';

// Contract ABIs (simplified for demo)
const IDR_TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
  "function approve(address,uint256) returns (bool)",
  "function allowance(address,address) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const ACCOUNT_REGISTRY_ABI = [
  "function resolveAccount(string) view returns (address,address)",
  "function getAccount(string) view returns (tuple(string,address,address,bool,uint256))",
  "function getAllAccountNumbers() view returns (string[])",
  "event AccountRegistered(string indexed,address indexed,address indexed,uint256)"
];

const INTERBANK_SETTLEMENT_ABI = [
  "function proposeTransfer(string,string,uint256)",
  "function approveTransfer(uint256)",
  "function getTransferRequest(uint256) view returns (string,string,uint256,address,uint256,bool,uint256,uint256)",
  "function nextRequestId() view returns (uint256)",
  "event TransferProposed(uint256 indexed,string indexed,string indexed,uint256,address,uint256)",
  "event TransferApproved(uint256 indexed,address indexed,uint256,uint256)",
  "event InterbankSettled(uint256 indexed,string indexed,string indexed,uint256,uint256)"
];

const PRODUCT_CATALOG_ABI = [
  "function getProduct(uint256) view returns (tuple(uint256,string,address,uint256,bool,string,uint256))",
  "function getAllProductIds() view returns (uint256[])",
  "function getActiveProducts() view returns (uint256[])"
];

const PURCHASE_PROCESSOR_ABI = [
  "function createPurchase(string,uint256) returns (uint256)",
  "function markFulfilled(uint256)",
  "function markFailed(uint256,string)",
  "function getOrder(uint256) view returns (tuple(uint256,string,address,uint256,uint256,address,uint8,uint256,uint256,uint256))",
  "function getPendingOrdersForProvider(address) view returns (uint256[])",
  "function nextOrderId() view returns (uint256)",
  "event PurchaseCommitted(uint256 indexed,string indexed,uint256 indexed,uint256,address,uint256)",
  "event PurchaseFulfilled(uint256 indexed,address indexed,uint256)",
  "event PurchaseFailed(uint256 indexed,address indexed,string,uint256)",
  "event PurchaseRefunded(uint256 indexed,string indexed,uint256,uint256)"
];

// Seeded accounts (from Hardhat)
const SEEDED_ACCOUNTS = {
  bankA: { name: "Bank A", address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" },
  bankB: { name: "Bank B", address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" },
  regulator: { name: "Regulator", address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a" },
  validator1: { name: "Validator 1", address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6" },
  validator2: { name: "Validator 2", address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", privateKey: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a" },
  provider: { name: "Provider", address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba" },
  user1: { name: "User 1", address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9", privateKey: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e" },
  user2: { name: "User 2", address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", privateKey: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356" }
};

// Contract addresses (update after deployment)
const CONTRACT_ADDRESSES = {
  IDRToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  AccountRegistry: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  InterbankSettlement: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  ProductCatalog: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  PurchaseProcessor: "0xDc64a140Aa3E981100a9becA4E685f962f0cF706"
};

function AppPRD() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [showAboutPage, setShowAboutPage] = useState(false);

  // Form states
  const [transferForm, setTransferForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    memo: ''
  });
  const [purchaseForm, setPurchaseForm] = useState({
    buyerAccount: '',
    productId: ''
  });

  useEffect(() => {
    initProvider();
  }, []);

  useEffect(() => {
    if (signer && provider) {
      loadData();
      setupEventListeners();
    }
  }, [signer, provider]);

  const initProvider = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        setProvider(provider);
        
        // For demo: use first account or allow role switching
        const signer = await provider.getSigner();
        setSigner(signer);
      } else {
        // Fallback to localhost for demo
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        setProvider(provider);
      }
    } catch (error) {
      console.error("Error initializing provider:", error);
    }
  };

  const switchRole = async (roleKey) => {
    try {
      if (!provider) return;
      
      const role = SEEDED_ACCOUNTS[roleKey];
      if (!role) return;

      // For demo: create signer from private key
      const wallet = new ethers.Wallet(role.privateKey, provider);
      setSigner(wallet);
      setCurrentRole(roleKey);
      
      console.log(`Switched to role: ${role.name}`);
    } catch (error) {
      console.error("Error switching role:", error);
    }
  };

  const loadData = async () => {
    if (!signer || !provider) return;
    
    try {
      await loadAccounts();
      await loadProducts();
      await loadPendingTransfers();
      await loadPendingOrders();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const loadAccounts = async () => {
    try {
      const registry = new ethers.Contract(
        CONTRACT_ADDRESSES.AccountRegistry,
        ACCOUNT_REGISTRY_ABI,
        provider
      );
      
      const accountNumbers = await registry.getAllAccountNumbers();
      const idrToken = new ethers.Contract(
        CONTRACT_ADDRESSES.IDRToken,
        IDR_TOKEN_ABI,
        provider
      );
      
      const accountData = await Promise.all(
        accountNumbers.map(async (accNum) => {
          const account = await registry.getAccount(accNum);
          const balance = await idrToken.balanceOf(account[1]);
          return {
            accountNumber: accNum,
            ownerAddress: account[1],
            bankAddress: account[2],
            bank: account[2].toLowerCase() === SEEDED_ACCOUNTS.bankA.address.toLowerCase() ? 'BankA' : 'BankB',
            balance: balance.toString()
          };
        })
      );
      
      setAccounts(accountData);
    } catch (error) {
      console.error("Error loading accounts:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const catalog = new ethers.Contract(
        CONTRACT_ADDRESSES.ProductCatalog,
        PRODUCT_CATALOG_ABI,
        provider
      );
      
      const productIds = await catalog.getActiveProducts();
      const productData = await Promise.all(
        productIds.map(async (id) => {
          const product = await catalog.getProduct(id);
          return {
            id: id.toString(),
            name: product[1],
            provider: product[2],
            price: product[3].toString(),
            description: product[5]
          };
        })
      );
      
      setProducts(productData);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const loadPendingTransfers = async () => {
    try {
      const settlement = new ethers.Contract(
        CONTRACT_ADDRESSES.InterbankSettlement,
        INTERBANK_SETTLEMENT_ABI,
        provider
      );
      
      const nextId = await settlement.nextRequestId();
      const transfers = [];
      
      for (let i = 0; i < nextId; i++) {
        try {
          const request = await settlement.getTransferRequest(i);
          if (!request[5]) { // not executed
            transfers.push({
              id: i,
              fromAccount: request[0],
              toAccount: request[1],
              amount: request[2].toString(),
              proposerBank: request[3],
              approvals: request[4].toString(),
              createdAt: request[6].toString()
            });
          }
        } catch (e) {
          // Request doesn't exist or was deleted
        }
      }
      
      setPendingTransfers(transfers);
    } catch (error) {
      console.error("Error loading pending transfers:", error);
    }
  };

  const loadPendingOrders = async () => {
    try {
      const processor = new ethers.Contract(
        CONTRACT_ADDRESSES.PurchaseProcessor,
        PURCHASE_PROCESSOR_ABI,
        provider
      );
      
      if (currentRole === 'provider' && signer) {
        const orderIds = await processor.getPendingOrdersForProvider(SEEDED_ACCOUNTS.provider.address);
        const orders = await Promise.all(
          orderIds.map(async (id) => {
            const order = await processor.getOrder(id);
            return {
              id: id.toString(),
              buyerAccount: order[1],
              productId: order[3].toString(),
              amount: order[4].toString(),
              status: order[6]
            };
          })
        );
        setPendingOrders(orders);
      }
    } catch (error) {
      console.error("Error loading pending orders:", error);
    }
  };

  const setupEventListeners = () => {
    if (!provider) return;
    
    // Listen to all contract events
    const contracts = [
      { address: CONTRACT_ADDRESSES.InterbankSettlement, abi: INTERBANK_SETTLEMENT_ABI, name: 'InterbankSettlement' },
      { address: CONTRACT_ADDRESSES.PurchaseProcessor, abi: PURCHASE_PROCESSOR_ABI, name: 'PurchaseProcessor' }
    ];
    
    contracts.forEach(({ address, abi, name }) => {
      const contract = new ethers.Contract(address, abi, provider);
      
      // Listen to all events
      contract.on("*", (event) => {
        addEvent({
          contract: name,
          event: event.eventName,
          args: event.args,
          timestamp: new Date().toISOString()
        });
      });
    });
  };

  const addEvent = (event) => {
    setEvents(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events
  };

  const handleIntraBankTransfer = async () => {
    if (!signer || !transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      const registry = new ethers.Contract(
        CONTRACT_ADDRESSES.AccountRegistry,
        ACCOUNT_REGISTRY_ABI,
        provider
      );
      
      const [fromAddress] = await registry.resolveAccount(transferForm.fromAccount);
      const [toAddress] = await registry.resolveAccount(transferForm.toAccount);
      
      const idrToken = new ethers.Contract(
        CONTRACT_ADDRESSES.IDRToken,
        IDR_TOKEN_ABI,
        signer
      );
      
      // Convert IDR to wei (18 decimals for demo)
      const amount = ethers.parseUnits(transferForm.amount, 18);
      await idrToken.transfer(toAddress, amount);
      
      alert("Transfer successful!");
      setTransferForm({ fromAccount: '', toAccount: '', amount: '', memo: '' });
      loadData();
    } catch (error) {
      console.error("Transfer error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleInterbankTransfer = async () => {
    if (!signer || !transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      const settlement = new ethers.Contract(
        CONTRACT_ADDRESSES.InterbankSettlement,
        INTERBANK_SETTLEMENT_ABI,
        signer
      );
      
      // Convert IDR to wei (18 decimals for demo)
      const amount = ethers.parseUnits(transferForm.amount, 18);
      await settlement.proposeTransfer(
        transferForm.fromAccount,
        transferForm.toAccount,
        amount
      );
      
      alert("Transfer proposed! Waiting for validator approvals.");
      setTransferForm({ fromAccount: '', toAccount: '', amount: '', memo: '' });
      loadData();
    } catch (error) {
      console.error("Propose transfer error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleApproveTransfer = async (requestId) => {
    if (!signer) {
      alert("Please select a validator role");
      return;
    }

    try {
      const settlement = new ethers.Contract(
        CONTRACT_ADDRESSES.InterbankSettlement,
        INTERBANK_SETTLEMENT_ABI,
        signer
      );
      
      await settlement.approveTransfer(requestId);
      alert("Transfer approved!");
      loadData();
    } catch (error) {
      console.error("Approve error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handlePurchase = async () => {
    if (!signer || !purchaseForm.buyerAccount || !purchaseForm.productId) {
      alert("Please fill all fields");
      return;
    }

    try {
      const processor = new ethers.Contract(
        CONTRACT_ADDRESSES.PurchaseProcessor,
        PURCHASE_PROCESSOR_ABI,
        signer
      );
      
      await processor.createPurchase(
        purchaseForm.buyerAccount,
        purchaseForm.productId
      );
      
      alert("Purchase created! Waiting for provider fulfillment.");
      setPurchaseForm({ buyerAccount: '', productId: '' });
      loadData();
    } catch (error) {
      console.error("Purchase error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleFulfillOrder = async (orderId) => {
    if (!signer) {
      alert("Please select provider role");
      return;
    }

    try {
      const processor = new ethers.Contract(
        CONTRACT_ADDRESSES.PurchaseProcessor,
        PURCHASE_PROCESSOR_ABI,
        signer
      );
      
      await processor.markFulfilled(orderId);
      alert("Order fulfilled!");
      loadData();
    } catch (error) {
      console.error("Fulfill error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleFailOrder = async (orderId) => {
    if (!signer) {
      alert("Please select provider role");
      return;
    }

    try {
      const processor = new ethers.Contract(
        CONTRACT_ADDRESSES.PurchaseProcessor,
        PURCHASE_PROCESSOR_ABI,
        signer
      );
      
      await processor.markFailed(orderId, "Provider cancelled");
      alert("Order marked as failed!");
      loadData();
    } catch (error) {
      console.error("Fail order error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (showAboutPage) {
    return <AboutPage onBack={() => setShowAboutPage(false)} />;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Contract-Based Payment System (PRD Demo)</h1>
        <button 
          onClick={() => setShowAboutPage(true)}
          style={{ background: '#28a745', width: 'auto', padding: '10px 20px' }}
        >
          Penjelasan Smart Contract
        </button>
      </div>

      <div className="card" style={{ background: '#fff3cd', border: '2px solid #ffc107', marginBottom: '20px' }}>
        <p style={{ margin: 0, color: '#856404' }}>
          <strong>Demo Mode:</strong> This is a local demo simulation. No real fiat movement. 
          Switch roles using the selector below to act as different parties.
        </p>
      </div>

      {/* Role Selector */}
      <div className="card">
        <h2>Role Selector</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {Object.entries(SEEDED_ACCOUNTS).map(([key, role]) => (
            <button
              key={key}
              onClick={() => switchRole(key)}
              style={{
                background: currentRole === key ? '#667eea' : '#ccc',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {role.name}
            </button>
          ))}
        </div>
        {currentRole && (
          <p style={{ marginTop: '15px' }}>
            <strong>Current Role:</strong> {SEEDED_ACCOUNTS[currentRole].name} 
            ({SEEDED_ACCOUNTS[currentRole].address.slice(0, 10)}...)
          </p>
        )}
      </div>

      {/* Simple Transfer Panel */}
      <div className="card">
        <h2>Transfer</h2>
        <div className="form-group">
          <label>From Account</label>
          <select
            value={transferForm.fromAccount}
            onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value })}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          >
            <option value="">-- Select From Account --</option>
            {accounts.map(acc => (
              <option key={acc.accountNumber} value={acc.accountNumber}>
                {acc.accountNumber} ({acc.bank}) - Saldo: Rp {acc.balance ? (parseFloat(acc.balance) / 1e18).toLocaleString('id-ID') : '0'}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>To Account</label>
          <select
            value={transferForm.toAccount}
            onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          >
            <option value="">-- Select To Account --</option>
            {accounts
              .filter(acc => acc.accountNumber !== transferForm.fromAccount)
              .map(acc => (
                <option key={acc.accountNumber} value={acc.accountNumber}>
                  {acc.accountNumber} ({acc.bank})
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>Amount (IDR)</label>
          <input
            type="number"
            value={transferForm.amount}
            onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
            placeholder="0"
            step="1000"
            min="0"
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          />
        </div>
        <div className="form-group">
          <label>Memo (Optional)</label>
          <input
            type="text"
            value={transferForm.memo}
            onChange={(e) => setTransferForm({ ...transferForm, memo: e.target.value })}
            placeholder="Transfer description"
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          />
        </div>
        <button 
          onClick={async () => {
            const fromAcc = accounts.find(a => a.accountNumber === transferForm.fromAccount);
            const toAcc = accounts.find(a => a.accountNumber === transferForm.toAccount);
            
            if (fromAcc && toAcc && fromAcc.bank === toAcc.bank) {
              await handleIntraBankTransfer();
            } else {
              await handleInterbankTransfer();
            }
          }}
        >
          Submit Transfer
        </button>
      </div>

      {/* Product Purchase Panel */}
      <div className="card">
        <h2>Product Purchase</h2>
        <div className="form-group">
          <label>Buyer Account</label>
          <select
            value={purchaseForm.buyerAccount}
            onChange={(e) => setPurchaseForm({ ...purchaseForm, buyerAccount: e.target.value })}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          >
            <option value="">-- Select Buyer Account --</option>
            {accounts.map(acc => (
              <option key={acc.accountNumber} value={acc.accountNumber}>
                {acc.accountNumber} ({acc.bank}) - Saldo: Rp {acc.balance ? (parseFloat(acc.balance) / 1e18).toLocaleString('id-ID') : '0'}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Product</label>
          <select
            value={purchaseForm.productId}
            onChange={(e) => setPurchaseForm({ ...purchaseForm, productId: e.target.value })}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          >
            <option value="">-- Select Product --</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - Rp {(parseFloat(product.price) / 1e18).toLocaleString('id-ID')}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handlePurchase}>Buy Product</button>
      </div>

      {/* Validator Panel */}
      {(currentRole === 'validator1' || currentRole === 'validator2') && (
        <div className="card">
          <h2>Validator Panel - Pending Transfers</h2>
          {pendingTransfers.length === 0 ? (
            <p>No pending transfers</p>
          ) : (
            <div>
              {pendingTransfers.map(transfer => (
                <div key={transfer.id} style={{ 
                  padding: '15px', 
                  margin: '10px 0', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <p><strong>Request ID:</strong> {transfer.id}</p>
                  <p><strong>From:</strong> {transfer.fromAccount}</p>
                  <p><strong>To:</strong> {transfer.toAccount}</p>
                  <p><strong>Amount:</strong> Rp {(parseFloat(transfer.amount) / 1e18).toLocaleString('id-ID')}</p>
                  <p><strong>Approvals:</strong> {transfer.approvals} / 2</p>
                  <button 
                    onClick={() => handleApproveTransfer(transfer.id)}
                    style={{ marginTop: '10px', marginRight: '10px' }}
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Provider Panel */}
      {currentRole === 'provider' && (
        <div className="card">
          <h2>Provider Panel - Pending Orders</h2>
          {pendingOrders.length === 0 ? (
            <p>No pending orders</p>
          ) : (
            <div>
              {pendingOrders.map(order => (
                <div key={order.id} style={{ 
                  padding: '15px', 
                  margin: '10px 0', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>Buyer:</strong> {order.buyerAccount}</p>
                  <p><strong>Product ID:</strong> {order.productId}</p>
                  <p><strong>Amount:</strong> Rp {(parseFloat(order.amount) / 1e18).toLocaleString('id-ID')}</p>
                  <button 
                    onClick={() => handleFulfillOrder(order.id)}
                    style={{ marginTop: '10px', marginRight: '10px', background: '#28a745' }}
                  >
                    Fulfill
                  </button>
                  <button 
                    onClick={() => handleFailOrder(order.id)}
                    style={{ marginTop: '10px', background: '#dc3545' }}
                  >
                    Fail
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Audit Feed */}
      <div className="card">
        <h2>Audit Feed (Events)</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {events.length === 0 ? (
            <p>No events yet</p>
          ) : (
            events.map((event, idx) => (
              <div key={idx} style={{ 
                padding: '10px', 
                margin: '5px 0', 
                background: '#f8f9fa', 
                borderRadius: '4px',
                fontSize: '0.9em'
              }}>
                <strong>{event.contract}:</strong> {event.event}
                <br />
                <small style={{ color: '#666' }}>{event.timestamp}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AppPRD;

