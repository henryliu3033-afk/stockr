import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { POPULAR_STOCKS, SECTORS } from '../constants/stocks'
import useQuote from '../hooks/useQuote'
import { fPrice, fPct, isPositive } from '../lib/format'
import Spinner from '../components/ui/Spinner'

function HeatTile({ stock }) {
  const { data, loading } = useQuote(stock.symbol)
  const up = isPositive(data?.dp)
  const pct = data?.dp ?? 0
  const intensity = Math.min(Math.abs(pct) / 5, 1)

  const bg = data
    ? up
      ? `rgba(34,212,122,${0.08 + intensity * 0.25})`
      : `rgba(255,69,96,${0.08 + intensity * 0.25})`
    : 'var(--color-surface)'

  const border = data
    ? up ? 'rgba(34,212,122,0.3)' : 'rgba(255,69,96,0.3)'
    : 'var(--color-border)'

  return (
    <Link to={`/stock/${stock.symbol}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-3 rounded-xl text-center cursor-pointer transition-all"
        style={{ background: bg, border: `1px solid ${border}` }}
        whileHover={{ scale: 1.03 }}
      >
        <p className="font-mono font-bold text-sm mb-0.5" style={{ color: 'var(--color-text)' }}>
          {stock.symbol}
        </p>
        {loading ? (
          <Spinner size={12} />
        ) : data ? (
          <p className="font-mono text-xs" style={{ color: up ? 'var(--color-up)' : 'var(--color-down)' }}>
            {fPct(pct)}
          </p>
        ) : (
          <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>—</p>
        )}
      </motion.div>
    </Link>
  )
}

export default function Market() {
  const [activeSector, setSector] = useState('All')

  const displayed = activeSector === 'All'
    ? POPULAR_STOCKS
    : POPULAR_STOCKS.filter((s) => s.sector === activeSector)

  const grouped = SECTORS.reduce((acc, sector) => {
    acc[sector] = POPULAR_STOCKS.filter((s) => s.sector === sector)
    return acc
  }, {})

  return (
    <div className="page-enter p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Market Overview</h1>

      {/* Sector filter */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {['All', ...SECTORS].map((s) => (
          <button key={s} onClick={() => setSector(s)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={{
              background:  activeSector === s ? 'var(--color-accent)' : 'var(--color-surface)',
              color:       activeSector === s ? '#fff' : 'var(--color-text-2)',
              border:      '1px solid',
              borderColor: activeSector === s ? 'var(--color-accent)' : 'var(--color-border)',
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* Heat map */}
      {activeSector === 'All' ? (
        Object.entries(grouped).map(([sector, stocks]) => (
          <div key={sector} className="mb-8">
            <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--color-text-2)' }}>
              {sector.toUpperCase()}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {stocks.map((s) => <HeatTile key={s.symbol} stock={s} />)}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {displayed.map((s) => <HeatTile key={s.symbol} stock={s} />)}
        </div>
      )}
    </div>
  )
}
