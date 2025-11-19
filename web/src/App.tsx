import { Link, Navigate, Route, Routes, HashRouter } from 'react-router-dom'
import Simulator from './pages/Simulator'
import About from './pages/About'

export default function App() {
  return (
    <HashRouter>
      <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 20, maxWidth: 1000, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>Banking Smart Contract</h1>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link to="/">Simulator</Link>
            <Link to="/about">Penjelasan</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Simulator />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
