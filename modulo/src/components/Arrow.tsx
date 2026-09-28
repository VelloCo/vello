export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M3 13 13 3M5.5 3H13v7.5" />
    </svg>
  )
}
