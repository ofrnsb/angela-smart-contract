# Implementasi Node - Distributed Ledger Banking System

## Overview

Sistem ini mengimplementasikan distributed ledger untuk perbankan dengan:
- **Smart Contract Engine**: Eksekusi deterministic contracts
- **RAFT Consensus**: Simplified consensus untuk demo
- **RPC API**: HTTP API untuk komunikasi dengan frontend
- **Multi-node Setup**: Docker compose untuk 3 node (BNI, BCA, Merchant)

## Arsitektur

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Node BNI   │────▶│  Node BCA   │────▶│Node Merchant│
│  Port 3001  │     │  Port 3002  │     │  Port 3003  │
└─────────────┘     └─────────────┘     └─────────────┘
      │                    │                    │
      └────────────────────┴────────────────────┘
                          │
                    ┌─────────────┐
                    │   Frontend  │
                    │  (React)    │
                    └─────────────┘
```

## State Model

### Accounts
```
accounts/{bankId}/{accountId} -> balance (int)
```

### Products
```
products/{merchantId}/{productId} -> { price, stock }
```

### Transactions
```
transactions/{txId} -> { payload, timestamp, status }
```

## Smart Contracts

### 1. TransferIntraBank
- Validasi: `fromBank == toBank`
- Debit akun sumber
- Kredit akun tujuan
- Error: `INSUFFICIENT_BALANCE`, `ACCOUNT_NOT_FOUND`

### 2. TransferInterBank
- Validasi: `fromBank != toBank`
- Debit akun sumber
- Kredit akun tujuan (bisa di bank lain)
- Error: `INSUFFICIENT_BALANCE`, `ACCOUNT_NOT_FOUND`

### 3. PurchaseProduct
- Validasi stok produk
- Validasi saldo pembeli
- Debit pembeli
- Kredit merchant
- Kurangi stok
- Error: `PRODUCT_NOT_FOUND`, `PRODUCT_OUT_OF_STOCK`, `INSUFFICIENT_BALANCE`

## Consensus (RAFT - Simplified)

Untuk demo, menggunakan RAFT yang disederhanakan:
- Node pertama menjadi leader
- Leader langsung execute dan commit
- Tidak ada log replication (untuk demo)
- Deterministic execution

**Catatan**: Untuk production, gunakan library RAFT yang proper seperti hashicorp/raft.

## API Endpoints

### Health Check
```
GET /health
Response: { nodeId, nodeType, bankId, status, peers }
```

### Get Balance
```
GET /balance?bank=BNI&acc=1234567890
Response: { balance, bank, account }
```

### Transfer
```
POST /transfer
Body: {
  fromBank: "BNI",
  fromAcc: "1234567890",
  toBank: "BCA",
  toAcc: "1111111111",
  amount: 100000
}
Response: { status: "SUCCESS", transactionId, ... }
```

### Purchase
```
POST /purchase
Body: {
  buyerBank: "BNI",
  buyerAcc: "1234567890",
  merchantId: "TELKOMSEL",
  productId: "PULSA_50K"
}
Response: { status: "SUCCESS", transactionId, price, ... }
```

### Get Transactions
```
GET /transactions?bank=BNI&acc=1234567890&limit=50
Response: { transactions: [...] }
```

### Get Products
```
GET /products?merchantId=TELKOMSEL
Response: { products: [...] }
```

## Menjalankan

### Local Development

1. Install dependencies:
```bash
cd node
npm install
```

2. Jalankan node BNI (terminal 1):
```bash
NODE_ID=node-bni NODE_TYPE=bank BANK_ID=BNI PORT=3001 PEERS=node-bca,node-merchant npm start
```

3. Jalankan node BCA (terminal 2):
```bash
NODE_ID=node-bca NODE_TYPE=bank BANK_ID=BCA PORT=3002 PEERS=node-bni,node-merchant npm start
```

4. Jalankan node Merchant (terminal 3):
```bash
NODE_ID=node-merchant NODE_TYPE=merchant BANK_ID=MERCHANT PORT=3003 PEERS=node-bni,node-bca npm start
```

### Docker Compose

```bash
docker-compose up
```

Ini akan menjalankan 3 node sekaligus.

## Testing

### Test Transfer Intra Bank
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

### Test Transfer Inter Bank
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

### Test Purchase
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

## Frontend Integration

Frontend dapat berkomunikasi dengan node melalui API client di `frontend/src/api.js`.

Contoh:
```javascript
import { BankingAPI } from './api';

const api = new BankingAPI('BNI');
const balance = await api.getBalance('BNI', '1234567890');
```

## Catatan Penting

1. **Demo Only**: Implementasi ini untuk demo, bukan production
2. **Simplified RAFT**: Consensus disederhanakan untuk demo
3. **No Persistence**: State tidak di-persist ke disk (in-memory only)
4. **Single Leader**: Node pertama selalu menjadi leader
5. **No Network RPC**: Peer communication belum diimplementasikan (untuk demo)

## Next Steps untuk Production

1. Implementasi RAFT library yang proper
2. Persistence layer (database)
3. Network RPC untuk peer communication
4. Byzantine Fault Tolerance (IBFT)
5. Transaction signing dan verification
6. State synchronization antar node

