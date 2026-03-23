export default function Spinner({ size = 16 }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      className="animate-spin"
      style={{ color: 'var(--color-text-3)' }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
    </svg>
  )
}
