import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './index.css';
import AboutPage from './components/AboutPage';

// Dummy bank accounts - langsung tersedia
const DUMMY_ACCOUNTS = {
  '1234567890': { 
    accountNumber: '1234567890', 
    accountName: 'Budi Santoso', 
    balance: 10000000, 
    bank: 'Bank Mandiri',
    bankCode: 'BM'
  },
  '0987654321': { 
    accountNumber: '0987654321', 
    accountName: 'Siti Nurhaliza', 
    balance: 5000000, 
    bank: 'Bank Mandiri',
    bankCode: 'BM'
  },
  '1122334455': { 
    accountNumber: '1122334455', 
    accountName: 'Rina Wati', 
    balance: 7500000, 
    bank: 'Bank Mandiri',
    bankCode: 'BM'
  },
  '2233445566': { 
    accountNumber: '2233445566', 
    accountName: 'Dedi Kurniawan', 
    balance: 12000000, 
    bank: 'Bank Mandiri',
    bankCode: 'BM'
  },
  '1111111111': { 
    accountNumber: '1111111111', 
    accountName: 'Ahmad Yani', 
    balance: 8000000, 
    bank: 'Bank BCA',
    bankCode: 'BCA'
  },
  '2222222222': { 
    accountNumber: '2222222222', 
    accountName: 'Maya Sari', 
    balance: 6000000, 
    bank: 'Bank BCA',
    bankCode: 'BCA'
  },
  '3333333333': { 
    accountNumber: '3333333333', 
    accountName: 'Bambang Sutrisno', 
    balance: 15000000, 
    bank: 'Bank BCA',
    bankCode: 'BCA'
  },
  '4444444444': { 
    accountNumber: '4444444444', 
    accountName: 'Lisa Permata', 
    balance: 9000000, 
    bank: 'Bank BCA',
    bankCode: 'BCA'
  },
  '5555555555': { 
    accountNumber: '5555555555', 
    accountName: 'Joko Widodo', 
    balance: 11000000, 
    bank: 'Bank BRI',
    bankCode: 'BRI'
  },
  '6666666666': { 
    accountNumber: '6666666666', 
    accountName: 'Sari Indah', 
    balance: 7000000, 
    bank: 'Bank BRI',
    bankCode: 'BRI'
  }
};

// Dummy products
const DUMMY_PRODUCTS = [
  { id: 1, name: 'Token Listrik 20kWh', price: 50000, provider: 'PLN', description: 'Token listrik untuk 20kWh' },
  { id: 2, name: 'Token Listrik 50kWh', price: 125000, provider: 'PLN', description: 'Token listrik untuk 50kWh' },
  { id: 3, name: 'Pulsa 50.000', price: 50000, provider: 'Telkomsel', description: 'Pulsa seluler 50.000 untuk semua operator' },
  { id: 4, name: 'Paket Data 10GB', price: 75000, provider: 'Indosat', description: 'Paket data internet 10GB - 30 hari' },
  { id: 5, name: 'Voucher Game 100k', price: 100000, provider: 'Steam', description: 'Voucher game Steam senilai 100.000' }
];

function AppPRD() {
  const [accounts, setAccounts] = useState(DUMMY_ACCOUNTS);
  const [products] = useState(DUMMY_PRODUCTS);
  const [showAboutPage, setShowAboutPage] = useState(false);
  
  // Transfer form
  const [transferForm, setTransferForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    memo: ''
  });
  
  // Purchase form
  const [purchaseForm, setPurchaseForm] = useState({
    buyerAccount: '',
    productId: ''
  });
  
  // Loading and flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [flowSteps, setFlowSteps] = useState([]);
  const [smartContractData, setSmartContractData] = useState(null);
  const [transactionResult, setTransactionResult] = useState(null);
  const [showFlowModal, setShowFlowModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  // Load accounts from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('banking_accounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    } else {
      localStorage.setItem('banking_accounts', JSON.stringify(DUMMY_ACCOUNTS));
    }
  }, []);

  const saveAccounts = (updatedAccounts) => {
    setAccounts(updatedAccounts);
    localStorage.setItem('banking_accounts', JSON.stringify(updatedAccounts));
  };

  const simulateTransferFlow = async (fromAcc, toAcc, amount, isInterbank) => {
    setIsProcessing(true);
    setFlowSteps([]);
    setSmartContractData(null);
    setTransactionResult(null);
    setShowFlowModal(true);
    setShowContractModal(false);

    const steps = [];
    
    if (isInterbank) {
      // Interbank transfer flow
      steps.push({ 
        step: 1, 
        title: 'Validasi Rekening', 
        description: 'Memverifikasi rekening asal dan tujuan',
        status: 'processing',
        node: 'Node Bank Asal'
      });
      await delay(800);
      setFlowSteps([...steps]);
      
      steps[0].status = 'completed';
      steps.push({ 
        step: 2, 
        title: 'Cek Saldo', 
        description: `Memverifikasi saldo rekening ${fromAcc.accountNumber}`,
        status: 'processing',
        node: 'Node Bank Asal'
      });
      await delay(600);
      setFlowSteps([...steps]);
      
      steps[1].status = 'completed';
      steps.push({ 
        step: 3, 
        title: 'Propose Transfer', 
        description: 'Mengirim proposal transfer ke jaringan',
        status: 'processing',
        node: 'Interbank Network'
      });
      await delay(1000);
      setFlowSteps([...steps]);
      
      steps[2].status = 'completed';
      steps.push({ 
        step: 4, 
        title: 'Validasi Node 1', 
        description: 'Validator 1 memverifikasi transaksi',
        status: 'processing',
        node: 'Validator Node 1'
      });
      await delay(1200);
      setFlowSteps([...steps]);
      
      steps[3].status = 'completed';
      steps.push({ 
        step: 5, 
        title: 'Validasi Node 2', 
        description: 'Validator 2 memverifikasi transaksi',
        status: 'processing',
        node: 'Validator Node 2'
      });
      await delay(1200);
      setFlowSteps([...steps]);
      
      steps[4].status = 'completed';
      steps.push({ 
        step: 6, 
        title: 'Settlement', 
        description: 'Menyelesaikan transfer antar bank',
        status: 'processing',
        node: 'Settlement Node'
      });
      await delay(1000);
      setFlowSteps([...steps]);
      
      steps[5].status = 'completed';
      steps.push({ 
        step: 7, 
        title: 'Update Saldo', 
        description: 'Memperbarui saldo rekening asal dan tujuan',
        status: 'processing',
        node: 'Database Node'
      });
      await delay(800);
      setFlowSteps([...steps]);
      
      steps[6].status = 'completed';
      
      // Set smart contract data with real hash
      const contractHash = generateContractHash();
      setSmartContractData({
        contractName: 'InterbankSettlement',
        contractAddress: contractHash,
        function: 'proposeTransfer',
        parameters: {
          fromAccount: fromAcc.accountNumber,
          toAccount: toAcc.accountNumber,
          amount: `Rp ${parseFloat(amount).toLocaleString('id-ID')}`,
          proposerBank: fromAcc.bank,
          validators: ['Validator Node 1', 'Validator Node 2'],
          approvalThreshold: '2 dari 2',
          timestamp: new Date().toISOString()
        },
        result: {
          requestId: Math.floor(Math.random() * 10000),
          status: 'Settled',
          executionTime: '4.6 detik',
          transactionHash: generateTransactionHash()
        }
      });
    } else {
      // Intra-bank transfer flow
      steps.push({ 
        step: 1, 
        title: 'Validasi Rekening', 
        description: 'Memverifikasi rekening asal dan tujuan',
        status: 'processing',
        node: 'Bank Internal Node'
      });
      await delay(600);
      setFlowSteps([...steps]);
      
      steps[0].status = 'completed';
      steps.push({ 
        step: 2, 
        title: 'Cek Saldo', 
        description: `Memverifikasi saldo rekening ${fromAcc.accountNumber}`,
        status: 'processing',
        node: 'Bank Internal Node'
      });
      await delay(500);
      setFlowSteps([...steps]);
      
      steps[1].status = 'completed';
      steps.push({ 
        step: 3, 
        title: 'Eksekusi Transfer', 
        description: 'Memproses transfer antar rekening',
        status: 'processing',
        node: 'Bank Internal Node'
      });
      await delay(800);
      setFlowSteps([...steps]);
      
      steps[2].status = 'completed';
      steps.push({ 
        step: 4, 
        title: 'Update Saldo', 
        description: 'Memperbarui saldo rekening asal dan tujuan',
        status: 'processing',
        node: 'Database Node'
      });
      await delay(600);
      setFlowSteps([...steps]);
      
      steps[3].status = 'completed';
      
      // Set smart contract data with real hash
      const contractHash = generateContractHash();
      setSmartContractData({
        contractName: 'BankTransfer',
        contractAddress: contractHash,
        function: 'transferInternal',
        parameters: {
          fromAccount: fromAcc.accountNumber,
          toAccount: toAcc.accountNumber,
          amount: `Rp ${parseFloat(amount).toLocaleString('id-ID')}`,
          bank: fromAcc.bank,
          timestamp: new Date().toISOString()
        },
        result: {
          status: 'Success',
          executionTime: '2.5 detik',
          transactionHash: generateTransactionHash()
        }
      });
    }
    
    // Update balances
    const updatedAccounts = { ...accounts };
    updatedAccounts[fromAcc.accountNumber].balance -= parseFloat(amount);
    updatedAccounts[toAcc.accountNumber].balance += parseFloat(amount);
    saveAccounts(updatedAccounts);
    
    setTransactionResult({
      success: true,
      message: `Transfer berhasil! Rp ${parseFloat(amount).toLocaleString('id-ID')} dari ${fromAcc.accountNumber} ke ${toAcc.accountNumber}`,
      fromBalance: updatedAccounts[fromAcc.accountNumber].balance,
      toBalance: updatedAccounts[toAcc.accountNumber].balance
    });
    
    setIsProcessing(false);
    setShowFlowModal(false);
    setShowContractModal(true);
  };

  const simulatePurchaseFlow = async (buyerAcc, product) => {
    setIsProcessing(true);
    setFlowSteps([]);
    setSmartContractData(null);
    setTransactionResult(null);

    const steps = [];
    
    steps.push({ 
      step: 1, 
      title: 'Validasi Rekening', 
      description: `Memverifikasi rekening ${buyerAcc.accountNumber}`,
      status: 'processing',
      node: 'Bank Node'
    });
    await delay(600);
    setFlowSteps([...steps]);
    
    steps[0].status = 'completed';
    steps.push({ 
      step: 2, 
      title: 'Cek Saldo', 
      description: `Memverifikasi saldo untuk pembayaran`,
      status: 'processing',
      node: 'Bank Node'
    });
    await delay(500);
    setFlowSteps([...steps]);
    
    steps[1].status = 'completed';
    steps.push({ 
      step: 3, 
      title: 'Escrow Funds', 
      description: 'Mengunci dana pembayaran',
      status: 'processing',
      node: 'Escrow Node'
    });
    await delay(800);
    setFlowSteps([...steps]);
    
    steps[2].status = 'completed';
    steps.push({ 
      step: 4, 
      title: 'Notifikasi Provider', 
      description: `Mengirim notifikasi ke ${product.provider}`,
      status: 'processing',
      node: 'Provider Node'
    });
    await delay(1000);
    setFlowSteps([...steps]);
    
    steps[3].status = 'completed';
    steps.push({ 
      step: 5, 
      title: 'Fulfillment', 
      description: 'Provider memproses pesanan',
      status: 'processing',
      node: 'Provider Node'
    });
    await delay(1200);
    setFlowSteps([...steps]);
    
    steps[4].status = 'completed';
    steps.push({ 
      step: 6, 
      title: 'Release Payment', 
      description: 'Melepaskan pembayaran ke provider',
      status: 'processing',
      node: 'Payment Node'
    });
    await delay(800);
    setFlowSteps([...steps]);
    
    steps[5].status = 'completed';
    steps.push({ 
      step: 7, 
      title: 'Update Saldo', 
      description: 'Memperbarui saldo rekening',
      status: 'processing',
      node: 'Database Node'
    });
    await delay(600);
    setFlowSteps([...steps]);
    
    steps[6].status = 'completed';
    
    // Update balance
    const updatedAccounts = { ...accounts };
    updatedAccounts[buyerAcc.accountNumber].balance -= product.price;
    saveAccounts(updatedAccounts);
    
    // Set smart contract data with real hash
    const contractHash = generateContractHash();
    setSmartContractData({
      contractName: 'PurchaseProcessor',
      contractAddress: contractHash,
      function: 'createPurchase',
      parameters: {
        buyerAccount: buyerAcc.accountNumber,
        productId: product.id.toString(),
        productName: product.name,
        amount: `Rp ${product.price.toLocaleString('id-ID')}`,
        provider: product.provider,
        timestamp: new Date().toISOString()
      },
      result: {
        orderId: Math.floor(Math.random() * 10000),
        status: 'Fulfilled',
        executionTime: '5.5 detik',
        transactionHash: generateTransactionHash()
      }
    });
    
    setTransactionResult({
      success: true,
      message: `Pembelian berhasil! ${product.name} untuk rekening ${buyerAcc.accountNumber}`,
      remainingBalance: updatedAccounts[buyerAcc.accountNumber].balance
    });
    
    setIsProcessing(false);
    setShowFlowModal(false);
    setShowContractModal(true);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Generate realistic contract hash (64 hex characters)
  const generateContractHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  // Generate realistic transaction hash (64 hex characters)
  const generateTransactionHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  const handleTransfer = async () => {
    if (!transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount) {
      alert('Mohon lengkapi semua field');
      return;
    }

    const fromAcc = accounts[transferForm.fromAccount];
    const toAcc = accounts[transferForm.toAccount];
    const amount = parseFloat(transferForm.amount);

    if (isNaN(amount) || amount <= 0) {
      alert('Jumlah transfer tidak valid');
      return;
    }

    if (fromAcc.balance < amount) {
      alert('Saldo tidak mencukupi');
      return;
    }

    if (fromAcc.accountNumber === toAcc.accountNumber) {
      alert('Rekening asal dan tujuan tidak boleh sama');
      return;
    }

    const isInterbank = fromAcc.bankCode !== toAcc.bankCode;
    await simulateTransferFlow(fromAcc, toAcc, amount, isInterbank);
    
    // Reset form
    setTransferForm({ fromAccount: '', toAccount: '', amount: '', memo: '' });
  };

  const handlePurchase = async () => {
    if (!purchaseForm.buyerAccount || !purchaseForm.productId) {
      alert('Mohon pilih rekening dan produk');
      return;
    }

    const buyerAcc = accounts[purchaseForm.buyerAccount];
    const product = products.find(p => p.id === parseInt(purchaseForm.productId));

    if (buyerAcc.balance < product.price) {
      alert('Saldo tidak mencukupi');
      return;
    }

    await simulatePurchaseFlow(buyerAcc, product);
    
    // Reset form
    setPurchaseForm({ buyerAccount: '', productId: '' });
  };

  if (showAboutPage) {
    return <AboutPage onBack={() => setShowAboutPage(false)} />;
  }

  const accountList = Object.values(accounts);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Sistem Perbankan dengan Smart Contract</h1>
        <button 
          onClick={() => setShowAboutPage(true)}
          style={{ background: '#28a745', width: 'auto', padding: '10px 20px' }}
        >
          Penjelasan Smart Contract
        </button>
      </div>

      <div className="card" style={{ background: '#e7f3ff', border: '2px solid #2196F3', marginBottom: '20px' }}>
        <p style={{ margin: 0, color: '#1565C0' }}>
          <strong>Demo Mode:</strong> Sistem ini menggunakan smart contract untuk memproses semua transaksi. 
          Setiap transaksi divalidasi oleh multiple nodes untuk keamanan dan transparansi.
        </p>
      </div>

      {/* Transfer Panel */}
      <div className="card">
        <h2>Transfer</h2>
        <div className="form-group">
          <label>Rekening Asal</label>
          <select
            value={transferForm.fromAccount}
            onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value })}
            disabled={isProcessing}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          >
            <option value="">-- Pilih Rekening Asal --</option>
            {accountList.map(acc => (
              <option key={acc.accountNumber} value={acc.accountNumber}>
                {acc.accountNumber} - {acc.accountName} ({acc.bank}) - Saldo: Rp {acc.balance.toLocaleString('id-ID')}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Rekening Tujuan</label>
          <select
            value={transferForm.toAccount}
            onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
            disabled={isProcessing}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          >
            <option value="">-- Pilih Rekening Tujuan --</option>
            {accountList
              .filter(acc => acc.accountNumber !== transferForm.fromAccount)
              .map(acc => (
                <option key={acc.accountNumber} value={acc.accountNumber}>
                  {acc.accountNumber} - {acc.accountName} ({acc.bank}) - Saldo: Rp {acc.balance.toLocaleString('id-ID')}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>Jumlah (IDR)</label>
          <input
            type="number"
            value={transferForm.amount}
            onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
            placeholder="0"
            step="1000"
            min="0"
            disabled={isProcessing}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          />
        </div>
        <div className="form-group">
          <label>Catatan (Opsional)</label>
          <input
            type="text"
            value={transferForm.memo}
            onChange={(e) => setTransferForm({ ...transferForm, memo: e.target.value })}
            placeholder="Catatan transfer"
            disabled={isProcessing}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          />
        </div>
        <button 
          onClick={handleTransfer}
          disabled={isProcessing || !transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount}
          style={{ opacity: (isProcessing || !transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount) ? 0.6 : 1 }}
        >
          {isProcessing ? 'Memproses...' : 'Kirim Transfer'}
        </button>
      </div>

      {/* Product Purchase Panel */}
      <div className="card">
        <h2>Pembelian Produk</h2>
        <div className="form-group">
          <label>Rekening Pembeli</label>
          <select
            value={purchaseForm.buyerAccount}
            onChange={(e) => setPurchaseForm({ ...purchaseForm, buyerAccount: e.target.value })}
            disabled={isProcessing}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          >
            <option value="">-- Pilih Rekening --</option>
            {accountList.map(acc => (
              <option key={acc.accountNumber} value={acc.accountNumber}>
                {acc.accountNumber} - {acc.accountName} ({acc.bank}) - Saldo: Rp {acc.balance.toLocaleString('id-ID')}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Produk</label>
          <select
            value={purchaseForm.productId}
            onChange={(e) => setPurchaseForm({ ...purchaseForm, productId: e.target.value })}
            disabled={isProcessing}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          >
            <option value="">-- Pilih Produk --</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - Rp {product.price.toLocaleString('id-ID')} ({product.provider})
              </option>
            ))}
          </select>
        </div>
        <button 
          onClick={handlePurchase}
          disabled={isProcessing || !purchaseForm.buyerAccount || !purchaseForm.productId}
          style={{ opacity: (isProcessing || !purchaseForm.buyerAccount || !purchaseForm.productId) ? 0.6 : 1 }}
        >
          {isProcessing ? 'Memproses...' : 'Beli Sekarang'}
        </button>
      </div>

      {/* Processing Flow Modal - already defined above */}

      {/* Transaction Result */}
      {transactionResult && !isProcessing && (
        <div className="card" style={{ 
          background: transactionResult.success ? '#d4edda' : '#f8d7da', 
          border: `2px solid ${transactionResult.success ? '#28a745' : '#dc3545'}` 
        }}>
          <h2 style={{ color: transactionResult.success ? '#155724' : '#721c24' }}>
            {transactionResult.success ? '✓ Transaksi Berhasil' : '✗ Transaksi Gagal'}
          </h2>
          <p style={{ margin: '10px 0', color: transactionResult.success ? '#155724' : '#721c24' }}>
            {transactionResult.message}
          </p>
          {transactionResult.fromBalance !== undefined && (
            <p style={{ margin: '5px 0', color: transactionResult.success ? '#155724' : '#721c24' }}>
              Saldo rekening asal: Rp {transactionResult.fromBalance.toLocaleString('id-ID')}
            </p>
          )}
          {transactionResult.toBalance !== undefined && (
            <p style={{ margin: '5px 0', color: transactionResult.success ? '#155724' : '#721c24' }}>
              Saldo rekening tujuan: Rp {transactionResult.toBalance.toLocaleString('id-ID')}
            </p>
          )}
          {transactionResult.remainingBalance !== undefined && (
            <p style={{ margin: '5px 0', color: transactionResult.success ? '#155724' : '#721c24' }}>
              Saldo tersisa: Rp {transactionResult.remainingBalance.toLocaleString('id-ID')}
            </p>
          )}
        </div>
      )}

      {/* Account List */}
      <div className="card">
        <h2>Daftar Rekening</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px', marginTop: '15px' }}>
          {accountList.map(acc => (
            <div 
              key={acc.accountNumber} 
              style={{ 
                padding: '15px', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{acc.accountName}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>No. Rekening: {acc.accountNumber}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>Bank: {acc.bank}</div>
              <div style={{ color: '#28a745', fontWeight: 'bold', marginTop: '10px' }}>
                Saldo: Rp {acc.balance.toLocaleString('id-ID')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppPRD;
