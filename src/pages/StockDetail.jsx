import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { motion } from 'motion/react'
import useQuote from '../hooks/useQuote'
import useLivePrice from '../hooks/useLivePrice'
import StockChart from '../components/chart/StockChart'
import NewsCard from '../components/stock/NewsCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { useWatchlistStore } from '../store/watchlist.store'
import { getProfile, getNews, toDateStr } from '../lib/finnhub'
import { fPrice, fChange, fPct, fVolume, fMarketCap, isPositive } from '../lib/format'

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b"
      style={{ borderColor: 'var(--color-border)' }}>
      <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>{label}</span>
      <span className="font-mono text-xs font-medium" style={{ color: 'var(--color-text)' }}>{value}</span>
    </div>
  )
}

export default function StockDetail() {
  const { symbol } = useParams()
  const { data: quote, loading: quoteLoading } = useQuote(symbol)
  const { livePrice, flash } = useLivePrice(symbol)
  const { addSymbol, removeSymbol, hasSymbol } = useWatchlistStore()

  const [profile, setProfile] = useState(null)
  const [news,    setNews]    = useState([])
  const [loading, setLoading] = useState(true)

  const inWatchlist = hasSymbol(symbol)
  const displayPrice = livePrice ?? quote?.c
  const up = isPositive(quote?.d)

  useEffect(() => {
    setProfile(null); setNews([]); setLoading(true)
    const to   = new Date()
    const from = new Date(); from.setMonth(from.getMonth() - 1)

    Promise.all([
      getProfile(symbol),
      getNews(symbol, toDateStr(from), toDateStr(to)),
    ]).then(([p, n]) => {
      setProfile(p)
      setNews((n || []).slice(0, 8))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [symbol])

  return (
    <div className="page-enter p-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-5">
        <Link to="/" className="transition-colors" style={{ color: 'var(--color-text-3)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-3)'}>
          Dashboard
        </Link>
        <span style={{ color: 'var(--color-text-3)' }}>/</span>
        <span style={{ color: 'var(--color-text)' }}>{symbol}</span>
      </div>

      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {profile?.logo && (
            <img src={profile.logo} alt={symbol} className="w-12 h-12 rounded-xl object-contain"
              style={{ background: 'var(--color-surface)', padding: '4px' }}
              onError={(e) => e.target.style.display = 'none'} />
          )}
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{symbol}</h1>
              {profile?.exchange && (
                <span className="text-xs px-2 py-0.5 rounded font-mono"
                  style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-3)' }}>
                  {profile.exchange}
                </span>
              )}
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>
              {profile?.name || symbol}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Price */}
          {quoteLoading && !displayPrice ? (
            <Spinner />
          ) : (
            <div className={`text-right ${flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''} rounded-lg px-3 py-1`}>
              <p className="font-mono text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                {fPrice(displayPrice)}
              </p>
              <p className="font-mono text-sm" style={{ color: up ? 'var(--color-up)' : 'var(--color-down)' }}>
                {fChange(quote?.d)} ({fPct(quote?.dp)}) today
              </p>
            </div>
          )}

          {/* Watchlist button */}
          <Button
            variant={inWatchlist ? 'up' : 'outline'}
            size="md"
            onClick={() => inWatchlist ? removeSymbol(symbol) : addSymbol(symbol)}
          >
            {inWatchlist ? '★ Watching' : '☆ Watch'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart + News */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <StockChart symbol={symbol} />

          <div>
            <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text-2)' }}>
              COMPANY NEWS
            </h2>
            {loading ? (
              <div className="flex justify-center py-8"><Spinner size={20} /></div>
            ) : news.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-3)' }}>No news available</p>
            ) : (
              <div className="flex flex-col gap-3">
                {news.map((item, i) => <NewsCard key={i} item={item} />)}
              </div>
            )}
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="flex flex-col gap-5">
          {/* Quote stats */}
          <div className="rounded-xl border p-4" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--color-text-2)' }}>QUOTE</h3>
            {quote ? (
              <>
                <StatRow label="Open"       value={fPrice(quote.o)} />
                <StatRow label="High"       value={fPrice(quote.h)} />
                <StatRow label="Low"        value={fPrice(quote.l)} />
                <StatRow label="Prev Close" value={fPrice(quote.pc)} />
              </>
            ) : <Spinner size={16} />}
          </div>

          {/* Company profile */}
          {profile && (
            <div className="rounded-xl border p-4" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--color-text-2)' }}>PROFILE</h3>
              <StatRow label="Market Cap"  value={fMarketCap(profile.marketCapitalization * 1e6)} />
              <StatRow label="Industry"    value={profile.finnhubIndustry || '—'} />
              <StatRow label="Country"     value={profile.country || '—'} />
              <StatRow label="Currency"    value={profile.currency || '—'} />
              <StatRow label="Shares Out"  value={fVolume(profile.shareOutstanding * 1e6)} />
              {profile.weburl && (
                <div className="pt-3">
                  <a href={profile.weburl} target="_blank" rel="noopener noreferrer"
                    className="text-xs transition-colors" style={{ color: 'var(--color-accent)' }}>
                    {profile.weburl.replace('https://', '').replace('http://', '')} ↗
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
