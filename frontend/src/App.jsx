import React, { useState, useEffect } from 'react';
import './index.css';
import AboutPage from './components/AboutPage';
import SmartContractViewer from './components/SmartContractViewer';

// Simulasi data untuk demo (tanpa blockchain)
const DEMO_MODE = true;

// Data dummy untuk simulasi - Account Bank Mandiri
const initialAccounts = {
  '1234567890': { accountNumber: '1234567890', accountName: 'Budi Santoso', balance: 10000000, bank: 'BM' },
  '0987654321': { accountNumber: '0987654321', accountName: 'Siti Nurhaliza', balance: 5000000, bank: 'BM' },
  '1122334455': { accountNumber: '1122334455', accountName: 'Rina Wati', balance: 7500000, bank: 'BM' },
  '2233445566': { accountNumber: '2233445566', accountName: 'Dedi Kurniawan', balance: 12000000, bank: 'BM' },
  // Account Bank BCA
  '1111111111': { accountNumber: '1111111111', accountName: 'Ahmad Yani', balance: 8000000, bank: 'BCA' },
  '2222222222': { accountNumber: '2222222222', accountName: 'Maya Sari', balance: 6000000, bank: 'BCA' },
  '3333333333': { accountNumber: '3333333333', accountName: 'Bambang Sutrisno', balance: 15000000, bank: 'BCA' },
  '4444444444': { accountNumber: '4444444444', accountName: 'Lisa Permata', balance: 9000000, bank: 'BCA' },
};

const initialProducts = [
  { id: '1', name: 'Token Listrik 20kWh', price: 50000, description: 'Token listrik untuk 20kWh - PLN' },
  { id: '2', name: 'Token Listrik 50kWh', price: 125000, description: 'Token listrik untuk 50kWh - PLN' },
  { id: '3', name: 'Pulsa 50.000', price: 50000, description: 'Pulsa seluler 50.000 untuk semua operator' },
  { id: '4', name: 'Paket Data 10GB', price: 75000, description: 'Paket data internet 10GB - 30 hari' },
];

function App() {
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('demo_accounts');
    return saved ? JSON.parse(saved) : initialAccounts;
  });
  
  const [products] = useState(initialProducts);
  const [currentBank, setCurrentBank] = useState('BM');
  const [userAccountNumber, setUserAccountNumber] = useState('');
  const [balance, setBalance] = useState('0');
  const [activeTab, setActiveTab] = useState('account');
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [showContractViewer, setShowContractViewer] = useState(false);
  const [contractCode, setContractCode] = useState('');
  const [transactionType, setTransactionType] = useState('');

  // Form states
  const [transferForm, setTransferForm] = useState({
    toAccount: '',
    amount: '',
    description: ''
  });
  const [externalTransferForm, setExternalTransferForm] = useState({
    toBankCode: 'BCA',
    toAccount: '',
    amount: '',
    description: ''
  });
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    // Simpan ke localStorage setiap kali accounts berubah
    localStorage.setItem('demo_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (userAccountNumber && accounts[userAccountNumber]) {
      setBalance(accounts[userAccountNumber].balance.toString());
    } else {
      setBalance('0');
    }
  }, [userAccountNumber, accounts]);

  const switchBank = (bankCode) => {
    setCurrentBank(bankCode);
    setUserAccountNumber('');
    setBalance('0');
    showAlert('success', `Berpindah ke ${bankCode === 'BM' ? 'Bank Mandiri' : 'Bank BCA'}`);
  };

  const handleAccountSelect = (accountNumber) => {
    setUserAccountNumber(accountNumber);
  };

  const deposit = () => {
    if (!userAccountNumber || !depositAmount) {
      showAlert('error', 'Mohon isi nomor rekening dan jumlah deposit');
      return;
    }

    if (!accounts[userAccountNumber]) {
      showAlert('error', 'Rekening tidak ditemukan');
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Jumlah deposit tidak valid');
      return;
    }

    const updatedAccounts = { ...accounts };
    updatedAccounts[userAccountNumber].balance += amount;
    setAccounts(updatedAccounts);
    showAlert('success', `Deposit Rp ${parseFloat(depositAmount).toLocaleString('id-ID')} berhasil!`);
    displayContractViewer('deposit', { accountNumber: userAccountNumber, amount: depositAmount });
    setDepositAmount('');
  };

  const withdraw = () => {
    if (!userAccountNumber || !withdrawAmount) {
      showAlert('error', 'Mohon isi nomor rekening dan jumlah penarikan');
      return;
    }

    if (!accounts[userAccountNumber]) {
      showAlert('error', 'Rekening tidak ditemukan');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Jumlah penarikan tidak valid');
      return;
    }

    if (accounts[userAccountNumber].balance < amount) {
      showAlert('error', 'Saldo tidak mencukupi');
      return;
    }

    const updatedAccounts = { ...accounts };
    updatedAccounts[userAccountNumber].balance -= amount;
    setAccounts(updatedAccounts);
    showAlert('success', `Penarikan Rp ${parseFloat(withdrawAmount).toLocaleString('id-ID')} berhasil!`);
    displayContractViewer('withdraw', { accountNumber: userAccountNumber, amount: withdrawAmount });
    setWithdrawAmount('');
  };

  const transferInternal = () => {
    if (!userAccountNumber || !transferForm.toAccount || !transferForm.amount) {
      showAlert('error', 'Mohon lengkapi semua field');
      return;
    }

    if (!accounts[userAccountNumber]) {
      showAlert('error', 'Rekening pengirim tidak ditemukan');
      return;
    }

    if (!accounts[transferForm.toAccount]) {
      showAlert('error', 'Rekening penerima tidak ditemukan');
      return;
    }

    if (userAccountNumber === transferForm.toAccount) {
      showAlert('error', 'Tidak dapat transfer ke rekening sendiri');
      return;
    }

    const amount = parseFloat(transferForm.amount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Jumlah transfer tidak valid');
      return;
    }

    if (accounts[userAccountNumber].balance < amount) {
      showAlert('error', 'Saldo tidak mencukupi');
      return;
    }

    const updatedAccounts = { ...accounts };
    updatedAccounts[userAccountNumber].balance -= amount;
    updatedAccounts[transferForm.toAccount].balance += amount;
    setAccounts(updatedAccounts);
    showAlert('success', `Transfer Rp ${parseFloat(transferForm.amount).toLocaleString('id-ID')} berhasil!`);
    displayContractViewer('transferInternal', {
      fromAccount: userAccountNumber,
      toAccount: transferForm.toAccount,
      amount: transferForm.amount,
      description: transferForm.description
    });
    setTransferForm({ toAccount: '', amount: '', description: '' });
  };

  const transferExternal = () => {
    if (!userAccountNumber || !externalTransferForm.toAccount || !externalTransferForm.amount) {
      showAlert('error', 'Mohon lengkapi semua field');
      return;
    }

    if (!accounts[userAccountNumber]) {
      showAlert('error', 'Rekening pengirim tidak ditemukan');
      return;
    }

    const amount = parseFloat(externalTransferForm.amount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Jumlah transfer tidak valid');
      return;
    }

    if (accounts[userAccountNumber].balance < amount) {
      showAlert('error', 'Saldo tidak mencukupi');
      return;
    }

    // Simulasi transfer antar bank
    const updatedAccounts = { ...accounts };
    updatedAccounts[userAccountNumber].balance -= amount;
    
    // Jika rekening tujuan ada, tambahkan saldo
    if (accounts[externalTransferForm.toAccount]) {
      updatedAccounts[externalTransferForm.toAccount].balance += amount;
    } else {
      // Buat rekening baru jika belum ada
      updatedAccounts[externalTransferForm.toAccount] = {
        accountNumber: externalTransferForm.toAccount,
        accountName: 'Penerima',
        balance: amount,
        bank: externalTransferForm.toBankCode
      };
    }
    
    setAccounts(updatedAccounts);
    showAlert('success', `Transfer antar bank Rp ${parseFloat(externalTransferForm.amount).toLocaleString('id-ID')} berhasil!`);
    displayContractViewer('transferExternal', {
      fromAccount: userAccountNumber,
      toBankCode: externalTransferForm.toBankCode,
      toAccount: externalTransferForm.toAccount,
      amount: externalTransferForm.amount,
      description: externalTransferForm.description
    });
    setExternalTransferForm({ toBankCode: 'BCA', toAccount: '', amount: '', description: '' });
  };

  const purchaseProduct = (productId) => {
    if (!userAccountNumber) {
      showAlert('error', 'Mohon masukkan nomor rekening Anda');
      return;
    }

    if (!accounts[userAccountNumber]) {
      showAlert('error', 'Rekening tidak ditemukan');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      showAlert('error', 'Produk tidak ditemukan');
      return;
    }

    if (accounts[userAccountNumber].balance < product.price) {
      showAlert('error', 'Saldo tidak mencukupi');
      return;
    }

    const updatedAccounts = { ...accounts };
    updatedAccounts[userAccountNumber].balance -= product.price;
    setAccounts(updatedAccounts);
    showAlert('success', `Produk ${product.name} berhasil dibeli!`);
    displayContractViewer('purchaseProduct', {
      accountNumber: userAccountNumber,
      productId: productId,
      productName: product.name,
      price: product.price
    });
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  // Fungsi untuk generate smart contract code
  const generateContractCode = (type, params) => {
    switch(type) {
      case 'deposit':
        return `function deposit(string memory _accountNumber) external payable {
    require(accounts[_accountNumber].exists, "Rekening tidak ditemukan");
    require(msg.value > 0, "Jumlah deposit harus lebih dari 0");

    accounts[_accountNumber].balance += msg.value;

    emit Deposit(_accountNumber, msg.value, block.timestamp);
}

// Parameter yang digunakan:
// _accountNumber: "${params.accountNumber}"
// msg.value: ${parseFloat(params.amount).toLocaleString('id-ID')} (dalam Rupiah)
// Jumlah: Rp ${parseFloat(params.amount).toLocaleString('id-ID')}`;

      case 'withdraw':
        return `function withdraw(
    string memory _accountNumber,
    uint256 _amount
) external nonReentrant {
    require(accounts[_accountNumber].exists, "Rekening tidak ditemukan");
    require(
        accounts[_accountNumber].accountAddress == msg.sender,
        "Hanya pemilik rekening yang dapat menarik"
    );
    require(_amount > 0, "Jumlah penarikan harus lebih dari 0");
    require(
        accounts[_accountNumber].balance >= _amount,
        "Saldo tidak mencukupi"
    );

    accounts[_accountNumber].balance -= _amount;
    payable(msg.sender).transfer(_amount);

    emit Withdrawal(_accountNumber, _amount, block.timestamp);
}

// Parameter yang digunakan:
// _accountNumber: "${params.accountNumber}"
// _amount: ${params.amount}
// Jumlah: Rp ${parseFloat(params.amount).toLocaleString('id-ID')}`;

      case 'transferInternal':
        return `function transferInternal(
    string memory _fromAccount,
    string memory _toAccount,
    uint256 _amount,
    string memory _description
) external {
    require(accounts[_fromAccount].exists, "Rekening pengirim tidak ditemukan");
    require(accounts[_toAccount].exists, "Rekening penerima tidak ditemukan");
    require(
        accounts[_fromAccount].accountAddress == msg.sender,
        "Hanya pemilik rekening yang dapat transfer"
    );
    require(_amount > 0, "Jumlah transfer harus lebih dari 0");
    require(
        accounts[_fromAccount].balance >= _amount,
        "Saldo tidak mencukupi"
    );
    require(
        keccak256(bytes(_fromAccount)) != keccak256(bytes(_toAccount)),
        "Tidak dapat transfer ke rekening sendiri"
    );

    accounts[_fromAccount].balance -= _amount;
    accounts[_toAccount].balance += _amount;

    emit TransferInternal(
        _fromAccount,
        _toAccount,
        _amount,
        _description,
        block.timestamp
    );
}

// Parameter yang digunakan:
// _fromAccount: "${params.fromAccount}"
// _toAccount: "${params.toAccount}"
// _amount: ${params.amount}
// _description: "${params.description || 'Transfer Internal'}"
// Jumlah: Rp ${parseFloat(params.amount).toLocaleString('id-ID')}`;

      case 'transferExternal':
        return `function transferExternal(
    string memory _fromAccount,
    string memory _toBankCode,
    string memory _toAccount,
    uint256 _amount,
    string memory _description
) external {
    require(accounts[_fromAccount].exists, "Rekening pengirim tidak ditemukan");
    require(
        accounts[_fromAccount].accountAddress == msg.sender,
        "Hanya pemilik rekening yang dapat transfer"
    );
    require(_amount > 0, "Jumlah transfer harus lebih dari 0");
    require(
        accounts[_fromAccount].balance >= _amount,
        "Saldo tidak mencukupi"
    );
    require(
        keccak256(bytes(bankCode)) != keccak256(bytes(_toBankCode)),
        "Gunakan transferInternal untuk transfer dalam bank yang sama"
    );

    accounts[_fromAccount].balance -= _amount;

    // Memanggil InterBankNetwork untuk koordinasi
    interBankNetwork.transferInterBank(
        bankCode,
        _fromAccount,
        _toBankCode,
        _toAccount,
        _amount
    );

    emit TransferExternal(
        _fromAccount,
        _toBankCode,
        _toAccount,
        _amount,
        _description,
        block.timestamp
    );
}

// Parameter yang digunakan:
// _fromAccount: "${params.fromAccount}"
// _toBankCode: "${params.toBankCode}"
// _toAccount: "${params.toAccount}"
// _amount: ${params.amount}
// _description: "${params.description || 'Transfer Antar Bank'}"
// Jumlah: Rp ${parseFloat(params.amount).toLocaleString('id-ID')}`;

      case 'purchaseProduct':
        return `function purchaseProduct(
    string memory _accountNumber,
    uint256 _productId
) external {
    require(accounts[_accountNumber].exists, "Rekening tidak ditemukan");
    require(
        accounts[_accountNumber].accountAddress == msg.sender,
        "Hanya pemilik rekening yang dapat membeli"
    );
    require(products[_productId].isActive, "Produk tidak tersedia");
    require(
        accounts[_accountNumber].balance >= products[_productId].price,
        "Saldo tidak mencukupi"
    );

    uint256 price = products[_productId].price;
    accounts[_accountNumber].balance -= price;

    emit ProductPurchased(
        _accountNumber,
        _productId,
        price,
        products[_productId].productName,
        block.timestamp
    );
}

// Parameter yang digunakan:
// _accountNumber: "${params.accountNumber}"
// _productId: ${params.productId}
// Product: ${params.productName}
// Harga: Rp ${params.price.toLocaleString('id-ID')}`;

      default:
        return '// Smart contract code';
    }
  };

  const displayContractViewer = (type, params) => {
    const code = generateContractCode(type, params);
    setContractCode(code);
    setTransactionType(type);
    setShowContractViewer(true);
  };

  if (showAboutPage) {
    return <AboutPage onBack={() => setShowAboutPage(false)} />;
  }

  return (
    <div className="container">
      {showContractViewer && (
        <SmartContractViewer
          contractCode={contractCode}
          transactionType={transactionType}
          onClose={() => setShowContractViewer(false)}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Sistem Perbankan dengan Smart Contract</h1>
        <button 
          onClick={() => setShowAboutPage(true)}
          style={{ background: '#28a745', width: 'auto', padding: '10px 20px' }}
        >
          Penjelasan Smart Contract
        </button>
      </div>

      <div className="card" style={{ background: '#fff3cd', border: '2px solid #ffc107', marginBottom: '20px' }}>
        <p style={{ margin: 0, color: '#856404' }}>
          <strong>Mode Demo:</strong> Aplikasi ini berjalan dalam mode simulasi untuk pembelajaran. 
          Tidak memerlukan MetaMask atau koneksi blockchain. Setiap transaksi akan menampilkan smart contract yang dieksekusi.
        </p>
      </div>

      <div className="card">
        <h2>Daftar Rekening Dummy untuk Simulasi</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginTop: '15px' }}>
          {Object.values(accounts).map((acc) => (
            <div key={acc.accountNumber} style={{ 
              padding: '15px', 
              background: acc.bank === 'BM' ? '#f0f8ff' : '#fff5f5', 
              border: `2px solid ${acc.bank === 'BM' ? '#4a90e2' : '#e74c3c'}`,
              borderRadius: '8px'
            }}>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{acc.accountName}</p>
              <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>No. Rek: {acc.accountNumber}</p>
              <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
                Bank: {acc.bank === 'BM' ? 'Bank Mandiri' : 'Bank BCA'}
              </p>
              <p style={{ margin: '5px 0', fontSize: '1.1em', fontWeight: 'bold', color: '#667eea' }}>
                Saldo: Rp {acc.balance.toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '15px', fontSize: '0.9em', color: '#666' }}>
          Gunakan nomor rekening di atas untuk melakukan simulasi transaksi. Setiap transaksi akan menampilkan smart contract yang dieksekusi.
        </p>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <h2>Pilih Bank</h2>
        <div style={{ marginTop: '15px' }}>
          <button 
            onClick={() => switchBank('BM')} 
            style={{ marginRight: '10px', width: 'auto', background: currentBank === 'BM' ? '#667eea' : '#ccc' }}
          >
            Bank Mandiri
          </button>
          <button 
            onClick={() => switchBank('BCA')} 
            style={{ width: 'auto', background: currentBank === 'BCA' ? '#667eea' : '#ccc' }}
          >
            Bank BCA
          </button>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Rekening
        </button>
        <button 
          className={`tab ${activeTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfer')}
        >
          Transfer
        </button>
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Produk
        </button>
      </div>

      {/* Tab Rekening */}
      <div className={`tab-content ${activeTab === 'account' ? 'active' : ''}`}>
        <div className="card">
          <h2>Pilih Rekening</h2>
          <div className="form-group">
            <label>Pilih Rekening</label>
            <select
              value={userAccountNumber}
              onChange={(e) => handleAccountSelect(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px' }}
            >
              <option value="">-- Pilih Rekening --</option>
              {Object.values(accounts)
                .filter(acc => acc.bank === currentBank)
                .map(acc => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountName} - {acc.accountNumber} (Saldo: Rp {acc.balance.toLocaleString('id-ID')})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {userAccountNumber && accounts[userAccountNumber] && (
          <div className="card">
            <h2>Informasi Rekening</h2>
            <div className="account-info">
              <p><strong>Nomor Rekening:</strong> {userAccountNumber}</p>
              <p><strong>Nama:</strong> {accounts[userAccountNumber].accountName}</p>
              <p><strong>Bank:</strong> {accounts[userAccountNumber].bank === 'BM' ? 'Bank Mandiri' : 'Bank BCA'}</p>
              <p className="balance"><strong>Saldo:</strong> Rp {parseFloat(balance || 0).toLocaleString('id-ID')}</p>
            </div>

            <h3>Deposit</h3>
            <div className="form-group">
              <label>Jumlah (Rupiah)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0"
                step="1000"
                min="0"
              />
            </div>
            <button onClick={deposit}>Deposit</button>

            <h3 style={{ marginTop: '30px' }}>Penarikan</h3>
            <div className="form-group">
              <label>Jumlah (Rupiah)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0"
                step="1000"
                min="0"
              />
            </div>
            <button onClick={withdraw}>Tarik</button>
          </div>
        )}
      </div>

      {/* Tab Transfer */}
      <div className={`tab-content ${activeTab === 'transfer' ? 'active' : ''}`}>
        <div className="card">
          <h2>Transfer Antar Rekening (Sesama Bank)</h2>
          <div className="form-group">
            <label>Rekening Pengirim</label>
            <select
              value={userAccountNumber}
              onChange={(e) => handleAccountSelect(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px' }}
            >
              <option value="">-- Pilih Rekening Pengirim --</option>
              {Object.values(accounts)
                .filter(acc => acc.bank === currentBank)
                .map(acc => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountName} - {acc.accountNumber} (Saldo: Rp {acc.balance.toLocaleString('id-ID')})
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label>Rekening Penerima</label>
            <select
              value={transferForm.toAccount}
              onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
              style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px' }}
            >
              <option value="">-- Pilih Rekening Penerima --</option>
              {Object.values(accounts)
                .filter(acc => acc.bank === currentBank && acc.accountNumber !== userAccountNumber)
                .map(acc => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountName} - {acc.accountNumber} (Saldo: Rp {acc.balance.toLocaleString('id-ID')})
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label>Jumlah (Rupiah)</label>
            <input
              type="number"
              value={transferForm.amount}
              onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
              placeholder="0"
              step="1000"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Deskripsi (Opsional)</label>
            <input
              type="text"
              value={transferForm.description}
              onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
              placeholder="Keterangan transfer"
            />
          </div>
          <button onClick={transferInternal}>Transfer</button>
        </div>

        <div className="card">
          <h2>Transfer Antar Bank</h2>
          <div className="form-group">
            <label>Rekening Pengirim</label>
            <select
              value={userAccountNumber}
              onChange={(e) => handleAccountSelect(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px' }}
            >
              <option value="">-- Pilih Rekening Pengirim --</option>
              {Object.values(accounts)
                .filter(acc => acc.bank === currentBank)
                .map(acc => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountName} - {acc.accountNumber} (Saldo: Rp {acc.balance.toLocaleString('id-ID')})
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label>Bank Tujuan</label>
            <select
              value={externalTransferForm.toBankCode}
              onChange={(e) => setExternalTransferForm({ ...externalTransferForm, toBankCode: e.target.value })}
            >
              <option value="BCA">Bank BCA</option>
              <option value="BM">Bank Mandiri</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nomor Rekening Penerima</label>
            <input
              type="text"
              value={externalTransferForm.toAccount}
              onChange={(e) => setExternalTransferForm({ ...externalTransferForm, toAccount: e.target.value })}
              placeholder="Nomor rekening tujuan"
            />
          </div>
          <div className="form-group">
            <label>Jumlah (Rupiah)</label>
            <input
              type="number"
              value={externalTransferForm.amount}
              onChange={(e) => setExternalTransferForm({ ...externalTransferForm, amount: e.target.value })}
              placeholder="0"
              step="1000"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Deskripsi (Opsional)</label>
            <input
              type="text"
              value={externalTransferForm.description}
              onChange={(e) => setExternalTransferForm({ ...externalTransferForm, description: e.target.value })}
              placeholder="Keterangan transfer"
            />
          </div>
          <button onClick={transferExternal}>Transfer Antar Bank</button>
        </div>
      </div>

      {/* Tab Produk */}
      <div className={`tab-content ${activeTab === 'products' ? 'active' : ''}`}>
        <div className="card">
          <h2>Daftar Produk</h2>
          {!userAccountNumber && (
            <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #ffc107' }}>
              <p style={{ margin: 0, color: '#856404' }}>
                <strong>Peringatan:</strong> Silakan pilih rekening terlebih dahulu di tab "Rekening" untuk melakukan pembelian produk.
              </p>
            </div>
          )}
          {userAccountNumber && (
            <div style={{ background: '#d4edda', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #28a745' }}>
              <p style={{ margin: 0, color: '#155724' }}>
                <strong>Rekening Aktif:</strong> {accounts[userAccountNumber]?.accountName} - {userAccountNumber} 
                (Saldo: Rp {accounts[userAccountNumber]?.balance.toLocaleString('id-ID')})
              </p>
            </div>
          )}
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p className="product-price">Rp {product.price.toLocaleString('id-ID')}</p>
                <button 
                  onClick={() => purchaseProduct(product.id)}
                  disabled={!userAccountNumber}
                  style={!userAccountNumber ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  Beli Sekarang
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
