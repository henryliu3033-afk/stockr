import { useState, useMemo } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, ReferenceLine, ComposedChart, Line
} from 'recharts'
import useCandles from '../../hooks/useCandles'
import { fPrice, fVolume } from '../../lib/format'
import Spinner from '../ui/Spinner'

const PERIODS = ['1D', '1W', '1M', '3M', '1Y', '5Y']

// ── Compute simple moving average ────────────────────────────
const calcMA = (data, period) => {
  return data.map((d, i) => {
    if (i < period - 1) return { ...d, [`ma${period}`]: null }
    const slice = data.slice(i - period + 1, i + 1)
    const avg = slice.reduce((s, x) => s + x.close, 0) / period
    return { ...d, [`ma${period}`]: parseFloat(avg.toFixed(2)) }
  })
}

// ── Custom tooltip ───────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="rounded-lg border p-3 text-xs font-mono shadow-xl"
      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border-2)' }}>
      <p className="mb-1.5 font-medium" style={{ color: 'var(--color-text-2)' }}>
        {new Date(d.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {[['O', d.open], ['H', d.high], ['L', d.low], ['C', d.close]].map(([k, v]) => (
          <div key={k} className="flex items-center gap-1">
            <span style={{ color: 'var(--color-text-3)' }}>{k}</span>
            <span style={{ color: 'var(--color-text)' }}>{fPrice(v)}</span>
          </div>
        ))}
        <div className="col-span-2 flex items-center gap-1 mt-0.5">
          <span style={{ color: 'var(--color-text-3)' }}>Vol</span>
          <span style={{ color: 'var(--color-text)' }}>{fVolume(d.volume)}</span>
        </div>
      </div>
    </div>
  )
}

export default function StockChart({ symbol, initialPeriod = '1M' }) {
  const [period, setPeriod] = useState(initialPeriod)
  const [showMA, setShowMA]   = useState(true)
  const [showVol, setShowVol] = useState(true)

  const { candles, loading, error } = useCandles(symbol, period)

  const chartData = useMemo(() => {
    if (!candles.length) return []
    let data = candles
    if (showMA) {
      data = calcMA(data, 5)
      data = calcMA(data, 20)
    }
    return data
  }, [candles, showMA])

  const isPositive = useMemo(() => {
    if (chartData.length < 2) return true
    return chartData[chartData.length - 1].close >= chartData[0].close
  }, [chartData])

  const color = isPositive ? 'var(--color-up)' : 'var(--color-down)'
  const gradId = `grad-${symbol}`

  const formatXAxis = (ts) => {
    const d = new Date(ts)
    if (['1D', '1W'].includes(period)) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    if (['1Y', '5Y'].includes(period)) return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex flex-col gap-0" style={{ background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {/* Period selector */}
        <div className="flex items-center gap-0.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1 text-xs font-medium rounded-md transition-colors"
              style={{
                background:  period === p ? 'var(--color-surface-3)' : 'transparent',
                color:       period === p ? 'var(--color-text)' : 'var(--color-text-3)',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-3 text-xs">
          {[
            { key: 'ma', label: 'MA', val: showMA, set: setShowMA, color: '#7C6AF7' },
            { key: 'vol', label: 'Vol', val: showVol, set: setShowVol, color: 'var(--color-text-3)' },
          ].map(({ key, label, val, set, color: c }) => (
            <button
              key={key}
              onClick={() => set((v) => !v)}
              className="flex items-center gap-1.5 transition-colors"
              style={{ color: val ? c : 'var(--color-text-3)', opacity: val ? 1 : 0.4 }}
            >
              <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: c }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="px-2 pt-3 pb-1 h-[220px] md:h-[340px]"style={{ height: undefined }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size={24} />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-sm" style={{ color: 'var(--color-text-3)' }}>
            Failed to load chart data
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm" style={{ color: 'var(--color-text-3)' }}>
            No chart data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="time" tickFormatter={formatXAxis} tick={{ fill: 'var(--color-text-3)', fontSize: 11 }}
                axisLine={false} tickLine={false} minTickGap={60} />
              <YAxis
                yAxisId="price"
                orientation="right"
                tickFormatter={(v) => fPrice(v, 0)}
                tick={{ fill: 'var(--color-text-3)', fontSize: 11 }}
                axisLine={false} tickLine={false} width={64}
                domain={['auto', 'auto']}
              />
              {showVol && (
                <YAxis yAxisId="vol" orientation="left" hide domain={[0, (max) => max * 5]} />
              )}
              <Tooltip content={<CustomTooltip />} />

              {/* Volume bars */}
              {showVol && (
                <Bar yAxisId="vol" dataKey="volume" fill="var(--color-border-2)" opacity={0.6} radius={[2, 2, 0, 0]} maxBarSize={8} />
              )}

              {/* Price area */}
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="close"
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#${gradId})`}
                dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              />

              {/* MA lines */}
              {showMA && chartData[0]?.ma5 && (
                <Line yAxisId="price" type="monotone" dataKey="ma5" stroke="#7C6AF7" strokeWidth={1}
                  dot={false} strokeOpacity={0.8} />
              )}
              {showMA && chartData[0]?.ma20 && (
                <Line yAxisId="price" type="monotone" dataKey="ma20" stroke="#D29922" strokeWidth={1}
                  dot={false} strokeOpacity={0.8} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* MA legend */}
      {showMA && !loading && (
        <div className="flex items-center gap-4 px-4 pb-3 text-xs">
          <span className="flex items-center gap-1.5" style={{ color: '#7C6AF7' }}>
            <span className="w-4 h-0.5 bg-[#7C6AF7] inline-block rounded-full" />MA5
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#D29922' }}>
            <span className="w-4 h-0.5 bg-[#D29922] inline-block rounded-full" />MA20
          </span>
        </div>
      )}
    </div>
  )
}
