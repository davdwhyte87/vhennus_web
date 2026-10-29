import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import { ButtonLink, Eyebrow, revealDelay } from '../components/ui'
import { usePageMeta } from '../seo'

const parts = [
  {
    number: '01',
    name: 'Vhennus Capital',
    line: 'Ownership that creates lasting value.',
    to: '/capital',
  },
  {
    number: '02',
    name: 'Vhennus Network',
    line: 'A network of people building a better-connected world.',
    to: '/social',
  },
  {
    number: '03',
    name: 'Vhennus Ventures',
    line: 'Backing people who solve meaningful problems.',
    to: '/vc',
  },
]

const principles = [
  {
    title: 'Long-term ownership',
    description:
      'We are interested in what a business can become, not only what it is today. Our horizon is measured in years, not quarters.',
  },
  {
    title: 'Complementary capability',
    description:
      'The most useful advantage is often another company. We look for ways businesses can share resources, knowledge, and access.',
  },
  {
    title: 'Capital as a tool',
    description:
      'Capital is not the objective. It is the means by which good businesses, capable people, and useful ideas can grow.',
  },
  {
    title: 'People and ideas',
    description:
      'Businesses are built by people. We invest in leadership, develop talent, and make room for ideas that deserve a serious test.',
  },
]

export default function AboutPage() {
  usePageMeta({
    title: 'About Vhennus — A global business ecosystem',
    description:
      'Vhennus is building a global business ecosystem across strategic ownership, a connected network, and support for ambitious ideas.',
    path: '/about',
  })

  return (
    <>
      <PageHero
        eyebrow="About Vhennus"
        title={
          <>
            A business group built around{' '}
            <span className="text-vh-sage-deep">lasting value.</span>
          </>
        }
        description={
          <p>
            Vhennus is building a global ecosystem that brings together capital, businesses,
            people, and ideas. Our ambition is a connected group of enterprises that create value
            beyond what any one part could achieve independently.
          </p>
        }
        image="/images/corporate/about-arches.webp"
        imageAlt="A sequence of pale architectural arches receding into the distance"
        caption="Structure with a long view."
        primary={{ label: 'Start a conversation', to: '/contact' }}
        secondary={{ label: 'Vhennus Capital', to: '/capital' }}
      />

      {/* What we are building */}
      <section className="border-b border-vh-line/60 bg-vh-ivory">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
            <div className="vh-reveal">
              <Eyebrow>01 — The ecosystem</Eyebrow>
              <h2 className="mt-7 max-w-[34rem] font-vh-display text-[clamp(2.5rem,4.4vw,4rem)] font-light leading-[1.03] tracking-[-0.03em] text-vh-forest">
                Three parts,
                <br />
                <span className="text-vh-sage-deep">one shared purpose.</span>
              </h2>
            </div>
            <p className="vh-reveal max-w-[32rem] text-[1rem] leading-[1.8] text-vh-muted lg:justify-self-end">
              Each part of Vhennus serves a distinct role. Together, they are intended to reinforce
              one another — creating more opportunity for businesses, people, and ideas.
            </p>
          </div>

          <div className="mt-14 border-t border-vh-line lg:mt-20">
            {parts.map((part, index) => (
              <Link
                key={part.to}
                to={part.to}
                className="vh-reveal group grid grid-cols-[2rem_1fr_auto] items-start gap-x-4 gap-y-2 border-b border-vh-line py-7 transition-colors duration-300 hover:bg-vh-paper sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-8 sm:px-4 lg:py-9"
                style={revealDelay(index * 80)}
              >
                <span className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-sage-deep">
                  {part.number}
                </span>
                <div>
                  <p className="font-vh-display text-[1.6rem] leading-tight tracking-[-0.015em] text-vh-forest lg:text-[1.9rem]">
                    {part.name}
                  </p>
                  <p className="mt-1 text-[13.5px] text-vh-muted">{part.line}</p>
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-5 w-5 text-vh-forest transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-vh-line/60 bg-vh-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
          <div className="vh-reveal max-w-[38rem]">
            <Eyebrow>02 — How we think</Eyebrow>
            <h2 className="mt-7 font-vh-display text-[clamp(2.5rem,4.4vw,4rem)] font-light leading-[1.03] tracking-[-0.03em] text-vh-forest">
              A consistent way of{' '}
              <span className="text-vh-sage-deep">looking at value.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:gap-y-14">
            {principles.map((principle, index) => (
              <article
                key={principle.title}
                className="vh-reveal border-t border-vh-line pt-5"
                style={revealDelay(index * 70)}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-vh-display text-[1.55rem] leading-tight tracking-[-0.015em] text-vh-forest">
                    {principle.title}
                  </h3>
                  <span className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-3 max-w-[31rem] text-[0.95rem] leading-[1.8] text-vh-muted">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Outlook */}
      <section className="bg-vh-forest text-vh-ivory">
        <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
            <div className="vh-reveal">
              <Eyebrow tone="light">03 — A global outlook</Eyebrow>
              <h2 className="mt-8 max-w-[40rem] font-vh-display text-[clamp(2.5rem,4.6vw,4.1rem)] font-light leading-[1.03] tracking-[-0.035em]">
                Good businesses
                <br />
                can become stronger
                <br />
                <span className="text-vh-sage">when they are part of</span>
                <br />
                <span className="text-vh-sage">something larger.</span>
              </h2>
            </div>
            <div className="vh-reveal max-w-[31rem] space-y-5 text-[0.98rem] leading-[1.85] text-vh-ivory/65 lg:justify-self-end">
              <p>
                We are open to opportunities in every market. Our interest is guided by the quality
                of the business, the capability of its people, and the value that can be created
                over time.
              </p>
              <p>
                Vhennus is at the beginning of building this ecosystem. The statements on this page
                describe our strategy and long-term intention, not a claim of completed activity.
              </p>
              <div className="pt-2">
                <ButtonLink to="/contact" variant="outline-light">
                  Contact Vhennus
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
