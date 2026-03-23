import { fPrice, fChange, fPct, isPositive } from '../../lib/format'

/**
 * PriceTag — renders current price and change/percent with color coding.
 * Props: price, change, changePct, size (sm|md|lg)
 */
export default function PriceTag({ price, change, changePct, size = 'md', showPrice = true }) {
  const up = isPositive(change)
  const color = up ? 'var(--color-up)' : 'var(--color-down)'

  const priceSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' }
  const changeSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      {showPrice && price != null && (
        <span className={`font-semibold font-mono ${priceSizes[size]}`} style={{ color: 'var(--color-text)' }}>
          {fPrice(price)}
        </span>
      )}
      {change != null && (
        <span className={`font-mono ${changeSizes[size]}`} style={{ color }}>
          {fChange(change)} ({fPct(changePct)})
        </span>
      )}
    </div>
  )
}
