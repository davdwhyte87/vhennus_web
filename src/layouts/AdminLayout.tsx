import { useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  ClipboardList,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MessagesSquare,
  Users,
  X,
} from 'lucide-react'
import { useAuthStore } from '../features/auth/useAuthStore.ts'
import { isAdminToken } from '../features/membership/membershipUtils.ts'

interface NavChild {
  route: string
  label: string
}

interface NavEntry {
  route: string
  label: string
  icon: typeof Home
  children?: NavChild[]
}

const NAV_ITEMS: NavEntry[] = [
  { route: '/admin', label: 'Home', icon: Home },
  { route: '/admin/requests', label: 'Membership Requests', icon: ClipboardList },
  { route: '/admin/questions', label: 'Questions', icon: HelpCircle },
  {
    route: '/admin/groups',
    label: 'Groups',
    icon: MessagesSquare,
    children: [
      { route: '/admin/groups', label: 'View groups' },
      { route: '/admin/groups/categories', label: 'Categories' },
    ],
  },
  { route: '/admin/users', label: 'Users', icon: Users },
]

function isEntryActive(pathname: string, route: string) {
  return route === '/admin'
    ? pathname === route
    : pathname === route || pathname.startsWith(`${route}/`)
}

const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const [menuOpen, setMenuOpen] = useState(false)

  if (!isAdminToken(token)) {
    return <Navigate to="/home/feeds" replace />
  }

  const go = (route: string) => {
    setMenuOpen(false)
    navigate(route)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#0A1931]">
      <div className="flex min-h-screen w-full">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-[#C9A86A]/60 bg-[#0A1931] text-[#F5F5F0] lg:flex">
          <div className="px-6 pb-6 pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#C9A86A]">
              Vhennus Admin
            </p>
            <p className="mt-1 font-serif text-2xl tracking-tight">
              Dashboard
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {NAV_ITEMS.map((entry) => (
              <AdminNavItem key={entry.route + entry.label} entry={entry} onNavigate={(r) => navigate(r)} />
            ))}
          </nav>

          <button
            type="button"
            onClick={() => navigate('/logout')}
            className="mx-3 mb-6 flex items-center gap-3 px-4 py-3 text-left text-[15px] text-[#d7dce4] transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <nav className="sticky top-0 z-40 border-b border-[#C9A86A]/60 bg-[#0A1931] text-[#F5F5F0] lg:hidden">
            <div className="flex items-center gap-2 px-2 py-3">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
                className="grid place-items-center p-2 text-[#F5F5F0] hover:text-[#C9A86A]"
              >
                <Menu className="h-6 w-6" />
              </button>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#C9A86A]">
                Vhennus Admin
              </p>
            </div>
          </nav>
          {menuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMenuOpen(false)}
              />
              <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-[#0A1931] text-[#F5F5F0]">
                <div className="flex items-center justify-between px-4 pb-4 pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#C9A86A]">
                    Vhennus Admin
                  </p>
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                    className="grid place-items-center p-2 text-[#F5F5F0] hover:text-[#C9A86A]"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex-1 space-y-1 px-3">
                {NAV_ITEMS.map((entry) => (
                  <AdminNavItem key={entry.route + entry.label} entry={entry} onNavigate={go} />
                ))}
                </nav>
                <button
                  type="button"
                  onClick={() => go('/logout')}
                  className="mx-3 mb-6 flex items-center gap-3 px-4 py-3 text-left text-[15px] text-[#d7dce4] transition-colors hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </aside>
            </div>
          )}
          <div className="mx-auto w-full max-w-4xl px-5 pb-8 pt-6 sm:px-8 lg:px-12">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminNavItem({ entry, onNavigate }: { entry: NavEntry; onNavigate: (route: string) => void }) {
  const location = useLocation()
  // null = auto (expand when a child route is active); otherwise the user's explicit choice wins.
  const [manualOpen, setManualOpen] = useState<boolean | null>(null)
  const { route, label, icon: Icon, children } = entry
  const active = isEntryActive(location.pathname, route)
  const expanded = manualOpen ?? active

  const baseClass = [
    'flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] transition-colors',
    active
      ? 'bg-[#F5F5F0] font-medium text-[#0A1931]'
      : 'text-[#d7dce4] hover:bg-white/10 hover:text-white',
  ].join(' ')

  if (!children || children.length === 0) {
    return (
      <button type="button" onClick={() => onNavigate(route)} className={baseClass}>
        <Icon className="h-5 w-5" />
        {label}
      </button>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          const next = !expanded
          setManualOpen(next)
          // Opening from elsewhere also lands on the parent page; closing never navigates away.
          if (next && !active) onNavigate(route)
        }}
        aria-expanded={expanded}
        className={baseClass}
      >
        <Icon className="h-5 w-5" />
        <span className="flex-1">{label}</span>
        <ChevronDown className={['h-4 w-4 transition-transform', expanded ? 'rotate-180' : ''].join(' ')} />
      </button>
      {expanded && (
        <div className="ml-9 space-y-0.5 border-l border-[#C9A86A]/40 py-1 pl-3">
          {children.map((child) => {
            const childActive = location.pathname === child.route
            return (
              <button
                key={child.route}
                type="button"
                onClick={() => onNavigate(child.route)}
                className={[
                  'block w-full px-2 py-2 text-left text-sm transition-colors',
                  childActive ? 'font-semibold text-[#C9A86A]' : 'text-[#d7dce4] hover:text-white',
                ].join(' ')}
              >
                {child.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminLayout
