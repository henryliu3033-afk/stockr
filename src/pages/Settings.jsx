import { useState } from 'react'
import { useSettingsStore } from '../store/settings.store'
import Button from '../components/ui/Button'

export default function Settings() {
  const { apiKey, setApiKey } = useSettingsStore()
  const [input,  setInput]  = useState(apiKey)
  const [saved,  setSaved]  = useState(false)
  const [visible, setVisible] = useState(false)

  const handleSave = () => {
    setApiKey(input.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const mask = (k) => k ? k.slice(0, 8) + '•'.repeat(Math.max(0, k.length - 12)) + k.slice(-4) : ''

  return (
    <div className="page-enter p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>Settings</h1>

      {/* API Key section */}
      <div className="rounded-xl border p-6 mb-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>Finnhub API Key</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-3)' }}>
          Your API key is stored locally and only sent directly to Finnhub. Get a free key at{' '}
          <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer"
            className="transition-colors" style={{ color: 'var(--color-accent)' }}>finnhub.io ↗</a>
        </p>

        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input type={visible ? 'text' : 'password'} value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="d6f72chr01..."
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none font-mono transition-colors"
              style={{
                background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
            <button onClick={() => setVisible((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono transition-colors"
              style={{ color: 'var(--color-text-3)' }}>
              {visible ? 'hide' : 'show'}
            </button>
          </div>
          <Button variant="primary" size="lg" onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save'}
          </Button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          {apiKey ? (
            <>
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-up)' }} />
              <span className="text-xs font-mono" style={{ color: 'var(--color-up)' }}>Connected</span>
              <span className="text-xs font-mono" style={{ color: 'var(--color-text-3)' }}>({mask(apiKey)})</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-down)' }} />
              <span className="text-xs font-mono" style={{ color: 'var(--color-down)' }}>No API key set</span>
            </>
          )}
        </div>
      </div>

      {/* API info */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--color-text)' }}>Finnhub Free Tier Limits</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['API Calls',    '60 / minute'],
            ['Price Data',   '15-min delay'],
            ['WebSocket',    'Real-time trades'],
            ['News',         'Company + market'],
            ['Profile',      'Company info'],
            ['Search',       'Symbol lookup'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b"
              style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>{k}</span>
              <span className="text-xs font-mono" style={{ color: 'var(--color-text)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
