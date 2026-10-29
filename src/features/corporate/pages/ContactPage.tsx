import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ContactEmail from '../components/ContactEmail'
import { Eyebrow } from '../components/ui'
import { usePageMeta } from '../seo'

const routes = [
  {
    label: 'Business owners',
    description: 'Discuss an acquisition or a partnership.',
    to: '/capital#inquiry',
  },
  {
    label: 'Founders and creators',
    description: 'Introduce an idea you are working on.',
    to: '/vc#submit',
  },
  {
    label: 'Network members',
    description: 'Join the Vhennus Network community.',
    to: '/social',
  },
]

export default function ContactPage() {
  usePageMeta({
    title: 'Contact Vhennus — Start a conversation',
    description:
      'Contact Vhennus about acquisitions, partnerships, the Vhennus Network, or an idea you are working on.',
    path: '/contact',
  })

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Start a <span className="text-vh-sage-deep">conversation.</span>
          </>
        }
        description={
          <p>
            Whether you are considering a sale, exploring a partnership, or working on an idea that
            deserves a serious conversation, we would like to hear from you.
          </p>
        }
        image="/images/corporate/contact-architecture.webp"
        imageAlt="Tall modern buildings seen from street level against a pale sky"
        caption="A considered first exchange."
        primary={{ label: 'Email us', to: '#email' }}
      />

      <section id="email" className="bg-vh-paper">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-12 lg:py-32">
          <div className="vh-reveal">
            <Eyebrow>Choose a route</Eyebrow>
            <h2 className="mt-7 max-w-[22rem] font-vh-display text-[clamp(2.4rem,4vw,3.6rem)] font-light leading-[1.04] tracking-[-0.03em] text-vh-forest">
              The right conversation{' '}
              <span className="text-vh-sage-deep">starts in the right place.</span>
            </h2>
            <p className="mt-6 max-w-[28rem] text-[0.98rem] leading-[1.8] text-vh-muted">
              Write to us directly. If you are contacting us about a specific part of Vhennus, the
              routes below will take you to the relevant introduction.
            </p>

            <div className="mt-10 border-t border-vh-line">
              {routes.map((route) => (
                <Link
                  key={route.to}
                  to={route.to}
                  className="group flex items-start justify-between gap-6 border-b border-vh-line py-5"
                >
                  <div>
                    <p className="text-[13.5px] font-medium text-vh-forest">{route.label}</p>
                    <p className="mt-1 text-[12.5px] leading-[1.6] text-vh-muted">
                      {route.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-vh-forest transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="vh-reveal self-center">
            <ContactEmail eyebrow="Write to us" />
          </div>
        </div>
      </section>
    </>
  )
}
