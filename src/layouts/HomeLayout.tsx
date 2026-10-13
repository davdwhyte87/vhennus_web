import { Outlet, useLocation } from 'react-router-dom'
import HomeBottomNav from '../features/Feed/Components/HomeBottomNav.tsx'
import AppSideNav from '../Shared/components/AppSideNav.tsx'
import GlobalCallBanner from '../features/groups/components/GlobalCallBanner.tsx'

const FULL_BLEED_PATTERNS = [
  /\/home\/groups\/[^/]+\/call\/?$/,
  /\/chat\/single_chat\//,
  /\/home\/groups\/[^/]+\/?$/,
]

/**
 * Conversation screens (1:1 chat, group chat, call page) manage their own
 * width + sticky chrome, so they render full-bleed. Everything else gets a
 * centered column that actually uses desktop space (5xl, not 3xl).
 * `/join` and `/settings` are forms — they stay in the capped column.
 */
function isFullBleed(pathname: string) {
  if (pathname.includes('/join') || pathname.includes('/settings')) return false
  return FULL_BLEED_PATTERNS.some((re) => re.test(pathname))
}

const HomeLayout: React.FC = () => {
  const { pathname } = useLocation()
  const fullBleed = isFullBleed(pathname)

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#0A1931]">
      <div className="flex min-h-screen w-full">
        <AppSideNav />

        <div className="min-w-0 flex-1">
          {fullBleed ? (
            <div className="w-full pb-8">
              <div className="px-4 sm:px-6">
                <GlobalCallBanner />
              </div>
              <Outlet />
            </div>
          ) : (
            <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
              <GlobalCallBanner />
              <Outlet />
            </div>
          )}
          <HomeBottomNav />
        </div>
      </div>
    </div>
  )
}

export default HomeLayout
