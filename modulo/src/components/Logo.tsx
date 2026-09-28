/** Símbolo modular da Módulo (quatro peças do "M" em perspectiva). */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 305 270" className={className} fill="currentColor" aria-hidden>
      <path d="M10 53 78 7l128 77-65 38z" />
      <path d="M5 60l75 44v144L5 203z" />
      <path d="M144 138l69-40v84l-69 40z" />
      <path d="M223 88l75-46v180l-75 43z" />
    </svg>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <LogoMark className="logo-mark" />
      <span className="logo-word" aria-hidden>ódulo</span>
      <span className="sr-only">Módulo</span>
    </span>
  )
}
