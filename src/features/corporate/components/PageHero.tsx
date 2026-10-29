import type { ReactNode } from 'react'
import { Eyebrow, ButtonLink } from './ui'

type PageHeroProps = {
  eyebrow: string
  title: ReactNode
  description: ReactNode
  image: string
  imageAlt: string
  caption?: string
  primary?: { label: string; to: string }
  secondary?: { label: string; to: string }
  titleClassName?: string
}

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  caption,
  primary,
  secondary,
  titleClassName = 'text-[clamp(2.9rem,5.6vw,5.4rem)]',
}: PageHeroProps) {
  return (
    <section className="border-b border-vh-line/70 bg-vh-ivory">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pb-14 pt-12 sm:px-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-16 lg:px-12 lg:pb-20 lg:pt-20">
        <div className="vh-reveal max-w-[46rem]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={`mt-8 font-vh-display ${titleClassName} font-light leading-[0.98] tracking-[-0.035em] text-vh-forest text-balance`}>
            {title}
          </h1>
          <div className="mt-7 max-w-[35rem] text-[1.02rem] leading-[1.75] text-vh-muted">
            {description}
          </div>
          {(primary || secondary) && (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {primary && (
                <ButtonLink to={primary.to} variant="solid">
                  {primary.label}
                </ButtonLink>
              )}
              {secondary && (
                <ButtonLink to={secondary.to} variant="outline">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          )}
        </div>

        <figure className="vh-reveal relative aspect-[4/5] overflow-hidden bg-vh-paper sm:aspect-[16/11] lg:aspect-[4/5]">
          <img
            src={image}
            alt={imageAlt}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-vh-forest/70 via-vh-forest/10 to-transparent"
          />
          <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-vh-ivory sm:p-7">
            <p className="max-w-[17rem] font-vh-display text-[1.15rem] leading-[1.3]">
              {caption ?? 'Vhennus'}
            </p>
            <span className="font-vh-mono text-[9px] uppercase tracking-[0.2em] text-vh-ivory/60">
              Vhennus
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
