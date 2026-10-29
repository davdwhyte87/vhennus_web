import { ArrowUpRight } from 'lucide-react'
import { Eyebrow } from './ui'

export default function ContactEmail({
  eyebrow = 'Contact',
  className = '',
}: {
  eyebrow?: string
  className?: string
}) {
  return (
    <div className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <a
        href="mailto:team@vhennus.org"
        className="group mt-6 inline-flex items-start gap-3 font-vh-display text-[clamp(1.7rem,4vw,2.9rem)] leading-[1.05] tracking-[-0.025em] text-vh-forest"
      >
        <span className="vh-underline break-all">team@vhennus.org</span>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-1 h-6 w-6 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
        />
      </a>
      <p className="mt-6 max-w-[30rem] text-[15px] leading-[1.75] text-vh-muted">
        Email is the best way to reach us. Tell us who you are, what you are working on, and how we
        can help.
      </p>
    </div>
  )
}
