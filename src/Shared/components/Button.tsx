import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const SIZE_STYLES = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-[15px]',
  lg: 'px-5 py-3.5 text-[15px]',
}

const VARIANT_STYLES = {
  primary: 'bg-[#0A1931] text-white hover:bg-[#CC5A2A] focus:ring-[#CC5A2A]',
  secondary: [
    'border border-[#0A1931] bg-transparent text-[#0A1931]',
    'hover:border-[#CC5A2A] hover:text-[#CC5A2A] focus:ring-[#CC5A2A]',
  ].join(' '),
  outline:
    'border border-[#C9A86A] bg-white text-[#0A1931] hover:border-[#CC5A2A] hover:text-[#CC5A2A] focus:ring-[#C9A86A]',
  ghost: 'bg-transparent text-[#0A1931] hover:bg-[#0A1931]/5 focus:ring-[#C9A86A]',
}

const AppButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  className = '',
}) => {
  const isDisabled = disabled || loading
  const buttonClassName = [
    'inline-flex items-center justify-center gap-2',
    'rounded-none font-medium transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-60',
    SIZE_STYLES[size],
    VARIANT_STYLES[variant],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ')

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={buttonClassName}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  )
}

export default AppButton
