import {
  AlignJustify,
  Home,
  MessageSquareText,
  MessagesSquare,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/useAuthStore.ts'
import { isAdminToken } from '../../features/membership/membershipUtils.ts'
import { useChatStore } from '../../features/chats/useChatStore.ts'
import { useGroupStore } from '../../features/groups/useGroupStore.ts'

const NAV_ITEMS = [
  { route: '/social/feeds', label: 'Feed', icon: Home },
  { route: '/social/chats', label: 'Chat', icon: MessageSquareText },
  { route: '/social/groups', label: 'Groups', icon: MessagesSquare },
  { route: '/social/wallet', label: 'Wallet', icon: Wallet, disabled: true },
  { route: '/social/myprofile', label: 'Profile', icon: User },
  { route: '/social/menu', label: 'Menu', icon: AlignJustify },
]

export default function AppSideNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const isAdmin = isAdminToken(token)
  const unreadTotal = useChatStore((s) => s.unreadTotal)
  const groupUnread = useGroupStore((s) => s.unreadTotal)
  const shellClassName = [
    'sticky top-0 hidden h-screen w-60 shrink-0 flex-col',
    'border-r border-[#C9A86A]/60 bg-[#0A1931] text-[#F5F5F0] lg:flex',
  ].join(' ')

  return (
    <aside className={shellClassName}>
      <button
        type="button"
        onClick={() => navigate('/social/feeds')}
        className="px-6 pb-6 pt-8 text-left"
      >
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#C9A86A]">
          Vhennus
        </p>
        <p className="mt-1 font-serif text-2xl tracking-tight">
          Build <em className="text-[#C9A86A]">together.</em>
        </p>
      </button>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ route, label, icon: Icon, disabled }) => {
          const isActive =
            location.pathname === route ||
            location.pathname.startsWith(`${route}/`)
          const showBadge =
            (route === '/social/chats' && unreadTotal > 0) ||
            (route === '/social/groups' && groupUnread > 0)
          const badgeCount = route === '/social/chats' ? unreadTotal : groupUnread
          return (
            <button
              key={route}
              type="button"
              onClick={() => {
                if (!disabled) navigate(route)
              }}
              disabled={disabled}
              title={disabled ? 'Coming soon' : label}
              className={[
                'flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] transition-colors',
                disabled
                  ? 'cursor-not-allowed opacity-50'
                  : isActive
                    ? 'bg-[#F5F5F0] font-medium text-[#0A1931]'
                    : 'text-[#d7dce4] hover:bg-white/10 hover:text-white',
              ].join(' ')}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {showBadge && (
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#CC5A2A] px-1 text-[11px] font-bold text-white">
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                )}
              </span>
              {label}
              {disabled && (
                <span className="ml-auto rounded-full bg-[#C9A86A]/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#C9A86A]">
                  Soon
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {isAdmin && (
        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={() => window.open('/admin', '_blank', 'noopener')}
            className="flex w-full items-center gap-3 border border-[#C9A86A]/60 px-4 py-3 text-left text-[15px] text-[#C9A86A] transition-colors hover:bg-white/10 hover:text-white"
          >
            <ShieldCheck className="h-5 w-5" />
            Admin
          </button>
        </div>
      )}

      <p className="px-6 py-6 font-mono text-[10px] uppercase tracking-[.14em] text-[#C9A86A]">
        One People, One Vision
      </p>
    </aside>
  )
}
