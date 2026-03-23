import { useState, useEffect } from 'react'
import { getCandles, getDateRange } from '../lib/finnhub'

export default function useCandles(symbol, period = '1M') {
  const [candles, setCandles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!symbol) return
    let cancelled = false

    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const { from, to, resolution } = getDateRange(period)
        const raw = await getCandles(symbol, resolution, from, to)

        if (!cancelled) {
          if (raw.s === 'no_data' || !raw.t) {
            setCandles([])
          } else {
            // Convert parallel arrays to [{time, open, high, low, close, volume}]
            const formatted = raw.t.map((t, i) => ({
              time:   t * 1000,           // ms timestamp
              open:   raw.o[i],
              high:   raw.h[i],
              low:    raw.l[i],
              close:  raw.c[i],
              volume: raw.v[i],
            }))
            setCandles(formatted)
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [symbol, period])

  return { candles, loading, error }
}
