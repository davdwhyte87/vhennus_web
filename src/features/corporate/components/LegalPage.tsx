import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Eyebrow } from './ui'

export type LegalSection = {
  title: string
  body: ReactNode
}

type LegalPageProps = {
  title: string
  intro: string
  updated: string
  sections: LegalSection[]
}

export default function LegalPage({ title, intro, updated, sections }: LegalPageProps) {
  return (
    <>
      <section className="border-b border-vh-line/60 bg-vh-ivory">
        <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-16 sm:px-8 lg:px-12 lg:pb-16 lg:pt-24">
          <div className="vh-reveal max-w-[46rem]">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="mt-8 font-vh-display text-[clamp(2.7rem,5vw,4.4rem)] font-light leading-[1.02] tracking-[-0.035em] text-vh-forest">
              {title}
            </h1>
            <p className="mt-6 max-w-[38rem] text-[1rem] leading-[1.8] text-vh-muted">{intro}</p>
            <p className="mt-6 font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-sage-deep">
              Last updated {updated}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-vh-ivory">
        <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20">
            <aside className="vh-reveal self-start lg:sticky lg:top-28">
              <p className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-sage-deep">
                On this page
              </p>
              <ol className="mt-5 space-y-2.5">
                {sections.map((section, index) => (
                  <li key={section.title} className="flex gap-3 text-[12.5px] text-vh-muted">
                    <span className="font-vh-mono text-[9px] leading-[2] text-vh-sage-deep">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{section.title}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 border-t border-vh-line pt-5">
                <Link
                  to="/contact"
                  className="vh-underline text-[11px] font-medium uppercase tracking-[0.14em] text-vh-forest"
                >
                  Contact Vhennus
                </Link>
              </div>
            </aside>

            <div className="vh-reveal max-w-[44rem]">
              <div className="space-y-10">
                {sections.map((section, index) => (
                  <section key={section.title} aria-labelledby={`legal-section-${index}`}>
                    <h2
                      id={`legal-section-${index}`}
                      className="font-vh-display text-[1.65rem] leading-tight tracking-[-0.015em] text-vh-forest"
                    >
                      {section.title}
                    </h2>
                    <div className="mt-3 space-y-4 text-[0.95rem] leading-[1.85] text-vh-muted">
                      {section.body}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
