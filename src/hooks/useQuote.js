import { useState, useEffect, useRef } from 'react'
import { getQuote } from '../lib/finnhub'

const cache = new Map()   // symbol → { data, fetchedAt }
const CACHE_TTL = 60000  // 60 seconds — reduces requests significantly

export default function useQuote(symbol) {
  const [data,    setData]    = useState(cache.get(symbol)?.data || null)
  const [loading, setLoading] = useState(!cache.get(symbol))
  const [error,   setError]   = useState(null)
  const prevRef = useRef(null)

  useEffect(() => {
    if (!symbol) return
    let cancelled = false

    const fetch = async () => {
      // Check cache first
      const cached = cache.get(symbol)
      if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
        setData(cached.data)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const quote = await getQuote(symbol)
        if (!cancelled) {
          cache.set(symbol, { data: quote, fetchedAt: Date.now() })
          setData(quote)
          prevRef.current = quote.c
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    // Refresh every 15 seconds
    const id = setInterval(fetch, 15000)
    return () => { cancelled = true; clearInterval(id) }
  }, [symbol])

  return { data, loading, error }
}
