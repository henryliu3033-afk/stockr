import { useState, useEffect, useRef } from 'react'
import { wsSubscribe, wsUnsubscribe } from '../lib/ws'

export default function useLivePrice(symbol) {
  const [livePrice, setLivePrice] = useState(null)
  const [flash,     setFlash]     = useState(null) // 'up' | 'down' | null
  const prevRef = useRef(null)

  useEffect(() => {
    if (!symbol) return

    const callback = ({ price }) => {
      setLivePrice((prev) => {
        if (prev !== null) {
          const dir = price > prev ? 'up' : price < prev ? 'down' : null
          if (dir) {
            setFlash(dir)
            setTimeout(() => setFlash(null), 600)
          }
        }
        prevRef.current = price
        return price
      })
    }

    const cached = wsSubscribe(symbol, callback)
    if (cached) setLivePrice(cached.price)

    return () => wsUnsubscribe(symbol, callback)
  }, [symbol])

  return { livePrice, flash }
}
