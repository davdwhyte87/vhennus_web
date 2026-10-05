import { Outlet } from 'react-router-dom'
import HomeBottomNav from '../features/Feed/Components/HomeBottomNav.tsx'
import AppSideNav from '../Shared/components/AppSideNav.tsx'

const HomeLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#0A1931]">
      <div className="flex min-h-screen w-full">
        <AppSideNav />

        <div className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-3xl px-5 pb-8 pt-6 sm:px-8 lg:px-12">
            <Outlet />
          </div>
          <HomeBottomNav />
        </div>
      </div>
    </div>
  )
}

export default HomeLayout
