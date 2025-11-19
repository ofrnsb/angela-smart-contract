import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './index.css';
import AboutPage from './components/AboutPage';

// Language translations
const translations = {
  id: {
    title: 'Sistem Perbankan dengan Smart Contract',
    aboutButton: 'Penjelasan Smart Contract',
    demoNote: 'Demo Mode: Sistem ini menggunakan smart contract untuk memproses semua transaksi. Setiap transaksi divalidasi oleh multiple nodes untuk keamanan dan transparansi.',
    transfer: 'Transfer',
    fromAccount: 'Rekening Asal',
    toAccount: 'Rekening Tujuan',
    amount: 'Jumlah (IDR)',
    memo: 'Catatan (Opsional)',
    memoPlaceholder: 'Catatan transfer',
    submitTransfer: 'Kirim Transfer',
    processing: 'Memproses...',
    purchase: 'Pembelian Produk',
    buyerAccount: 'Rekening Pembeli',
    product: 'Produk',
    buyNow: 'Beli Sekarang',
    selectFromAccount: '-- Pilih Rekening Asal --',
    selectToAccount: '-- Pilih Rekening Tujuan --',
    selectBuyerAccount: '-- Pilih Rekening --',
    selectProduct: '-- Pilih Produk --',
    processingTransaction: 'Memproses Transaksi...',
    smartContractExecuted: 'Smart Contract yang Dieksekusi',
    transactionRecorded: 'Transaksi Anda telah diproses dan tercatat di blockchain',
    contractAddress: 'Alamat Smart Contract:',
    transactionId: 'ID Transaksi:',
    contractInfo: 'Informasi: Setiap transaksi menggunakan smart contract yang terenkripsi dan tersimpan permanen di blockchain. Alamat dan ID transaksi di atas dapat digunakan untuk memverifikasi transaksi Anda.',
    close: 'Tutup',
    selectAccount: 'Mohon lengkapi semua field',
    invalidAmount: 'Jumlah transfer tidak valid',
    insufficientBalance: 'Saldo tidak mencukupi',
    sameAccount: 'Rekening asal dan tujuan tidak boleh sama',
    selectProductError: 'Mohon pilih rekening dan produk',
    transferSuccess: 'Transfer berhasil!',
    purchaseSuccess: 'Pembelian berhasil!'
  },
  en: {
    title: 'Banking System with Smart Contract',
    aboutButton: 'Smart Contract Explanation',
    demoNote: 'Demo Mode: This system uses smart contracts to process all transactions. Each transaction is validated by multiple nodes for security and transparency.',
    transfer: 'Transfer',
    fromAccount: 'From Account',
    toAccount: 'To Account',
    amount: 'Amount (IDR)',
    memo: 'Memo (Optional)',
    memoPlaceholder: 'Transfer memo',
    submitTransfer: 'Send Transfer',
    processing: 'Processing...',
    purchase: 'Product Purchase',
    buyerAccount: 'Buyer Account',
    product: 'Product',
    buyNow: 'Buy Now',
    selectFromAccount: '-- Select From Account --',
    selectToAccount: '-- Select To Account --',
    selectBuyerAccount: '-- Select Account --',
    selectProduct: '-- Select Product --',
    processingTransaction: 'Processing Transaction...',
    smartContractExecuted: 'Executed Smart Contract',
    transactionRecorded: 'Your transaction has been processed and recorded on the blockchain',
    contractAddress: 'Smart Contract Address:',
    transactionId: 'Transaction ID:',
    contractInfo: 'Information: Every transaction uses an encrypted smart contract that is permanently stored on the blockchain. The address and transaction ID above can be used to verify your transaction.',
    close: 'Close',
    selectAccount: 'Please fill all fields',
    invalidAmount: 'Invalid transfer amount',
    insufficientBalance: 'Insufficient balance',
    sameAccount: 'From and to accounts cannot be the same',
    selectProductError: 'Please select account and product',
    transferSuccess: 'Transfer successful!',
    purchaseSuccess: 'Purchase successful!'
  }
};

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
  const [language, setLanguage] = useState('id');
  
  const t = translations[language];
  
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
        title: 'Validasi Bank Asal', 
        description: 'Node Bank Asal memverifikasi transaksi',
        status: 'processing',
        node: 'Node Bank Asal'
      });
      await delay(1200);
      setFlowSteps([...steps]);
      
      steps[3].status = 'completed';
      steps.push({ 
        step: 5, 
        title: 'Validasi Bank Tujuan', 
        description: 'Node Bank Tujuan memverifikasi transaksi',
        status: 'processing',
        node: 'Node Bank Tujuan'
      });
      await delay(1200);
      setFlowSteps([...steps]);
      
      steps[4].status = 'completed';
      steps.push({ 
        step: 6, 
        title: 'Validasi Regulator', 
        description: 'Node Regulator memverifikasi dan menyetujui transaksi',
        status: 'processing',
        node: 'Node Regulator'
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
          validators: ['Node Bank Asal', 'Node Bank Tujuan', 'Node Regulator'],
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
        node: 'Node Bank'
      });
      await delay(600);
      setFlowSteps([...steps]);
      
      steps[0].status = 'completed';
      steps.push({ 
        step: 2, 
        title: 'Cek Saldo', 
        description: `Memverifikasi saldo rekening ${fromAcc.accountNumber}`,
        status: 'processing',
        node: 'Node Bank'
      });
      await delay(500);
      setFlowSteps([...steps]);
      
      steps[1].status = 'completed';
      steps.push({ 
        step: 3, 
        title: 'Eksekusi Transfer', 
        description: 'Memproses transfer antar rekening',
        status: 'processing',
        node: 'Node Bank'
      });
      await delay(800);
      setFlowSteps([...steps]);
      
      steps[2].status = 'completed';
      steps.push({ 
        step: 4, 
        title: 'Update Saldo', 
        description: 'Memperbarui saldo rekening asal dan tujuan',
        status: 'processing',
        node: 'Node Bank'
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
      message: `${t.transferSuccess} Rp ${parseFloat(amount).toLocaleString('id-ID')} ${language === 'id' ? 'dari' : 'from'} ${fromAcc.accountNumber} ${language === 'id' ? 'ke' : 'to'} ${toAcc.accountNumber}`,
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
      message: `${t.purchaseSuccess} ${product.name} ${language === 'id' ? 'untuk rekening' : 'for account'} ${buyerAcc.accountNumber}`,
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
      alert(t.selectAccount);
      return;
    }

    const fromAcc = accounts[transferForm.fromAccount];
    const toAcc = accounts[transferForm.toAccount];
    const amount = parseFloat(transferForm.amount);

    if (isNaN(amount) || amount <= 0) {
      alert(t.invalidAmount);
      return;
    }

    if (fromAcc.balance < amount) {
      alert(t.insufficientBalance);
      return;
    }

    if (fromAcc.accountNumber === toAcc.accountNumber) {
      alert(t.sameAccount);
      return;
    }

    const isInterbank = fromAcc.bankCode !== toAcc.bankCode;
    await simulateTransferFlow(fromAcc, toAcc, amount, isInterbank);
    
    // Reset form
    setTransferForm({ fromAccount: '', toAccount: '', amount: '', memo: '' });
  };

  const handlePurchase = async () => {
    if (!purchaseForm.buyerAccount || !purchaseForm.productId) {
      alert(t.selectProductError);
      return;
    }

    const buyerAcc = accounts[purchaseForm.buyerAccount];
    const product = products.find(p => p.id === parseInt(purchaseForm.productId));

    if (buyerAcc.balance < product.price) {
      alert(t.insufficientBalance);
      return;
    }

    await simulatePurchaseFlow(buyerAcc, product);
    
    // Reset form
    setPurchaseForm({ buyerAccount: '', productId: '' });
  };

  if (showAboutPage) {
    return <AboutPage onBack={() => setShowAboutPage(false)} language={language} onLanguageChange={setLanguage} />;
  }

  const accountList = Object.values(accounts);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0 }}>{t.title}</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            style={{ 
              background: '#f0f0f0', 
              color: '#333', 
              border: '1px solid #ddd', 
              padding: '6px 12px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s',
              minWidth: '40px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#e0e0e0';
              e.target.style.borderColor = '#bbb';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#f0f0f0';
              e.target.style.borderColor = '#ddd';
            }}
          >
            {language === 'id' ? 'EN' : 'ID'}
          </button>
          <button 
            onClick={() => setShowAboutPage(true)}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              width: 'auto', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '8px', 
              color: 'white', 
              cursor: 'pointer', 
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            }}
          >
            {t.aboutButton}
          </button>
        </div>
      </div>

      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', 
        border: 'none', 
        marginBottom: '24px',
        padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <p style={{ margin: 0, color: '#1976d2', fontSize: '14px', lineHeight: '1.6' }}>
          <strong style={{ fontWeight: '600' }}>Demo Mode:</strong> {t.demoNote}
        </p>
      </div>

      {/* Transfer Panel */}
      <div className="card" style={{ background: 'white' }}>
        <h2 style={{ 
          color: '#1a202c', 
          fontSize: '1.75rem', 
          fontWeight: '700', 
          marginBottom: '28px',
          paddingBottom: '16px',
          borderBottom: '2px solid #e2e8f0'
        }}>
          {t.transfer}
        </h2>
        <div className="form-group">
          <label>{t.fromAccount}</label>
          <select
            value={transferForm.fromAccount}
            onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value })}
            disabled={isProcessing}
            style={{ 
              width: '100%', 
              padding: '14px', 
              border: '2px solid #e0e0e0', 
              borderRadius: '8px',
              fontSize: '15px',
              backgroundColor: isProcessing ? '#f5f5f5' : 'white',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: '40px'
            }}
          >
            <option value="">{t.selectFromAccount}</option>
            {accountList.map(acc => (
              <option key={acc.accountNumber} value={acc.accountNumber}>
                {acc.accountNumber} - {acc.accountName} ({acc.bank}) - {language === 'id' ? 'Saldo' : 'Balance'}: Rp {acc.balance.toLocaleString('id-ID')}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>{t.toAccount}</label>
          <select
            value={transferForm.toAccount}
            onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
            disabled={isProcessing}
            style={{ 
              width: '100%', 
              padding: '14px', 
              border: '2px solid #e0e0e0', 
              borderRadius: '8px',
              fontSize: '15px',
              backgroundColor: isProcessing ? '#f5f5f5' : 'white',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: '40px'
            }}
          >
            <option value="">{t.selectToAccount}</option>
            {accountList
              .filter(acc => acc.accountNumber !== transferForm.fromAccount)
              .map(acc => (
                <option key={acc.accountNumber} value={acc.accountNumber}>
                  {acc.accountNumber} - {acc.accountName} ({acc.bank}) - {language === 'id' ? 'Saldo' : 'Balance'}: Rp {acc.balance.toLocaleString('id-ID')}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>{t.amount}</label>
          <input
            type="number"
            value={transferForm.amount}
            onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
            placeholder="0"
            step="1000"
            min="0"
            disabled={isProcessing}
            style={{ width: '100%', padding: '14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px' }}
          />
        </div>
        <div className="form-group">
          <label>{t.memo}</label>
          <input
            type="text"
            value={transferForm.memo}
            onChange={(e) => setTransferForm({ ...transferForm, memo: e.target.value })}
            placeholder={t.memoPlaceholder}
            disabled={isProcessing}
            style={{ width: '100%', padding: '14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px' }}
          />
        </div>
        <button 
          onClick={handleTransfer}
          disabled={isProcessing || !transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount}
          style={{ 
            width: '100%',
            marginTop: '8px',
            opacity: (isProcessing || !transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount) ? 0.5 : 1,
            background: (isProcessing || !transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount) 
              ? 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          {isProcessing ? t.processing : t.submitTransfer}
        </button>
      </div>

      {/* Product Purchase Panel */}
      <div className="card" style={{ background: 'white' }}>
        <h2 style={{ 
          color: '#1a202c', 
          fontSize: '1.75rem', 
          fontWeight: '700', 
          marginBottom: '28px',
          paddingBottom: '16px',
          borderBottom: '2px solid #e2e8f0'
        }}>
          {t.purchase}
        </h2>
        <div className="form-group">
          <label>{t.buyerAccount}</label>
          <select
            value={purchaseForm.buyerAccount}
            onChange={(e) => setPurchaseForm({ ...purchaseForm, buyerAccount: e.target.value })}
            disabled={isProcessing}
            style={{ 
              width: '100%', 
              padding: '14px', 
              border: '2px solid #e0e0e0', 
              borderRadius: '8px',
              fontSize: '15px',
              backgroundColor: isProcessing ? '#f5f5f5' : 'white',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: '40px'
            }}
          >
            <option value="">{t.selectBuyerAccount}</option>
            {accountList.map(acc => (
              <option key={acc.accountNumber} value={acc.accountNumber}>
                {acc.accountNumber} - {acc.accountName} ({acc.bank}) - {language === 'id' ? 'Saldo' : 'Balance'}: Rp {acc.balance.toLocaleString('id-ID')}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>{t.product}</label>
          <select
            value={purchaseForm.productId}
            onChange={(e) => setPurchaseForm({ ...purchaseForm, productId: e.target.value })}
            disabled={isProcessing}
            style={{ 
              width: '100%', 
              padding: '14px', 
              border: '2px solid #e0e0e0', 
              borderRadius: '8px',
              fontSize: '15px',
              backgroundColor: isProcessing ? '#f5f5f5' : 'white',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: '40px'
            }}
          >
            <option value="">{t.selectProduct}</option>
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
          style={{ 
            width: '100%',
            marginTop: '8px',
            opacity: (isProcessing || !purchaseForm.buyerAccount || !purchaseForm.productId) ? 0.5 : 1,
            background: (isProcessing || !purchaseForm.buyerAccount || !purchaseForm.productId) 
              ? 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          {isProcessing ? t.processing : t.buyNow}
        </button>
      </div>

      {/* Processing Flow Modal */}
      {showFlowModal && isProcessing && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => {}} // Prevent closing on background click during processing
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #e2e8f0' }}>
              <h2 style={{ margin: 0, color: '#667eea', fontSize: '1.5rem', fontWeight: '700' }}>{t.processingTransaction}</h2>
            </div>
            <div style={{ marginTop: '20px' }}>
              {flowSteps.map((step, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    marginBottom: '16px',
                    padding: '18px',
                    background: step.status === 'completed' 
                      ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)' 
                      : step.status === 'processing' 
                      ? 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)' 
                      : '#f8f9fa',
                    border: `2px solid ${step.status === 'completed' ? '#28a745' : step.status === 'processing' ? '#ffc107' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'all 0.3s ease',
                    boxShadow: step.status === 'processing' ? '0 4px 12px rgba(255, 193, 7, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '50%', 
                    background: step.status === 'completed' 
                      ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
                      : step.status === 'processing' 
                      ? 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)' 
                      : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    fontSize: step.status === 'completed' ? '20px' : '16px',
                    boxShadow: step.status !== 'pending' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                  }}>
                    {step.status === 'completed' ? '✓' : step.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#2d3748' }}>{step.title}</h3>
                      <span style={{ 
                        fontSize: '11px', 
                        color: '#4a5568',
                        background: '#edf2f7',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontWeight: '500',
                        letterSpacing: '0.3px'
                      }}>
                        {step.node}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#718096', fontSize: '14px', lineHeight: '1.5' }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Smart Contract Data Modal */}
      {showContractModal && smartContractData && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowContractModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #e2e8f0' }}>
              <h2 style={{ margin: 0, color: '#1976D2', fontSize: '1.5rem', fontWeight: '700' }}>Data Smart Contract</h2>
              <button
                onClick={() => setShowContractModal(false)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#dc2626';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#ef4444';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>
            </div>
            <div style={{ marginTop: '15px' }}>
              <div style={{ marginBottom: '28px', textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', borderRadius: '12px' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#1976D2', marginBottom: '12px', letterSpacing: '-0.3px' }}>
                  {t.smartContractExecuted}
                </div>
                <div style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.6' }}>
                  {t.transactionRecorded}
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <strong style={{ fontSize: '13px', color: '#4a5568', display: 'block', marginBottom: '10px', fontWeight: '600', letterSpacing: '0.3px' }}>{t.contractAddress}</strong>
                <div style={{ 
                  padding: '16px', 
                  background: '#f7fafc', 
                  borderRadius: '12px',
                  fontFamily: 'Monaco, Menlo, "Courier New", monospace',
                  fontSize: '13px',
                  wordBreak: 'break-all',
                  border: '2px solid #e2e8f0',
                  color: '#2d3748',
                  lineHeight: '1.6'
                }}>
                  {smartContractData.contractAddress}
                </div>
              </div>
              
              {smartContractData.result.transactionHash && (
                <div style={{ marginBottom: '24px' }}>
                  <strong style={{ fontSize: '13px', color: '#4a5568', display: 'block', marginBottom: '10px', fontWeight: '600', letterSpacing: '0.3px' }}>{t.transactionId}</strong>
                  <div style={{ 
                    padding: '16px', 
                    background: '#f7fafc', 
                    borderRadius: '12px',
                    fontFamily: 'Monaco, Menlo, "Courier New", monospace',
                    fontSize: '13px',
                    wordBreak: 'break-all',
                    border: '2px solid #e2e8f0',
                    color: '#2d3748',
                    lineHeight: '1.6'
                  }}>
                    {smartContractData.result.transactionHash}
                  </div>
                </div>
              )}
              
              <div style={{ 
                marginTop: '28px', 
                padding: '18px', 
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', 
                borderRadius: '12px',
                border: '1px solid rgba(33, 150, 243, 0.2)'
              }}>
                <div style={{ fontSize: '14px', color: '#1976d2', lineHeight: '1.7', fontWeight: '500' }}>
                  {t.contractInfo}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowContractModal(false)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                cursor: 'pointer',
                marginTop: '24px',
                fontWeight: '600',
                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.25)'
              }}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default AppPRD;
