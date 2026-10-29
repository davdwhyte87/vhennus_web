import { Outlet } from 'react-router-dom'
import SiteHeader from '../features/corporate/components/SiteHeader'
import SiteFooter from '../features/corporate/components/SiteFooter'
import { useHashScroll, useRevealObserver } from '../features/corporate/hooks'

export default function CorporateLayout() {
  useRevealObserver()
  useHashScroll()

  return (
    <div className="vh-site min-h-screen bg-vh-ivory">
      <a
        href="#main-content"
        className="absolute left-4 top-3 z-[100] -translate-y-24 bg-vh-forest px-5 py-3 text-[11px] uppercase tracking-[0.14em] text-vh-ivory transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
