// ── Formatting utilities ─────────────────────────────────────

export const fPrice = (n, decimals = 2) => {
  if (n == null || isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(n)
}

export const fChange = (n, decimals = 2) => {
  if (n == null || isNaN(n)) return '—'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(decimals)}`
}

export const fPct = (n, decimals = 2) => {
  if (n == null || isNaN(n)) return '—'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(decimals)}%`
}

export const fVolume = (n) => {
  if (n == null || isNaN(n)) return '—'
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return String(n)
}

export const fMarketCap = (n) => {
  if (!n) return '—'
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`
  return `$${n}`
}

export const fDate = (ts) => {
  if (!ts) return '—'
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export const fTime = (ts) => {
  if (!ts) return '—'
  return new Date(ts * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  })
}

export const isPositive = (n) => n != null && n >= 0
