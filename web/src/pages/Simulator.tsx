import { useEffect, useMemo, useState } from 'react'
import { BrowserProvider, Contract, formatEther, parseEther, encodeBytes32String } from 'ethers'
import abi from '../contracts/BankingCore.abi.json'
import { BANKS, CONTRACT_ADDRESS, PROVIDERS } from '../config'

function useProvider() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [account, setAccount] = useState<string>("")

  useEffect(() => {
    const anyWin = window as any
    if (anyWin.ethereum) {
      const p = new BrowserProvider(anyWin.ethereum)
      setProvider(p)
      anyWin.ethereum.on?.('accountsChanged', (accs: string[]) => setAccount(accs?.[0] ?? ""))
    }
  }, [])

  const connect = async () => {
    if (!provider) return
    const accs = await provider.send('eth_requestAccounts', [])
    setAccount(accs[0])
  }

  return { provider, account, connect }
}

export default function Simulator() {
  const { provider, account, connect } = useProvider()
  const [selectedBank, setSelectedBank] = useState<string>('BCA')
  const [toBank, setToBank] = useState<string>('BRI')
  const [toAddress, setToAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('0.01')
  const [balance, setBalance] = useState<string>('0')
  const [metadata, setMetadata] = useState<string>('meter: 1234567890, 50k')
  const [providerId, setProviderId] = useState<string>('PLN')
  const code = (s: string) => encodeBytes32String(s)

  const contract = useMemo(() => {
    if (!provider || !CONTRACT_ADDRESS) return null
    return new Contract(CONTRACT_ADDRESS, abi as any, provider)
  }, [provider])

  const refreshBalance = async () => {
    if (!contract || !account) return
    try {
      const bal = await contract.getBalance(code(selectedBank), account)
      setBalance(formatEther(bal))
    } catch {}
  }

  useEffect(() => {
    refreshBalance()
  }, [contract, account, selectedBank])

  const openAccount = async () => {
    if (!provider || !contract) return
    const signer = await provider.getSigner()
    const sc = contract.connect(signer)
    const tx = await sc.openAccount(code(selectedBank))
    await tx.wait()
    await refreshBalance()
  }

  const deposit = async () => {
    if (!provider || !contract) return
    const signer = await provider.getSigner()
    const sc = contract.connect(signer)
    const tx = await sc.deposit(code(selectedBank), { value: parseEther(amount) })
    await tx.wait()
    await refreshBalance()
  }

  const withdraw = async () => {
    if (!provider || !contract) return
    const signer = await provider.getSigner()
    const sc = contract.connect(signer)
    const tx = await sc.withdraw(code(selectedBank), parseEther(amount))
    await tx.wait()
    await refreshBalance()
  }

  const transferIntra = async () => {
    if (!provider || !contract) return
    const signer = await provider.getSigner()
    const sc = contract.connect(signer)
    const tx = await sc.transferIntra(code(selectedBank), toAddress, parseEther(amount))
    await tx.wait()
    await refreshBalance()
  }

  const transferInter = async () => {
    if (!provider || !contract) return
    const signer = await provider.getSigner()
    const sc = contract.connect(signer)
    const tx = await sc.transferInter(code(selectedBank), code(toBank), toAddress, parseEther(amount))
    await tx.wait()
    await refreshBalance()
  }

  const purchase = async () => {
    if (!provider || !contract) return
    const signer = await provider.getSigner()
    const sc = contract.connect(signer)
    const tx = await sc.purchaseProduct(code(selectedBank), code(providerId), metadata, parseEther(amount))
    await tx.wait()
    await refreshBalance()
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h1>Banking Smart Contract Demo</h1>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={connect}>Connect Wallet</button>
        <div>Account: {account || '-'}</div>
      </div>

      <hr />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <section style={{ border: '1px solid #ccc', padding: 12 }}>
          <h3>Rekening</h3>
          <div>
            <label>Bank</label>
            <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)}>
              {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>Saldo: {balance} ETH</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={openAccount}>Buka Rekening</button>
          </div>
        </section>

        <section style={{ border: '1px solid #ccc', padding: 12 }}>
          <h3>Setor / Tarik</h3>
          <input value={amount} onChange={e => setAmount(e.target.value)} /> ETH
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={deposit}>Setor (deposit)</button>
            <button onClick={withdraw}>Tarik (withdraw)</button>
          </div>
        </section>

        <section style={{ border: '1px solid #ccc', padding: 12 }}>
          <h3>Transfer Sesama Bank</h3>
          <div>
            <input placeholder="Alamat tujuan" value={toAddress} onChange={e => setToAddress(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div>
            <input value={amount} onChange={e => setAmount(e.target.value)} /> ETH
          </div>
          <button onClick={transferIntra}>Kirim</button>
        </section>

        <section style={{ border: '1px solid #ccc', padding: 12 }}>
          <h3>Transfer Antar Bank</h3>
          <div>
            <label>Bank Tujuan</label>
            <select value={toBank} onChange={e => setToBank(e.target.value)}>
              {BANKS.filter(b => b !== selectedBank).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <input placeholder="Alamat tujuan" value={toAddress} onChange={e => setToAddress(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div>
            <input value={amount} onChange={e => setAmount(e.target.value)} /> ETH
          </div>
          <button onClick={transferInter}>Kirim Antar Bank</button>
        </section>

        <section style={{ gridColumn: '1 / -1', border: '1px solid #ccc', padding: 12 }}>
          <h3>Pembelian Produk</h3>
          <div>
            <label>Provider</label>
            <select value={providerId} onChange={e => setProviderId(e.target.value)}>
              {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <input placeholder="Metadata (contoh: meter/nomor pelanggan)" value={metadata} onChange={e => setMetadata(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div>
            <input value={amount} onChange={e => setAmount(e.target.value)} /> ETH
          </div>
          <button onClick={purchase}>Beli</button>
        </section>
      </div>
    </div>
  )
}
