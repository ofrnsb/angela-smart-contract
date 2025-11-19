export default function About() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h1>Penjelasan: Apa itu Smart Contract?</h1>
      <p>
        Smart contract adalah program yang berjalan di blockchain yang mengeksekusi perjanjian/aturan secara otomatis
        ketika kondisi terpenuhi. Tidak ada pihak ketiga yang mengubah-ubah aturan di tengah jalan, dan semua transaksi
        tercatat secara transparan.
      </p>

      <h2>Contoh Penggunaan</h2>
      <ul>
        <li>Perdagangan aset digital (mis. saham/token) dengan penyelesaian otomatis.</li>
        <li>Keuangan (perbankan): transfer saldo, pembayaran, pencatatan fee secara on-chain.</li>
        <li>Big company: supply chain, pembayaran vendor, loyalti/kupon, dsb.</li>
      </ul>

      <h2>Peran di Perbankan</h2>
      <p>
        Di demo ini, smart contract menyimpan saldo per rekening per bank, memvalidasi transfer sesama bank atau antar bank
        (dengan fee), dan menyalurkan pembayaran ke penyedia produk (contoh: token listrik). Semua pergerakan saldo terjadi
        mengikuti aturan kontrak.
      </p>

      <h2>Cara Kerja Singkat</h2>
      <ol>
        <li>Buka rekening pada bank yang aktif.</li>
        <li>Setor dana ke rekening (simulasi memakai Ether di jaringan lokal).</li>
        <li>Lakukan transfer (sesama bank/antar bank) atau pembelian produk.</li>
        <li>Tarik dana kembali bila diperlukan.</li>
      </ol>

      <h2>Mapping UI ke Smart Contract</h2>
      <ul>
        <li>Buka Rekening → fungsi <code>openAccount(bankCode)</code></li>
        <li>Setor (deposit) → fungsi <code>deposit(bankCode)</code> (mengirim Ether)</li>
        <li>Tarik (withdraw) → fungsi <code>withdraw(bankCode, amount)</code></li>
        <li>Transfer Sesama Bank → fungsi <code>transferIntra(bankCode, to, amount)</code></li>
        <li>Transfer Antar Bank → fungsi <code>transferInter(fromBank, toBank, to, amount)</code> (ada fee)</li>
        <li>Beli Produk → fungsi <code>purchaseProduct(bankCode, providerId, metadata, amount)</code></li>
      </ul>

      <h2>Manfaat</h2>
      <ul>
        <li>Otomatis, konsisten, dan transparan.</li>
        <li>Mengurangi kesalahan manual dan rekonsiliasi.</li>
        <li>Jejak audit on-chain.</li>
      </ul>

      <h2>Keterbatasan (Demo)</h2>
      <ul>
        <li>Simulasi edukatif: tidak mencakup KYC/AML, privasi, atau izin regulator.</li>
        <li>Nilai memakai Ether pada jaringan lokal, bukan rupiah.</li>
      </ul>
    </div>
  )
}
