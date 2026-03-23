// ── Finnhub API Wrapper ──────────────────────────────────────
// Docs: https://finnhub.io/docs/api

const BASE = 'https://finnhub.io/api/v1'

let _apiKey = ''

export const setApiKey = (key) => { _apiKey = key }
export const getApiKey = () => _apiKey

// ── Request queue — max 8 concurrent, 120ms between each ────
// Finnhub free tier = 60 calls/min. We spread them out to avoid 429.
const queue = []
let activeCount = 0
const MAX_CONCURRENT = 4
const DELAY_MS = 150   // ~6–7 per second → well under 60/min

function processQueue() {
  if (activeCount >= MAX_CONCURRENT || queue.length === 0) return
  const { resolve, reject, fn } = queue.shift()
  activeCount++
  fn()
    .then(resolve)
    .catch(reject)
    .finally(() => {
      activeCount--
      setTimeout(processQueue, DELAY_MS)
    })
}

function enqueue(fn) {
  return new Promise((resolve, reject) => {
    queue.push({ resolve, reject, fn })
    processQueue()
  })
}

async function get(path, params = {}) {
  return enqueue(async () => {
    const url = new URL(`${BASE}${path}`)
    url.searchParams.set('token', _apiKey)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

    const res = await fetch(url.toString())
    if (res.status === 429) {
      // Rate limited — wait 1s and retry once
      await new Promise((r) => setTimeout(r, 1000))
      const retry = await fetch(url.toString())
      if (!retry.ok) throw new Error(`Finnhub ${retry.status}: ${path}`)
      return retry.json()
    }
    if (!res.ok) throw new Error(`Finnhub ${res.status}: ${path}`)
    return res.json()
  })
}

// ── Quote (current price) ────────────────────────────────────
// Returns: { c: price, d: change, dp: changePercent, h, l, o, pc, t }
export const getQuote = (symbol) => get('/quote', { symbol })

// ── Multiple quotes (batch via Promise.all) ──────────────────
export const getQuotes = (symbols) => Promise.all(symbols.map(getQuote))

// ── Candles (OHLCV for chart) ────────────────────────────────
// resolution: 1, 5, 15, 30, 60, D, W, M
export const getCandles = (symbol, resolution, from, to) =>
  get('/stock/candle', { symbol, resolution, from, to })

// ── Company profile ──────────────────────────────────────────
export const getProfile = (symbol) => get('/stock/profile2', { symbol })

// ── Company news ─────────────────────────────────────────────
export const getNews = (symbol, from, to) =>
  get('/company-news', { symbol, from, to })

// ── Symbol search ────────────────────────────────────────────
export const searchSymbol = (query) => get('/search', { q: query })

// ── Market news (general) ────────────────────────────────────
export const getMarketNews = (category = 'general') =>
  get('/news', { category })

// ── Earnings calendar ────────────────────────────────────────
export const getEarnings = (from, to) =>
  get('/calendar/earnings', { from, to })

// ── Helper: format date as YYYY-MM-DD ────────────────────────
export const toDateStr = (date) => date.toISOString().slice(0, 10)

// ── Helper: get unix timestamp ───────────────────────────────
export const toUnix = (date) => Math.floor(date.getTime() / 1000)

// ── Helper: date ranges for candle requests ──────────────────
export const getDateRange = (period) => {
  const to = new Date()
  const from = new Date()
  const ranges = {
    '1D': () => { from.setDate(from.getDate() - 1);   return '5'  },
    '1W': () => { from.setDate(from.getDate() - 7);   return '15' },
    '1M': () => { from.setMonth(from.getMonth() - 1); return '60' },
    '3M': () => { from.setMonth(from.getMonth() - 3); return 'D'  },
    '1Y': () => { from.setFullYear(from.getFullYear() - 1); return 'D' },
    '5Y': () => { from.setFullYear(from.getFullYear() - 5); return 'W' },
  }
  const resolution = (ranges[period] || ranges['1M'])()
  return { from: toUnix(from), to: toUnix(to), resolution }
}
