import type { ReactNode } from 'react'

interface AppCardProps {
  children: ReactNode
  className?: string
}

export default function AppCard({ children, className = '' }: AppCardProps) {
  return (
    <div
      className={[
        'border border-[#C9A86A]/60 bg-white',
        'rounded-none p-5 sm:p-6',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
