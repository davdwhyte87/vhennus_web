import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Wordmark from './Wordmark'
import { primaryNav } from '../navigation'

export default function SiteHeader() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      menuButtonRef.current?.focus()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-vh-ivory/95 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
        scrolled || open
          ? 'border-vh-line shadow-[0_1px_24px_rgba(21,17,44,0.06)]'
          : 'border-vh-line/60'
      }`}
    >
      <div className="mx-auto flex h-[80px] max-w-[1440px] items-center gap-6 px-6 sm:px-8 lg:px-12">
        <Wordmark />

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-9 lg:flex">
          {primaryNav.map((item) => {
            const isActive =
              pathname === item.to || (item.to !== '/' && pathname.startsWith(`${item.to}/`))

            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-2 text-[14px] transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-vh-forest after:transition-transform after:duration-300 hover:text-vh-forest ${
                  isActive
                    ? 'text-vh-forest after:scale-x-100'
                    : 'text-vh-muted after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <Link
          to="/contact"
          className="group ml-auto hidden items-center gap-2.5 rounded-full bg-vh-forest px-6 py-3 text-[14px] text-vh-ivory transition-colors duration-300 hover:bg-vh-forest-deep md:inline-flex lg:ml-4"
        >
          Contact us
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="corporate-mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="ml-auto grid h-11 w-11 place-items-center text-vh-forest lg:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div
          id="corporate-mobile-menu"
          className="max-h-[calc(100dvh-80px)] overflow-y-auto border-t border-vh-line bg-vh-ivory lg:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-[1440px] px-6 py-6 sm:px-8">
            <ul className="divide-y divide-vh-line/70">
              {primaryNav.map((item, index) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between gap-4 py-5 text-vh-forest"
                  >
                    <span className="font-vh-display text-2xl tracking-[-0.01em]">{item.label}</span>
                    <span className="font-vh-mono text-[11px] tracking-[0.18em] text-vh-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-6 flex items-center justify-between rounded-full bg-vh-forest px-6 py-4 text-[14px] text-vh-ivory"
            >
              Contact us
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
