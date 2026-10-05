import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import aquariusLogo from '../../../assets/vlogosm.png'

interface AuthLayoutProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  backTo?: string
  backLabel?: string
}

export default function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  backTo,
  backLabel,
}: AuthLayoutProps) {
  const shellClassName = [
    'min-h-screen bg-[#F5F5F0] text-[#0A1931]',
    'md:grid md:grid-cols-[1.05fr_.95fr]',
  ].join(' ')
  const heroPanelClassName = [
    'relative hidden overflow-hidden bg-[#0A1931] p-12 text-[#F5F5F0]',
    'md:flex md:flex-col md:justify-between lg:p-16',
  ].join(' ')
  const backLinkClassName = [
    'mb-8 inline-flex items-center gap-2 text-sm text-[#4d5666]',
    'transition-colors hover:text-[#CC5A2A]',
  ].join(' ')

  return (
    <main className={shellClassName}>
      <section className={heroPanelClassName}>
        <div className="absolute -right-36 -top-40 size-[520px] rounded-full border border-[#C9A86A]/30" />
        <div className="absolute -bottom-48 -left-28 size-[520px] rounded-full border border-[#C9A86A]/20" />

        <Link to="/" className="relative z-10">
          <img
            className="logo-white h-11 w-auto max-w-[170px] object-contain object-left"
            src={aquariusLogo}
            alt="Vhennus"
          />
        </Link>

        <div className="relative z-10 max-w-[540px]">
          <p className="mb-7 font-mono text-[11px] uppercase tracking-[.18em] text-[#C9A86A]">
            A new civilization on Earth
          </p>
          <p className="font-serif text-[clamp(48px,5.2vw,82px)] leading-[.98] tracking-[-.05em]">
            Build the future
            <br />
            <em className="font-medium text-[#C9A86A]">together.</em>
          </p>
          <p className="mt-8 max-w-md text-lg leading-[1.75] text-[#d7dce4]">
            Vhennus brings people together to create, discover, and build
            better systems.
          </p>
        </div>

        <p className="relative z-10 font-mono text-[10px] uppercase tracking-[.14em] text-[#C9A86A]">
          One People, One Vision
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 md:px-12 lg:px-16">
        <div className="w-full max-w-[500px]">
          <Link to="/" className="mb-11 flex md:hidden">
            <img
              className="aquarius-logo h-10 w-auto max-w-[170px] object-contain object-left"
              src={aquariusLogo}
              alt="Vhennus"
            />
          </Link>

          {backTo && (
            <Link to={backTo} className={backLinkClassName}>
              <ArrowLeft size={16} />
              {backLabel}
            </Link>
          )}

          <div className="border-b border-[#C9A86A] pb-8">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[.15em] text-[#CC5A2A]">
              {eyebrow}
            </p>
            <h1 className="font-serif text-[clamp(42px,6vw,60px)] leading-[1] tracking-[-.045em] text-[#0A1931]">
              {title}
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-[1.7] text-[#4d5666]">
              {description}
            </p>
          </div>

          <div className="pt-8">{children}</div>
        </div>
      </section>
    </main>
  )
}
