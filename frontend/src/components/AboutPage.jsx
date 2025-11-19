import React from 'react';
import './AboutPage.css';

const translations = {
  id: {
    back: '← Kembali ke Aplikasi',
    title: 'Penjelasan Smart Contract untuk Sistem Perbankan',
    whatIs: '1. Apa itu Smart Contract?',
    whatIsDesc: 'Smart Contract adalah program komputer yang berjalan di blockchain yang secara otomatis menjalankan perjanjian atau kontrak ketika kondisi tertentu terpenuhi. Dalam konteks perbankan, smart contract berfungsi sebagai "kontrak digital" yang memproses transaksi keuangan secara otomatis, aman, dan transparan.',
    analogy: 'Analogi Sederhana:',
    analogyDesc: 'Bayangkan smart contract seperti mesin ATM yang sangat canggih:',
    analogyList: [
      'Anda memasukkan kartu dan PIN (input)',
      'Mesin memverifikasi identitas Anda secara otomatis (validasi)',
      'Mesin memproses permintaan Anda (eksekusi)',
      'Mesin memberikan uang dan mencetak struk (output)',
      'Semua transaksi tercatat di sistem bank (record)'
    ],
    analogyNote: 'Bedanya, smart contract berjalan di blockchain yang terdesentralisasi, sehingga tidak ada satu pihak pun yang bisa memanipulasi atau menghentikan prosesnya.',
    whyImportant: '2. Mengapa Smart Contract Penting di Perbankan?',
    whyImportantDesc: 'Bank-bank besar di dunia seperti JPMorgan Chase, Bank of America, dan HSBC sudah mulai menggunakan teknologi blockchain dan smart contract untuk meningkatkan efisiensi operasional mereka.',
    realWorldUse: 'Penggunaan di Dunia Nyata:',
    useCase1: 'JPMorgan Chase - JPM Coin',
    useCase1Desc: 'Bank terbesar di AS ini menggunakan blockchain dan smart contract untuk transfer uang antar institusi keuangan secara instan, menggantikan sistem SWIFT yang memakan waktu 1-3 hari.',
    useCase2: 'Bank of America',
    useCase2Desc: 'Menggunakan smart contract untuk otomatisasi proses pinjaman, mengurangi waktu persetujuan dari minggu menjadi jam, dan meningkatkan akurasi verifikasi dokumen.',
    useCase3: 'HSBC & Standard Chartered',
    useCase3Desc: 'Menggunakan blockchain untuk trade finance, memungkinkan eksportir dan importir melakukan transaksi dengan lebih cepat dan transparan, mengurangi risiko penipuan.',
    useCase4: 'Bank Sentral Eropa (ECB)',
    useCase4Desc: 'Sedang meneliti penggunaan blockchain untuk sistem pembayaran antar bank (interbank settlement) yang lebih efisien dan aman.',
    howItWorks: '3. Bagaimana Smart Contract Bekerja di Sistem Perbankan?',
    howItWorksDesc: 'Dalam sistem perbankan, setiap transaksi (transfer, pembayaran, dll) diproses melalui smart contract yang berjalan di blockchain. Prosesnya melibatkan beberapa node (komputer) yang memvalidasi transaksi untuk memastikan keamanan dan keabsahan.',
    processTitle: 'Proses Transfer dengan Smart Contract:',
    processStep1: '1. Validasi Rekening',
    processStep1Desc: 'Node Bank Asal memverifikasi bahwa rekening pengirim valid dan memiliki saldo cukup.',
    processStep2: '2. Validasi Bank Tujuan',
    processStep2Desc: 'Node Bank Tujuan memverifikasi bahwa rekening penerima valid dan siap menerima transfer.',
    processStep3: '3. Validasi Regulator',
    processStep3Desc: 'Node Regulator (OJK/BI) memverifikasi bahwa transaksi mematuhi regulasi anti-money laundering dan tidak melanggar aturan.',
    processStep4: '4. Eksekusi Smart Contract',
    processStep4Desc: 'Setelah semua validasi selesai, smart contract secara otomatis memindahkan dana dari rekening pengirim ke rekening penerima.',
    processStep5: '5. Pencatatan Permanen',
    processStep5Desc: 'Transaksi dicatat secara permanen di blockchain, tidak bisa diubah atau dihapus, dan bisa diverifikasi kapan saja.',
    benefits: '4. Keuntungan Smart Contract untuk Perbankan',
    benefit1: 'Kecepatan',
    benefit1Desc: 'Transfer antar bank yang biasanya memakan waktu 1-3 hari bisa selesai dalam hitungan detik atau menit. Contoh: JPM Coin memproses transfer $1 miliar dalam waktu kurang dari 1 menit.',
    benefit2: 'Biaya Rendah',
    benefit2Desc: 'Mengurangi biaya operasional hingga 50-70% karena tidak perlu banyak pegawai untuk memproses transaksi manual. Bank bisa menghemat miliaran dolar per tahun.',
    benefit3: 'Keamanan Tinggi',
    benefit3Desc: 'Setiap transaksi dienkripsi dan divalidasi oleh multiple nodes, membuatnya hampir tidak mungkin untuk diretas atau dimanipulasi. Blockchain menggunakan kriptografi tingkat militer.',
    benefit4: 'Transparansi',
    benefit4Desc: 'Semua transaksi tercatat di blockchain yang bisa diverifikasi oleh regulator, auditor, dan pihak terkait tanpa mengungkapkan data pribadi nasabah.',
    benefit5: 'Tidak Bisa Diubah',
    benefit5Desc: 'Setelah transaksi tercatat di blockchain, tidak bisa diubah atau dihapus. Ini memberikan audit trail yang sempurna untuk kepatuhan regulasi.',
    benefit6: 'Otomatisasi',
    benefit6Desc: 'Proses yang biasanya memerlukan banyak langkah manual (verifikasi, approval, settlement) bisa diotomatisasi, mengurangi human error.',
    realExample: '5. Contoh Implementasi Real di Indonesia',
    realExampleDesc: 'Meskipun belum sepenuhnya diimplementasikan, beberapa bank di Indonesia sudah mulai mengeksplorasi teknologi blockchain:',
    indoExample1: 'Bank Mandiri',
    indoExample1Desc: 'Sudah melakukan uji coba blockchain untuk trade finance dan remittance, bekerja sama dengan perusahaan teknologi blockchain.',
    indoExample2: 'Bank BCA',
    indoExample2Desc: 'Menggunakan teknologi blockchain untuk meningkatkan keamanan dan efisiensi sistem pembayaran internal.',
    indoExample3: 'Bank BRI',
    indoExample3Desc: 'Meneliti penggunaan blockchain untuk microfinance dan pembayaran digital di daerah terpencil.',
    indoExample4: 'OJK (Otoritas Jasa Keuangan)',
    indoExample4Desc: 'Sudah mengeluarkan regulasi tentang penggunaan teknologi blockchain di sektor keuangan dan mendorong inovasi fintech.',
    future: '6. Masa Depan Smart Contract di Perbankan',
    futureDesc: 'Menurut penelitian dari Deloitte dan McKinsey, diperkirakan 80% bank di dunia akan menggunakan teknologi blockchain dan smart contract dalam 5-10 tahun ke depan. Ini akan mengubah cara kita melakukan transaksi keuangan selamanya.',
    conclusion: 'Kesimpulan',
    conclusionDesc: 'Smart contract bukan lagi teknologi masa depan, tapi sudah menjadi kenyataan di perbankan modern. Bank-bank terbesar di dunia sudah menggunakannya untuk meningkatkan efisiensi, keamanan, dan transparansi. Sistem perbankan Indonesia juga mulai mengadopsi teknologi ini untuk tetap kompetitif di era digital.'
  },
  en: {
    back: '← Back to Application',
    title: 'Smart Contract Explanation for Banking System',
    whatIs: '1. What is a Smart Contract?',
    whatIsDesc: 'A Smart Contract is a computer program that runs on blockchain and automatically executes agreements or contracts when certain conditions are met. In banking context, smart contracts function as "digital contracts" that process financial transactions automatically, securely, and transparently.',
    analogy: 'Simple Analogy:',
    analogyDesc: 'Think of a smart contract as a very advanced ATM machine:',
    analogyList: [
      'You insert your card and PIN (input)',
      'The machine automatically verifies your identity (validation)',
      'The machine processes your request (execution)',
      'The machine dispenses money and prints receipt (output)',
      'All transactions are recorded in the bank system (record)'
    ],
    analogyNote: 'The difference is, smart contracts run on a decentralized blockchain, so no single party can manipulate or stop the process.',
    whyImportant: '2. Why are Smart Contracts Important in Banking?',
    whyImportantDesc: 'Major banks worldwide like JPMorgan Chase, Bank of America, and HSBC have already started using blockchain technology and smart contracts to improve their operational efficiency.',
    realWorldUse: 'Real-World Usage:',
    useCase1: 'JPMorgan Chase - JPM Coin',
    useCase1Desc: 'The largest bank in the US uses blockchain and smart contracts for instant money transfers between financial institutions, replacing the SWIFT system that takes 1-3 days.',
    useCase2: 'Bank of America',
    useCase2Desc: 'Uses smart contracts to automate loan processes, reducing approval time from weeks to hours, and improving document verification accuracy.',
    useCase3: 'HSBC & Standard Chartered',
    useCase3Desc: 'Use blockchain for trade finance, enabling exporters and importers to transact faster and more transparently, reducing fraud risk.',
    useCase4: 'European Central Bank (ECB)',
    useCase4Desc: 'Researching the use of blockchain for more efficient and secure interbank payment systems (interbank settlement).',
    howItWorks: '3. How do Smart Contracts Work in Banking Systems?',
    howItWorksDesc: 'In banking systems, every transaction (transfer, payment, etc.) is processed through smart contracts running on blockchain. The process involves multiple nodes (computers) that validate transactions to ensure security and validity.',
    processTitle: 'Transfer Process with Smart Contract:',
    processStep1: '1. Account Validation',
    processStep1Desc: 'Source Bank Node verifies that the sender account is valid and has sufficient balance.',
    processStep2: '2. Destination Bank Validation',
    processStep2Desc: 'Destination Bank Node verifies that the recipient account is valid and ready to receive the transfer.',
    processStep3: '3. Regulator Validation',
    processStep3Desc: 'Regulator Node (OJK/BI) verifies that the transaction complies with anti-money laundering regulations and does not violate rules.',
    processStep4: '4. Smart Contract Execution',
    processStep4Desc: 'After all validations are complete, the smart contract automatically transfers funds from sender account to recipient account.',
    processStep5: '5. Permanent Recording',
    processStep5Desc: 'The transaction is permanently recorded on blockchain, cannot be changed or deleted, and can be verified anytime.',
    benefits: '4. Benefits of Smart Contracts for Banking',
    benefit1: 'Speed',
    benefit1Desc: 'Interbank transfers that usually take 1-3 days can be completed in seconds or minutes. Example: JPM Coin processes $1 billion transfers in less than 1 minute.',
    benefit2: 'Low Cost',
    benefit2Desc: 'Reduces operational costs by 50-70% because fewer employees are needed to process manual transactions. Banks can save billions of dollars per year.',
    benefit3: 'High Security',
    benefit3Desc: 'Every transaction is encrypted and validated by multiple nodes, making it nearly impossible to hack or manipulate. Blockchain uses military-grade cryptography.',
    benefit4: 'Transparency',
    benefit4Desc: 'All transactions are recorded on blockchain that can be verified by regulators, auditors, and related parties without revealing customer personal data.',
    benefit5: 'Immutable',
    benefit5Desc: 'Once a transaction is recorded on blockchain, it cannot be changed or deleted. This provides a perfect audit trail for regulatory compliance.',
    benefit6: 'Automation',
    benefit6Desc: 'Processes that usually require many manual steps (verification, approval, settlement) can be automated, reducing human error.',
    realExample: '5. Real Implementation Examples in Indonesia',
    realExampleDesc: 'Although not fully implemented yet, several banks in Indonesia have started exploring blockchain technology:',
    indoExample1: 'Bank Mandiri',
    indoExample1Desc: 'Has conducted blockchain trials for trade finance and remittance, collaborating with blockchain technology companies.',
    indoExample2: 'Bank BCA',
    indoExample2Desc: 'Uses blockchain technology to improve security and efficiency of internal payment systems.',
    indoExample3: 'Bank BRI',
    indoExample3Desc: 'Researching the use of blockchain for microfinance and digital payments in remote areas.',
    indoExample4: 'OJK (Financial Services Authority)',
    indoExample4Desc: 'Has issued regulations on the use of blockchain technology in the financial sector and encourages fintech innovation.',
    future: '6. Future of Smart Contracts in Banking',
    futureDesc: 'According to research from Deloitte and McKinsey, it is estimated that 80% of banks worldwide will use blockchain technology and smart contracts in the next 5-10 years. This will change the way we conduct financial transactions forever.',
    conclusion: 'Conclusion',
    conclusionDesc: 'Smart contracts are no longer future technology, but have become a reality in modern banking. The world\'s largest banks are already using them to improve efficiency, security, and transparency. Indonesia\'s banking system is also starting to adopt this technology to remain competitive in the digital era.'
  }
};

function AboutPage({ onBack, language = 'id', onLanguageChange }) {
  const t = translations[language];
  
  return (
    <div className='about-container'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button className='back-button' onClick={onBack}>
          {t.back}
        </button>
        <button
          onClick={() => onLanguageChange && onLanguageChange(language === 'id' ? 'en' : 'id')}
          style={{ 
            background: '#667eea', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#5568d3'}
          onMouseOut={(e) => e.target.style.background = '#667eea'}
        >
          {language === 'id' ? 'EN' : 'ID'}
        </button>
      </div>

      <div className='about-content'>
        <h1>{t.title}</h1>

        <section className='about-section'>
          <h2>{t.whatIs}</h2>
          <div className='explanation-box'>
            <p>{t.whatIsDesc}</p>
            <div className='analogy-box'>
              <h3>{t.analogy}</h3>
              <p>{t.analogyDesc}</p>
              <ul>
                {t.analogyList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p style={{ marginTop: '15px', fontStyle: 'italic', color: '#666' }}>
                {t.analogyNote}
              </p>
            </div>
          </div>
        </section>

        <section className='about-section'>
          <h2>{t.whyImportant}</h2>
          <div className='explanation-box'>
            <p>{t.whyImportantDesc}</p>
            <h3>{t.realWorldUse}</h3>
            <div className='use-cases'>
              <div className='use-case-card'>
                <h4>{t.useCase1}</h4>
                <p>{t.useCase1Desc}</p>
              </div>

              <div className='use-case-card'>
                <h4>{t.useCase2}</h4>
                <p>{t.useCase2Desc}</p>
              </div>

              <div className='use-case-card'>
                <h4>{t.useCase3}</h4>
                <p>{t.useCase3Desc}</p>
              </div>

              <div className='use-case-card'>
                <h4>{t.useCase4}</h4>
                <p>{t.useCase4Desc}</p>
              </div>
            </div>
          </div>
        </section>

        <section className='about-section'>
          <h2>{t.howItWorks}</h2>
          <div className='explanation-box'>
            <p>{t.howItWorksDesc}</p>
            <h3>{t.processTitle}</h3>
            <div className='process-steps'>
              <div className='process-step'>
                <h4>{t.processStep1}</h4>
                <p>{t.processStep1Desc}</p>
              </div>
              <div className='process-step'>
                <h4>{t.processStep2}</h4>
                <p>{t.processStep2Desc}</p>
              </div>
              <div className='process-step'>
                <h4>{t.processStep3}</h4>
                <p>{t.processStep3Desc}</p>
              </div>
              <div className='process-step'>
                <h4>{t.processStep4}</h4>
                <p>{t.processStep4Desc}</p>
              </div>
              <div className='process-step'>
                <h4>{t.processStep5}</h4>
                <p>{t.processStep5Desc}</p>
              </div>
            </div>
          </div>
        </section>

        <section className='about-section'>
          <h2>{t.benefits}</h2>
          <div className='benefits-grid'>
            <div className='benefit-card'>
              <div className='benefit-icon'>⚡</div>
              <h3>{t.benefit1}</h3>
              <p>{t.benefit1Desc}</p>
            </div>

            <div className='benefit-card'>
              <div className='benefit-icon'>💰</div>
              <h3>{t.benefit2}</h3>
              <p>{t.benefit2Desc}</p>
            </div>

            <div className='benefit-card'>
              <div className='benefit-icon'>🔒</div>
              <h3>{t.benefit3}</h3>
              <p>{t.benefit3Desc}</p>
            </div>

            <div className='benefit-card'>
              <div className='benefit-icon'>👁️</div>
              <h3>{t.benefit4}</h3>
              <p>{t.benefit4Desc}</p>
            </div>

            <div className='benefit-card'>
              <div className='benefit-icon'>📝</div>
              <h3>{t.benefit5}</h3>
              <p>{t.benefit5Desc}</p>
            </div>

            <div className='benefit-card'>
              <div className='benefit-icon'>🤖</div>
              <h3>{t.benefit6}</h3>
              <p>{t.benefit6Desc}</p>
            </div>
          </div>
        </section>

        <section className='about-section'>
          <h2>{t.realExample}</h2>
          <div className='explanation-box'>
            <p>{t.realExampleDesc}</p>
            <div className='use-cases'>
              <div className='use-case-card'>
                <h4>{t.indoExample1}</h4>
                <p>{t.indoExample1Desc}</p>
              </div>
              <div className='use-case-card'>
                <h4>{t.indoExample2}</h4>
                <p>{t.indoExample2Desc}</p>
              </div>
              <div className='use-case-card'>
                <h4>{t.indoExample3}</h4>
                <p>{t.indoExample3Desc}</p>
              </div>
              <div className='use-case-card'>
                <h4>{t.indoExample4}</h4>
                <p>{t.indoExample4Desc}</p>
              </div>
            </div>
          </div>
        </section>

        <section className='about-section'>
          <h2>{t.future}</h2>
          <div className='explanation-box'>
            <p>{t.futureDesc}</p>
          </div>
        </section>

        <section className='about-section'>
          <h2>{t.conclusion}</h2>
          <div className='explanation-box'>
            <p style={{ fontSize: '16px', lineHeight: '1.8', fontWeight: '500' }}>
              {t.conclusionDesc}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
