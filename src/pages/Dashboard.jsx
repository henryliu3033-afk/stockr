import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { useWatchlistStore } from '../store/watchlist.store'
import StockCard from '../components/stock/StockCard'
import NewsCard from '../components/stock/NewsCard'
import Spinner from '../components/ui/Spinner'
import { getMarketNews, getQuotes } from '../lib/finnhub'
import { fPrice, fPct, isPositive } from '../lib/format'

// ── Market summary row ───────────────────────────────────────
function MarketSummary() {
  const [quotes, setQuotes] = useState([])

  useEffect(() => {
    const symbols = ['SPY', 'QQQ', 'DIA', 'IWM']
    const labels  = ['S&P 500', 'NASDAQ', 'DOW', 'Russell']
    getQuotes(symbols).then((data) => {
      setQuotes(data.map((q, i) => ({ label: labels[i], ...q })))
    }).catch(() => {})
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {quotes.map((q) => {
        const up = isPositive(q.d)
        return (
          <div key={q.label} className="p-4 rounded-xl border"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-3)' }}>{q.label}</p>
            <p className="font-mono font-semibold text-base mb-0.5" style={{ color: 'var(--color-text)' }}>
              {fPrice(q.c)}
            </p>
            <p className="font-mono text-xs" style={{ color: up ? 'var(--color-up)' : 'var(--color-down)' }}>
              {fPct(q.dp)}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────
export default function Dashboard() {
  const { symbols, removeSymbol } = useWatchlistStore()
  const [news,        setNews]        = useState([])
  const [newsLoading, setNewsLoading] = useState(true)

  useEffect(() => {
    getMarketNews('general')
      .then((data) => setNews((data || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setNewsLoading(false))
  }, [])

  return (
    <div className="page-enter p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-3)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="live-dot w-2 h-2 rounded-full inline-block" style={{ background: 'var(--color-up)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--color-up)' }}>Market Open</span>
        </div>
      </div>

      {/* Market indices summary */}
      <MarketSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--color-text-2)' }}>
              WATCHLIST · {symbols.length} stocks
            </h2>
            <Link to="/watchlist" className="text-xs font-medium transition-colors"
              style={{ color: 'var(--color-accent)' }}>
              Manage →
            </Link>
          </div>

          {symbols.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl border"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>Your watchlist is empty</p>
              <Link to="/explore" className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                Explore stocks →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {symbols.map((sym, i) => (
                <StockCard key={sym} symbol={sym} onRemove={removeSymbol} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* News sidebar */}
        <div>
          <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text-2)' }}>
            MARKET NEWS
          </h2>
          {newsLoading ? (
            <div className="flex items-center justify-center py-10"><Spinner size={20} /></div>
          ) : (
            <div className="flex flex-col gap-3">
              {news.map((item, i) => <NewsCard key={i} item={item} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
