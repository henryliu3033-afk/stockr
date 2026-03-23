import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import useQuote from '../../hooks/useQuote'
import useLivePrice from '../../hooks/useLivePrice'
import { fPrice, fPct, isPositive } from '../../lib/format'
import Spinner from '../ui/Spinner'

export default function StockCard({ symbol, onRemove, index = 0 }) {
  const { data: quote, loading } = useQuote(symbol)
  const { livePrice, flash }    = useLivePrice(symbol)

  const displayPrice = livePrice ?? quote?.c
  const change    = quote?.d
  const changePct = quote?.dp
  const up        = isPositive(change)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group relative rounded-xl border transition-all duration-150 overflow-hidden ${
        flash === 'up'   ? 'flash-up'   :
        flash === 'down' ? 'flash-down' : ''
      }`}
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <Link
        to={`/stock/${symbol}`}
        className="block p-4 hover:bg-[var(--color-surface-2)] transition-colors"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>{symbol}</p>
          </div>
          <div className="text-right">
            {loading && !displayPrice ? (
              <Spinner size={14} />
            ) : (
              <>
                <p className="font-mono font-semibold text-base" style={{ color: 'var(--color-text)' }}>
                  {fPrice(displayPrice)}
                </p>
                <p className="font-mono text-xs mt-0.5" style={{ color: up ? 'var(--color-up)' : 'var(--color-down)' }}>
                  {fPct(changePct)}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Mini bar indicator */}
        {change != null && (
          <div className="h-0.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width:      `${Math.min(Math.abs(changePct || 0) * 10, 100)}%`,
                background: up ? 'var(--color-up)' : 'var(--color-down)',
              }}
            />
          </div>
        )}
      </Link>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => { e.preventDefault(); onRemove(symbol) }}
          className="absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--color-surface-3)]"
          style={{ color: 'var(--color-text-3)' }}
          title="Remove from watchlist"
        >
          ✕
        </button>
      )}
    </motion.div>
  )
}
