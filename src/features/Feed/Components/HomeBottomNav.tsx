import {
  AlignJustify,
  Home,
  MessageSquareText,
  MessagesSquare,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { route: '/home/feeds', label: 'Feed', icon: Home },
  { route: '/home/chats', label: 'Chat', icon: MessageSquareText },
  { route: '/home/groups', label: 'Groups', icon: MessagesSquare },
  { route: '/home/menu', label: 'Menu', icon: AlignJustify },
]

function HomeBottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const barClassName = [
    'fixed inset-x-0 bottom-0 z-40 border-t border-[#C9A86A]/60',
    'bg-white/95 backdrop-blur-md lg:hidden',
  ].join(' ')

  return (
    <>
      <nav className={barClassName}>
        <ul className="mx-auto flex h-20 max-w-md items-center justify-between px-6">
          {NAV_ITEMS.map(({ route, label, icon: Icon }) => {
            const isActive =
              location.pathname === route ||
              location.pathname.startsWith(`${route}/`)
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => navigate(route)}
                  className={[
                    'flex flex-col items-center gap-1 p-2 text-xs transition-colors',
                    isActive
                      ? 'font-semibold text-[#CC5A2A]'
                      : 'text-[#4d5666] hover:text-[#0A1931]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'grid h-10 w-10 place-items-center rounded-full transition-colors',
                      isActive
                        ? 'bg-[#0A1931] text-white'
                        : 'bg-[#0A1931]/5',
                    ].join(' ')}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </nav>

      <div className="h-24 lg:hidden" />
    </>
  )
}

export default HomeBottomNav
