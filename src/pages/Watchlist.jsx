import { useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useWatchlistStore } from '../store/watchlist.store'
import useQuote from '../hooks/useQuote'
import useLivePrice from '../hooks/useLivePrice'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { fPrice, fChange, fPct, isPositive } from '../lib/format'

function WatchlistRow({ symbol, onRemove, index }) {
  const { data, loading } = useQuote(symbol)
  const { livePrice, flash } = useLivePrice(symbol)
  const displayPrice = livePrice ?? data?.c
  const up = isPositive(data?.d)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.03 }}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
        flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
      }`}
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <Link to={`/stock/${symbol}`} className="flex-1 min-w-0 flex items-center gap-4 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-xs flex-shrink-0"
          style={{ background: 'var(--color-surface-2)', color: 'var(--color-accent)' }}>
          {symbol.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{symbol}</p>
          {data && (
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-px flex-1 max-w-24 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${Math.min(Math.abs(data.dp || 0) * 15, 100)}%`, background: up ? 'var(--color-up)' : 'var(--color-down)' }} />
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="text-right flex-shrink-0">
        {loading && !displayPrice ? <Spinner size={12} /> : (
          <>
            <p className="font-mono font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
              {fPrice(displayPrice)}
            </p>
            {data && (
              <p className="font-mono text-xs" style={{ color: up ? 'var(--color-up)' : 'var(--color-down)' }}>
                {fChange(data.d)} ({fPct(data.dp)})
              </p>
            )}
          </>
        )}
      </div>

      <button onClick={() => onRemove(symbol)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors flex-shrink-0"
        style={{ color: 'var(--color-text-3)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-3)'; e.currentTarget.style.color = 'var(--color-down)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-3)' }}
        title="Remove">
        ✕
      </button>
    </motion.div>
  )
}

export default function Watchlist() {
  const { symbols, addSymbol, removeSymbol } = useWatchlistStore()
  const [input, setInput] = useState('')
  const [err,   setErr]   = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    const s = input.trim().toUpperCase()
    if (!s) return
    if (symbols.includes(s)) { setErr('Already in watchlist'); setTimeout(() => setErr(''), 2000); setInput(''); return }
    addSymbol(s)
    setInput('')
    setErr('')
  }

  return (
    <div className="page-enter p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Watchlist</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-3)' }}>{symbols.length} stocks tracked</p>
        </div>
      </div>

      {/* Add stock form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="Add symbol e.g. AAPL, TSLA..."
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-colors font-mono"
          style={{
            background:   'var(--color-surface)',
            border:       '1px solid var(--color-border)',
            color:        'var(--color-text)',
            fontFamily:   'var(--font-mono)',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
          onBlur={(e)  => e.target.style.borderColor = 'var(--color-border)'}
        />
        <Button type="submit" variant="primary" size="lg">+ Add</Button>
      </form>
      {err && <p className="text-xs mb-4 font-mono" style={{ color: 'var(--color-down)' }}>{err}</p>}

      {/* Stock list */}
      {symbols.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 rounded-xl border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>No stocks in watchlist</p>
          <Link to="/explore" className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
            Browse stocks →
          </Link>
        </div>
      ) : (
        <AnimatePresence>
          <div className="flex flex-col gap-2">
            {symbols.map((sym, i) => (
              <WatchlistRow key={sym} symbol={sym} onRemove={removeSymbol} index={i} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
