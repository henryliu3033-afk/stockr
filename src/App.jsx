import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router'
import { AnimatePresence } from 'motion/react'
import Navbar    from './components/layout/Navbar'
import TickerBar from './components/layout/TickerBar'
import { useSettingsStore } from './store/settings.store'
import Dashboard  from './pages/Dashboard'
import StockDetail from './pages/StockDetail'
import Explore    from './pages/Explore'
import Watchlist  from './pages/Watchlist'
import Market     from './pages/Market'
import Settings   from './pages/Settings'

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"              element={<Dashboard />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/explore"       element={<Explore />} />
        <Route path="/watchlist"     element={<Watchlist />} />
        <Route path="/market"        element={<Market />} />
        <Route path="/settings"      element={<Settings />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppInner() {
  const { initApiKey } = useSettingsStore()

  // Initialize API key as soon as the app mounts
  useEffect(() => {
    initApiKey()
  }, [])

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Navbar />
      <TickerBar />
      <main className="flex-1 overflow-y-auto">
        <AppRoutes />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
