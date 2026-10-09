import {
  BarChart,
  Bell,
  Bitcoin,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Lock,
  LogOut,
  Medal,
  Settings,
  Shield,
  User,
  Users,
  Wallet,
} from 'lucide-react'
import type React from 'react'
import { useNavigate } from 'react-router-dom'
import AppCard from '../../../Shared/components/AppCard.tsx'
import PageHeader from '../../../Shared/components/PageHeader.tsx'

const MenuPage: React.FC = () => {
  const navigate = useNavigate()
  const logoutClassName = [
    'mt-6 flex w-full items-center justify-center gap-3',
    'border border-red-300 bg-white p-4 font-medium text-red-600',
    'transition-colors hover:bg-red-50',
  ].join(' ')

  return (
    <div className="min-h-screen">
      <div className="bg-[#0A1931] px-5 pb-8 pt-8 text-[#F5F5F0] sm:px-8">
        <h1 className="mt-2 font-serif text-[clamp(30px,5vw,44px)] tracking-tight">
          Menu
        </h1>
      </div>

      <main className="px-5 py-6 sm:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MenuItem
            text="Wallet"
            icon={Wallet}
            page="/wallet"
            description="Manage your balance"
          />
          <MenuItem
            text="Profile"
            icon={User}
            page="/myprofile"
            description="Edit your profile"
          />
          <MenuItem
            text="Membership"
            icon={Medal}
            page="/home/membership"
            description="Become a member"
          />
          <MenuItem
            text="Earnings"
            icon={Bitcoin}
            page="/earnings"
            description="View your income"
            disabled
            disabledReason="Coming to web soon"
          />
          <MenuItem
            text="Friends"
            icon={Users}
            page="/friends"
            description="Manage connections"
            disabled
          />
        </div>

        <div className="mt-6">
          <PageHeader title="Preferences" />
          <AppCard className="mt-3 p-0">
            <div className="divide-y divide-[#C9A86A]/40">
              <MenuLink
                text="Notifications"
                icon={Bell}
                page="/notifications"
                badge="3"
                disabled
                disabledReason="Coming soon."
              />
              <MenuLink
                text="Privacy & Security"
                icon={Shield}
                page="/privacy"
                disabled
              />
              <MenuLink
                text="Payment Methods"
                icon={CreditCard}
                page="/payments"
                disabled
              />
              <MenuLink
                text="Statistics"
                icon={BarChart}
                page="/stats"
                disabled
              />
            </div>
          </AppCard>
        </div>

        <div className="mt-6">
          <PageHeader title="Support" />
          <AppCard className="mt-3 p-0">
            <div className="divide-y divide-[#C9A86A]/40">
              <MenuLink
                text="Help Center"
                icon={HelpCircle}
                page="#"
                disabled
              />
              <MenuLink
                text="Settings"
                icon={Settings}
                page="#"
                disabled
              />
            </div>
          </AppCard>
        </div>

        <button
          type="button"
          onClick={() => navigate('/logout')}
          className={logoutClassName}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>

        <p className="py-6 text-center text-sm text-[#4d5666]">
          Version 2.4.1 • © 2025
        </p>
      </main>
    </div>
  )
}

interface MenuItemProps {
  text: string
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'>
  >
  page: string
  description?: string
  disabled?: boolean
  disabledReason?: string
}

const MenuItem: React.FC<MenuItemProps> = ({
  text,
  icon: Icon,
  page,
  description,
  disabled = false,
  disabledReason,
}) => {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) navigate(page)
      }}
      disabled={disabled}
      className={[
        'flex flex-col items-center gap-3 border border-[#C9A86A]/60 bg-white p-5 text-center transition-all',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'hover:border-[#CC5A2A] active:scale-[0.98]',
      ].join(' ')}
    >
      <span
        className={[
          'grid h-14 w-14 place-items-center',
          disabled ? 'bg-[#0A1931]/20 text-white' : 'bg-[#0A1931] text-[#C9A86A]',
        ].join(' ')}
      >
        <Icon className="h-7 w-7" />
      </span>
      <span>
        <span className="block font-medium text-[#0A1931]">{text}</span>
        {description && (
          <span className="mt-1 block text-sm text-[#4d5666]">
            {description}
          </span>
        )}
        {disabled && disabledReason && (
          <span className="mt-2 inline-block bg-[#C9A86A]/20 px-2 py-1 text-xs font-medium text-[#CC5A2A]">
            {disabledReason}
          </span>
        )}
      </span>
      {disabled && <Lock className="h-4 w-4 text-[#4d5666]" />}
    </button>
  )
}

interface MenuLinkProps {
  text: string
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'>
  >
  page: string
  badge?: string
  disabled?: boolean
  disabledReason?: string
}

const MenuLink: React.FC<MenuLinkProps> = ({
  text,
  icon: Icon,
  page,
  badge,
  disabled = false,
  disabledReason,
}) => {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) navigate(page)
      }}
      disabled={disabled}
      className={[
        'flex w-full items-center justify-between p-4 transition-colors',
        disabled ? 'cursor-not-allowed' : 'hover:bg-[#F5F5F0]',
      ].join(' ')}
    >
      <span className="flex items-center gap-3">
        <span
          className={[
            'grid h-9 w-9 place-items-center',
            disabled
              ? 'bg-[#0A1931]/5 text-[#4d5666]'
              : 'bg-[#0A1931] text-[#C9A86A]',
          ].join(' ')}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-left">
          <span
            className={[
              'block font-medium',
              disabled ? 'text-[#4d5666]' : 'text-[#0A1931]',
            ].join(' ')}
          >
            {text}
          </span>
          {disabled && disabledReason && (
            <span className="block text-xs font-medium text-[#CC5A2A]">
              {disabledReason}
            </span>
          )}
        </span>
      </span>

      <span className="flex items-center gap-2">
        {badge && !disabled && (
          <span className="bg-[#CC5A2A] px-2 py-0.5 text-xs font-medium text-white">
            {badge}
          </span>
        )}
        {disabled ? (
          <Lock className="h-4 w-4 text-[#4d5666]" />
        ) : (
          <ChevronRight className="h-4 w-4 text-[#4d5666]" />
        )}
      </span>
    </button>
  )
}

export default MenuPage
