import { useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  Users,
  X,
} from 'lucide-react'
import { useAuthStore } from '../features/auth/useAuthStore.ts'
import { isAdminToken } from '../features/membership/membershipUtils.ts'

const NAV_ITEMS = [
  { route: '/admin', label: 'Home', icon: Home },
  { route: '/admin/requests', label: 'Membership Requests', icon: ClipboardList },
  { route: '/admin/questions', label: 'Questions', icon: HelpCircle },
  { route: '/admin/users', label: 'Users', icon: Users },
]

const AdminLayout: React.FC = () => {
  const location = useLocation()
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
            {NAV_ITEMS.map(({ route, label, icon: Icon }) => {
              const isActive =
                route === '/admin'
                  ? location.pathname === route
                  : location.pathname === route ||
                    location.pathname.startsWith(`${route}/`)
              return (
                <button
                  key={route}
                  type="button"
                  onClick={() => navigate(route)}
                  className={[
                    'flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] transition-colors',
                    isActive
                      ? 'bg-[#F5F5F0] font-medium text-[#0A1931]'
                      : 'text-[#d7dce4] hover:bg-white/10 hover:text-white',
                  ].join(' ')}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              )
            })}
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
                {NAV_ITEMS.map(({ route, label, icon: Icon }) => {
                  const isActive =
                    route === '/admin'
                      ? location.pathname === route
                      : location.pathname === route ||
                        location.pathname.startsWith(`${route}/`)
                  return (
                    <button
                      key={route}
                      type="button"
                      onClick={() => go(route)}
                      className={[
                        'flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] transition-colors',
                        isActive
                          ? 'bg-[#F5F5F0] font-medium text-[#0A1931]'
                          : 'text-[#d7dce4] hover:bg-white/10 hover:text-white',
                      ].join(' ')}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </button>
                  )
                })}
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

export default AdminLayout
