import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { usePageMeta } from '../seo'
import { ArrowLink, ButtonLink, Eyebrow, revealDelay } from '../components/ui'

const ecosystem = [
  {
    number: '01',
    name: 'Vhennus Capital',
    title: 'Ownership that creates lasting value.',
    description:
      'We acquire businesses, strengthen their foundations, and help them grow. By connecting complementary companies, we create opportunities that individual businesses may not achieve alone.',
    cta: 'Learn more',
    to: '/capital',
    image: '/images/corporate/ecosystem-capital.webp',
    alt: 'Aerial view of a dense city skyline at dusk',
  },
  {
    number: '02',
    name: 'Vhennus Network',
    title: 'A network of people building a better-connected world.',
    description:
      'A social network connecting individuals, professionals, and communities to exchange ideas, develop relationships, and discover opportunities.',
    cta: 'Join the network',
    to: '/social',
    image: '/images/corporate/ecosystem-network.webp',
    alt: 'A group of people sitting together outdoors, looking out over a valley',
  },
  {
    number: '03',
    name: 'Vhennus Ventures',
    title: 'Backing people who solve meaningful problems.',
    description:
      'We support promising ideas and ambitious individuals working to solve difficult problems and push the boundaries of what is possible.',
    cta: 'Explore ventures',
    to: '/vc',
    image: '/images/corporate/ecosystem-ventures.webp',
    alt: 'An engineer working on a technical system in a workshop',
  },
]

const focusPoints = [
  { label: 'Focus', value: 'Businesses with potential' },
  { label: 'Approach', value: 'Strategic ownership' },
  { label: 'Horizon', value: 'Long term' },
]

const closingLinks = [
  {
    number: '01',
    label: 'Explore Capital',
    description: 'Ownership that builds enduring businesses.',
    to: '/capital',
  },
  {
    number: '02',
    label: 'Join the Network',
    description: 'A place for people, ideas, and opportunity.',
    to: '/social',
  },
  {
    number: '03',
    label: 'Discover Ventures',
    description: 'Support for people solving difficult problems.',
    to: '/vc',
  },
]

export default function HomePage() {
  usePageMeta({
    title: 'Vhennus — Building an ecosystem of people and businesses',
    description:
      'Vhennus brings together capital, businesses, people, and ideas to create lasting value across industries and around the world.',
    path: '/',
  })

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-vh-line/60 bg-vh-ivory">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 pb-12 pt-12 sm:px-8 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14 lg:px-12 lg:pb-16 lg:pt-16">
          <div className="flex flex-col justify-between">
            <div className="vh-reveal">
              <Eyebrow>Vhennus — a global business ecosystem</Eyebrow>
              <h1 className="mt-8 font-vh-display text-[clamp(3rem,7vw,6.1rem)] font-light leading-[0.95] tracking-[-0.04em] text-vh-forest">
                <span className="block">Building an</span>
                <span className="block">ecosystem of</span>
                <span className="block text-vh-sage-deep">people and</span>
                <span className="block text-vh-sage-deep">businesses.</span>
              </h1>
              <p className="mt-8 max-w-[32rem] text-[1.05rem] leading-[1.75] text-vh-muted">
                We bring together capital, businesses, people, and ideas to create lasting value
                across industries and around the world.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <ButtonLink to="/capital" variant="solid">
                  Explore Vhennus Capital
                </ButtonLink>
                <ButtonLink to="#ecosystem" variant="outline">
                  Discover our ecosystem
                </ButtonLink>
              </div>
            </div>

            <dl className="mt-14 hidden grid-cols-3 gap-5 border-t border-vh-line pt-5 sm:grid lg:mt-16">
              {[
                { term: 'Capital', detail: 'Long-term ownership' },
                { term: 'Network', detail: 'Connected people' },
                { term: 'Ventures', detail: 'Ambitious ideas' },
              ].map((item) => (
                <div key={item.term}>
                  <dt className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-sage-deep">
                    {item.term}
                  </dt>
                  <dd className="mt-2 text-[13px] leading-snug text-vh-forest">{item.detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="vh-reveal relative min-h-[420px] overflow-hidden bg-vh-paper sm:min-h-[500px] lg:min-h-[620px]">
            <img
              src="/images/corporate/hero-architecture.webp"
              alt="Modern towers rising into a dramatic sky, photographed from below"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-vh-forest/75 via-vh-forest/10 to-transparent"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-vh-ivory sm:p-7">
              <div>
                <p className="font-vh-mono text-[9px] uppercase tracking-[0.2em] text-vh-ivory/60">
                  Vhennus Capital
                </p>
                <p className="mt-2 max-w-[16rem] font-vh-display text-[1.25rem] leading-[1.3]">
                  Ownership with a long horizon.
                </p>
              </div>
              <span className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-ivory/50">
                01 / 03
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Ecosystem */}
      <section id="ecosystem" className="border-b border-vh-line/60 bg-vh-ivory">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
            <div className="vh-reveal">
              <Eyebrow>01 — Our ecosystem</Eyebrow>
              <h2 className="mt-7 font-vh-display text-[clamp(2.6rem,4.6vw,4.2rem)] font-light leading-[1.02] tracking-[-0.03em] text-vh-forest">
                Three parts.
                <br />
                <span className="text-vh-sage-deep">One long-term view.</span>
              </h2>
            </div>
            <p className="vh-reveal max-w-[34rem] text-[1rem] leading-[1.8] text-vh-muted lg:justify-self-end">
              Capital, network, and ideas — connected by a shared belief that the right combination
              creates more value than any one part alone.
            </p>
          </div>

          <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-3 lg:gap-8">
            {ecosystem.map((item, index) => (
              <article
                key={item.name}
                className="vh-reveal group"
                style={revealDelay(index * 100)}
              >
                <Link
                  to={item.to}
                  className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vh-sage-deep"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-vh-paper">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-vh-forest/10 mix-blend-multiply"
                    />
                    <span className="absolute left-5 top-5 font-vh-mono text-[9px] uppercase tracking-[0.2em] text-vh-ivory/90">
                      {item.number}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-vh-line pt-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-vh-mono text-[9.5px] uppercase tracking-[0.18em] text-vh-sage-deep">
                        {item.name}
                      </p>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-vh-forest transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </div>
                    <h3 className="mt-4 text-balance font-vh-display text-[1.7rem] leading-[1.18] tracking-[-0.015em] text-vh-forest">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[0.94rem] leading-[1.7] text-vh-muted">
                      {item.description}
                    </p>
                    <span className="mt-5 inline-block text-[11px] font-medium uppercase tracking-[0.14em] text-vh-forest">
                      <span className="vh-underline">{item.cta}</span>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vhennus Capital introduction */}
      <section className="border-b border-vh-line/60 bg-vh-paper">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] lg:gap-20 lg:px-12 lg:py-32">
          <figure className="vh-reveal relative aspect-[4/3] overflow-hidden bg-vh-line lg:aspect-[4/5]">
            <img
              src="/images/corporate/capital-approach.webp"
              alt="A quiet, contemporary office interior with warm wood and glass"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-vh-forest/70 to-transparent p-6 pt-16 font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-ivory/80 sm:p-7">
              Considered ownership — long-term development
            </figcaption>
          </figure>

          <div className="vh-reveal">
            <Eyebrow>02 — Vhennus Capital</Eyebrow>
            <h2 className="mt-7 max-w-[36rem] font-vh-display text-[clamp(2.5rem,4.4vw,4rem)] font-light leading-[1.04] tracking-[-0.03em] text-vh-forest">
              We acquire businesses.{' '}
              <span className="text-vh-sage-deep">We build their future.</span>
            </h2>
            <p className="mt-7 max-w-[34rem] text-[1rem] leading-[1.8] text-vh-muted">
              We invest in companies with potential, strengthen the way they operate, and help them
              scale. Through strategic ownership and collaboration, we aim to build a connected
              ecosystem of businesses that create lasting value.
            </p>

            <dl className="mt-9 grid grid-cols-1 gap-px border-y border-vh-line bg-vh-line sm:grid-cols-3">
              {focusPoints.map((point) => (
                <div key={point.label} className="bg-vh-paper px-4 py-4">
                  <dt className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-sage-deep">
                    {point.label}
                  </dt>
                  <dd className="mt-2 text-[12.5px] leading-snug text-vh-forest">{point.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-9">
              <ButtonLink to="/capital" variant="outline">
                Learn about Vhennus Capital
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative overflow-hidden bg-vh-forest text-vh-ivory">
        <div className="relative mx-auto max-w-[1440px] px-6 py-24 sm:px-8 lg:px-12 lg:py-40">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
            <div className="vh-reveal">
              <Eyebrow tone="light">03 — Our philosophy</Eyebrow>
              <h2 className="mt-8 font-vh-display text-[clamp(2.8rem,6vw,5.6rem)] font-light leading-[1.01] tracking-[-0.035em] text-balance">
                Capital is a tool.
                <br />
                <span className="text-vh-sage">Value is the objective.</span>
              </h2>
            </div>

            <div className="vh-reveal self-end">
              <p className="max-w-[30rem] text-[0.98rem] leading-[1.85] text-vh-ivory/65">
                We believe capital should be allocated where it can create the greatest lasting
                value. By investing in businesses, developing people, and connecting complementary
                capabilities, we seek to build an ecosystem in which progress in one part creates
                opportunities for others.
              </p>
              <div aria-hidden="true" className="mt-8 h-px w-16 bg-vh-sage/50" />
              <p className="mt-6 font-vh-mono text-[9px] uppercase leading-[2] tracking-[0.18em] text-vh-sage">
                Long-term ownership
                <br />
                Complementary capabilities
                <br />
                Shared opportunity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing invitation */}
      <section className="bg-vh-ivory">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
          <div className="vh-reveal grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
            <div>
              <Eyebrow>04 — An open invitation</Eyebrow>
              <h2 className="mt-7 max-w-[38rem] font-vh-display text-[clamp(2.7rem,5vw,4.6rem)] font-light leading-[1.02] tracking-[-0.035em] text-vh-forest">
                Be part of
                <br />
                <span className="text-vh-sage-deep">something bigger.</span>
              </h2>
            </div>
            <p className="max-w-[32rem] text-[1rem] leading-[1.8] text-vh-muted lg:justify-self-end">
              Whether you are a business owner, professional, founder, or potential partner,
              Vhennus is building an ecosystem around shared opportunities and lasting value.
            </p>
          </div>

          <div className="mt-14 grid border-t border-vh-line sm:grid-cols-3 lg:mt-20">
            {closingLinks.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                style={revealDelay(index * 80)}
                className="vh-reveal group flex flex-col justify-between gap-12 border-b border-vh-line px-0 py-8 transition-colors duration-300 hover:bg-vh-paper sm:border-b-0 sm:border-r sm:px-8 sm:py-10 sm:last:border-r-0 lg:gap-16 lg:px-10"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-sage-deep">
                    {item.number}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 text-vh-forest transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
                <div>
                  <p className="font-vh-display text-[1.9rem] leading-[1.15] tracking-[-0.02em] text-vh-forest">
                    {item.label}
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.65] text-vh-muted">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-vh-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-muted">
              A global business ecosystem
            </p>
            <ArrowLink to="/about">About Vhennus</ArrowLink>
          </div>
        </div>
      </section>
    </>
  )
}
