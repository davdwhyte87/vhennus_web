import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

type Tone = 'dark' | 'light'

export function Eyebrow({
  children,
  tone = 'dark',
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <p
      className={`flex items-center gap-3 font-vh-mono text-[11px] uppercase leading-none tracking-[0.2em] ${
        tone === 'light' ? 'text-vh-sage' : 'text-vh-sage-deep'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-px w-6 ${tone === 'light' ? 'bg-vh-sage/60' : 'bg-vh-sage-deep/40'}`}
      />
      {children}
    </p>
  )
}

type ButtonVariant = 'solid' | 'outline' | 'light' | 'outline-light'

const buttonStyles: Record<ButtonVariant, string> = {
  solid: 'bg-vh-forest text-vh-ivory hover:bg-vh-forest-deep',
  outline:
    'border border-vh-forest/30 text-vh-forest hover:border-vh-forest hover:bg-vh-forest hover:text-vh-ivory',
  light: 'bg-vh-ivory text-vh-forest hover:bg-vh-sage',
  'outline-light':
    'border border-vh-ivory/40 text-vh-ivory hover:border-vh-ivory hover:bg-vh-ivory hover:text-vh-forest',
}

export function ButtonLink({
  to,
  children,
  variant = 'solid',
  className = '',
}: {
  to: string
  children: ReactNode
  variant?: ButtonVariant
  className?: string
}) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center justify-center gap-4 self-start rounded-full py-2 pl-7 pr-2 text-[14px] font-normal transition-colors duration-300 ${buttonStyles[variant]} ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-full border border-current/30"
      >
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  )
}

export function ArrowLink({
  to,
  children,
  tone = 'dark',
  className = '',
}: {
  to: string
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 text-[14px] font-normal ${
        tone === 'light' ? 'text-vh-ivory' : 'text-vh-forest'
      } ${className}`}
    >
      <span className="vh-underline">{children}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  )
}

export function revealDelay(ms: number): CSSProperties {
  return { '--vh-delay': `${ms}ms` } as CSSProperties
}
