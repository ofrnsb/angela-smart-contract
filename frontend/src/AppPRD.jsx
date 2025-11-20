import React, { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import './index.css';
import AboutPage from './components/AboutPage';
import HistoryPanel from './components/HistoryPanel';

function InfoIcon({ text }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  return (
    <span
      role='button'
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      onTouchStart={() => setOpen(true)}
      onTouchEnd={() => setOpen(false)}
      aria-label={text}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#e5e7eb',
        color: '#374151',
        fontSize: 12,
        fontWeight: 700,
        cursor: 'help',
        userSelect: 'none',
        outline: 'none',
      }}
    >
      i
      {open && (
        <span
          style={{
            position: 'absolute',
            top: '140%',
            left: 0,
            zIndex: 3000,
            background: '#111827',
            color: 'white',
            padding: '8px 10px',
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.4,
            whiteSpace: 'normal',
            width: 280,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

// Language translations
const translations = {
  id: {
    title: 'Sistem Perbankan dengan Smart Contract',
    aboutButton: 'Penjelasan Smart Contract',
    demoNote:
      'Sistem ini menggunakan smart contract untuk memproses semua transaksi. Setiap transaksi divalidasi oleh multiple nodes untuk keamanan dan transparansi.',
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
    transactionRecorded:
      'Transaksi Anda telah diproses dan tercatat di blockchain',
    contractAddress: 'Alamat Smart Contract:',
    transactionId: 'ID Transaksi:',
    contractInfo:
      'Informasi: Setiap transaksi menggunakan smart contract yang terenkripsi dan tersimpan permanen di blockchain. Alamat dan ID transaksi di atas dapat digunakan untuk memverifikasi transaksi Anda.',
    close: 'Tutup',
    viewProcess: 'Lihat Proses',
    viewResult: 'Lihat Hasil',
    simulationControlTitle: 'Kontrol Simulasi',
    processSpeed: 'Kecepatan Proses',
    validatorThreshold: 'Threshold Validator',
    totalNodesHint: 'Total node: 3 (Asal, Tujuan, Regulator)',
    simulateFailToBank: 'Kegagalan validasi bank tujuan',
    simulationExtras: 'Simulasi Tambahan',
    copy: 'Salin',
    simulateFailRegulator: 'Kegagalan validasi regulator',
    simulateDispute: 'Dispute & Reversal setelah settle',
    reversedDueToDispute: 'Transaksi dibatalkan (reversal) karena dispute',
    tooltipProcessSpeed:
      'Mengatur kecepatan simulasi (nilai lebih besar = lebih lambat).',
    tooltipValidatorThreshold:
      'Jumlah persetujuan validator yang dibutuhkan sebelum eksekusi kontrak.',
    tooltipFailToBank:
      'Simulasi validasi bank tujuan gagal untuk menguji skenario gagal konsensus.',
    tooltipFailRegulator:
      'Simulasi validasi regulator gagal untuk menguji skenario gagal konsensus.',
    tooltipDisputeReversal:
      'Setelah settle, simulasi adanya dispute dan reversal saldo.',
    selectAccount: 'Mohon lengkapi semua field',
    invalidAmount: 'Jumlah transfer tidak valid',
    insufficientBalance: 'Saldo tidak mencukupi',
    sameAccount: 'Rekening asal dan tujuan tidak boleh sama',
    selectProductError: 'Mohon pilih rekening dan produk',
    transferSuccess: 'Transfer berhasil!',
    purchaseSuccess: 'Pembelian berhasil!',
  },
  en: {
    title: 'Banking System with Smart Contract',
    aboutButton: 'Smart Contract Explanation',
    demoNote:
      'This system uses smart contracts to process all transactions. Each transaction is validated by multiple nodes for security and transparency.',
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
    transactionRecorded:
      'Your transaction has been processed and recorded on the blockchain',
    contractAddress: 'Smart Contract Address:',
    transactionId: 'Transaction ID:',
    contractInfo:
      'Information: Every transaction uses an encrypted smart contract that is permanently stored on the blockchain. The address and transaction ID above can be used to verify your transaction.',
    close: 'Close',
    viewProcess: 'View Process',
    viewResult: 'View Result',
    simulationControlTitle: 'Simulation Controls',
    processSpeed: 'Process Speed',
    validatorThreshold: 'Validator Threshold',
    totalNodesHint: 'Total nodes: 3 (Source, Destination, Regulator)',
    simulateFailToBank: 'Destination bank validation failure',
    simulationExtras: 'Extra Simulation',
    copy: 'Copy',
    simulateFailRegulator: 'Regulator validation failure',
    simulateDispute: 'Dispute & Reversal after settlement',
    reversedDueToDispute: 'Transaction reversed due to dispute',
    tooltipProcessSpeed: 'Adjust simulation speed (higher value = slower).',
    tooltipValidatorThreshold:
      'Number of validator approvals required before executing the contract.',
    tooltipFailToBank:
      'Force destination bank validation to fail to test consensus failure.',
    tooltipFailRegulator:
      'Force regulator validation to fail to test consensus failure.',
    tooltipDisputeReversal:
      'After settlement, simulate a dispute and balance reversal.',
    selectAccount: 'Please fill all fields',
    invalidAmount: 'Invalid transfer amount',
    insufficientBalance: 'Insufficient balance',
    sameAccount: 'From and to accounts cannot be the same',
    selectProductError: 'Please select account and product',
    transferSuccess: 'Transfer successful!',
    purchaseSuccess: 'Purchase successful!',
  },
};

// Dummy bank accounts - langsung tersedia
const DUMMY_ACCOUNTS = {
  1234567890: {
    accountNumber: '1234567890',
    accountName: 'Budi Santoso',
    balance: 10000000,
    bank: 'Bank Mandiri',
    bankCode: 'BM',
  },
  '0987654321': {
    accountNumber: '0987654321',
    accountName: 'Siti Nurhaliza',
    balance: 5000000,
    bank: 'Bank Mandiri',
    bankCode: 'BM',
  },
  1122334455: {
    accountNumber: '1122334455',
    accountName: 'Rina Wati',
    balance: 7500000,
    bank: 'Bank Mandiri',
    bankCode: 'BM',
  },
  2233445566: {
    accountNumber: '2233445566',
    accountName: 'Dedi Kurniawan',
    balance: 12000000,
    bank: 'Bank Mandiri',
    bankCode: 'BM',
  },
  1111111111: {
    accountNumber: '1111111111',
    accountName: 'Ahmad Yani',
    balance: 8000000,
    bank: 'Bank BCA',
    bankCode: 'BCA',
  },
  2222222222: {
    accountNumber: '2222222222',
    accountName: 'Maya Sari',
    balance: 6000000,
    bank: 'Bank BCA',
    bankCode: 'BCA',
  },
  3333333333: {
    accountNumber: '3333333333',
    accountName: 'Bambang Sutrisno',
    balance: 15000000,
    bank: 'Bank BCA',
    bankCode: 'BCA',
  },
  4444444444: {
    accountNumber: '4444444444',
    accountName: 'Lisa Permata',
    balance: 9000000,
    bank: 'Bank BCA',
    bankCode: 'BCA',
  },
  5555555555: {
    accountNumber: '5555555555',
    accountName: 'Gilang Saputra',
    balance: 11000000,
    bank: 'Bank BRI',
    bankCode: 'BRI',
  },
  6666666666: {
    accountNumber: '6666666666',
    accountName: 'Sari Indah',
    balance: 7000000,
    bank: 'Bank BRI',
    bankCode: 'BRI',
  },
  7777777777: {
    accountNumber: '7777777777',
    accountName: 'Andi Pratama',
    balance: 9500000,
    bank: 'Bank BNI',
    bankCode: 'BNI',
  },
  8888888888: {
    accountNumber: '8888888888',
    accountName: 'Nadia Lestari',
    balance: 4200000,
    bank: 'Bank BNI',
    bankCode: 'BNI',
  },
  9999999999: {
    accountNumber: '9999999999',
    accountName: 'Yusuf Hamzah',
    balance: 3000000,
    bank: 'Bank BSI',
    bankCode: 'BSI',
  },
  1010101010: {
    accountNumber: '1010101010',
    accountName: 'Siti Aisyah',
    balance: 8600000,
    bank: 'Bank BSI',
    bankCode: 'BSI',
  },
  1212121212: {
    accountNumber: '1212121212',
    accountName: 'Rudi Hartono',
    balance: 13400000,
    bank: 'Bank Permata',
    bankCode: 'PMT',
  },
  1313131313: {
    accountNumber: '1313131313',
    accountName: 'Ari Wibowo',
    balance: 2700000,
    bank: 'Bank Danamon',
    bankCode: 'DNMN',
  },
  1414141414: {
    accountNumber: '1414141414',
    accountName: 'Dewi Lestari',
    balance: 15800000,
    bank: 'CIMB Niaga',
    bankCode: 'CIMB',
  },
  1515151515: {
    accountNumber: '1515151515',
    accountName: 'Fajar Maulana',
    balance: 2200000,
    bank: 'Bank BTN',
    bankCode: 'BTN',
  },
  1616161616: {
    accountNumber: '1616161616',
    accountName: 'Kevin Pratama',
    balance: 12500000,
    bank: 'OCBC NISP',
    bankCode: 'OCBC',
  },
  1717171717: {
    accountNumber: '1717171717',
    accountName: 'Nurul Huda',
    balance: 5200000,
    bank: 'Bank Panin',
    bankCode: 'PANIN',
  },
  1818181818: {
    accountNumber: '1818181818',
    accountName: 'Taufik Rahman',
    balance: 9100000,
    bank: 'Maybank Indonesia',
    bankCode: 'MYBK',
  },
};

// Dummy products
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: 'Token Listrik 20kWh',
    price: 50000,
    provider: 'PLN',
    description: 'Token listrik untuk 20kWh',
  },
  {
    id: 2,
    name: 'Token Listrik 50kWh',
    price: 125000,
    provider: 'PLN',
    description: 'Token listrik untuk 50kWh',
  },
  {
    id: 3,
    name: 'Pulsa 50.000',
    price: 50000,
    provider: 'Telkomsel',
    description: 'Pulsa seluler 50.000 untuk semua operator',
  },
  {
    id: 4,
    name: 'Paket Data 10GB',
    price: 75000,
    provider: 'Indosat',
    description: 'Paket data internet 10GB - 30 hari',
  },
  {
    id: 5,
    name: 'Voucher Game 100k',
    price: 100000,
    provider: 'Steam',
    description: 'Voucher game Steam senilai 100.000',
  },
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
    memo: '',
  });

  // Purchase form
  const [purchaseForm, setPurchaseForm] = useState({
    buyerAccount: '',
    productId: '',
  });

  // Loading and flow states
  const [isTransferProcessing, setIsTransferProcessing] = useState(false);
  const [isPurchaseProcessing, setIsPurchaseProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [flowSteps, setFlowSteps] = useState([]);
  const [smartContractData, setSmartContractData] = useState(null);
  const [transactionResult, setTransactionResult] = useState(null);
  const [showFlowModal, setShowFlowModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  // Strong simulation controls
  const [speedFactor, setSpeedFactor] = useState(1.0); // 1.0 = normal, >1 lebih lambat
  const [validatorConfig, setValidatorConfig] = useState({
    total: 3,
    required: 3,
    failToBank: false,
    failRegulator: false,
    dispute: false,
  });
  const [ledgerTick, setLedgerTick] = useState(0);

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

  // Privacy mask helper
  const maskAccount = (acc) => {
    const s = String(acc || '');
    if (s.length <= 4) return s;
    return s.slice(0, -4).replace(/\d/g, 'x') + s.slice(-4);
  };

  // Currency input helpers (live thousand separator formatting)
  const unformatToDigits = (s) => String(s || '').replace(/\D/g, '');
  const formatCurrencyInput = (digits, lang) => {
    const ds = unformatToDigits(digits);
    if (!ds) return '';
    const n = parseInt(ds, 10);
    return n.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US');
  };

  // Fee & limit (simulation)
  const DAILY_LIMIT = 10000000; // Rp 10.000.000 per hari
  const FEE_INTER = 2500; // Interbank fee simulasi
  const FEE_INTRA = 0; // Intra-bank fee simulasi

  // Daily usage helpers
  const USAGE_KEY = 'banking_daily_usage';
  const todayKey = () => new Date().toISOString().slice(0, 10);
  const getDailyUsage = (accountNumber) => {
    try {
      const raw = localStorage.getItem(USAGE_KEY);
      const obj = raw ? JSON.parse(raw) : {};
      const byAcc = obj[accountNumber] || {};
      return parseFloat(byAcc[todayKey()] || 0);
    } catch {
      return 0;
    }
  };
  const addDailyUsage = (accountNumber, delta) => {
    try {
      const raw = localStorage.getItem(USAGE_KEY);
      const obj = raw ? JSON.parse(raw) : {};
      const key = todayKey();
      obj[accountNumber] = obj[accountNumber] || {};
      obj[accountNumber][key] =
        parseFloat(obj[accountNumber][key] || 0) + parseFloat(delta || 0);
      localStorage.setItem(USAGE_KEY, JSON.stringify(obj));
    } catch {}
  };

  const simulateTransferFlow = async (fromAcc, toAcc, amount, isInterbank) => {
    setIsTransferProcessing(true);
    setFlowSteps([]);
    setSmartContractData(null);
    setTransactionResult(null);
    setShowFlowModal(true);
    setShowContractModal(false);

    const steps = [];
    let createdContractHash = null;
    let createdTxHash = null;

    if (isInterbank) {
      // Interbank transfer flow
      let approvals = 0;
      let feeApplied = FEE_INTER;
      steps.push({
        step: 1,
        title: 'Validasi Rekening',
        description: `${fromAcc.bank} memverifikasi rekening asal dan tujuan`,
        status: 'processing',
        node: `Node ${fromAcc.bank}`,
        details: [
          'Cek format nomor rekening dan keberadaan rekening.',
          'Pastikan rekening tidak diblokir atau dibekukan.',
        ],
      });
      await delay(1500);
      setFlowSteps([...steps]);

      steps[0].status = 'completed';
      steps.push({
        step: 2,
        title: 'Cek Saldo',
        description: `${
          fromAcc.bank
        } memverifikasi saldo rekening ${maskAccount(fromAcc.accountNumber)}`,
        status: 'processing',
        node: `Node ${fromAcc.bank}`,
        details: [
          'Hitung saldo tersedia vs. saldo tertahan (hold).',
          'Validasi limit transfer harian dan fee (bila ada).',
        ],
      });
      await delay(1200);
      setFlowSteps([...steps]);
      // Check fee & daily limit
      const usedToday = getDailyUsage(fromAcc.accountNumber);
      if (
        fromAcc.balance < amount + feeApplied ||
        usedToday + amount > DAILY_LIMIT
      ) {
        steps[1].status = 'failed';
        steps.push({
          step: 2.5,
          title:
            language === 'id'
              ? 'Batas/Saldo Tidak Cukup'
              : 'Limit/Insufficient Balance',
          description:
            usedToday + amount > DAILY_LIMIT
              ? language === 'id'
                ? `Melebihi limit harian Rp ${DAILY_LIMIT.toLocaleString(
                    'id-ID'
                  )}`
                : `Exceeds daily limit Rp ${DAILY_LIMIT.toLocaleString(
                    'id-ID'
                  )}`
              : language === 'id'
              ? `Saldo tidak mencukupi untuk jumlah + fee Rp ${feeApplied.toLocaleString(
                  'id-ID'
                )}`
              : `Insufficient balance for amount + fee Rp ${feeApplied.toLocaleString(
                  'id-ID'
                )}`,
          status: 'failed',
          node: `Node ${fromAcc.bank}`,
        });
        await delay(800);
        setFlowSteps([...steps]);
        setIsTransferProcessing(false);
        setTransactionResult({
          success: false,
          message:
            language === 'id'
              ? 'Transaksi ditolak: saldo/limit harian tidak mencukupi'
              : 'Transaction declined: insufficient balance/daily limit',
        });
        appendLedgerEntry({
          type: 'transfer',
          interbank: true,
          fromAccount: fromAcc.accountNumber,
          toAccount: toAcc.accountNumber,
          bankFrom: fromAcc.bank,
          bankTo: toAcc.bank,
          amount,
          fee: feeApplied,
          status: 'Rejected',
          reason: 'Insufficient/Limit',
          steps: [...steps],
          createdAt: new Date().toISOString(),
        });
        return;
      }

      steps[1].status = 'completed';
      steps.push({
        step: 3,
        title: 'Propose Transfer',
        description: 'Mengirim proposal transfer ke jaringan',
        status: 'processing',
        node: 'Interbank Network',
        details: [
          'Bank pengirim menyiarkan payload (rek. asal/tujuan, jumlah, timestamp).',
          'Jaringan menerima proposal untuk divalidasi oleh para node validator.',
        ],
      });
      await delay(2000);
      setFlowSteps([...steps]);

      steps[2].status = 'completed';
      steps.push({
        step: 4,
        title: `Validasi ${fromAcc.bank}`,
        description: `${fromAcc.bank} memverifikasi transaksi`,
        status: 'processing',
        node: `Node ${fromAcc.bank}`,
        details: [
          'Node bank asal mengecek keabsahan payload.',
          'Memberikan tanda tangan persetujuan (signature).',
        ],
      });
      await delay(1800);
      setFlowSteps([...steps]);

      steps[3].status = 'completed';
      approvals += 1;
      steps.push({
        step: 5,
        title: `Validasi ${toAcc.bank}`,
        description: `${toAcc.bank} memverifikasi transaksi`,
        status: 'processing',
        node: `Node ${toAcc.bank}`,
        details: [
          'Node bank tujuan mengecek keabsahan payload.',
          'Memberikan tanda tangan persetujuan (signature).',
        ],
      });
      await delay(1800);
      // Simulasi kegagalan validator tujuan
      if (validatorConfig.failToBank) {
        steps[4].status = 'failed';
      } else {
        steps[4].status = 'completed';
        approvals += 1;
      }
      setFlowSteps([...steps]);

      steps.push({
        step: 6,
        title: 'Validasi Regulator',
        description: 'Node Regulator memverifikasi dan menyetujui transaksi',
        status: 'processing',
        node: 'Node Regulator',
        details: [
          'Pengecekan kepatuhan (mis. threshold, AML/CTF sederhana).',
          'Memberikan persetujuan akhir sebelum commit.',
        ],
      });
      await delay(1500);
      if (validatorConfig.failRegulator) {
        steps[5].status = 'failed';
      } else {
        steps[5].status = 'completed';
        approvals += 1;
      }
      setFlowSteps([...steps]);

      // Cek threshold konsensus sebelum mengeksekusi kontrak
      if (approvals < validatorConfig.required) {
        steps.push({
          step: 7,
          title: language === 'id' ? 'Gagal Konsensus' : 'Consensus Failed',
          description:
            language === 'id'
              ? `Persetujuan ${approvals}/${validatorConfig.total} kurang dari threshold ${validatorConfig.required}`
              : `Approvals ${approvals}/${validatorConfig.total} less than threshold ${validatorConfig.required}`,
          status: 'failed',
          node: 'Consensus',
          details: [
            language === 'id'
              ? 'Transaksi tidak dieksekusi karena kurang persetujuan.'
              : 'Transaction not executed due to insufficient approvals.',
          ],
        });
        await delay(1200);
        setFlowSteps([...steps]);
        setIsTransferProcessing(false);
        setTransactionResult({
          success: false,
          message:
            language === 'id'
              ? 'Transaksi ditolak: persetujuan validator kurang'
              : 'Transaction declined: insufficient validator approvals',
        });
        // Ledger (failed)
        appendLedgerEntry({
          type: 'transfer',
          interbank: true,
          fromAccount: fromAcc.accountNumber,
          toAccount: toAcc.accountNumber,
          bankFrom: fromAcc.bank,
          bankTo: toAcc.bank,
          amount,
          status: 'Rejected',
          approvals: {
            total: validatorConfig.total,
            required: validatorConfig.required,
            succeed: approvals,
          },
          steps: [...steps],
          createdAt: new Date().toISOString(),
        });
        return;
      }

      // Eksekusi Smart Contract & pembuatan ID
      steps.push({
        step: 7,
        title: 'Eksekusi Smart Contract',
        description:
          language === 'id'
            ? 'Menjalankan fungsi proposeTransfer pada validator set untuk commit transaksi'
            : 'Execute proposeTransfer on the validator set to commit the transaction',
        status: 'processing',
        node: 'Validator Set',
        details: [
          language === 'id'
            ? `Eksekutor: Node ${fromAcc.bank}, Node ${toAcc.bank}, Node Regulator`
            : `Executors: Node ${fromAcc.bank}, Node ${toAcc.bank}, Regulator Node`,
          language === 'id'
            ? 'Kontrak dieksekusi setelah persetujuan terpenuhi.'
            : 'Contract executes after approvals are met.',
          language === 'id'
            ? 'Alamat Smart Contract dan ID Transaksi dibuat pada tahap ini.'
            : 'Contract address and Transaction ID are produced at this stage.',
        ],
      });
      createdContractHash = generateAddressLikeFromName('InterbankSettlement');
      createdTxHash = generateTxHashDeterministic({
        type: 'transferInterbank',
        from: fromAcc.accountNumber,
        to: toAcc.accountNumber,
        amount,
      });
      steps[steps.length - 1].contractAddress = createdContractHash;
      steps[steps.length - 1].transactionHash = createdTxHash;
      await delay(1800);
      setFlowSteps([...steps]);

      steps[6].status = 'completed';
      steps.push({
        step: 8,
        title: 'Update Saldo',
        description: `${fromAcc.bank} dan ${toAcc.bank} memperbarui saldo rekening`,
        status: 'processing',
        node: `Node ${fromAcc.bank} & ${toAcc.bank}`,
        details: [
          'Saldo rekening pengirim dikurangi dan penerima ditambah.',
          'Ledger internal bank diperbarui sesuai hasil eksekusi kontrak.',
        ],
      });
      await delay(1200);
      setFlowSteps([...steps]);

      steps[7].status = 'completed';

      // Set smart contract data with real hash (simulasi)
      setSmartContractData({
        contractName: 'InterbankSettlement',
        contractAddress: createdContractHash || generateContractHash(),
        function: 'proposeTransfer',
        parameters: {
          fromAccount: fromAcc.accountNumber,
          toAccount: toAcc.accountNumber,
          amount: `Rp ${parseFloat(amount).toLocaleString('id-ID')}`,
          proposerBank: fromAcc.bank,
          validators: [
            `Node ${fromAcc.bank}`,
            `Node ${toAcc.bank}`,
            'Node Regulator',
          ],
          approvalThreshold: `${validatorConfig.required} dari ${validatorConfig.total}`,
          timestamp: new Date().toISOString(),
        },
        result: {
          requestId: Math.floor(Math.random() * 10000),
          status: 'Settled',
          executionTime: '4.6 detik',
          transactionHash: createdTxHash || generateTransactionHash(),
        },
      });
      // Ledger (success)
      appendLedgerEntry({
        type: 'transfer',
        interbank: true,
        fromAccount: fromAcc.accountNumber,
        toAccount: toAcc.accountNumber,
        bankFrom: fromAcc.bank,
        bankTo: toAcc.bank,
        amount,
        fee: feeApplied,
        status: 'Settled',
        approvals: {
          total: validatorConfig.total,
          required: validatorConfig.required,
          succeed: approvals,
        },
        contractName: 'InterbankSettlement',
        contractAddress: createdContractHash,
        transactionHash: createdTxHash,
        steps: [...steps],
        createdAt: new Date().toISOString(),
      });
    } else {
      // Intra-bank transfer flow
      let feeApplied = FEE_INTRA;
      steps.push({
        step: 1,
        title: 'Validasi Rekening',
        description: `${fromAcc.bank} memverifikasi rekening asal dan tujuan`,
        status: 'processing',
        node: `Node ${fromAcc.bank}`,
        details: [
          'Cek format nomor rekening dan keberadaan rekening.',
          'Pastikan rekening tidak diblokir atau dibekukan.',
        ],
      });
      await delay(1200);
      setFlowSteps([...steps]);

      steps[0].status = 'completed';
      steps.push({
        step: 2,
        title: 'Cek Saldo',
        description: `${fromAcc.bank} memverifikasi saldo rekening ${fromAcc.accountNumber}`,
        status: 'processing',
        node: `Node ${fromAcc.bank}`,
        details: [
          'Hitung saldo tersedia vs. saldo tertahan (hold).',
          'Validasi limit transfer harian dan fee (bila ada).',
        ],
      });
      await delay(1200);
      setFlowSteps([...steps]);

      steps[1].status = 'completed';
      steps.push({
        step: 3,
        title: 'Eksekusi Transfer',
        description: `${fromAcc.bank} memproses transfer antar rekening`,
        status: 'processing',
        node: `Node ${fromAcc.bank}`,
        details: [
          'Mempersiapkan data transfer internal antar rekening.',
          'Validasi akhir sebelum commit.',
        ],
      });
      await delay(1500);
      setFlowSteps([...steps]);

      steps[2].status = 'completed';
      // Eksekusi Smart Contract & pembuatan ID
      steps.push({
        step: 4,
        title: 'Eksekusi Smart Contract',
        description:
          language === 'id'
            ? 'Menjalankan fungsi transferInternal pada validator set'
            : 'Execute transferInternal on the validator set',
        status: 'processing',
        node: 'Validator Set',
        details: [
          language === 'id'
            ? `Eksekutor: Node ${fromAcc.bank}`
            : `Executors: Node ${fromAcc.bank}`,
          language === 'id'
            ? 'Kontrak dieksekusi untuk mencatat transfer internal.'
            : 'Contract executes to record the internal transfer.',
          language === 'id'
            ? 'Alamat Smart Contract dan ID Transaksi dibuat pada tahap ini.'
            : 'Contract address and Transaction ID are produced at this stage.',
        ],
      });
      createdContractHash = generateAddressLikeFromName('BankTransfer');
      createdTxHash = generateTxHashDeterministic({
        type: 'transferIntra',
        from: fromAcc.accountNumber,
        to: toAcc.accountNumber,
        amount,
      });
      steps[steps.length - 1].contractAddress = createdContractHash;
      steps[steps.length - 1].transactionHash = createdTxHash;
      await delay(1500);
      setFlowSteps([...steps]);

      steps[3].status = 'completed';
      steps.push({
        step: 5,
        title: 'Update Saldo',
        description: `${fromAcc.bank} memperbarui saldo rekening asal dan tujuan`,
        status: 'processing',
        node: `Node ${fromAcc.bank}`,
        details: [
          'Saldo rekening pengirim dikurangi dan penerima ditambah.',
          'Ledger internal bank diperbarui sesuai hasil eksekusi kontrak.',
        ],
      });
      await delay(1200);
      setFlowSteps([...steps]);

      steps[4].status = 'completed';

      // Set smart contract data with real hash (simulasi)
      setSmartContractData({
        contractName: 'BankTransfer',
        contractAddress: createdContractHash || generateContractHash(),
        function: 'transferInternal',
        parameters: {
          fromAccount: fromAcc.accountNumber,
          toAccount: toAcc.accountNumber,
          amount: `Rp ${parseFloat(amount).toLocaleString('id-ID')}`,
          bank: fromAcc.bank,
          timestamp: new Date().toISOString(),
        },
        result: {
          status: 'Success',
          executionTime: '2.5 detik',
          transactionHash: createdTxHash || generateTransactionHash(),
        },
      });
      // Ledger (success)
      appendLedgerEntry({
        type: 'transfer',
        interbank: false,
        fromAccount: fromAcc.accountNumber,
        toAccount: toAcc.accountNumber,
        bankFrom: fromAcc.bank,
        bankTo: toAcc.bank,
        amount,
        fee: feeApplied,
        status: 'Success',
        contractName: 'BankTransfer',
        contractAddress: createdContractHash,
        transactionHash: createdTxHash,
        steps: [...steps],
        createdAt: new Date().toISOString(),
      });
    }

    // Update balances
    const updatedAccounts = { ...accounts };
    // Apply balances with fee (sender pays fee)
    const feeFinal =
      fromAcc.bankCode !== toAcc.bankCode ? FEE_INTER : FEE_INTRA;
    updatedAccounts[fromAcc.accountNumber].balance -=
      parseFloat(amount) + feeFinal;
    updatedAccounts[toAcc.accountNumber].balance += parseFloat(amount);
    saveAccounts(updatedAccounts);
    // Update daily usage
    addDailyUsage(fromAcc.accountNumber, amount);

    // Optional: Dispute & Reversal after settlement (interbank only)
    if (isInterbank && validatorConfig.dispute) {
      const stepBase = 9;
      steps.push({
        step: stepBase,
        title: language === 'id' ? 'Dispute Diajukan' : 'Dispute Raised',
        description:
          language === 'id'
            ? 'Nasabah/Bank mengajukan dispute setelah transaksi settle'
            : 'Customer/Bank raises a dispute after settlement',
        status: 'processing',
        node: 'Dispute Desk',
        details: [
          language === 'id'
            ? 'Pengajuan bukti pendukung, ticketing, dan verifikasi awal.'
            : 'Submit supporting evidence, ticketing, and preliminary verification.',
        ],
      });
      await delay(900);
      steps[steps.length - 1].status = 'completed';
      setFlowSteps([...steps]);

      steps.push({
        step: stepBase + 1,
        title:
          language === 'id'
            ? 'Investigasi & Konsensus'
            : 'Investigation & Consensus',
        description:
          language === 'id'
            ? 'Jaringan melakukan verifikasi bukti dan mencapai konsensus untuk reversal'
            : 'Network verifies evidence and reaches consensus for reversal',
        status: 'processing',
        node: 'Consensus',
        details: [
          language === 'id'
            ? 'Cross-check hash transaksi dan aturan kepatuhan.'
            : 'Cross-check transaction hash and compliance rules.',
        ],
      });
      await delay(1100);
      steps[steps.length - 1].status = 'completed';
      setFlowSteps([...steps]);

      steps.push({
        step: stepBase + 2,
        title: language === 'id' ? 'Reversal Dieksekusi' : 'Reversal Executed',
        description:
          language === 'id'
            ? 'Membalik perubahan saldo sesuai hasil dispute'
            : 'Reverse balance changes according to dispute result',
        status: 'processing',
        node: 'Blockchain',
        details: [
          language === 'id'
            ? 'Saldo dan usage harian dikembalikan.'
            : 'Balances and daily usage restored.',
        ],
      });
      await delay(1000);

      // Reverse balances and daily usage
      const reversedAccounts = { ...updatedAccounts };
      reversedAccounts[fromAcc.accountNumber].balance +=
        parseFloat(amount) + feeFinal;
      reversedAccounts[toAcc.accountNumber].balance -= parseFloat(amount);
      saveAccounts(reversedAccounts);
      addDailyUsage(fromAcc.accountNumber, -amount);

      steps[steps.length - 1].status = 'completed';
      setFlowSteps([...steps]);

      // Ledger (reversal)
      appendLedgerEntry({
        type: 'transfer',
        interbank: true,
        fromAccount: fromAcc.accountNumber,
        toAccount: toAcc.accountNumber,
        bankFrom: fromAcc.bank,
        bankTo: toAcc.bank,
        amount,
        fee: feeFinal,
        status: 'Reversed',
        reason: 'Dispute',
        reversalOf: createdTxHash,
        steps: [...steps],
        createdAt: new Date().toISOString(),
      });

      // Overwrite latest balances for result message
      updatedAccounts[fromAcc.accountNumber].balance =
        reversedAccounts[fromAcc.accountNumber].balance;
      updatedAccounts[toAcc.accountNumber].balance =
        reversedAccounts[toAcc.accountNumber].balance;
    }

    const baseMsg = `${t.transferSuccess} Rp ${parseFloat(
      amount
    ).toLocaleString('id-ID')} ${
      language === 'id' ? 'dari' : 'from'
    } ${maskAccount(fromAcc.accountNumber)} ${
      language === 'id' ? 'ke' : 'to'
    } ${maskAccount(toAcc.accountNumber)}`;
    const finalMsg =
      isInterbank && validatorConfig.dispute
        ? `${baseMsg} — ${t.reversedDueToDispute}`
        : baseMsg;
    setTransactionResult({
      success: true,
      message: finalMsg,
      fromBalance: updatedAccounts[fromAcc.accountNumber].balance,
      toBalance: updatedAccounts[toAcc.accountNumber].balance,
    });

    setIsTransferProcessing(false);
    setShowFlowModal(false);
    setShowContractModal(true);
  };

  const simulatePurchaseFlow = async (buyerAcc, product) => {
    setIsPurchaseProcessing(true);
    setFlowSteps([]);
    setSmartContractData(null);
    setTransactionResult(null);
    setShowFlowModal(true);
    setShowContractModal(false);

    const steps = [];
    let createdContractHash = null;
    let createdTxHash = null;

    steps.push({
      step: 1,
      title: 'Validasi Rekening',
      description: `${buyerAcc.bank} memverifikasi rekening ${maskAccount(
        buyerAcc.accountNumber
      )}`,
      status: 'processing',
      node: `Node ${buyerAcc.bank}`,
      details: [
        'Cek status rekening dan hak akses.',
        'Validasi data akun untuk pembayaran.',
      ],
    });
    await delay(1200);
    setFlowSteps([...steps]);

    steps[0].status = 'completed';
    steps.push({
      step: 2,
      title: 'Cek Saldo',
      description: `${buyerAcc.bank} memverifikasi saldo untuk pembayaran`,
      status: 'processing',
      node: `Node ${buyerAcc.bank}`,
      details: [
        'Pastikan saldo cukup untuk harga produk.',
        'Validasi batas pembayaran dan biaya.',
      ],
    });
    await delay(1200);
    setFlowSteps([...steps]);

    steps[1].status = 'completed';
    steps.push({
      step: 3,
      title: 'Escrow Funds',
      description: 'Mengunci dana pembayaran',
      status: 'processing',
      node: 'Escrow Node',
      details: [
        'Dana pembeli di-hold sementara untuk keamanan.',
        'Mencegah double-spend saat proses fulfillment.',
      ],
    });
    await delay(1600);
    setFlowSteps([...steps]);

    steps[2].status = 'completed';
    steps.push({
      step: 4,
      title: 'Notifikasi Provider',
      description: `Mengirim notifikasi ke ${product.provider}`,
      status: 'processing',
      node: `Node ${product.provider}`,
      details: [
        'Provider menerima order dan metadata.',
        'Sistem provider memulai proses pemenuhan (fulfillment).',
      ],
    });
    await delay(1800);
    setFlowSteps([...steps]);

    steps[3].status = 'completed';
    steps.push({
      step: 5,
      title: 'Fulfillment',
      description: `${product.provider} memproses pesanan`,
      status: 'processing',
      node: `Node ${product.provider}`,
      details: [
        'Provider menyiapkan produk/layanan (contoh: token/kode).',
        'Hasil siap dikirim setelah verifikasi internal.',
      ],
    });
    await delay(1600);
    setFlowSteps([...steps]);

    steps[4].status = 'completed';
    steps.push({
      step: 6,
      title: 'Release Payment',
      description: `Melepaskan pembayaran ke ${product.provider}`,
      status: 'processing',
      node: `Node ${product.provider}`,
      details: [
        'Dana escrow dirilis ke provider setelah fulfillment OK.',
        'Transaksi siap dicatat permanen.',
      ],
    });
    await delay(1400);
    setFlowSteps([...steps]);

    steps[5].status = 'completed';
    // Eksekusi Smart Contract & pembuatan ID
    steps.push({
      step: 7,
      title: 'Eksekusi Smart Contract',
      description:
        language === 'id'
          ? 'Menjalankan fungsi createPurchase pada validator set untuk mencatat transaksi'
          : 'Execute createPurchase on the validator set to record the transaction',
      status: 'processing',
      node: 'Validator Set',
      details: [
        language === 'id'
          ? `Eksekutor: Node ${buyerAcc.bank}, Node ${product.provider}`
          : `Executors: Node ${buyerAcc.bank}, Node ${product.provider}`,
        language === 'id'
          ? 'Kontrak dieksekusi untuk mencatat pembelian.'
          : 'Contract executes to record the purchase.',
        language === 'id'
          ? 'Alamat Smart Contract dan ID Transaksi dibuat pada tahap ini.'
          : 'Contract address and Transaction ID are produced at this stage.',
      ],
    });
    createdContractHash = generateAddressLikeFromName('PurchaseProcessor');
    createdTxHash = generateTxHashDeterministic({
      type: 'purchase',
      buyer: buyerAcc.accountNumber,
      productId: product.id,
      amount: product.price,
    });
    steps[steps.length - 1].contractAddress = createdContractHash;
    steps[steps.length - 1].transactionHash = createdTxHash;
    await delay(1500);
    setFlowSteps([...steps]);

    steps[6].status = 'completed';
    steps.push({
      step: 8,
      title: 'Update Saldo',
      description: `${buyerAcc.bank} memperbarui saldo rekening`,
      status: 'processing',
      node: `Node ${buyerAcc.bank}`,
      details: [
        'Saldo rekening pembeli dikurangi sesuai harga produk.',
        'Ledger internal bank diperbarui sesuai hasil eksekusi kontrak.',
      ],
    });
    await delay(1200);
    setFlowSteps([...steps]);

    steps[7].status = 'completed';

    // Update balance
    const updatedAccounts = { ...accounts };
    updatedAccounts[buyerAcc.accountNumber].balance -= product.price;
    saveAccounts(updatedAccounts);

    // Set smart contract data with real hash (simulasi)
    setSmartContractData({
      contractName: 'PurchaseProcessor',
      contractAddress:
        createdContractHash || generateAddressLikeFromName('PurchaseProcessor'),
      function: 'createPurchase',
      parameters: {
        buyerAccount: buyerAcc.accountNumber,
        productId: product.id.toString(),
        productName: product.name,
        amount: `Rp ${product.price.toLocaleString('id-ID')}`,
        provider: product.provider,
        timestamp: new Date().toISOString(),
      },
      result: {
        orderId: Math.floor(Math.random() * 10000),
        status: 'Fulfilled',
        executionTime: '5.5 detik',
        transactionHash:
          createdTxHash ||
          generateTxHashDeterministic({
            type: 'purchase',
            buyer: buyerAcc.accountNumber,
            productId: product.id,
            amount: product.price,
          }),
      },
    });
    // Ledger (success)
    appendLedgerEntry({
      type: 'purchase',
      buyerAccount: buyerAcc.accountNumber,
      productId: product.id,
      productName: product.name,
      provider: product.provider,
      amount: product.price,
      status: 'Fulfilled',
      contractName: 'PurchaseProcessor',
      contractAddress: generateAddressLikeFromName('PurchaseProcessor'),
      transactionHash: generateTxHashDeterministic({
        type: 'purchase',
        buyer: buyerAcc.accountNumber,
        productId: product.id,
        amount: product.price,
      }),
      steps: [...steps],
      createdAt: new Date().toISOString(),
    });

    // Optional: Dispute & Reversal after settlement (purchase parity)
    if (validatorConfig.dispute) {
      const stepBase = 9;
      steps.push({
        step: stepBase,
        title: language === 'id' ? 'Dispute Diajukan' : 'Dispute Raised',
        description:
          language === 'id'
            ? 'Nasabah/Bank mengajukan dispute setelah transaksi settle'
            : 'Customer/Bank raises a dispute after settlement',
        status: 'processing',
        node: 'Dispute Desk',
        details: [
          language === 'id'
            ? 'Pengajuan bukti pendukung, ticketing, dan verifikasi awal.'
            : 'Submit supporting evidence, ticketing, and preliminary verification.',
        ],
      });
      await delay(900);
      steps[steps.length - 1].status = 'completed';
      setFlowSteps([...steps]);

      steps.push({
        step: stepBase + 1,
        title:
          language === 'id'
            ? 'Investigasi & Konsensus'
            : 'Investigation & Consensus',
        description:
          language === 'id'
            ? 'Jaringan melakukan verifikasi bukti dan mencapai konsensus untuk reversal'
            : 'Network verifies evidence and reaches consensus for reversal',
        status: 'processing',
        node: 'Consensus',
        details: [
          language === 'id'
            ? 'Cross-check hash transaksi dan aturan kepatuhan.'
            : 'Cross-check transaction hash and compliance rules.',
        ],
      });
      await delay(1100);
      steps[steps.length - 1].status = 'completed';
      setFlowSteps([...steps]);

      steps.push({
        step: stepBase + 2,
        title: language === 'id' ? 'Reversal Dieksekusi' : 'Reversal Executed',
        description:
          language === 'id'
            ? 'Membalik perubahan saldo sesuai hasil dispute'
            : 'Reverse balance changes according to dispute result',
        status: 'processing',
        node: 'Blockchain',
        details: [
          language === 'id'
            ? 'Saldo dikembalikan ke sebelum transaksi.'
            : 'Balance restored to pre-transaction state.',
        ],
      });
      await delay(1000);

      // Reverse buyer balance
      const reversedAccounts = { ...updatedAccounts };
      reversedAccounts[buyerAcc.accountNumber].balance += product.price;
      saveAccounts(reversedAccounts);

      steps[steps.length - 1].status = 'completed';
      setFlowSteps([...steps]);

      // Ledger (reversal)
      appendLedgerEntry({
        type: 'purchase',
        buyerAccount: buyerAcc.accountNumber,
        productId: product.id,
        productName: product.name,
        provider: product.provider,
        amount: product.price,
        status: 'Reversed',
        reason: 'Dispute',
        reversalOf: createdTxHash,
        steps: [...steps],
        createdAt: new Date().toISOString(),
      });

      // Update the reference balance for result
      updatedAccounts[buyerAcc.accountNumber].balance =
        reversedAccounts[buyerAcc.accountNumber].balance;
    }

    const basePurchaseMsg = `${t.purchaseSuccess} ${product.name} ${
      language === 'id' ? 'untuk rekening' : 'for account'
    } ${maskAccount(buyerAcc.accountNumber)}`;
    const finalPurchaseMsg = validatorConfig.dispute
      ? `${basePurchaseMsg} — ${t.reversedDueToDispute}`
      : basePurchaseMsg;
    setTransactionResult({
      success: true,
      message: finalPurchaseMsg,
      remainingBalance: updatedAccounts[buyerAcc.accountNumber].balance,
    });

    setIsPurchaseProcessing(false);
    setShowFlowModal(false);
    setShowContractModal(true);
  };

  const delay = (ms) =>
    new Promise((resolve) =>
      setTimeout(resolve, Math.max(0, Math.round(ms * speedFactor)))
    );

  // Deterministic 64-hex generator (simple, for simulation)
  const deterministicHex64 = (input) => {
    const str = typeof input === 'string' ? input : JSON.stringify(input);
    let h1 = 0x811c9dc5,
      h2 = 0x811c9dc5,
      p = 0x01000193;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      h1 ^= c;
      h1 = (h1 * p) >>> 0;
      h2 ^= c + i;
      h2 = (h2 * p) >>> 0;
    }
    const to8 = (x) => ('00000000' + (x >>> 0).toString(16)).slice(-8);
    const hex =
      to8(h1) +
      to8(h2) +
      to8((h1 >>> 1) ^ h2) +
      to8((h2 >>> 1) ^ h1) +
      to8(h1 ^ 0xa5a5a5a5) +
      to8(h2 ^ 0x5a5a5a5a) +
      to8((h1 + h2) >>> 0) +
      to8((h1 * 31) >>> 0);
    return '0x' + hex.slice(0, 64);
  };

  // Address-like 40-hex from name (deterministic, for simulation)
  const generateAddressLikeFromName = (name) => {
    const hex = deterministicHex64(name).slice(2); // 64 hex
    return '0x' + hex.slice(0, 40); // 20 bytes
  };

  // Deterministic tx hash from parameters (for simulation)
  const generateTxHashDeterministic = (params) => deterministicHex64(params);

  // Ledger helpers
  const LEDGER_KEY = 'banking_ledger';
  const appendLedgerEntry = (entry) => {
    try {
      const raw = localStorage.getItem(LEDGER_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(entry);
      localStorage.setItem(LEDGER_KEY, JSON.stringify(arr));
      setLedgerTick((k) => k + 1);
    } catch {}
  };

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
    if (
      !transferForm.fromAccount ||
      !transferForm.toAccount ||
      !transferForm.amount
    ) {
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

  const accountList = Object.values(accounts);
  const accountsByBank = useMemo(() => {
    const groups = {};
    Object.values(accounts).forEach((acc) => {
      groups[acc.bank] = groups[acc.bank] || [];
      groups[acc.bank].push(acc);
    });
    return groups;
  }, [accounts]);

  const productsByProvider = useMemo(() => {
    const groups = {};
    products.forEach((p) => {
      groups[p.provider] = groups[p.provider] || [];
      groups[p.provider].push(p);
    });
    return groups;
  }, [products]);

  const handlePurchase = async () => {
    if (!purchaseForm.buyerAccount || !purchaseForm.productId) {
      alert(t.selectProductError);
      return;
    }

    const buyerAcc = accounts[purchaseForm.buyerAccount];
    const product = products.find(
      (p) => p.id === parseInt(purchaseForm.productId)
    );

    if (buyerAcc.balance < product.price) {
      alert(t.insufficientBalance);
      return;
    }

    await simulatePurchaseFlow(buyerAcc, product);

    // Reset form
    setPurchaseForm({ buyerAccount: '', productId: '' });
  };

  if (showAboutPage) {
    return (
      <AboutPage
        onBack={() => setShowAboutPage(false)}
        language={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  return (
    <div className='container'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <h1 style={{ margin: 0 }}>{t.title}</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
              transition: 'all 0.2s',
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
              width: 'auto',
              whiteSpace: 'nowrap',
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
        </div>
      </div>

      <div
        className='card'
        style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          border: 'none',
          marginBottom: '24px',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'visible',
          position: 'relative',
        }}
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>
            {t.simulationControlTitle}
          </h3>

          {/* Row: Speed */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr 60px',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <label
              style={{
                color: '#374151',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {t.processSpeed}
              <InfoIcon text={t.tooltipProcessSpeed} />
            </label>
            <input
              type='range'
              min='0.5'
              max='3'
              step='0.1'
              value={speedFactor}
              onChange={(e) => setSpeedFactor(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <div
              style={{
                color: '#374151',
                fontSize: 12,
                textAlign: 'right',
                minWidth: 60,
              }}
            >
              {speedFactor.toFixed(1)}x
            </div>
          </div>

          {/* Row: Extra toggles (horizontal) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <label style={{ color: '#374151', fontWeight: 600 }}>
              {t.simulationExtras}
            </label>
            <div
              style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                alignItems: 'center',
              }}
            >
              {/* Toggle: Fail To Bank */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  id='failToBank'
                  type='checkbox'
                  checked={validatorConfig.failToBank}
                  onChange={(e) =>
                    setValidatorConfig({
                      ...validatorConfig,
                      failToBank: e.target.checked,
                    })
                  }
                  style={{ width: 18, height: 18 }}
                />
                <label
                  htmlFor='failToBank'
                  style={{
                    color: '#374151',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    margin: 0,
                  }}
                >
                  {t.simulateFailToBank}
                </label>
                <InfoIcon text={t.tooltipFailToBank} />
              </div>

              {/* Toggle: Fail Regulator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  id='failRegulator'
                  type='checkbox'
                  checked={validatorConfig.failRegulator}
                  onChange={(e) =>
                    setValidatorConfig({
                      ...validatorConfig,
                      failRegulator: e.target.checked,
                    })
                  }
                  style={{ width: 18, height: 18 }}
                />
                <label
                  htmlFor='failRegulator'
                  style={{
                    color: '#374151',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    margin: 0,
                  }}
                >
                  {t.simulateFailRegulator}
                </label>
                <InfoIcon text={t.tooltipFailRegulator} />
              </div>

              {/* Toggle: Dispute & Reversal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  id='disputeToggle'
                  type='checkbox'
                  checked={validatorConfig.dispute}
                  onChange={(e) =>
                    setValidatorConfig({
                      ...validatorConfig,
                      dispute: e.target.checked,
                    })
                  }
                  style={{ width: 18, height: 18 }}
                />
                <label
                  htmlFor='disputeToggle'
                  style={{
                    color: '#374151',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    margin: 0,
                  }}
                >
                  {t.simulateDispute}
                </label>
                <InfoIcon text={t.tooltipDisputeReversal} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Panel */}
      <div className='card' style={{ background: 'white' }}>
        <h2
          style={{
            color: '#1a202c',
            fontSize: '1.75rem',
            fontWeight: '700',
            marginBottom: '28px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e2e8f0',
          }}
        >
          {t.transfer}
        </h2>
        <div className='form-group'>
          <label>{t.fromAccount}</label>
          <select
            value={transferForm.fromAccount}
            onChange={(e) =>
              setTransferForm({ ...transferForm, fromAccount: e.target.value })
            }
            disabled={isTransferProcessing || isPurchaseProcessing}
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              fontVariantNumeric: 'tabular-nums',
              backgroundColor:
                isTransferProcessing || isPurchaseProcessing
                  ? '#f5f5f5'
                  : 'white',
              cursor:
                isTransferProcessing || isPurchaseProcessing
                  ? 'not-allowed'
                  : 'pointer',
              appearance: 'none',
              backgroundImage:
                "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: '40px',
            }}
          >
            <option value=''>{t.selectFromAccount}</option>
            {Object.keys(accountsByBank)
              .sort()
              .map((bank) => (
                <optgroup key={bank} label={bank}>
                  {accountsByBank[bank]
                    .slice()
                    .sort((a, b) => a.accountName.localeCompare(b.accountName))
                    .map((acc) => (
                      <option
                        key={acc.accountNumber}
                        value={acc.accountNumber}
                        title={`${acc.accountNumber} · ${
                          acc.accountName
                        } · ${bank} · Rp ${acc.balance.toLocaleString(
                          'id-ID'
                        )}`}
                      >
                        {acc.accountName} - {maskAccount(acc.accountNumber)} -
                        Rp {acc.balance.toLocaleString('id-ID')}
                      </option>
                    ))}
                </optgroup>
              ))}
          </select>
        </div>

        <div className='form-group'>
          <label>{t.toAccount}</label>
          <select
            value={transferForm.toAccount}
            onChange={(e) =>
              setTransferForm({ ...transferForm, toAccount: e.target.value })
            }
            disabled={isTransferProcessing || isPurchaseProcessing}
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              fontVariantNumeric: 'tabular-nums',
              backgroundColor:
                isTransferProcessing || isPurchaseProcessing
                  ? '#f5f5f5'
                  : 'white',
              cursor:
                isTransferProcessing || isPurchaseProcessing
                  ? 'not-allowed'
                  : 'pointer',
              appearance: 'none',
              backgroundImage:
                "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: '40px',
            }}
          >
            <option value=''>{t.selectToAccount}</option>
            {Object.keys(accountsByBank)
              .sort()
              .map((bank) => (
                <optgroup key={bank} label={bank}>
                  {accountsByBank[bank]
                    .filter(
                      (acc) => acc.accountNumber !== transferForm.fromAccount
                    )
                    .slice()
                    .sort((a, b) => a.accountName.localeCompare(b.accountName))
                    .map((acc) => (
                      <option
                        key={acc.accountNumber}
                        value={acc.accountNumber}
                        title={`${acc.accountNumber} · ${
                          acc.accountName
                        } · ${bank} · Rp ${acc.balance.toLocaleString(
                          'id-ID'
                        )}`}
                      >
                        {acc.accountName} - {maskAccount(acc.accountNumber)} -
                        Rp {acc.balance.toLocaleString('id-ID')}
                      </option>
                    ))}
                </optgroup>
              ))}
          </select>
        </div>

        <div className='form-group'>
          <label>{t.amount}</label>
          <input
            type='text'
            value={formatCurrencyInput(transferForm.amount, language)}
            onChange={(e) => {
              const digits = (e.target.value || '').replace(/\D/g, '');
              setTransferForm({ ...transferForm, amount: digits });
            }}
            placeholder='0'
            disabled={isTransferProcessing || isPurchaseProcessing}
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              fontVariantNumeric: 'tabular-nums',
            }}
          />
        </div>

        <div className='form-group'>
          <label>{t.memo}</label>
          <input
            type='text'
            value={transferForm.memo}
            onChange={(e) =>
              setTransferForm({ ...transferForm, memo: e.target.value })
            }
            placeholder={t.memoPlaceholder}
            disabled={isTransferProcessing || isPurchaseProcessing}
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
            }}
          />
        </div>

        <button
          onClick={handleTransfer}
          disabled={
            isTransferProcessing ||
            isPurchaseProcessing ||
            !transferForm.fromAccount ||
            !transferForm.toAccount ||
            !transferForm.amount
          }
          style={{
            width: '100%',
            marginTop: '8px',
            opacity:
              isTransferProcessing ||
              isPurchaseProcessing ||
              !transferForm.fromAccount ||
              !transferForm.toAccount ||
              !transferForm.amount
                ? 0.5
                : 1,
            background:
              isTransferProcessing ||
              isPurchaseProcessing ||
              !transferForm.fromAccount ||
              !transferForm.toAccount ||
              !transferForm.amount
                ? 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {isTransferProcessing ? t.processing : t.submitTransfer}
        </button>
      </div>

      {/* Product Purchase Panel */}
      <div className='card' style={{ background: 'white' }}>
        <h2
          style={{
            color: '#1a202c',
            fontSize: '1.75rem',
            fontWeight: '700',
            marginBottom: '28px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e2e8f0',
          }}
        >
          {t.purchase}
        </h2>
        <div className='form-group'>
          <label>{t.buyerAccount}</label>
          <select
            value={purchaseForm.buyerAccount}
            onChange={(e) =>
              setPurchaseForm({ ...purchaseForm, buyerAccount: e.target.value })
            }
            disabled={isTransferProcessing || isPurchaseProcessing}
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              fontVariantNumeric: 'tabular-nums',
              backgroundColor:
                isTransferProcessing || isPurchaseProcessing
                  ? '#f5f5f5'
                  : 'white',
              cursor:
                isTransferProcessing || isPurchaseProcessing
                  ? 'not-allowed'
                  : 'pointer',
              appearance: 'none',
              backgroundImage:
                "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: '40px',
            }}
          >
            <option value=''>{t.selectBuyerAccount}</option>
            {Object.keys(accountsByBank)
              .sort()
              .map((bank) => (
                <optgroup key={bank} label={bank}>
                  {accountsByBank[bank]
                    .slice()
                    .sort((a, b) => a.accountName.localeCompare(b.accountName))
                    .map((acc) => (
                      <option
                        key={acc.accountNumber}
                        value={acc.accountNumber}
                        title={`${acc.accountNumber} · ${
                          acc.accountName
                        } · ${bank} · Rp ${acc.balance.toLocaleString(
                          'id-ID'
                        )}`}
                      >
                        {acc.accountName} - {maskAccount(acc.accountNumber)} -
                        Rp {acc.balance.toLocaleString('id-ID')}
                      </option>
                    ))}
                </optgroup>
              ))}
          </select>
        </div>

        <div className='form-group'>
          <label>{t.product}</label>
          <select
            value={purchaseForm.productId}
            onChange={(e) =>
              setPurchaseForm({ ...purchaseForm, productId: e.target.value })
            }
            disabled={isTransferProcessing || isPurchaseProcessing}
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              fontVariantNumeric: 'tabular-nums',
              backgroundColor:
                isTransferProcessing || isPurchaseProcessing
                  ? '#f5f5f5'
                  : 'white',
              cursor:
                isTransferProcessing || isPurchaseProcessing
                  ? 'not-allowed'
                  : 'pointer',
              appearance: 'none',
              backgroundImage:
                "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: '40px',
            }}
          >
            <option value=''>{t.selectProduct}</option>
            {Object.keys(productsByProvider)
              .sort()
              .map((provider) => (
                <optgroup key={provider} label={provider}>
                  {productsByProvider[provider]
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((product) => (
                      <option
                        key={product.id}
                        value={product.id}
                        title={`${provider} · ${
                          product.name
                        } · Rp ${product.price.toLocaleString('id-ID')}`}
                      >
                        {product.name} - Rp{' '}
                        {product.price.toLocaleString('id-ID')}
                      </option>
                    ))}
                </optgroup>
              ))}
          </select>
        </div>

        <button
          onClick={handlePurchase}
          disabled={
            isTransferProcessing ||
            isPurchaseProcessing ||
            !purchaseForm.buyerAccount ||
            !purchaseForm.productId
          }
          style={{
            width: '100%',
            marginTop: '8px',
            opacity:
              isTransferProcessing ||
              isPurchaseProcessing ||
              !purchaseForm.buyerAccount ||
              !purchaseForm.productId
                ? 0.5
                : 1,
            background:
              isTransferProcessing ||
              isPurchaseProcessing ||
              !purchaseForm.buyerAccount ||
              !purchaseForm.productId
                ? 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {isPurchaseProcessing ? t.processing : t.buyNow}
        </button>
      </div>

      {/* History & Audit */}
      <div className='card' style={{ background: 'white' }}>
        <HistoryPanel tick={ledgerTick} lang={language} />
      </div>

      {/* Processing Flow Modal */}
      {showFlowModal && flowSteps.length > 0 && (
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
            padding: '20px',
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
              border: '1px solid rgba(255,255,255,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e2e8f0',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: '#667eea',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                }}
              >
                {t.processingTransaction}
              </h2>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {!isTransferProcessing &&
                  !isPurchaseProcessing &&
                  smartContractData && (
                    <button
                      onClick={() => {
                        setShowFlowModal(false);
                        setShowContractModal(true);
                      }}
                      style={{
                        background: '#f0f0f0',
                        color: '#333',
                        border: '1px solid #ddd',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {t.viewResult}
                    </button>
                  )}
                {!isTransferProcessing &&
                  !isPurchaseProcessing &&
                  flowSteps.some((s) => s.status === 'failed') && (
                    <button
                      onClick={() => setShowFlowModal(false)}
                      aria-label='Close'
                      title='Close'
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        cursor: 'pointer',
                        fontSize: '18px',
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      ×
                    </button>
                  )}
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              {flowSteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '16px',
                    padding: '18px',
                    background:
                      step.status === 'completed'
                        ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)'
                        : step.status === 'processing'
                        ? 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)'
                        : '#f8f9fa',
                    border: `2px solid ${
                      step.status === 'completed'
                        ? '#28a745'
                        : step.status === 'processing'
                        ? '#ffc107'
                        : '#e2e8f0'
                    }`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'all 0.3s ease',
                    boxShadow:
                      step.status === 'processing'
                        ? '0 4px 12px rgba(255, 193, 7, 0.2)'
                        : '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background:
                        step.status === 'completed'
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
                      boxShadow:
                        step.status !== 'pending'
                          ? '0 4px 12px rgba(0,0,0,0.15)'
                          : 'none',
                    }}
                  >
                    {step.status === 'completed' ? '✓' : step.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#2d3748',
                        }}
                      >
                        {step.title}
                      </h3>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#4a5568',
                          background: '#edf2f7',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontWeight: '500',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {step.node}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: '#718096',
                        fontSize: '14px',
                        lineHeight: '1.5',
                      }}
                    >
                      {step.description}
                    </p>
                    {Array.isArray(step.details) && step.details.length > 0 && (
                      <ul
                        style={{
                          margin: '8px 0 0 18px',
                          color: '#4a5568',
                          fontSize: '13px',
                          lineHeight: '1.5',
                        }}
                      >
                        {step.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                    {(step.contractAddress || step.transactionHash) && (
                      <div
                        style={{
                          marginTop: '12px',
                          display: 'grid',
                          gap: '10px',
                        }}
                      >
                        {step.contractAddress && (
                          <div>
                            <strong
                              style={{
                                fontSize: '12px',
                                color: '#4a5568',
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '600',
                                letterSpacing: '0.3px',
                              }}
                            >
                              {t.contractAddress}
                            </strong>
                            <div
                              style={{
                                padding: '12px',
                                background: '#f7fafc',
                                borderRadius: '8px',
                                fontFamily:
                                  'Monaco, Menlo, "Courier New", monospace',
                                fontSize: '12px',
                                wordBreak: 'break-all',
                                border: '2px solid #e2e8f0',
                                color: '#2d3748',
                                lineHeight: '1.6',
                              }}
                            >
                              {step.contractAddress}
                            </div>
                          </div>
                        )}
                        {step.transactionHash && (
                          <div>
                            <strong
                              style={{
                                fontSize: '12px',
                                color: '#4a5568',
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '600',
                                letterSpacing: '0.3px',
                              }}
                            >
                              {t.transactionId}
                            </strong>
                            <div
                              style={{
                                padding: '12px',
                                background: '#f7fafc',
                                borderRadius: '8px',
                                fontFamily:
                                  'Monaco, Menlo, "Courier New", monospace',
                                fontSize: '12px',
                                wordBreak: 'break-all',
                                border: '2px solid #e2e8f0',
                                color: '#2d3748',
                                lineHeight: '1.6',
                              }}
                            >
                              {step.transactionHash}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
            padding: '20px',
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
              border: '1px solid rgba(255,255,255,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e2e8f0',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: '#1976D2',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                }}
              >
                Data Smart Contract
              </h2>
              {flowSteps.length > 0 && (
                <button
                  onClick={() => {
                    setShowContractModal(false);
                    setShowFlowModal(true);
                  }}
                  style={{
                    background: '#f0f0f0',
                    color: '#333',
                    border: '1px solid #ddd',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginRight: '8px',
                  }}
                >
                  {t.viewProcess}
                </button>
              )}
              <button
                onClick={() => setShowContractModal(false)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  minWidth: '36px',
                  minHeight: '36px',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  fontSize: '22px',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                  fontWeight: '300',
                  flexShrink: 0,
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
              <div
                style={{
                  marginBottom: '28px',
                  textAlign: 'center',
                  padding: '20px',
                  background:
                    'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1976D2',
                    marginBottom: '12px',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {t.smartContractExecuted}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#4a5568',
                    lineHeight: '1.6',
                  }}
                >
                  {t.transactionRecorded}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <strong
                  style={{
                    fontSize: '13px',
                    color: '#4a5568',
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    letterSpacing: '0.3px',
                  }}
                >
                  {t.contractAddress}
                </strong>
                <div
                  style={{
                    padding: '16px',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    fontFamily: 'Monaco, Menlo, "Courier New", monospace',
                    fontSize: '13px',
                    wordBreak: 'break-all',
                    border: '2px solid #e2e8f0',
                    color: '#2d3748',
                    lineHeight: '1.6',
                  }}
                >
                  {smartContractData.contractAddress}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '8px',
                  }}
                >
                  <button
                    onClick={() =>
                      navigator.clipboard?.writeText?.(
                        smartContractData.contractAddress
                      )
                    }
                    style={{
                      background: '#f0f0f0',
                      color: '#333',
                      border: '1px solid #ddd',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {t.copy}
                  </button>
                </div>
              </div>

              {smartContractData.result.transactionHash && (
                <div style={{ marginBottom: '24px' }}>
                  <strong
                    style={{
                      fontSize: '13px',
                      color: '#4a5568',
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '600',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {t.transactionId}
                  </strong>
                  <div
                    style={{
                      padding: '16px',
                      background: '#f7fafc',
                      borderRadius: '12px',
                      fontFamily: 'Monaco, Menlo, "Courier New", monospace',
                      fontSize: '13px',
                      wordBreak: 'break-all',
                      border: '2px solid #e2e8f0',
                      color: '#2d3748',
                      lineHeight: '1.6',
                    }}
                  >
                    {smartContractData.result.transactionHash}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '8px',
                    }}
                  >
                    <button
                      onClick={() =>
                        navigator.clipboard?.writeText?.(
                          smartContractData.result.transactionHash
                        )
                      }
                      style={{
                        background: '#f0f0f0',
                        color: '#333',
                        border: '1px solid #ddd',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      {t.copy}
                    </button>
                  </div>
                </div>
              )}

              <div
                style={{
                  marginTop: '28px',
                  padding: '18px',
                  background:
                    'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(33, 150, 243, 0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: '#1976d2',
                    lineHeight: '1.7',
                    fontWeight: '500',
                  }}
                >
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
                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.25)',
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
