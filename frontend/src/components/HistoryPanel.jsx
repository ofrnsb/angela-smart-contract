import React, { useEffect, useMemo, useState } from 'react'

export default function HistoryPanel({ tick = 0, lang = 'id' }) {
  const LEDGER_KEY = 'banking_ledger'
  const [items, setItems] = useState([])
  const [expanded, setExpanded] = useState({})

  const L = {
    id: {
      title: 'Riwayat & Audit',
      refresh: 'Refresh',
      exportJson: 'Export JSON',
      clear: 'Hapus',
      empty: 'Belum ada transaksi. Lakukan transfer atau pembelian untuk melihat jejak audit.',
      typePurchase: 'Pembelian',
      typeTransfer: 'Transfer',
      interbank: '(Interbank)',
      details: 'Detail',
      hide: 'Sembunyikan',
      from: 'Dari',
      to: 'Ke',
      account: 'Rekening',
      product: 'Produk',
      fee: 'Fee',
      addr: 'Alamat Smart Contract (simulasi)',
      txid: 'ID Transaksi (simulasi)',
      consensus: 'Konsensus',
      threshold: 'threshold',
      copy: 'Salin',
    },
    en: {
      title: 'History & Audit',
      refresh: 'Refresh',
      exportJson: 'Export JSON',
      clear: 'Clear',
      empty: 'No transactions yet. Perform a transfer or purchase to see the audit trail.',
      typePurchase: 'Purchase',
      typeTransfer: 'Transfer',
      interbank: '(Interbank)',
      details: 'Details',
      hide: 'Hide',
      from: 'From',
      to: 'To',
      account: 'Account',
      product: 'Product',
      fee: 'Fee',
      addr: 'Smart Contract Address (simulation)',
      txid: 'Transaction ID (simulation)',
      consensus: 'Consensus',
      threshold: 'threshold',
      copy: 'Copy',
    },
  }
  const t = L[lang] || L.id

  const reload = () => {
    try {
      const raw = localStorage.getItem(LEDGER_KEY)
      const arr = raw ? JSON.parse(raw) : []
      setItems(Array.isArray(arr) ? arr : [])
    } catch {
      setItems([])
    }
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  const clearLedger = () => {
    localStorage.setItem(LEDGER_KEY, JSON.stringify([]))
    reload()
  }

  const fmtAmount = (n) => `Rp ${parseFloat(n || 0).toLocaleString('id-ID')}`
  const fmtTime = (s) => {
    try { return new Date(s).toLocaleString('id-ID') } catch { return s }
  }

  const copy = (text) => navigator.clipboard?.writeText?.(text)
  const maskAccount = (acc) => {
    const s = String(acc || '')
    if (s.length <= 4) return s
    return s.slice(0, -4).replace(/\d/g, 'x') + s.slice(-4)
  }

  if (!items.length) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{t.title}</h2>
          <button onClick={reload} style={{ background: '#f0f0f0', width: 'auto' }}>{t.refresh}</button>
        </div>
        <p style={{ color: '#6b7280', marginTop: 10 }}>{t.empty}</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{t.title}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={reload} style={{ background: '#f0f0f0', width: 'auto', padding: '8px 12px', borderRadius: 8 }}>{t.refresh}</button>
          <button onClick={clearLedger} style={{ background: '#fee2e2', color: '#b91c1c', width: 'auto', padding: '8px 12px', borderRadius: 8, border: '1px solid #fecaca' }}>{t.clear}</button>
        </div>
      </div>
      <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
        {items.map((it, idx) => {
          const key = `${it.createdAt}-${idx}`
          const isOpen = !!expanded[key]
          return (
            <div key={key} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{it.type === 'purchase' ? t.typePurchase : t.typeTransfer}{it.interbank ? ` ${t.interbank}` : ''}</span>
                  {'amount' in it && <span style={{ color: '#374151', fontWeight: 700 }}>{fmtAmount(it.amount)}</span>}
                  <span style={{ color: '#6b7280' }}>{fmtTime(it.createdAt)}</span>
                  <span style={{ padding: '2px 10px', borderRadius: 999,
                    background: it.status === 'Rejected' ? '#fee2e2' : it.status === 'Reversed' ? '#e0e7ff' : '#d1fae5',
                    color: it.status === 'Rejected' ? '#b91c1c' : it.status === 'Reversed' ? '#3730a3' : '#065f46',
                    fontSize: 12 }}>{it.status}</span>
                  {it.productName && <span style={{ color: '#374151' }}>{it.productName}</span>}
                </div>
                <button onClick={() => setExpanded({ ...expanded, [key]: !isOpen })} style={{ background: '#f0f0f0', width: 'auto', padding: '8px 12px', borderRadius: 8 }}>{isOpen ? `▾ ${t.hide}` : `▸ ${t.details}`}</button>
              </div>
              {isOpen && (
                <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                    {it.fromAccount && <div><strong>{t.from}</strong>: {maskAccount(it.fromAccount)} ({it.bankFrom})</div>}
                    {it.toAccount && <div><strong>{t.to}</strong>: {maskAccount(it.toAccount)} ({it.bankTo})</div>}
                    {it.buyerAccount && <div><strong>{t.account}</strong>: {maskAccount(it.buyerAccount)}</div>}
                    {it.productId && <div><strong>{t.product}</strong>: {it.productId} - {it.productName} ({it.provider})</div>}
                    {'fee' in it && <div><strong>{t.fee}</strong>: {fmtAmount(it.fee || 0)}</div>}
                  </div>
                  {(it.contractAddress || it.transactionHash) && (
                    <div style={{ display: 'grid', gap: 8 }}>
                      {it.contractAddress && (
                        <div>
                          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}><strong>{t.addr}</strong></div>
                          <div style={{ fontFamily: 'Monaco, Menlo, "Courier New", monospace', fontSize: 12, background: '#f9fafb', padding: 10, borderRadius: 6, border: '1px solid #e5e7eb', wordBreak: 'break-all' }}>{it.contractAddress}</div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                            <button onClick={() => copy(it.contractAddress)} style={{ background: '#f0f0f0', width: 'auto' }}>{t.copy}</button>
                          </div>
                        </div>
                      )}
                      {it.transactionHash && (
                        <div>
                          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}><strong>{t.txid}</strong></div>
                          <div style={{ fontFamily: 'Monaco, Menlo, "Courier New", monospace', fontSize: 12, background: '#f9fafb', padding: 10, borderRadius: 6, border: '1px solid #e5e7eb', wordBreak: 'break-all' }}>{it.transactionHash}</div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                            <button onClick={() => copy(it.transactionHash)} style={{ background: '#f0f0f0', width: 'auto' }}>{t.copy}</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {it.approvals && (
                    <div style={{ fontSize: 12, color: '#374151', background: '#eff6ff', padding: 10, borderRadius: 8, border: '1px solid #bfdbfe' }}>
                      {t.consensus}: {it.approvals.succeed}/{it.approvals.total} ({t.threshold} {it.approvals.required})
                    </div>
                  )}
                  {Array.isArray(it.steps) && it.steps.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>{lang === 'id' ? 'Langkah' : 'Steps'}</div>
                      <ol style={{ margin: 0, paddingLeft: 18, color: '#374151' }}>
                        {it.steps.map((s, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>
                            <span style={{ fontWeight: 600 }}>{s.title}</span> — <span style={{ color: '#6b7280' }}>{s.node}</span> [{s.status}]
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
