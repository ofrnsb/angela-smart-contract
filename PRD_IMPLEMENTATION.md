# Implementasi PRD - Distributed Ledger Banking System

## Status Implementasi

Semua komponen sesuai PRD telah diimplementasikan:

### ✅ Completed

1. **Node Implementation** (`node/`)
   - Node dengan state store (key-value)
   - Smart contract engine
   - RAFT consensus (simplified)
   - RPC API server

2. **Smart Contracts**
   - ✅ TransferIntraBank
   - ✅ TransferInterBank
   - ✅ PurchaseProduct

3. **Docker Compose**
   - 3 node setup (BNI, BCA, Merchant)
   - Network configuration

4. **API RPC**
   - POST /transfer
   - POST /purchase
   - GET /balance
   - GET /transactions
   - GET /products

5. **Frontend API Client**
   - BankingAPI class untuk komunikasi dengan node

## Struktur Project

```
angela-smart-contract/
├── node/                          # Node implementation
│   ├── src/
│   │   ├── index.js              # RPC API server
│   │   ├── node.js               # Node core
│   │   ├── consensus/
│   │   │   └── raft.js           # RAFT consensus
│   │   └── contracts/
│   │       ├── engine.js         # Contract engine
│   │       ├── TransferIntraBank.js
│   │       ├── TransferInterBank.js
│   │       └── PurchaseProduct.js
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
├── frontend/                      # React frontend (mode demo)
│   └── src/
│       └── api.js                # API client untuk node
├── docker-compose.yml            # Multi-node setup
└── NODE_IMPLEMENTATION.md        # Dokumentasi lengkap
```

## Cara Menggunakan

### Option 1: Mode Demo (Current - Stable)

Frontend saat ini menggunakan mode demo dengan localStorage. Tidak perlu node backend.

```bash
cd frontend
npm install
npm run dev
```

### Option 2: Mode Node (Distributed Ledger)

1. **Start nodes dengan Docker:**
```bash
docker-compose up
```

2. **Atau start manual:**
```bash
# Terminal 1 - Node BNI
cd node
NODE_ID=node-bni NODE_TYPE=bank BANK_ID=BNI PORT=3001 PEERS=node-bca,node-merchant npm start

# Terminal 2 - Node BCA
NODE_ID=node-bca NODE_TYPE=bank BANK_ID=BCA PORT=3002 PEERS=node-bni,node-merchant npm start

# Terminal 3 - Node Merchant
NODE_ID=node-merchant NODE_TYPE=merchant BANK_ID=MERCHANT PORT=3003 PEERS=node-bni,node-bca npm start
```

3. **Update frontend untuk menggunakan node:**
   - Import `BankingAPI` dari `api.js`
   - Ganti fungsi transfer/deposit/purchase untuk menggunakan API

## API Endpoints

### Node BNI: http://localhost:3001
### Node BCA: http://localhost:3002
### Node Merchant: http://localhost:3003

### Transfer Intra Bank
```bash
curl -X POST http://localhost:3001/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "fromBank": "BNI",
    "fromAcc": "1234567890",
    "toBank": "BNI",
    "toAcc": "0987654321",
    "amount": 100000
  }'
```

### Transfer Inter Bank
```bash
curl -X POST http://localhost:3001/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "fromBank": "BNI",
    "fromAcc": "1234567890",
    "toBank": "BCA",
    "toAcc": "1111111111",
    "amount": 500000
  }'
```

### Purchase Product
```bash
curl -X POST http://localhost:3001/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "buyerBank": "BNI",
    "buyerAcc": "1234567890",
    "merchantId": "TELKOMSEL",
    "productId": "PULSA_50K"
  }'
```

## Smart Contract Code

Semua smart contract code ditampilkan di frontend saat transaksi dilakukan. Kode yang ditampilkan adalah implementasi actual dari contracts di `node/src/contracts/`.

## Error Handling

Semua error codes sesuai PRD:
- `ACCOUNT_NOT_FOUND`
- `INSUFFICIENT_BALANCE`
- `PRODUCT_NOT_FOUND`
- `PRODUCT_OUT_OF_STOCK`
- `INVALID_TRANSFER_TYPE`

## Catatan

- **Mode Demo**: Frontend saat ini menggunakan mode demo (localStorage) yang stabil dan tidak memerlukan backend
- **Mode Node**: Node implementation tersedia untuk demo distributed ledger, tapi frontend perlu di-update untuk menggunakannya
- **Consensus**: RAFT disederhanakan untuk demo (tidak ada network RPC antar peer)
- **State**: In-memory only (tidak persist ke disk)

## Next Steps (Optional)

Jika ingin frontend terhubung ke node:
1. Update `App.jsx` untuk menggunakan `BankingAPI`
2. Handle connection errors
3. Sync state dari node ke frontend

