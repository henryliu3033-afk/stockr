import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_WATCHLIST = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD']

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      symbols: DEFAULT_WATCHLIST,

      addSymbol: (symbol) => {
        const s = symbol.toUpperCase().trim()
        if (!s || get().symbols.includes(s)) return
        set((state) => ({ symbols: [...state.symbols, s] }))
      },

      removeSymbol: (symbol) =>
        set((state) => ({ symbols: state.symbols.filter((s) => s !== symbol) })),

      hasSymbol: (symbol) => get().symbols.includes(symbol.toUpperCase()),

      reorder: (from, to) => {
        const symbols = [...get().symbols]
        const [moved] = symbols.splice(from, 1)
        symbols.splice(to, 0, moved)
        set({ symbols })
      },
    }),
    { name: 'stockr-watchlist' }
  )
)
