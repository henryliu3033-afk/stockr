const V = {
  primary: 'bg-[var(--color-accent)] hover:opacity-90 text-white',
  outline: 'border border-[var(--color-border)] hover:border-[var(--color-border-2)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-2)] hover:text-[var(--color-text)]',
  ghost:   'hover:bg-[var(--color-surface-2)] text-[var(--color-text-2)] hover:text-[var(--color-text)]',
  up:      'bg-[var(--color-up-dim)] border border-[var(--color-up)] text-[var(--color-up)] hover:opacity-80',
  down:    'bg-[var(--color-down-dim)] border border-[var(--color-down)] text-[var(--color-down)] hover:opacity-80',
}
const S = {
  xs: 'h-6 px-2 text-xs gap-1',
  sm: 'h-7 px-3 text-xs gap-1.5',
  md: 'h-8 px-3.5 text-sm gap-2',
  lg: 'h-9 px-4 text-sm gap-2',
  xl: 'h-10 px-5 text-base gap-2',
}

export default function Button({ variant = 'outline', size = 'md', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${V[variant]} ${S[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
