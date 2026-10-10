import {
  AlignJustify,
  Home,
  MessageSquareText,
  MessagesSquare,
  ShieldCheck,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/useAuthStore.ts'
import { isAdminToken } from '../../membership/membershipUtils.ts'
import { useChatStore } from '../../chats/useChatStore.ts'
import { useGroupStore } from '../../groups/useGroupStore.ts'

const NAV_ITEMS: {
  route: string
  label: string
  icon: typeof Home
  external?: boolean
}[] = [
  { route: '/home/feeds', label: 'Feed', icon: Home },
  { route: '/home/chats', label: 'Chat', icon: MessageSquareText },
  { route: '/home/groups', label: 'Groups', icon: MessagesSquare },
  { route: '/home/menu', label: 'Menu', icon: AlignJustify },
]

function HomeBottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const unreadTotal = useChatStore((s) => s.unreadTotal)
  const groupUnread = useGroupStore((s) => s.unreadTotal)
  const items = isAdminToken(token)
    ? [
        ...NAV_ITEMS,
        { route: '/admin', label: 'Admin', icon: ShieldCheck, external: true },
      ]
    : NAV_ITEMS
  const barClassName = [
    'fixed inset-x-0 bottom-0 z-40 border-t border-[#C9A86A]/60',
    'bg-white/95 backdrop-blur-md lg:hidden',
  ].join(' ')

  return (
    <>
      <nav className={barClassName}>
        <ul className="mx-auto flex h-20 max-w-md items-center justify-between px-6">
          {items.map(({ route, label, icon: Icon, external }) => {
            const isActive =
              location.pathname === route ||
              location.pathname.startsWith(`${route}/`)
            const showBadge =
              (route === '/home/chats' && unreadTotal > 0) ||
              (route === '/home/groups' && groupUnread > 0)
            const badgeCount = route === '/home/chats' ? unreadTotal : groupUnread
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() =>
                    external
                      ? window.open(route, '_blank', 'noopener')
                      : navigate(route)
                  }
                  className={[
                    'flex flex-col items-center gap-1 p-2 text-xs transition-colors',
                    isActive
                      ? 'font-semibold text-[#CC5A2A]'
                      : 'text-[#4d5666] hover:text-[#0A1931]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'relative grid h-10 w-10 place-items-center rounded-full transition-colors',
                      isActive
                        ? 'bg-[#0A1931] text-white'
                        : 'bg-[#0A1931]/5',
                    ].join(' ')}
                  >
                    <Icon className="h-5 w-5" />
                    {showBadge && (
                      <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#CC5A2A] px-1 text-[11px] font-bold text-white">
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </span>
                    )}
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
