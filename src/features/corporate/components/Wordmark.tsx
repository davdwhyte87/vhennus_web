import { Link } from 'react-router-dom'

type WordmarkProps = {
  tone?: 'dark' | 'light'
  className?: string
}

export default function Wordmark({ tone = 'dark', className = '' }: WordmarkProps) {
  const isLight = tone === 'light'

  return (
    <Link
      to="/"
      aria-label="Vhennus home"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <svg
        viewBox="0 0 28 28"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        className={`h-6 w-6 shrink-0 transition-colors duration-300 ${
          isLight ? 'text-vh-sage' : 'text-vh-forest'
        }`}
      >
        <path
          d="M3 4.5 14 24 25 4.5"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 4.5 14 14.5 19.5 4.5"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity=".45"
        />
      </svg>
      <span
        className={`font-vh-display text-[1.4rem] leading-none tracking-[-0.01em] ${
          isLight ? 'text-vh-ivory' : 'text-vh-forest'
        }`}
      >
        Vhennus
      </span>
    </Link>
  )
}
