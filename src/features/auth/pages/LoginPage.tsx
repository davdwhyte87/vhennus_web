import axios from 'axios'
import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, type LoginData } from '../api'
import { useAuthStore } from '../useAuthStore'
import AppButton from '../../../Shared/components/Button'
import AppInput from '../../../Shared/components/AppInput'
import AuthLayout from '../components/AuthLayout'

export default function LoginPage() {
  const navigate = useNavigate()
  const authStore = useAuthStore()

  const handleLogin = async () => {
    authStore.setState({ isLoginLoading: true })
    try {
      const credentials: LoginData = {
        user_name: authStore.userName,
        password: authStore.password,
      }
      const result = await login(credentials)
      authStore.setState({
        token: result.token,
        authUserName: authStore.userName,
      })
      if (result.email_confirmed) {
        navigate('/home/feeds')
      } else {
        authStore.setState({ emailToBeVerified: result.email })
        navigate('/confirm_email')
      }
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Unable to sign in'
          : 'Unable to sign in'
      )
    } finally {
      authStore.setState({ isLoginLoading: false })
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Continue building."
      description="Sign in to take part in the Vhennus community."
    >
      <div className="space-y-5">
        <AppInput
          label="Username"
          value={authStore.userName}
          onChange={(event) =>
            authStore.setState({ userName: event.target.value })
          }
          placeholder="Your username"
          autoComplete="username"
        />
        <AppInput
          label="Password"
          type="password"
          value={authStore.password}
          onChange={(event) =>
            authStore.setState({ password: event.target.value })
          }
          placeholder="Your password"
          autoComplete="current-password"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to="/forgot_password"
          className="text-sm font-medium text-[#CC5A2A] hover:text-[#0A1931]"
        >
          Forgot password?
        </Link>
      </div>

      <AppButton
        fullWidth
        className="mt-8"
        loading={authStore.isLoginLoading}
        onClick={handleLogin}
      >
        Sign in
        <ArrowRight size={18} />
      </AppButton>

      <p className="mt-7 border-t border-[#C9A86A]/60 pt-6 text-center text-[15px] text-[#4d5666]">
        New to Vhennus?{' '}
        <Link
          to="/signup"
          className="font-medium text-[#CC5A2A] hover:text-[#0A1931]"
        >
          Create your account
        </Link>
      </p>
    </AuthLayout>
  )
}
