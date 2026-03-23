// ── Finnhub WebSocket Live Price Manager ─────────────────────
// Manages a single WebSocket connection and multiplexes
// subscriptions to multiple symbols.

let ws = null
let apiKey = ''
const subscribers = new Map() // symbol → Set<callback>
const latestPrices = new Map() // symbol → { price, volume, timestamp }

export const wsSetKey = (key) => { apiKey = key }

function connect() {
  if (ws && ws.readyState === WebSocket.OPEN) return
  if (!apiKey) return

  ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`)

  ws.onopen = () => {
    // Re-subscribe all active symbols
    subscribers.forEach((_, symbol) => wsSubscribe(symbol))
  }

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      if (msg.type !== 'trade' || !msg.data) return

      // Group trades by symbol and take the last price
      const bySymbol = {}
      for (const trade of msg.data) {
        bySymbol[trade.s] = { price: trade.p, volume: trade.v, timestamp: trade.t }
      }

      // Notify subscribers
      Object.entries(bySymbol).forEach(([symbol, data]) => {
        latestPrices.set(symbol, data)
        const subs = subscribers.get(symbol)
        if (subs) subs.forEach((cb) => cb(data))
      })
    } catch { /* ignore malformed */ }
  }

  ws.onclose = () => {
    ws = null
    // Reconnect after 3 seconds if there are active subscribers
    if (subscribers.size > 0) setTimeout(connect, 3000)
  }

  ws.onerror = () => ws?.close()
}

export function wsSubscribe(symbol, callback) {
  if (!subscribers.has(symbol)) subscribers.set(symbol, new Set())
  if (callback) subscribers.get(symbol).add(callback)

  // Send subscribe message if WS is open
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'subscribe', symbol }))
  } else {
    connect()
  }

  // Return current cached price if available
  return latestPrices.get(symbol) || null
}

export function wsUnsubscribe(symbol, callback) {
  const subs = subscribers.get(symbol)
  if (subs) {
    if (callback) subs.delete(callback)
    if (!callback || subs.size === 0) {
      subscribers.delete(symbol)
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'unsubscribe', symbol }))
      }
    }
  }
  if (subscribers.size === 0 && ws) {
    ws.close()
    ws = null
  }
}

export const getLatestPrice = (symbol) => latestPrices.get(symbol)
