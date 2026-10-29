import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import ContactEmail from '../components/ContactEmail'
import { Eyebrow, revealDelay } from '../components/ui'
import { usePageMeta } from '../seo'

const industries = [
  {
    title: 'Technology and Digital',
    description: 'Software, digital services, and technology-enabled businesses.',
    image: '/images/corporate/industry-technology.webp',
    alt: 'A laptop showing software code on a clean desk',
  },
  {
    title: 'Manufacturing',
    description: 'Businesses producing essential goods and industrial products.',
    image: '/images/corporate/industry-manufacturing.webp',
    alt: 'A craftsperson working with metal, with sparks in the foreground',
  },
  {
    title: 'Hospitality',
    description: 'Hotels and service businesses with opportunities to improve and grow.',
    image: '/images/corporate/industry-hospitality.webp',
    alt: 'A white hotel building with a calm pool in the foreground',
  },
  {
    title: 'Agriculture',
    description: 'Businesses supporting food production and agricultural value chains.',
    image: '/images/corporate/industry-agriculture.webp',
    alt: 'A golden field at sunrise',
  },
]

const capabilities = [
  {
    title: 'Strategic direction',
    description:
      'Identifying opportunities, competitive advantages, and sustainable growth strategies.',
  },
  {
    title: 'Operational improvement',
    description: 'Strengthening processes, efficiency, and profitability.',
  },
  {
    title: 'Leadership and talent',
    description:
      'Building effective management teams and placing the right people in the right roles.',
  },
  {
    title: 'Business development',
    description: 'Identifying new markets, partnerships, and commercial opportunities.',
  },
  {
    title: 'Ecosystem synergies',
    description:
      'Helping complementary businesses share capabilities and create additional value for customers.',
  },
]

export default function CapitalPage() {
  usePageMeta({
    title: 'Vhennus Capital — We acquire businesses. We build their future.',
    description:
      'Vhennus Capital acquires businesses, strengthens their foundations, and helps them grow through strategic ownership, operational improvement, and collaboration.',
    path: '/capital',
  })

  return (
    <>
      <PageHero
        eyebrow="Vhennus Capital"
        title={
          <>
            We acquire businesses.{' '}
            <span className="text-vh-sage-deep">We build their future.</span>
          </>
        }
        description={
          <p>
            We acquire businesses, strengthen their foundations, and help them grow. Through
            strategic ownership and collaboration, we aim to build a connected ecosystem of
            companies that create lasting value.
          </p>
        }
        image="/images/corporate/capital-hero.webp"
        imageAlt="A warm, contemporary meeting room with large windows and natural light"
        caption="Strategic ownership. Considered execution."
        primary={{ label: 'Discuss an acquisition', to: '#inquiry' }}
        secondary={{ label: 'Our investment approach', to: '#approach' }}
      />

      {/* Why we buy */}
      <section id="approach" className="border-b border-vh-line/60 bg-vh-ivory">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-12 lg:py-32">
          <div className="vh-reveal self-start lg:sticky lg:top-28">
            <Eyebrow>01 — Our approach</Eyebrow>
            <h2 className="mt-7 max-w-[26rem] font-vh-display text-[clamp(2.5rem,4.2vw,3.9rem)] font-light leading-[1.04] tracking-[-0.03em] text-vh-forest">
              We buy to build,{' '}
              <span className="text-vh-sage-deep">not simply to sell.</span>
            </h2>
          </div>

          <div className="vh-reveal">
            <div className="max-w-[38rem] space-y-6 text-[1rem] leading-[1.85] text-vh-muted">
              <p>
                We don’t acquire companies solely to sell them to another buyer. We acquire
                businesses to develop them, grow their capabilities, and create lasting value.
              </p>
              <p>
                Our approach is built around long-term ownership and the opportunities that emerge
                when complementary businesses work together. We look for ways our companies can
                share resources, strengthen their offerings, and reach new customers.
              </p>
              <p>
                We are not opposed to selling a business when it makes strategic sense. However,
                selling is not the defining objective of our approach. Our focus is on building
                stronger businesses and a more valuable ecosystem over time.
              </p>
            </div>

            <blockquote className="mt-10 max-w-[34rem] border-l border-vh-sage-deep pl-6">
              <p className="font-vh-display text-[1.55rem] leading-[1.45] text-vh-forest">
                “Selling is not the defining objective. Building stronger businesses is.”
              </p>
              <footer className="mt-3 font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-sage-deep">
                The Vhennus Capital approach
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="border-b border-vh-line/60 bg-vh-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
            <div className="vh-reveal">
              <Eyebrow>02 — Where we look</Eyebrow>
              <h2 className="mt-7 max-w-[34rem] font-vh-display text-[clamp(2.5rem,4.4vw,4rem)] font-light leading-[1.03] tracking-[-0.03em] text-vh-forest">
                Opportunity exists{' '}
                <span className="text-vh-sage-deep">across industries.</span>
              </h2>
            </div>
            <div className="vh-reveal max-w-[32rem] lg:justify-self-end">
              <p className="text-[1rem] leading-[1.8] text-vh-muted">
                We consider businesses across a broad range of industries, focusing on their
                potential to become stronger, more competitive, and more valuable under strategic
                ownership.
              </p>
              <p className="mt-4 font-vh-mono text-[9px] uppercase leading-[1.9] tracking-[0.16em] text-vh-sage-deep">
                Industry focus, not a statement of current holdings
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:gap-x-10 lg:gap-y-14">
            {industries.map((industry, index) => (
              <article
                key={industry.title}
                className="vh-reveal group"
                style={revealDelay(index * 90)}
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-vh-line">
                  <img
                    src={industry.image}
                    alt={industry.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-vh-line pt-4">
                  <h3 className="font-vh-display text-[1.55rem] leading-tight tracking-[-0.015em] text-vh-forest">
                    {industry.title}
                  </h3>
                  <span className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-2 max-w-[28rem] text-[0.94rem] leading-[1.7] text-vh-muted">
                  {industry.description}
                </p>
              </article>
            ))}
          </div>

          <div className="vh-reveal mt-14 flex flex-col gap-5 border-t border-vh-line pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
            <p className="max-w-[38rem] text-[14px] leading-[1.7] text-vh-muted">
              Vhennus is open to opportunities beyond these sectors. If a business has strong
              foundations and room to grow, we are interested in the conversation.
            </p>
            <Link
              to="#inquiry"
              className="group inline-flex shrink-0 items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-vh-forest"
            >
              <span className="vh-underline">Tell us about your business</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-b border-vh-line/60 bg-vh-ivory">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-end lg:gap-16">
            <div className="vh-reveal">
              <Eyebrow>03 — What we bring</Eyebrow>
              <h2 className="mt-7 max-w-[38rem] font-vh-display text-[clamp(2.5rem,4.4vw,4rem)] font-light leading-[1.03] tracking-[-0.03em] text-vh-forest">
                Strategy is where we start.{' '}
                <span className="text-vh-sage-deep">
                  Execution is what makes it count.
                </span>
              </h2>
            </div>
            <p className="vh-reveal max-w-[31rem] text-[1rem] leading-[1.8] text-vh-muted lg:justify-self-end">
              We believe businesses can often achieve more with the right strategy, leadership, and
              operating structure.
            </p>
          </div>

          <ol className="mt-14 border-t border-vh-line lg:mt-20">
            {capabilities.map((capability, index) => (
              <li
                key={capability.title}
                className="vh-reveal group grid gap-3 border-b border-vh-line py-6 transition-colors duration-300 hover:bg-vh-paper sm:grid-cols-[3rem_1fr_1.5fr] sm:items-baseline sm:gap-8 sm:px-4 lg:py-7"
                style={revealDelay(index * 60)}
              >
                <span className="font-vh-mono text-[10px] tracking-[0.18em] text-vh-sage-deep">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-vh-display text-[1.55rem] leading-tight tracking-[-0.015em] text-vh-forest">
                  {capability.title}
                </h3>
                <p className="max-w-[30rem] text-[0.95rem] leading-[1.7] text-vh-muted">
                  {capability.description}
                </p>
              </li>
            ))}
          </ol>

          <p className="vh-reveal mt-10 max-w-[40rem] font-vh-display text-[1.5rem] leading-[1.5] text-vh-forest lg:mt-14 lg:text-[1.8rem]">
            Our objective is to build resilient, profitable enterprises with the foundations to grow
            over the long term.
          </p>
        </div>
      </section>

      {/* Global */}
      <section className="relative overflow-hidden bg-vh-forest text-vh-ivory">
        <img
          src="/images/corporate/capital-global.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-vh-forest via-vh-forest/90 to-vh-forest/60"
        />
        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-6 py-24 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:items-end lg:gap-20 lg:px-12 lg:py-36">
          <div className="vh-reveal">
            <Eyebrow tone="light">04 — Global capital allocation</Eyebrow>
            <h2 className="mt-8 max-w-[30rem] font-vh-display text-[clamp(2.7rem,5.2vw,4.8rem)] font-light leading-[1.02] tracking-[-0.035em]">
              Building businesses{' '}
              <span className="text-vh-sage">without borders.</span>
            </h2>
          </div>
          <div className="vh-reveal max-w-[32rem] space-y-5 text-[0.98rem] leading-[1.85] text-vh-ivory/65 lg:justify-self-end">
            <p>
              We seek opportunities across markets and industries, guided by the potential of each
              business and the value we can create.
            </p>
            <p>
              Our vision is to build a global portfolio of companies that can learn from one
              another, collaborate across markets, and deliver better products and services to
              people around the world.
            </p>
            <p className="font-vh-display text-[1.35rem] leading-[1.5] text-vh-sage">
              We believe good businesses can become even stronger when they are part of something
              larger.
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section id="inquiry" className="bg-vh-paper">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12 lg:py-32">
          <div className="vh-reveal">
            <Eyebrow>05 — Business owner inquiry</Eyebrow>
            <h2 className="mt-7 max-w-[24rem] font-vh-display text-[clamp(2.5rem,4.2vw,3.9rem)] font-light leading-[1.03] tracking-[-0.03em] text-vh-forest">
              Have a business{' '}
              <span className="text-vh-sage-deep">worth building?</span>
            </h2>
            <p className="mt-7 max-w-[30rem] text-[1rem] leading-[1.8] text-vh-muted">
              We welcome conversations with business owners, founders, and partners who share our
              interest in building enduring enterprises.
            </p>

            <div className="mt-10 border-t border-vh-line pt-6">
              <p className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-sage-deep">
                A first conversation
              </p>
              <p className="mt-3 max-w-[28rem] text-[13.5px] leading-[1.75] text-vh-muted">
                Share a short description of your business and what you are considering. Please
                avoid confidential information in this first message.
              </p>
            </div>

            <p className="mt-8 max-w-[28rem] text-[12px] leading-[1.7] text-vh-muted">
              Vhennus does not publish acquisition criteria, deal timelines, or investment
              commitments. Every conversation begins with understanding the business.
            </p>
          </div>

          <div className="vh-reveal">
            <ContactEmail eyebrow="Write to us" />
          </div>
        </div>
      </section>
    </>
  )
}
