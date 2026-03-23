import { fDate } from '../../lib/format'

export default function NewsCard({ item }) {
  if (!item) return null
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 p-4 rounded-xl border transition-all duration-150 hover:bg-[var(--color-surface-2)] group"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {/* Thumbnail */}
      {item.image && (
        <img
          src={item.image}
          alt=""
          className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug mb-1.5 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors"
          style={{ color: 'var(--color-text)' }}>
          {item.headline}
        </p>
        <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--color-text-2)' }}>
          {item.summary}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
            {item.source}
          </span>
          <span style={{ color: 'var(--color-text-3)' }}>·</span>
          <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>
            {fDate(item.datetime)}
          </span>
        </div>
      </div>
    </a>
  )
}
