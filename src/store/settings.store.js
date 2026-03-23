import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setApiKey } from '../lib/finnhub'
import { wsSetKey as wsSetKeyWs } from '../lib/ws'

// Default API key — users can override in Settings
const DEFAULT_KEY = 'd6f72chr01qvn4o2295gd6f72chr01qvn4o22960'

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      apiKey: DEFAULT_KEY,
      setApiKey: (key) => {
        const k = key.trim() || DEFAULT_KEY
        setApiKey(k)
        wsSetKeyWs(k)
        set({ apiKey: k })
      },
      initApiKey: () => {
        const key = get().apiKey || DEFAULT_KEY
        setApiKey(key)
        wsSetKeyWs(key)
      },
    }),
    { name: 'stockr-settings' }
  )
)
