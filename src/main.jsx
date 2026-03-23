import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setApiKey } from './lib/finnhub.js'
import { wsSetKey } from './lib/ws.js'

// ── Set API key SYNCHRONOUSLY before any component renders ──
// This prevents the race condition where hooks fire before initApiKey()
const DEFAULT_KEY = 'd6f72chr01qvn4o2295gd6f72chr01qvn4o22960'
const stored = (() => {
  try {
    const s = localStorage.getItem('stockr-settings')
    return s ? JSON.parse(s)?.state?.apiKey : null
  } catch { return null }
})()
const activeKey = stored || DEFAULT_KEY
setApiKey(activeKey)
wsSetKey(activeKey)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
