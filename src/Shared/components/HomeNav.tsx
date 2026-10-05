import { useState } from 'react'
import { Bell } from 'lucide-react'

const HomeNav: React.FC = () => {
  const [notifications] = useState(3)

  return (
    <nav className="sticky top-0 z-40 border-b border-[#C9A86A]/60 bg-[#F5F5F0]/95 backdrop-blur-md">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center bg-[#0A1931]">
              <span className="text-xl font-bold text-[#C9A86A]">V</span>
            </div>
            <div>
              <h1 className="font-serif text-xl text-[#0A1931]">Vhennus</h1>
              <p className="text-xs text-[#4d5666]">Social Network</p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-[#0A1931]/5"
            >
              <Bell className="h-5 w-5 text-[#0A1931]" />
              {notifications > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#CC5A2A] text-xs text-white">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default HomeNav
