import { Compass, MessageCircle, Users } from 'lucide-react'
import PageHero from '../components/PageHero'
import { ArrowLink, ButtonLink, Eyebrow, revealDelay } from '../components/ui'
import { usePageMeta } from '../seo'
import { useAuthStore } from '../../auth/useAuthStore'

const pillars = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'Exchange ideas',
    description:
      'Share perspectives, ask questions, and learn from people with different experiences and points of view.',
  },
  {
    icon: Users,
    number: '02',
    title: 'Develop relationships',
    description:
      'Build meaningful connections with individuals, professionals, and communities — not just contacts.',
  },
  {
    icon: Compass,
    number: '03',
    title: 'Discover opportunity',
    description:
      'Find collaborators, conversations, and possibilities that might not appear through a narrower network.',
  },
]

export default function NetworkPage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const joinHref = isLoggedIn ? '/social/feeds' : '/signup'

  usePageMeta({
    title: 'Vhennus Network — A network of people building a better-connected world',
    description:
      'Vhennus Network brings together individuals, professionals, and communities to exchange ideas, develop relationships, and discover opportunities.',
    path: '/social',
  })

  return (
    <>
      <PageHero
        eyebrow="Vhennus Network"
        titleClassName="text-[clamp(2.6rem,4.6vw,4.2rem)]"
        title={
          <>
            A network of people
            <br />
            building a
            <br />
            <span className="text-vh-sage-deep xl:whitespace-nowrap">
              better-connected world.
            </span>
          </>
        }
        description={
          <p>
            Vhennus Network brings together individuals, professionals, and communities in one
            place. It is a space to share ideas, develop meaningful relationships, and discover
            opportunities to collaborate.
          </p>
        }
        image="/images/corporate/network-community.webp"
        imageAlt="A group of people sitting together with their arms around one another, looking out over a valley"
        caption="People, professionals, and communities."
        primary={{ label: isLoggedIn ? 'Open the network' : 'Join the network', to: joinHref }}
        secondary={{ label: 'Member sign in', to: '/login' }}
      />

      {/* Pillars */}
      <section className="border-b border-vh-line/60 bg-vh-ivory">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
            <div className="vh-reveal">
              <Eyebrow>01 — What the network is for</Eyebrow>
              <h2 className="mt-7 max-w-[32rem] font-vh-display text-[clamp(2.5rem,4.4vw,4rem)] font-light leading-[1.03] tracking-[-0.03em] text-vh-forest">
                One network.
                <br />
                <span className="text-vh-sage-deep">Many kinds of connection.</span>
              </h2>
            </div>
            <p className="vh-reveal max-w-[32rem] text-[1rem] leading-[1.8] text-vh-muted lg:justify-self-end">
              Vhennus Network is built around the idea that people and businesses become stronger
              through the relationships between them.
            </p>
          </div>

          <div className="mt-14 grid gap-px border border-vh-line bg-vh-line md:grid-cols-3 lg:mt-20">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <article
                  key={pillar.title}
                  className="vh-reveal group bg-vh-ivory p-7 transition-colors duration-300 hover:bg-vh-paper sm:p-9"
                  style={revealDelay(index * 90)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-vh-mono text-[9px] uppercase tracking-[0.18em] text-vh-sage-deep">
                      {pillar.number}
                    </span>
                    <Icon
                      className="h-5 w-5 text-vh-sage-deep transition-colors duration-300 group-hover:text-vh-forest"
                      strokeWidth={1.25}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-14 font-vh-display text-[1.75rem] leading-tight tracking-[-0.015em] text-vh-forest sm:mt-20">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 max-w-[22rem] text-[0.94rem] leading-[1.75] text-vh-muted">
                    {pillar.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="border-b border-vh-line/60 bg-vh-paper">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20 lg:px-12 lg:py-32">
          <div className="vh-reveal order-2 lg:order-1">
            <Eyebrow>02 — A place to take part</Eyebrow>
            <h2 className="mt-7 max-w-[32rem] font-vh-display text-[clamp(2.5rem,4.4vw,4rem)] font-light leading-[1.03] tracking-[-0.03em] text-vh-forest">
              Built around people,{' '}
              <span className="text-vh-sage-deep">not just profiles.</span>
            </h2>
            <div className="mt-7 max-w-[34rem] space-y-5 text-[1rem] leading-[1.8] text-vh-muted">
              <p>
                Share ideas through conversations, join groups around shared interests, and build
                relationships that extend beyond a single exchange.
              </p>
              <p>
                The network is designed for people who want to contribute — with their experience,
                their curiosity, and their willingness to help something grow.
              </p>
            </div>

            <dl className="mt-10 grid gap-px border-y border-vh-line bg-vh-line sm:grid-cols-3">
              {[
                { term: 'Conversations', detail: 'Ideas and perspectives' },
                { term: 'Communities', detail: 'Shared interests' },
                { term: 'Relationships', detail: 'Longer-term connection' },
              ].map((item) => (
                <div key={item.term} className="bg-vh-paper px-4 py-4">
                  <dt className="font-vh-mono text-[9px] uppercase tracking-[0.16em] text-vh-sage-deep">
                    {item.term}
                  </dt>
                  <dd className="mt-2 text-[12.5px] leading-snug text-vh-forest">{item.detail}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-9">
              <ButtonLink to={joinHref} variant="solid">
                {isLoggedIn ? 'Open the network' : 'Join the network'}
              </ButtonLink>
            </div>
          </div>

          <figure className="vh-reveal order-1 aspect-[4/3] overflow-hidden bg-vh-line lg:order-2 lg:aspect-[4/5]">
            <img
              src="/images/corporate/network-meeting.webp"
              alt="People gathered around a table in conversation"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </figure>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-vh-forest text-vh-ivory">
        <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="vh-reveal grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
            <div>
              <Eyebrow tone="light">03 — An open network</Eyebrow>
              <h2 className="mt-8 max-w-[40rem] font-vh-display text-[clamp(2.6rem,4.6vw,4rem)] font-light leading-[1.02] tracking-[-0.035em]">
                The network is better
                <br />
                <span className="text-vh-sage">with you in it.</span>
              </h2>
            </div>
            <div className="lg:justify-self-end">
              <p className="max-w-[26rem] text-[0.98rem] leading-[1.85] text-vh-ivory/65">
                Join people who are building, thinking, and working on problems that matter.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink to={joinHref} variant="light">
                  {isLoggedIn ? 'Open the network' : 'Join the network'}
                </ButtonLink>
                <ArrowLink to="/contact" tone="light">
                  Contact Vhennus
                </ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
