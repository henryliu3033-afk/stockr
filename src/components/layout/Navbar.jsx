import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { searchSymbol } from '../../lib/finnhub'

const NAV = [
  { to: '/',          label: 'Dashboard' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/explore',   label: 'Explore'   },
  { to: '/market',    label: 'Market'    },
]

export default function Navbar() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSearch = async (q) => {
    setQuery(q)
    if (q.trim().length < 1) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const res = await searchSymbol(q)
      const hits = (res.result || []).filter((r) => r.type === 'Common Stock').slice(0, 6)
      setResults(hits)
      setOpen(true)
    } catch { setResults([]) }
    finally { setLoading(false) }
  }

  const go = (symbol) => {
    setQuery(''); setResults([]); setOpen(false); setSearchOpen(false); setMenuOpen(false)
    navigate(`/stock/${symbol}`)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b"
        style={{ background: 'rgba(10,10,15,0.95)', borderColor: 'var(--color-border)', backdropFilter: 'blur(16px)', height: '56px' }}>
        <div className="h-full mx-auto flex items-center justify-between gap-3 md:gap-6"
          style={{ maxWidth: '1400px', padding: '0 1.25rem' }}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--color-accent)', color: '#fff' }}>S</div>
            <span className="font-bold text-base tracking-tight hidden sm:block" style={{ color: 'var(--color-text)' }}>Stockr</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-mono hidden sm:block"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-3)' }}>BETA</span>
          </Link>

          {/* Desktop: Center nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link key={to} to={to}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  style={{ background: active ? 'var(--color-surface-2)' : 'transparent', color: active ? 'var(--color-text)' : 'var(--color-text-2)' }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--color-text)' }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--color-text-2)' }}>
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop: Search */}
          <div className="hidden md:flex justify-end" style={{ minWidth: '220px' }}>
            <div className="relative w-full max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--color-text-3)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={query} onChange={(e) => handleSearch(e.target.value)}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; results.length > 0 && setOpen(true) }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; setTimeout(() => setOpen(false), 150) }}
                placeholder="Search symbol..."
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontFamily: 'inherit' }}
              />
              {open && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-2xl overflow-hidden z-50"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border-2)' }}>
                  {results.map((r) => (
                    <button key={r.symbol} onMouseDown={() => go(r.symbol)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-3)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <span className="font-mono font-semibold text-sm w-16 flex-shrink-0" style={{ color: 'var(--color-accent)' }}>{r.symbol}</span>
                      <span className="text-sm truncate" style={{ color: 'var(--color-text-2)' }}>{r.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile: search icon + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => { setSearchOpen(v => !v); setMenuOpen(false) }}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
              style={{ color: 'var(--color-text-2)', background: searchOpen ? 'var(--color-surface-2)' : 'transparent' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <button onClick={() => { setMenuOpen(v => !v); setSearchOpen(false) }}
              className="flex flex-col gap-[5px] w-9 h-9 items-center justify-center cursor-pointer">
              {[0,1,2].map(i => (
                <span key={i} className="block transition-all duration-200"
                  style={{
                    width: '18px', height: '1.5px', background: 'var(--color-text-2)',
                    opacity: i === 1 && menuOpen ? 0 : 1,
                    transform: i === 0 && menuOpen ? 'rotate(45deg) translate(4px,4px)' : i === 2 && menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none',
                  }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden z-40"
            style={{ background: 'rgba(10,10,15,0.98)', borderBottom: '1px solid var(--color-border)' }}>
            <div className="relative mx-4 my-3">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--color-text-3)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={query} onChange={(e) => handleSearch(e.target.value)} autoFocus
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                placeholder="Search symbol or company..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-accent)', color: 'var(--color-text)', fontFamily: 'inherit' }}
              />
              {open && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-2xl overflow-hidden z-50"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border-2)' }}>
                  {results.map((r) => (
                    <button key={r.symbol} onMouseDown={() => go(r.symbol)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                      style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <span className="font-mono font-semibold text-sm w-16 flex-shrink-0" style={{ color: 'var(--color-accent)' }}>{r.symbol}</span>
                      <span className="text-sm truncate" style={{ color: 'var(--color-text-2)' }}>{r.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden z-40"
            style={{ background: 'rgba(10,10,15,0.98)', borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex flex-col px-4 py-3 gap-1">
              {NAV.map(({ to, label }) => {
                const active = location.pathname === to
                return (
                  <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    style={{ background: active ? 'var(--color-surface-2)' : 'transparent', color: active ? 'var(--color-text)' : 'var(--color-text-2)' }}>
                    {label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
