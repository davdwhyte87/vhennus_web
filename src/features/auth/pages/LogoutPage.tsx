import { ArrowLeft, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../useAuthStore'
import AppButton from '../../../Shared/components/Button'
import AuthLayout from '../components/AuthLayout'

export function LogoutPage() {
  const navigate = useNavigate()
  const authStore = useAuthStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = () => {
    setIsLoggingOut(true)
    authStore.setState({ token: '', authUserName: '' })
    navigate('/login')
  }

  return (
    <AuthLayout
      eyebrow="Your Vhennus account"
      title="Sign out?"
      description={`You are currently signed in as ${authStore.authUserName || 'a Vhennus member'}.`}
      backTo="/home/feeds"
      backLabel="Return to the community"
    >
      <div className="border border-[#C9A86A] bg-[#F5F5F0] p-6">
        <LogOut className="text-[#CC5A2A]" size={25} />
        <p className="mt-4 text-[17px] leading-[1.7] text-[#4d5666]">
          You can return whenever you are ready to continue building with
          the community.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <AppButton
          fullWidth
          variant="secondary"
          onClick={() => navigate('/home/feeds')}
        >
          <ArrowLeft size={18} />
          Stay signed in
        </AppButton>
        <AppButton fullWidth loading={isLoggingOut} onClick={logout}>
          Sign out
          <LogOut size={18} />
        </AppButton>
      </div>
    </AuthLayout>
  )
}
