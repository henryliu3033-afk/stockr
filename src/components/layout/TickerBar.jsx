import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import useQuote from '../../hooks/useQuote'
import { fPrice, fPct, isPositive } from '../../lib/format'

const TICKER_SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'META', 'AMZN']

function TickerItem({ symbol }) {
  const { data } = useQuote(symbol)
  if (!data) return null
  const up = isPositive(data.d)
  return (
    <Link
      to={`/stock/${symbol}`}
      className="flex items-center gap-2 px-4 whitespace-nowrap hover:opacity-80 transition-opacity"
    >
      <span className="font-semibold text-xs" style={{ color: 'var(--color-text)' }}>{symbol}</span>
      <span className="font-mono text-xs" style={{ color: 'var(--color-text-2)' }}>{fPrice(data.c)}</span>
      <span className="font-mono text-xs" style={{ color: up ? 'var(--color-up)' : 'var(--color-down)' }}>
        {fPct(data.dp)}
      </span>
    </Link>
  )
}

export default function TickerBar() {
  const items = [...TICKER_SYMBOLS, ...TICKER_SYMBOLS] // duplicate for seamless loop

  return (
    <div
      className="border-b overflow-hidden"
      style={{
        background:   'var(--color-surface)',
        borderColor:  'var(--color-border)',
        height:       '34px',
      }}
    >
      <div className="ticker-track flex items-center h-full w-max">
        {items.map((sym, i) => (
          <TickerItem key={`${sym}-${i}`} symbol={sym} />
        ))}
      </div>
    </div>
  )
}
