import ContactEmail from '../components/ContactEmail'
import PageHero from '../components/PageHero'
import { ArrowLink, Eyebrow, revealDelay } from '../components/ui'
import { usePageMeta } from '../seo'

const principles = [
  {
    number: '01',
    title: 'People first',
    description:
      'Ideas matter, but the person behind them matters more. We are interested in how you think, what you have learned, and why this problem is yours to solve.',
  },
  {
    number: '02',
    title: 'Problems worth solving',
    description:
      'We are drawn to difficult problems that affect real people and industries — work that requires persistence, judgement, and a willingness to challenge assumptions.',
  },
  {
    number: '03',
    title: 'A long view',
    description:
      'Meaningful progress rarely happens quickly. We take a patient view of what it takes to turn a promising idea into something practical and durable.',
  },
]

export default function VenturesPage() {
  usePageMeta({
    title: 'Vhennus Ventures — Backing people who solve meaningful problems',
    description:
      'Vhennus Ventures supports promising ideas and ambitious individuals working on difficult problems, helping turn bold thinking into practical solutions.',
    path: '/vc',
  })

  return (
    <>
      <PageHero
        eyebrow="Vhennus Ventures"
        title={
          <>
            Backing people who solve{' '}
            <span className="text-vh-sage-deep">meaningful problems.</span>
          </>
        }
        description={
          <p>
            Innovation begins with people willing to challenge existing assumptions. Vhennus
            Ventures supports promising ideas and ambitious individuals working on difficult
            problems, helping turn bold thinking into practical solutions.
          </p>
        }
        image="/images/corporate/ventures-workshop.webp"
        imageAlt="An engineer working carefully on a technical system in a workshop"
        caption="Ideas, tested against reality."
        primary={{ label: 'Submit an idea', to: '#submit' }}
        secondary={{ label: 'Our approach', to: '#approach' }}
      />

      {/* Principles */}
      <section id="approach" className="border-b border-vh-line/60 bg-vh-ivory">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
            <div className="vh-reveal">
              <Eyebrow>01 — What we look for</Eyebrow>
              <h2 className="mt-7 max-w-[40rem] font-vh-display text-[clamp(2.5rem,4.4vw,4rem)] font-light leading-[1.03] tracking-[-0.03em] text-vh-forest">
                People first.
                <br />
                <span className="text-vh-sage-deep">Problems worth solving.</span>
              </h2>
            </div>
            <p className="vh-reveal max-w-[32rem] text-[1rem] leading-[1.8] text-vh-muted lg:justify-self-end">
              We do not begin with a fixed list of sectors or a template for every idea. We begin
              with the quality of the thinking and the person doing the work.
            </p>
          </div>

          <div className="mt-14 grid gap-px border border-vh-line bg-vh-line md:grid-cols-3 lg:mt-20">
            {principles.map((principle, index) => (
              <article
                key={principle.title}
                className="vh-reveal bg-vh-ivory p-7 transition-colors duration-300 hover:bg-vh-paper sm:p-9"
                style={revealDelay(index * 90)}
              >
                <span className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-sage-deep">
                  {principle.number}
                </span>
                <h3 className="mt-12 font-vh-display text-[1.75rem] leading-tight tracking-[-0.015em] text-vh-forest sm:mt-16">
                  {principle.title}
                </h3>
                <p className="mt-3 max-w-[22rem] text-[0.94rem] leading-[1.75] text-vh-muted">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="relative overflow-hidden border-b border-vh-line/60 bg-vh-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
          <div className="vh-reveal mx-auto max-w-[54rem] text-center">
            <Eyebrow className="justify-center">02 — The work itself</Eyebrow>
            <p className="mt-8 font-vh-display text-[clamp(2rem,3.8vw,3.4rem)] font-light leading-[1.22] tracking-[-0.025em] text-vh-forest text-balance">
              Ideas become meaningful when they reach the people who need them.{' '}
              <span className="text-vh-sage-deep">
                We are interested in the distance between the two.
              </span>
            </p>
            <p className="mx-auto mt-7 max-w-[36rem] text-[1rem] leading-[1.8] text-vh-muted">
              Whether you are at the beginning of an idea or already testing something in the world,
              a clear account of the problem and your approach is the best place to start.
            </p>
          </div>
        </div>
      </section>

      {/* Submit */}
      <section id="submit" className="bg-vh-ivory">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12 lg:py-32">
          <div className="vh-reveal">
            <Eyebrow>03 — Submit an idea</Eyebrow>
            <h2 className="mt-7 max-w-[22rem] font-vh-display text-[clamp(2.5rem,4.2vw,3.9rem)] font-light leading-[1.03] tracking-[-0.03em] text-vh-forest">
              Start with{' '}
              <span className="text-vh-sage-deep">the idea.</span>
            </h2>
            <p className="mt-7 max-w-[30rem] text-[1rem] leading-[1.8] text-vh-muted">
              Tell us what you are working on, the problem you are addressing, and what you have
              learned so far. A short introduction is enough.
            </p>

            <div className="mt-10 border-t border-vh-line pt-6">
              <p className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-sage-deep">
                An introduction, not an application
              </p>
              <p className="mt-3 max-w-[28rem] text-[13.5px] leading-[1.75] text-vh-muted">
                Vhennus Ventures does not publish funding amounts, application timelines, or
                investment commitments. An email is a way to begin a conversation, not a promise of
                support.
              </p>
            </div>

            <div className="mt-8">
              <ArrowLink to="/contact">General enquiries</ArrowLink>
            </div>
          </div>

          <div className="vh-reveal">
            <ContactEmail eyebrow="Write to us" />
          </div>
        </div>
      </section>
    </>
  )
}
