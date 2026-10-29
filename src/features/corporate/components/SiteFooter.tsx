import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Wordmark from './Wordmark'
import { companyNav, ecosystemNav } from '../navigation'

const enquiryLinks = [
  { label: 'Discuss an acquisition', to: '/capital#inquiry' },
  { label: 'Submit an idea', to: '/vc#submit' },
  { label: 'Join the network', to: '/signup' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-vh-line bg-vh-ivory text-vh-forest">
      <div className="mx-auto max-w-[1440px] px-6 pb-8 pt-16 sm:px-8 lg:px-12 lg:pb-10 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_0.9fr_0.9fr] lg:gap-16">
          <div className="max-w-[26rem]">
            <Wordmark />
            <p className="mt-7 font-vh-display text-[1.6rem] leading-[1.35] text-vh-forest">
              Capital, people, and ideas — connected to build lasting value.
            </p>
            <p className="mt-5 text-[14px] leading-[1.75] text-vh-muted">
              Vhennus is a global business ecosystem that acquires and develops companies,
              connects people, and supports ambitious ideas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16 lg:grid-cols-2">
            <div>
              <p className="font-vh-mono text-[11px] uppercase tracking-[0.2em] text-vh-sage-deep">
                Ecosystem
              </p>
              <ul className="mt-5 space-y-3.5">
                {ecosystemNav.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="vh-underline text-[14px] text-vh-muted transition-colors hover:text-vh-forest"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-vh-mono text-[11px] uppercase tracking-[0.2em] text-vh-sage-deep">
                Company
              </p>
              <ul className="mt-5 space-y-3.5">
                {companyNav.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="vh-underline text-[14px] text-vh-muted transition-colors hover:text-vh-forest"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="font-vh-mono text-[11px] uppercase tracking-[0.2em] text-vh-sage-deep">
              Enquiries
            </p>
            <a
              href="mailto:team@vhennus.org"
              className="mt-5 inline-block text-[1.35rem] leading-tight tracking-[-0.01em] text-vh-forest"
            >
              <span className="vh-underline">team@vhennus.org</span>
            </a>
            <ul className="mt-5 space-y-3.5">
              {enquiryLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-2 text-[14px] text-vh-muted transition-colors hover:text-vh-forest"
                  >
                    {item.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-vh-line pt-6 text-[11px] uppercase tracking-[0.14em] text-vh-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vhennus. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-vh-forest">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-vh-forest">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
