import React from 'react';
import './AboutPage.css';

const translations = {
  id: {
    back: '← Kembali ke Aplikasi',
    title:
      'Smart Contract dan Implementasinya pada Sistem Perbankan Konvensional Indonesia',
    subtitle: '',

    // 1. Pendahuluan
    intro:
      '1. Pendahuluan: Mengapa Smart Contract Relevan untuk Perbankan Indonesia',
    introDesc:
      'Sistem pembayaran di Indonesia saat ini mengandalkan infrastruktur besar seperti:',
    introList: [
      'Core banking setiap bank',
      'SKN, RTGS',
      'BI-FAST',
      'Sistem switching (ATM Bersama, Link, Prima)',
      'Rekonsiliasi manual antar bank',
    ],
    introLimitation: 'Meskipun stabil, sistem-sistem ini memiliki batasan:',
    introLimitationList: [
      'keterlambatan proses antar lembaga,',
      'duplikasi data lintas sistem,',
      'kebutuhan rekonsiliasi,',
      'potensi error administratif,',
      'audit yang tidak selalu real-time, dan',
      'biaya operasional yang tinggi.',
    ],
    introSolution:
      'Smart contract menawarkan model alternatif: **aturan transaksi yang otomatis, konsisten, dan diverifikasi bersama oleh semua pihak yang berkepentingan** - bukan oleh satu server pusat.',
    introNote:
      'Konsep ini tidak menggantikan peran bank atau regulasi, tetapi **meningkatkan efisiensi dan transparansi tanpa mengubah mata uang (IDR tetap IDR)**.',

    // 2. Apa itu Smart Contract
    whatIs: '2. Apa Itu Smart Contract? ',
    whatIsDesc: 'Smart contract adalah **kontrak digital otomatis** yang:',
    whatIsList: [
      'berisi aturan dan ketentuan yang telah disepakati,',
      'berjalan sendiri tanpa campur tangan manual,',
      'diverifikasi oleh banyak pihak,',
      'mencatat hasilnya secara permanen,',
      'dan memastikan semua pihak mematuhi aturan yang sama.',
    ],
    whatIsDiff: 'Perbedaan besar dibanding sistem tradisional:',
    whatIsSimple:
      'Sederhana: **Smart contract bukan tulisan, tapi mekanisme otomatis yang menjalankan aturan keuangan secara deterministik.**',

    // 3. Konsep Node
    nodeConcept:
      '3. Konsep Node: Elemen yang Sering Terlewat dalam Penjelasan Smart Contract',
    nodeConceptDesc:
      'Inilah bagian yang paling kritikal dan paling membedakan sistem ini dari sistem tradisional.',
    nodeWhatIs: 'Apa itu Node?',
    nodeWhatIsDesc: 'Node adalah **komputer/server milik institusi** yang:',
    nodeWhatIsList: [
      'Menyimpan data transaksi,',
      'Memverifikasi transaksi,',
      'Menjalankan smart contract,',
      'Menyinkronkan catatan ke semua pihak terkait.',
    ],
    nodeContext: 'Dalam konteks Indonesia:',
    nodeContextList: [
      '**Setiap bank** dapat memiliki beberapa node (pusat, cadangan, cabang besar).',
      '**Bank Indonesia** memiliki node pengawas dan verifikasi kepatuhan.',
      '**Penyedia produk** (PLN, Telkomsel, PDAM) dapat memiliki node mereka sendiri untuk transaksi pembelian.',
    ],
    nodeEnsure: 'Node-node inilah yang memastikan bahwa:',
    nodeEnsureList: [
      'tidak ada satu bank pun yang bisa memodifikasi transaksi secara sepihak,',
      'seluruh bank melihat catatan transaksi yang identik,',
      'transaksi antar bank tidak memerlukan rekonsiliasi tambahan.',
    ],

    // 4. Cara Kerja
    howItWorks:
      '4. Cara Kerja Smart Contract di Lingkungan Perbankan Indonesia',
    howItWorksDesc:
      'Berikut cara kerja yang terstruktur dan menyerupai operasi nyata bank.',
    trigger: 'A. Pemicu Transaksi (Trigger)',
    triggerDesc:
      'Setiap transaksi - transfer, pembayaran, pembelian produk - dimulai dari permintaan nasabah.',
    triggerInfo: 'Ini memberi smart contract informasi dasar:',
    triggerInfoList: [
      'rekening pengirim,',
      'rekening tujuan,',
      'jumlah,',
      'jenis transaksi,',
      'waktu transaksi.',
    ],
    validation: 'B. Validasi Berlapis oleh Smart Contract',
    validation1: '1. Validasi oleh Bank Pengirim',
    validation1Desc: 'Node bank pengirim (misal BNI) memeriksa:',
    validation1List: [
      'saldo cukup,',
      'rekening aktif,',
      'aturan limit harian,',
      'tidak ada tanda fraud,',
      'data nasabah valid.',
    ],
    validation1Fail: 'Jika gagal → transaksi berhenti.',
    validation2: '2. Validasi oleh Bank Penerima',
    validation2Desc: 'Node bank penerima (misal BCA) memeriksa:',
    validation2List: [
      'rekening tujuan valid,',
      'status rekening,',
      'siap menerima dana.',
    ],
    validation2Fail: 'Jika gagal → transaksi ditolak bersama.',
    validation3: '3. Validasi oleh Regulator (Bank Indonesia)',
    validation3Desc: 'BI tidak mengeksekusi, tetapi memverifikasi:',
    validation3List: [
      'aturan anti pencucian uang,',
      'aturan transaksi batas tertentu,',
      'likuiditas bank,',
      'kesesuaian regulasi.',
    ],
    validation3Fail: 'Jika ada pelanggaran → transaksi tidak dilanjutkan.',
    execution: 'C. Eksekusi Transaksi (Execution)',
    executionDesc: 'Jika semua pihak setuju maka:',
    executionList: [
      'saldo pengirim berkurang,',
      'saldo penerima bertambah,',
      'transaksi dianggap sah oleh seluruh node,',
      'catatan final disimpan permanen di semua node.',
    ],
    executionNote:
      'Sifatnya deterministik: **Jika syarat terpenuhi, tidak ada pihak yang dapat menahan atau mengubah transaksi.**',
    recording: 'D. Pencatatan Final (Immutable Record)',
    recordingDesc: 'Catatan transaksi kemudian:',
    recordingList: [
      'disimpan oleh semua bank yang terlibat,',
      'disimpan oleh regulator sebagai audit trail,',
      'tidak bisa dihapus atau dimodifikasi secara sepihak.',
    ],
    recordingResult:
      'Dengan demikian, laporan BI, audit internal bank, dan data transaksi nasabah - semuanya konsisten.',

    // 5. Contoh Penerapan
    examples: '5. Contoh Penerapan Nyata pada Sistem Perbankan Indonesia',
    example1: '1. Transfer Sesama Bank',
    example1Desc: 'Misal BCA ke BCA.',
    example1Process: 'Proses:',
    example1ProcessList: [
      'Node BCA pusat memvalidasi,',
      'Node BCA lain memverifikasi,',
      'kontrak memastikan saldo dan aturan terpenuhi,',
      'catatan final dibagikan ke seluruh node BCA.',
    ],
    example1Result: 'Tidak ada mismatch data antar cabang.',
    example2: '2. Transfer Antar Bank (BNI → BCA)',
    example2Desc: 'Inilah pengaplikasian paling kuat.',
    example2Nodes: 'Node yang terlibat:',
    example2NodesList: [
      'Node BNI',
      'Node BCA',
      'Node Bank Indonesia (pengawas)',
    ],
    example2Process: 'Proses:',
    example2ProcessList: [
      'BNI mengusulkan transaksi',
      'BCA menyetujui rekening tujuan',
      'BI menyetujui aturan kepatuhan',
      'Semua node mencatat hasil final',
      'Saldo berubah sesuai pada kedua bank',
    ],
    example2Result: 'Tidak ada lagi:',
    example2ResultList: [
      'rekonsiliasi manual,',
      'kemungkinan transaksi "hilang",',
      'delay panjang untuk settlement.',
    ],
    example3: '3. Pembelian Produk (Pulsa, Token Listrik, dll.)',
    example3Actors: 'Aktor:',
    example3ActorsList: [
      'Node Bank',
      'Node Provider (PLN, Telkomsel)',
      'Node BI (opsional audit)',
    ],
    example3Process: 'Proses:',
    example3ProcessList: [
      'bank memvalidasi saldo,',
      'provider memvalidasi produk,',
      'smart contract menyelesaikan pembayaran,',
      'provider mengeluarkan token/produk,',
      'semua node mencatat hasil final.',
    ],

    // 6. Keuntungan
    benefits: '6. Keuntungan Sistem Ini Dibanding Sistem Perbankan Tradisional',
    benefit1: '1. Eliminasi Rekonsiliasi Antar Bank',
    benefit1Desc:
      'Semua node memiliki catatan yang sama → tidak mungkin ada mismatch.',
    benefit2: '2. Audit Real-Time',
    benefit2Desc:
      'BI dapat melihat transaksi saat itu juga tanpa menunggu laporan.',
    benefit3: '3. Efisiensi Operasional',
    benefit3Desc: 'Proses manual berkurang drastis:',
    benefit3List: ['clearing,', 'settlement,', 'rekonsiliasi,', 'pelaporan.'],
    benefit4: '4. Transparansi dan Keamanan Tinggi',
    benefit4Desc:
      'Karena catatan disimpan bersama, tidak ada pihak yang dapat memanipulasi transaksi.',
    benefit5: '5. Kepatuhan Regulasi Terintegrasi',
    benefit5Desc:
      'Awal transaksi sudah melewati verifikasi regulator → risiko pelanggaran lebih kecil.',

    // 7. Batasan
    limitations: '7. Batasan dan Konteks Indonesia',
    limitationsDesc: 'Model ini:',
    limitationsList: [
      '**tidak menciptakan mata uang baru**,',
      '**tidak menggunakan crypto**,',
      '**IDR tetap IDR**,',
      'hanya mengganti *mekanisme logika transaksi*, bukan regulasi.',
    ],
    limitationsContext: 'Ini sepenuhnya sesuai dengan konsep:',
    limitationsContextList: [
      'digitalisasi keuangan nasional,',
      'integrasi sistem antar bank,',
      'peningkatan keamanan sistem perbankan.',
    ],

    // 8. Kesimpulan
    conclusion: '8. Kesimpulan Terintegrasi',
    conclusionDesc:
      'Smart contract dalam konteks perbankan Indonesia bukan "teknologi kripto", tetapi **mekanisme otomatis** untuk menegakkan aturan transaksi.',
    conclusionResult:
      'Dengan memanfaatkan konsep node antar bank, sistem ini dapat:',
    conclusionResultList: [
      'menghilangkan rekonsiliasi,',
      'meminimalkan error,',
      'meningkatkan keamanan,',
      'memberikan audit real time ke regulator,',
      'dan mempercepat transaksi antar lembaga.',
    ],
    conclusionFinal:
      'Ini menjadikan smart contract sebuah pendekatan strategis untuk modernisasi sistem pembayaran Indonesia.',
  },
  en: {
    back: '← Back to Application',
    title:
      'Smart Contracts and the Implementation for Conventional Indonesian Banking System',
    subtitle: '',

    // 1. Introduction
    intro:
      '1. Introduction: Why Smart Contracts are Relevant for Indonesian Banking',
    introDesc:
      "Indonesia's current payment system relies on large infrastructure such as:",
    introList: [
      'Core banking of each bank',
      'SKN, RTGS',
      'BI-FAST',
      'Switching systems (ATM Bersama, Link, Prima)',
      'Manual reconciliation between banks',
    ],
    introLimitation: 'Although stable, these systems have limitations:',
    introLimitationList: [
      'delays in inter-institutional processes,',
      'data duplication across systems,',
      'need for reconciliation,',
      'potential administrative errors,',
      'audit that is not always real-time, and',
      'high operational costs.',
    ],
    introSolution:
      'Smart contracts offer an alternative model: **automatic, consistent transaction rules verified together by all relevant parties** - not by a single central server.',
    introNote:
      'This concept does not replace the role of banks or regulations, but **improves efficiency and transparency without changing the currency (IDR remains IDR)**.',

    // 2. What is Smart Contract
    whatIs: '2. What is a Smart Contract?',
    whatIsDesc: 'A smart contract is an **automatic digital contract** that:',
    whatIsList: [
      'contains agreed-upon rules and terms,',
      'runs independently without manual intervention,',
      'is verified by many parties,',
      'records results permanently,',
      'and ensures all parties comply with the same rules.',
    ],
    whatIsDiff: 'Major differences compared to traditional systems:',
    whatIsSimple:
      'Simply put: **A smart contract is not writing, but an automatic mechanism that executes financial rules deterministically.**',

    // 3. Node Concept
    nodeConcept:
      '3. Node Concept: The Element Often Overlooked in Smart Contract Explanations',
    nodeConceptDesc:
      'This is the most critical part and what most distinguishes this system from traditional systems.',
    nodeWhatIs: 'What is a Node?',
    nodeWhatIsDesc: 'A node is an **institution-owned computer/server** that:',
    nodeWhatIsList: [
      'Stores transaction data,',
      'Verifies transactions,',
      'Executes smart contracts,',
      'Synchronizes records to all relevant parties.',
    ],
    nodeContext: 'In the Indonesian context:',
    nodeContextList: [
      '**Each bank** can have several nodes (central, backup, major branches).',
      '**Bank Indonesia** has supervisory and compliance verification nodes.',
      '**Product providers** (PLN, Telkomsel, PDAM) can have their own nodes for purchase transactions.',
    ],
    nodeEnsure: 'These nodes ensure that:',
    nodeEnsureList: [
      'no single bank can modify transactions unilaterally,',
      'all banks see identical transaction records,',
      'interbank transactions do not require additional reconciliation.',
    ],

    // 4. How It Works
    howItWorks: '4. How Smart Contracts Work in Indonesian Banking Environment',
    howItWorksDesc:
      'The following is a structured workflow that resembles actual bank operations.',
    trigger: 'A. Transaction Trigger',
    triggerDesc:
      'Every transaction - transfer, payment, product purchase - starts from a customer request.',
    triggerInfo: 'This provides the smart contract with basic information:',
    triggerInfoList: [
      'sender account,',
      'recipient account,',
      'amount,',
      'transaction type,',
      'transaction time.',
    ],
    validation: 'B. Layered Validation by Smart Contract',
    validation1: '1. Validation by Sender Bank',
    validation1Desc: 'The sender bank node (e.g., BNI) checks:',
    validation1List: [
      'sufficient balance,',
      'active account,',
      'daily limit rules,',
      'no fraud indicators,',
      'valid customer data.',
    ],
    validation1Fail: 'If failed → transaction stops.',
    validation2: '2. Validation by Recipient Bank',
    validation2Desc: 'The recipient bank node (e.g., BCA) checks:',
    validation2List: [
      'valid recipient account,',
      'account status,',
      'ready to receive funds.',
    ],
    validation2Fail: 'If failed → transaction is rejected together.',
    validation3: '3. Validation by Regulator (Bank Indonesia)',
    validation3Desc: 'BI does not execute, but verifies:',
    validation3List: [
      'anti-money laundering rules,',
      'certain transaction limit rules,',
      'bank liquidity,',
      'regulatory compliance.',
    ],
    validation3Fail: 'If there is a violation → transaction is not continued.',
    execution: 'C. Transaction Execution',
    executionDesc: 'If all parties agree then:',
    executionList: [
      'sender balance decreases,',
      'recipient balance increases,',
      'transaction is considered valid by all nodes,',
      'final record is permanently stored in all nodes.',
    ],
    executionNote:
      'It is deterministic: **If conditions are met, no party can hold or change the transaction.**',
    recording: 'D. Final Recording (Immutable Record)',
    recordingDesc: 'Transaction records are then:',
    recordingList: [
      'stored by all involved banks,',
      'stored by regulator as audit trail,',
      'cannot be deleted or modified unilaterally.',
    ],
    recordingResult:
      'Thus, BI reports, internal bank audits, and customer transaction data - all are consistent.',

    // 5. Examples
    examples: '5. Real Application Examples in Indonesian Banking System',
    example1: '1. Same Bank Transfer',
    example1Desc: 'For example, BCA to BCA.',
    example1Process: 'Process:',
    example1ProcessList: [
      'BCA central node validates,',
      'Other BCA nodes verify,',
      'contract ensures balance and rules are met,',
      'final record is shared to all BCA nodes.',
    ],
    example1Result: 'No data mismatch between branches.',
    example2: '2. Interbank Transfer (BNI → BCA)',
    example2Desc: 'This is the most powerful application.',
    example2Nodes: 'Involved nodes:',
    example2NodesList: [
      'BNI Node',
      'BCA Node',
      'Bank Indonesia Node (supervisor)',
    ],
    example2Process: 'Process:',
    example2ProcessList: [
      'BNI proposes transaction',
      'BCA approves recipient account',
      'BI approves compliance rules',
      'All nodes record final result',
      'Balance changes accordingly in both banks',
    ],
    example2Result: 'No more:',
    example2ResultList: [
      'manual reconciliation,',
      'possibility of "lost" transactions,',
      'long delays for settlement.',
    ],
    example3: '3. Product Purchase (Pulsa, Electricity Token, etc.)',
    example3Actors: 'Actors:',
    example3ActorsList: [
      'Bank Node',
      'Provider Node (PLN, Telkomsel)',
      'BI Node (optional audit)',
    ],
    example3Process: 'Process:',
    example3ProcessList: [
      'bank validates balance,',
      'provider validates product,',
      'smart contract completes payment,',
      'provider issues token/product,',
      'all nodes record final result.',
    ],

    // 6. Benefits
    benefits:
      '6. Benefits of This System Compared to Traditional Banking Systems',
    benefit1: '1. Elimination of Interbank Reconciliation',
    benefit1Desc: 'All nodes have the same records → mismatch is impossible.',
    benefit2: '2. Real-Time Audit',
    benefit2Desc:
      'BI can see transactions immediately without waiting for reports.',
    benefit3: '3. Operational Efficiency',
    benefit3Desc: 'Manual processes are drastically reduced:',
    benefit3List: ['clearing,', 'settlement,', 'reconciliation,', 'reporting.'],
    benefit4: '4. High Transparency and Security',
    benefit4Desc:
      'Because records are stored together, no party can manipulate transactions.',
    benefit5: '5. Integrated Regulatory Compliance',
    benefit5Desc:
      'The beginning of the transaction has already passed regulatory verification → lower risk of violations.',

    // 7. Limitations
    limitations: '7. Limitations and Indonesian Context',
    limitationsDesc: 'This model:',
    limitationsList: [
      '**does not create new currency**,',
      '**does not use crypto**,',
      '**IDR remains IDR**,',
      'only replaces *transaction logic mechanism*, not regulations.',
    ],
    limitationsContext: 'This fully aligns with the concept of:',
    limitationsContextList: [
      'national financial digitization,',
      'interbank system integration,',
      'banking system security enhancement.',
    ],

    // 8. Conclusion
    conclusion: '8. Integrated Conclusion',
    conclusionDesc:
      'Smart contracts in the context of Indonesian banking are not "crypto technology", but an **automatic mechanism** to enforce transaction rules.',
    conclusionResult:
      'By utilizing the interbank node concept, this system can:',
    conclusionResultList: [
      'eliminate reconciliation,',
      'minimize errors,',
      'increase security,',
      'provide real-time audit to regulators,',
      'and accelerate inter-institutional transactions.',
    ],
    conclusionFinal:
      "This makes smart contracts a strategic approach for modernizing Indonesia's payment system.",
  },
};

function AboutPage({ onBack, language = 'id', onLanguageChange }) {
  const t = translations[language];

  return (
    <div className='about-container'>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'nowrap',
        }}
      >
        <button
          className='back-button'
          onClick={onBack}
          style={{ marginBottom: 0 }}
        >
          {t.back}
        </button>
        <button
          onClick={() =>
            onLanguageChange &&
            onLanguageChange(language === 'id' ? 'en' : 'id')
          }
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

      <div className='about-content'>
        <h1>{t.title}</h1>
        <p
          style={{
            textAlign: 'center',
            color: '#666',
            fontStyle: 'italic',
            marginBottom: '30px',
          }}
        >
          {t.subtitle}
        </p>

        {/* 1. Pendahuluan */}
        <section className='about-section'>
          <h2>{t.intro}</h2>
          <div className='explanation-box'>
            <p>{t.introDesc}</p>
            <ul style={{ marginTop: '15px', paddingLeft: '25px' }}>
              {t.introList.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: '8px', lineHeight: '1.6' }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '20px', fontWeight: '600' }}>
              {t.introLimitation}
            </p>
            <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
              {t.introLimitationList.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: '8px', lineHeight: '1.6' }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <p
              style={{ marginTop: '20px', fontWeight: '600' }}
              dangerouslySetInnerHTML={{
                __html: t.introSolution.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong>$1</strong>'
                ),
              }}
            />
            <p
              style={{
                marginTop: '15px',
                fontStyle: 'italic',
                color: '#667eea',
              }}
              dangerouslySetInnerHTML={{
                __html: t.introNote.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong>$1</strong>'
                ),
              }}
            />
          </div>
        </section>

        {/* 2. Apa itu Smart Contract */}
        <section className='about-section'>
          <h2>{t.whatIs}</h2>
          <div className='explanation-box'>
            <p
              style={{ fontWeight: '600' }}
              dangerouslySetInnerHTML={{
                __html: t.whatIsDesc.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong>$1</strong>'
                ),
              }}
            />
            <ul style={{ marginTop: '15px', paddingLeft: '25px' }}>
              {t.whatIsList.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: '8px', lineHeight: '1.6' }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className='analogy-box' style={{ marginTop: '20px' }}>
              <h3>{t.whatIsDiff}</h3>
              <div style={{ marginTop: '15px', overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px',
                  }}
                >
                  <thead>
                    <tr style={{ background: '#667eea', color: 'white' }}>
                      <th
                        style={{
                          padding: '12px',
                          border: '1px solid #ddd',
                          textAlign: 'left',
                        }}
                      >
                        Sistem Bank Tradisional
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          border: '1px solid #ddd',
                          textAlign: 'left',
                        }}
                      >
                        Smart Contract
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        Aturan ditulis dalam SOP
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        Aturan ditulis dalam kontrak digital
                      </td>
                    </tr>
                    <tr style={{ background: '#f8f9fa' }}>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        Eksekusi oleh pegawai/mesin pusat
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        Eksekusi otomatis oleh seluruh node
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        Bisa ada interpretasi manusia
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        Tidak bisa ditafsirkan ulang
                      </td>
                    </tr>
                    <tr style={{ background: '#f8f9fa' }}>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        Catatan ada di server bank masing-masing
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        Catatan ada di semua node secara konsisten
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        Potensi mismatch antar bank
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        Tidak ada mismatch karena catatan disinkronkan bersama
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p
              style={{
                marginTop: '20px',
                fontWeight: '600',
                fontSize: '16px',
                color: '#667eea',
              }}
              dangerouslySetInnerHTML={{
                __html: t.whatIsSimple.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong>$1</strong>'
                ),
              }}
            />
          </div>
        </section>

        {/* 3. Konsep Node */}
        <section className='about-section'>
          <h2>{t.nodeConcept}</h2>
          <div className='explanation-box'>
            <p
              style={{ fontWeight: '600', color: '#667eea', fontSize: '16px' }}
            >
              {t.nodeConceptDesc}
            </p>
            <h3 style={{ marginTop: '25px' }}>{t.nodeWhatIs}</h3>
            <p
              style={{ fontWeight: '600' }}
              dangerouslySetInnerHTML={{
                __html: t.nodeWhatIsDesc.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong>$1</strong>'
                ),
              }}
            />
            <ul style={{ marginTop: '15px', paddingLeft: '25px' }}>
              {t.nodeWhatIsList.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: '8px', lineHeight: '1.6' }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <h3 style={{ marginTop: '25px' }}>{t.nodeContext}</h3>
            <ul style={{ marginTop: '15px', paddingLeft: '25px' }}>
              {t.nodeContextList.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: '8px', lineHeight: '1.6' }}
                  dangerouslySetInnerHTML={{
                    __html: item.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong>$1</strong>'
                    ),
                  }}
                />
              ))}
            </ul>
            <h3 style={{ marginTop: '25px' }}>
              Node-node inilah yang memastikan bahwa:
            </h3>
            <ul style={{ marginTop: '15px', paddingLeft: '25px' }}>
              {t.nodeEnsureList.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: '8px', lineHeight: '1.6' }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Cara Kerja */}
        <section className='about-section'>
          <h2>{t.howItWorks}</h2>
          <div className='explanation-box'>
            <p>{t.howItWorksDesc}</p>

            <h3 style={{ marginTop: '25px', color: '#667eea' }}>{t.trigger}</h3>
            <p>{t.triggerDesc}</p>
            <p style={{ marginTop: '10px', fontWeight: '600' }}>
              {t.triggerInfo}
            </p>
            <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
              {t.triggerInfoList.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: '8px', lineHeight: '1.6' }}
                >
                  {item}
                </li>
              ))}
            </ul>

            <h3 style={{ marginTop: '30px', color: '#667eea' }}>
              {t.validation}
            </h3>

            <div className='process-step' style={{ marginTop: '20px' }}>
              <h4>{t.validation1}</h4>
              <p>{t.validation1Desc}</p>
              <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
                {t.validation1List.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ marginBottom: '6px', lineHeight: '1.6' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p
                style={{
                  marginTop: '10px',
                  fontWeight: '600',
                  color: '#dc2626',
                }}
              >
                {t.validation1Fail}
              </p>
            </div>

            <div className='process-step' style={{ marginTop: '20px' }}>
              <h4>{t.validation2}</h4>
              <p>{t.validation2Desc}</p>
              <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
                {t.validation2List.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ marginBottom: '6px', lineHeight: '1.6' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p
                style={{
                  marginTop: '10px',
                  fontWeight: '600',
                  color: '#dc2626',
                }}
              >
                {t.validation2Fail}
              </p>
            </div>

            <div className='process-step' style={{ marginTop: '20px' }}>
              <h4>{t.validation3}</h4>
              <p>{t.validation3Desc}</p>
              <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
                {t.validation3List.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ marginBottom: '6px', lineHeight: '1.6' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p
                style={{
                  marginTop: '10px',
                  fontWeight: '600',
                  color: '#dc2626',
                }}
              >
                {t.validation3Fail}
              </p>
            </div>

            <h3 style={{ marginTop: '30px', color: '#667eea' }}>
              {t.execution}
            </h3>
            <p style={{ fontWeight: '600' }}>{t.executionDesc}</p>
            <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
              {t.executionList.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: '8px', lineHeight: '1.6' }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <p
              style={{ marginTop: '15px', fontWeight: '600', color: '#667eea' }}
              dangerouslySetInnerHTML={{
                __html: t.executionNote.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong>$1</strong>'
                ),
              }}
            />

            <h3 style={{ marginTop: '30px', color: '#667eea' }}>
              {t.recording}
            </h3>
            <p style={{ fontWeight: '600' }}>{t.recordingDesc}</p>
            <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
              {t.recordingList.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: '8px', lineHeight: '1.6' }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <p
              style={{ marginTop: '15px', fontStyle: 'italic', color: '#666' }}
            >
              {t.recordingResult}
            </p>
          </div>
        </section>

        {/* 5. Contoh Penerapan */}
        <section className='about-section'>
          <h2>{t.examples}</h2>
          <div className='explanation-box'>
            <div className='use-case-card' style={{ marginBottom: '25px' }}>
              <h4>{t.example1}</h4>
              <p style={{ fontWeight: '600' }}>{t.example1Desc}</p>
              <p style={{ marginTop: '10px', fontWeight: '600' }}>
                {t.example1Process}
              </p>
              <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
                {t.example1ProcessList.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ marginBottom: '6px', lineHeight: '1.6' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p
                style={{
                  marginTop: '15px',
                  fontWeight: '600',
                  color: '#28a745',
                }}
              >
                {t.example1Result}
              </p>
            </div>

            <div className='use-case-card' style={{ marginBottom: '25px' }}>
              <h4>{t.example2}</h4>
              <p style={{ fontWeight: '600' }}>{t.example2Desc}</p>
              <p style={{ marginTop: '10px', fontWeight: '600' }}>
                {t.example2Nodes}
              </p>
              <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
                {t.example2NodesList.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ marginBottom: '6px', lineHeight: '1.6' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: '15px', fontWeight: '600' }}>
                {t.example2Process}
              </p>
              <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
                {t.example2ProcessList.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ marginBottom: '6px', lineHeight: '1.6' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: '15px', fontWeight: '600' }}>
                {t.example2Result}
              </p>
              <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
                {t.example2ResultList.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ marginBottom: '6px', lineHeight: '1.6' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className='use-case-card'>
              <h4>{t.example3}</h4>
              <p style={{ marginTop: '10px', fontWeight: '600' }}>
                {t.example3Actors}
              </p>
              <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
                {t.example3ActorsList.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ marginBottom: '6px', lineHeight: '1.6' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: '15px', fontWeight: '600' }}>
                {t.example3Process}
              </p>
              <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
                {t.example3ProcessList.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ marginBottom: '6px', lineHeight: '1.6' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Keuntungan */}
        <section className='about-section'>
          <h2>{t.benefits}</h2>
          <div className='benefits-grid'>
            <div className='benefit-card'>
              <h3>{t.benefit1}</h3>
              <p>{t.benefit1Desc}</p>
            </div>

            <div className='benefit-card'>
              <h3>{t.benefit2}</h3>
              <p>{t.benefit2Desc}</p>
            </div>

            <div className='benefit-card'>
              <h3>{t.benefit3}</h3>
              <p>{t.benefit3Desc}</p>
              <ul
                style={{
                  marginTop: '10px',
                  paddingLeft: '20px',
                  textAlign: 'left',
                  fontSize: '14px',
                }}
              >
                {t.benefit3List.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className='benefit-card'>
              <h3>{t.benefit4}</h3>
              <p>{t.benefit4Desc}</p>
            </div>

            <div className='benefit-card'>
              <h3>{t.benefit5}</h3>
              <p>{t.benefit5Desc}</p>
            </div>
          </div>
        </section>

        {/* 7. Batasan */}
        <section className='about-section'>
          <h2>{t.limitations}</h2>
          <div className='explanation-box'>
            <p style={{ fontWeight: '600' }}>{t.limitationsDesc}</p>
            <ul style={{ marginTop: '15px', paddingLeft: '25px' }}>
              {t.limitationsList.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: '8px', lineHeight: '1.6' }}
                  dangerouslySetInnerHTML={{
                    __html: item.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong>$1</strong>'
                    ),
                  }}
                />
              ))}
            </ul>
            <p style={{ marginTop: '20px', fontWeight: '600' }}>
              {t.limitationsContext}
            </p>
            <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
              {t.limitationsContextList.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: '8px', lineHeight: '1.6' }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. Kesimpulan */}
        <section className='about-section'>
          <h2>{t.conclusion}</h2>
          <div className='explanation-box'>
            <p
              style={{
                fontSize: '16px',
                lineHeight: '1.8',
                fontWeight: '500',
                marginBottom: '20px',
              }}
              dangerouslySetInnerHTML={{
                __html: t.conclusionDesc.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong>$1</strong>'
                ),
              }}
            />
            <p style={{ fontWeight: '600', marginTop: '20px' }}>
              {t.conclusionResult}
            </p>
            <ul style={{ marginTop: '15px', paddingLeft: '25px' }}>
              {t.conclusionResultList.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: '8px',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <p
              style={{
                marginTop: '25px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#667eea',
                textAlign: 'center',
              }}
            >
              {t.conclusionFinal}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
