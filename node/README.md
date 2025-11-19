# Banking Node - Distributed Ledger dengan Smart Contract

Implementasi node untuk sistem perbankan terdistribusi dengan smart contract engine dan RAFT consensus.

## Struktur

```
node/
├── src/
│   ├── index.js              # RPC API server
│   ├── node.js               # Node implementation
│   ├── consensus/
│   │   └── raft.js           # RAFT consensus (simplified)
│   └── contracts/
│       ├── engine.js         # Smart contract engine
│       ├── TransferIntraBank.js
│       ├── TransferInterBank.js
│       └── PurchaseProduct.js
├── package.json
└── Dockerfile
```

## Fitur

- **Smart Contract Engine**: Eksekusi deterministic contracts
- **RAFT Consensus**: Simplified RAFT untuk demo
- **RPC API**: HTTP API untuk frontend
- **State Store**: Key-value store untuk accounts, products, transactions

## Instalasi

```bash
cd node
npm install
```

## Menjalankan Node

### Node BNI (Port 3001)
```bash
NODE_ID=node-bni NODE_TYPE=bank BANK_ID=BNI PORT=3001 PEERS=node-bca,node-merchant npm start
```

### Node BCA (Port 3002)
```bash
NODE_ID=node-bca NODE_TYPE=bank BANK_ID=BCA PORT=3002 PEERS=node-bni,node-merchant npm start
```

### Node Merchant (Port 3003)
```bash
NODE_ID=node-merchant NODE_TYPE=merchant BANK_ID=MERCHANT PORT=3003 PEERS=node-bni,node-bca npm start
```

## API Endpoints

### GET /health
Health check

### GET /balance?bank=BNI&acc=1234567890
Get account balance

### POST /transfer
```json
{
  "fromBank": "BNI",
  "fromAcc": "1234567890",
  "toBank": "BCA",
  "toAcc": "1111111111",
  "amount": 100000
}
```

### POST /purchase
```json
{
  "buyerBank": "BNI",
  "buyerAcc": "1234567890",
  "merchantId": "TELKOMSEL",
  "productId": "PULSA_50K"
}
```

### GET /transactions?bank=BNI&acc=1234567890&limit=50
Get transaction history

### GET /products?merchantId=TELKOMSEL
Get products

## Docker

```bash
docker-compose up
```

Ini akan menjalankan 3 node:
- node-bni: http://localhost:3001
- node-bca: http://localhost:3002
- node-merchant: http://localhost:3003

## Smart Contracts

### TransferIntraBank
Transfer antar rekening dalam bank yang sama.

### TransferInterBank
Transfer antar bank berbeda.

### PurchaseProduct
Pembelian produk digital (pulsa, token listrik).

## Error Codes

- `ACCOUNT_NOT_FOUND`
- `INSUFFICIENT_BALANCE`
- `PRODUCT_NOT_FOUND`
- `PRODUCT_OUT_OF_STOCK`
- `INVALID_TRANSFER_TYPE`

