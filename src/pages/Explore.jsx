import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { POPULAR_STOCKS, SECTORS } from '../constants/stocks'
import { useWatchlistStore } from '../store/watchlist.store'
import { searchSymbol } from '../lib/finnhub'
import useQuote from '../hooks/useQuote'
import { fPrice, fPct, isPositive } from '../lib/format'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'

// ── Row for explore grid ─────────────────────────────────────
function StockRow({ stock, index }) {
  const { data, loading } = useQuote(stock.symbol)
  const { addSymbol, removeSymbol, hasSymbol } = useWatchlistStore()
  const inWL = hasSymbol(stock.symbol)
  const up = isPositive(data?.d)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-4 p-3 rounded-lg border transition-colors"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <Link to={`/stock/${stock.symbol}`} className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity">
        <div>
          <p className="font-semibold text-sm font-mono" style={{ color: 'var(--color-accent)' }}>{stock.symbol}</p>
          <p className="text-xs truncate" style={{ color: 'var(--color-text-2)' }}>{stock.name}</p>
        </div>
      </Link>

      {loading ? <Spinner size={12} /> : data ? (
        <div className="text-right mr-2">
          <p className="font-mono text-sm font-medium" style={{ color: 'var(--color-text)' }}>{fPrice(data.c)}</p>
          <p className="font-mono text-xs" style={{ color: up ? 'var(--color-up)' : 'var(--color-down)' }}>{fPct(data.dp)}</p>
        </div>
      ) : null}

      <Button size="xs" variant={inWL ? 'up' : 'ghost'}
        onClick={() => inWL ? removeSymbol(stock.symbol) : addSymbol(stock.symbol)}>
        {inWL ? '★' : '☆'}
      </Button>
    </motion.div>
  )
}

export default function Explore() {
  const [query,    setQuery]    = useState('')
  const [results,  setResults]  = useState([])
  const [searching, setSearching] = useState(false)
  const [activeSector, setSector] = useState('All')

  const filtered = useMemo(() => {
    const base = activeSector === 'All' ? POPULAR_STOCKS : POPULAR_STOCKS.filter((s) => s.sector === activeSector)
    return base
  }, [activeSector])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await searchSymbol(query)
        setResults((res.result || []).filter((r) => r.type === 'Common Stock').slice(0, 10))
      } catch { setResults([]) }
      finally { setSearching(false) }
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="page-enter p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Explore</h1>

      {/* Search */}
      <div className="relative mb-8 max-w-lg">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-3)' }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any stock symbol or company name..."
          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-colors"
          style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            color: 'var(--color-text)', fontFamily: 'inherit',
          }}
        />
        {searching && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2"><Spinner size={14} /></div>
        )}
      </div>

      {/* Search results */}
      {query && (
        <div className="mb-8">
          <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--color-text-2)' }}>
            SEARCH RESULTS
          </h2>
          {results.length === 0 && !searching ? (
            <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>No results found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.map((r, i) => (
                <StockRow key={r.symbol} stock={{ symbol: r.symbol, name: r.description, sector: '' }} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sector filter */}
      {!query && (
        <>
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {['All', ...SECTORS].map((s) => (
              <button key={s} onClick={() => setSector(s)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: activeSector === s ? 'var(--color-accent)' : 'var(--color-surface)',
                  color:      activeSector === s ? '#fff' : 'var(--color-text-2)',
                  border:     '1px solid',
                  borderColor: activeSector === s ? 'var(--color-accent)' : 'var(--color-border)',
                }}>
                {s}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {filtered.map((stock, i) => (
              <StockRow key={stock.symbol} stock={stock} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
