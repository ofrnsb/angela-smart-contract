# Banking Smart Contract Demo (Indonesia)

Proyek ini mensimulasikan transaksi perbankan sederhana di atas smart contract: buka rekening per bank, setor/penarikan (Ether sebagai rupiah simulasi), transfer sesama bank (intrabank), transfer antar bank (interbank) dengan fee, dan pembelian produk (contoh: token listrik PLN) yang disalurkan ke rekening settlement provider.

## Struktur Proyek
- `contracts/BankingCore.sol`
- `scripts/deploy.js`
- `hardhat.config.js`, `package.json`
- `web/` (frontend Vite + React untuk simulasi)
  - Halaman: `/#/` (Simulator), `/#/about` (Penjelasan non-teknis)

## Cara Menjalankan (Local)
- **Install dependensi root**
```
npm install
```
- **Jalankan node Hardhat** (terminal 1)
```
npx hardhat node
```
- **Deploy kontrak & seed data** (terminal 2)
```
npx hardhat run scripts/deploy.js --network localhost
```
- Catat alamat kontrak dari output, lalu set di `web/src/config.ts`.
- **Frontend**
```
cd web
npm install
npm run dev
```
Buka http://localhost:5173 dan sambungkan MetaMask ke `http://127.0.0.1:8545`.

## Deploy Frontend ke GitHub Pages
> GitHub Pages hanya menyajikan file statis. Agar dApp berfungsi online, kontrak harus dideploy di jaringan publik (mis. Sepolia). Sesuaikan `CONTRACT_ADDRESS` dan pilih network yang sama di MetaMask.

1. Push repo ini ke GitHub (branch `main`).
2. Di GitHub, buka `Settings > Pages` dan set Source: `GitHub Actions`.
3. Workflow sudah disiapkan: `.github/workflows/deploy-pages.yml`. Setiap push ke `main` (bagian `web/`) akan build dan deploy otomatis ke Pages.
4. Pastikan `web/src/config.ts` diisi alamat kontrak publik:
   - `export const CONTRACT_ADDRESS = "0x...";`
5. Frontend memakai `HashRouter` sehingga routing bekerja di Pages (`/#/` dan `/#/about`).

### Deploy Kontrak ke Testnet (contoh Sepolia)
Anda perlu RPC & private key (jangan commit ke git). Tambah network di `hardhat.config.js` dan gunakan variabel environment:
```js
// hardhat.config.js
sepolia: {
  url: process.env.SEPOLIA_RPC,
  accounts: [process.env.PRIVATE_KEY]
}
```
Lalu:
```bash
SEPOLIA_RPC=... PRIVATE_KEY=0x... npx hardhat run scripts/deploy.js --network sepolia
```
Ambil alamat kontrak dari output dan set ke `web/src/config.ts`.

## 1. Contoh Case Implementasi
- **Transfer sesama bank (Intrabank)**: Nasabah A di `BCA` mengirim ke Nasabah B juga di `BCA`.
- **Transfer antar bank (Interbank)**: Nasabah A di `BCA` mengirim ke Nasabah C di `BRI`. Terdapat fee interbank dalam basis poin (bps).
- **Pembelian produk (Token Listrik)**: Nasabah membeli token listrik `PLN`. Dana didebet dari rekening nasabah dan dikreditkan ke rekening settlement provider pada bank yang ditentukan (misal `BCA`).

## 2. Bentuk/Wujud Smart Contract
Kontrak inti: `contracts/BankingCore.sol` menyimpan:
- **Registri bank dan provider** (`registerBank`, `registerProvider`).
- **Rekening per bank** untuk setiap alamat, beserta saldo internal (dalam wei/Ether sebagai simulasi rupiah).
- **Operasi**: `openAccount`, `deposit` (payable), `withdraw`, `transferIntra`, `transferInter`, `purchaseProduct`.
- **Fee interbank**: `interbankFeeBps` dan `feeReserve` yang dapat ditarik owner melalui `withdrawFees`.

## 3. Peran Smart Contract pada Transaksi Perbankan
- **Sumber kebenaran**: Saldo per rekening per bank tercatat on-chain.
- **Aturan transaksi**: Validasi keberadaan rekening, status bank/provider, dan perhitungan fee interbank.
- **Transparansi**: Event on-chain untuk setiap aksi (deposit, transfer, pembelian).

## 4. Cara Kerja Smart Contract (Ringkas)
- **Buka rekening**: Alamat memanggil `openAccount(bankCode)` jika bank aktif.
- **Setor/Deposit**: `deposit(bankCode)` mengirim Ether dan menambah saldo internal.
- **Tarik/Withdraw**: `withdraw(bankCode, amount)` mengirim Ether kembali ke pemilik.
- **Transfer intra**: Debit dan kredit di bank yang sama.
- **Transfer inter**: Debit dari bank asal, kredit ke bank tujuan, fee ditambahkan ke `feeReserve`.
- **Pembelian produk**: Debit dari pembeli, kredit ke akun settlement provider sesuai banknya.

## Catatan
- Ini adalah simulasi edukatif. Bukan rancangan siap produksi/perizinan. Tidak mencakup KYC/AML, persetujuan regulator, atau privasi/permissioned chain.
- Unit saldo memakai wei/Ether pada jaringan lokal Hardhat.
