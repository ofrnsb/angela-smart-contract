# PRD: Demo Contract-Based Payment & Product Purchase System

## Overview

Educational local demo that simulates a permissioned contract-based payment & settlement system (intra-bank, interbank, and product purchases) using tokenized IDR semantics. Frontend is intentionally simple: user picks 'from account' and 'to account' (or product) and the on-chain contracts simulate realistic network/node/validator behaviors.

## Quick Start

### Prerequisites
- Node.js >= 16
- npm or yarn
- Git

### Installation

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..
```

### Running the Demo

1. **Start Hardhat local node** (Terminal 1):
```bash
npm run node
```

This will start a local blockchain and display 20 seeded accounts with their private keys.

2. **Deploy contracts** (Terminal 2):
```bash
npm run deploy:prd
```

This deploys all contracts and sets up roles. **Copy the contract addresses** from the output.

3. **Update contract addresses**:
   - Open `scripts/seedPRD.js` and update `CONTRACT_ADDRESSES` with addresses from step 2
   - Open `frontend/src/AppPRD.jsx` and update `CONTRACT_ADDRESSES` with addresses from step 2

4. **Seed demo data** (Terminal 2):
```bash
npm run seed:prd
```

This creates accounts, mints initial balances, and adds products.

5. **Start frontend** (Terminal 3):
```bash
cd frontend && npm run dev
```

6. **Open browser**: http://localhost:3000

## Seeded Accounts (Hardhat Default)

| Role | Address | Private Key |
|------|---------|-------------|
| BankA | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 |
| BankB | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d |
| Regulator | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a |
| Validator1 | 0x90F79bf6EB2c4f870365E785982E1f101E93b906 | 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6 |
| Validator2 | 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 | 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a |
| Provider | 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc | 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba |
| User1 | 0x976EA74026E726554dB657fA54763abd0C3a0aa9 | 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e |
| User2 | 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955 | 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356 |

**WARNING**: These are demo-only keys. Never use in production or connect to mainnet!

## Contract Architecture

### IDRToken
- Demo ledger token representing IDR balances
- Only banks can mint/burn
- Tracks which bank issued tokens to which account

### AccountRegistry
- Maps human-readable account numbers to on-chain addresses
- Records owning bank for each account
- Only banks can register accounts

### InterbankSettlement
- Handles interbank transfer proposals
- Requires k-of-n validator approvals (default: 2 of 3)
- Escrows tokens during proposal, releases after approval threshold

### ProductCatalog
- Stores products (id, provider, priceInIDR)
- Only banks can add products
- Tracks active/inactive status

### PurchaseProcessor
- Handles product purchase lifecycle
- Escrows buyer funds
- Provider can mark fulfilled/failed
- Auto-refunds on timeout

## Frontend Features

### Role Selector
Switch between different roles to act as:
- BankA / BankB: Propose transfers, register accounts
- Validator1 / Validator2: Approve interbank transfers
- Provider: Fulfill or fail purchase orders
- User1 / User2: Make transfers and purchases
- Regulator: Cancel transfers (governance)

### Simple Transfer Panel
- Select from account (dropdown)
- Select to account (dropdown)
- Enter amount
- Submit
- Automatically detects intra-bank vs interbank

### Product Purchase Panel
- Select buyer account
- Select product
- Create purchase (escrows funds)

### Validator Panel
- Shows pending interbank transfer requests
- Approve button for each request
- Shows approval count

### Provider Panel
- Shows pending purchase orders
- Fulfill or Fail buttons
- Updates order status

### Audit Feed
- Chronological list of all contract events
- Shows TransferProposed, TransferApproved, InterbankSettled, PurchaseCommitted, PurchaseFulfilled, etc.

## Demo Scenarios

### 1. Intra-Bank Transfer
1. Select role: User1
2. From Account: 1234567890 (BankA)
3. To Account: 1111111111 (BankA)
4. Amount: 1000000
5. Submit
6. Result: Immediate balance update, Transfer event

### 2. Interbank Transfer
1. Select role: BankA
2. From Account: 1234567890 (BankA)
3. To Account: 0987654321 (BankB)
4. Amount: 2000000
5. Submit → Transfer proposed
6. Switch to Validator1 → Approve
7. Switch to Validator2 → Approve
8. Result: InterbankSettled event, balances updated

### 3. Product Purchase
1. Select role: User1
2. Buyer Account: 1234567890
3. Product: Token Listrik 20kWh
4. Buy → Purchase committed, funds escrowed
5. Switch to Provider → See pending order
6. Click Fulfill → Funds released to provider

## Flows

### Intra-Bank Transfer Flow
```
User selects from/to (same bank) → IDRToken.transfer() → Immediate execution
```

### Interbank Transfer Flow
```
Bank proposes → InterbankSettlement.proposeTransfer() → Escrow tokens
→ Validators approve → Threshold reached → Execute transfer → Release escrow
```

### Purchase Flow
```
User creates purchase → PurchaseProcessor.createPurchase() → Escrow funds
→ Provider marks fulfilled → Release escrow to provider
OR
→ Provider marks failed → Refund to buyer
```

## Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "deploy:prd": "hardhat run scripts/deployPRD.js --network localhost",
    "seed:prd": "hardhat run scripts/seedPRD.js --network localhost"
  }
}
```

## Important Notes

1. **Demo Only**: This is a local simulation. No real fiat movement.
2. **Private Keys**: Seeded keys are for demo only. Never use in production.
3. **Simplified Consensus**: Demo uses on-chain k-of-n approvals. Production uses distributed BFT consensus.
4. **Update Addresses**: After deployment, update contract addresses in `seedPRD.js` and `AppPRD.jsx`.

## Troubleshooting

- **"Contract not deployed"**: Make sure you've run `deploy:prd` and updated addresses
- **"Insufficient balance"**: Run `seed:prd` to mint initial balances
- **"Role not authorized"**: Make sure you've selected the correct role
- **Events not showing**: Check browser console for errors, ensure event listeners are set up

## Next Steps

1. Deploy contracts and update addresses
2. Seed demo data
3. Test all flows (intra-bank, interbank, purchase)
4. Switch roles and test validator/provider panels
5. Observe audit feed for all events

