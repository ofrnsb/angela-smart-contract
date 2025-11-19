# GitHub Pages Deployment - Setup Instructions

## Status Deployment

✅ **Semua file sudah di-push ke GitHub**
✅ **GitHub Actions workflow sudah dikonfigurasi**
✅ **Frontend sudah di-build dan siap deploy**

## Langkah Terakhir (Sekali Saja)

### 1. Aktifkan GitHub Pages di Repository Settings

1. Buka repository di GitHub: https://github.com/ofrnsb/angela-smart-contract
2. Klik **Settings** → **Pages** (di sidebar kiri)
3. Di bagian **Source**, pilih:
   - **Source**: `GitHub Actions`
4. Klik **Save**

### 2. Verifikasi Deployment

Setelah push terakhir, GitHub Actions akan otomatis:
1. Build frontend (npm ci → npm run build)
2. Upload artifact (frontend/dist)
3. Deploy ke GitHub Pages

**Cek status deployment:**
- Buka tab **Actions** di repository
- Lihat workflow "Deploy to GitHub Pages"
- Tunggu sampai selesai (biasanya 2-3 menit)

### 3. Akses Aplikasi

Setelah deployment selesai, aplikasi akan tersedia di:
**https://ofrnsb.github.io/angela-smart-contract/**

## Catatan Penting

### Untuk Full Functionality

Aplikasi di GitHub Pages adalah **read-only demo**. Untuk full functionality (transaksi, role switching, dll):

1. **Clone repository:**
   ```bash
   git clone https://github.com/ofrnsb/angela-smart-contract.git
   cd angela-smart-contract
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Start Hardhat node:**
   ```bash
   npm run node
   ```

4. **Deploy contracts (terminal baru):**
   ```bash
   npm run deploy:prd
   ```
   **Update contract addresses** di `scripts/seedPRD.js` dan `frontend/src/AppPRD.jsx`

5. **Seed data:**
   ```bash
   npm run seed:prd
   ```

6. **Start frontend:**
   ```bash
   cd frontend && npm run dev
   ```

7. **Akses:** http://localhost:3000

## Troubleshooting

### GitHub Actions Gagal

1. **Cek logs** di tab Actions
2. **Pastikan** `frontend/package-lock.json` ada (sudah ada)
3. **Pastikan** Node.js version 18 (sudah dikonfigurasi)

### Halaman Kosong di GitHub Pages

1. **Cek base path** di `frontend/vite.config.js`:
   ```js
   base: process.env.NODE_ENV === 'production' ? '/angela-smart-contract/' : '/',
   ```
   Pastikan sesuai dengan nama repository.

2. **Cek console browser** untuk error JavaScript

### Contract Addresses Tidak Valid

- Di GitHub Pages, contract addresses adalah placeholder
- Untuk testing, gunakan local deployment (lihat langkah di atas)

## Manual Deployment (Opsional)

Jika GitHub Actions tidak berjalan, bisa deploy manual:

```bash
cd frontend
npm install
npm run build
npx gh-pages -d dist
```

Tapi lebih baik gunakan GitHub Actions (otomatis setiap push).

## Status Saat Ini

✅ Frontend menggunakan AppPRD (PRD implementation)
✅ Build berhasil (dist/ folder sudah dibuat)
✅ GitHub Actions workflow sudah dikonfigurasi
✅ Base path sudah benar (/angela-smart-contract/)
✅ Semua perubahan sudah di-push

**Tinggal aktifkan GitHub Pages di Settings → Pages → Source: GitHub Actions**
