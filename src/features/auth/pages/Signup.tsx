import axios from 'axios'
import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { isAllLowercase, isValidEmailStrict } from '../../../Shared/utils'
import { signup, type SignupData } from '../api'
import { useAuthStore } from '../useAuthStore'
import AppButton from '../../../Shared/components/Button'
import AppInput from '../../../Shared/components/AppInput'
import AuthLayout from '../components/AuthLayout'

export default function SignupPage() {
  const authStore = useAuthStore()
  const navigate = useNavigate()

  const valid = () => {
    if (!authStore.userName || !authStore.password || !authStore.email) {
      toast.error('Complete all required fields')
      return false
    }
    if (!isAllLowercase(authStore.userName)) {
      toast.error('Username should use lowercase letters')
      return false
    }
    if (!isValidEmailStrict(authStore.email)) {
      toast.error('Enter a valid email address')
      return false
    }
    if (authStore.password !== authStore.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    return true
  }

  const handleSignup = async () => {
    if (!valid()) return
    authStore.setState({ signupLoading: true })
    try {
      const data: SignupData = {
        user_name: authStore.userName,
        password: authStore.password,
        email: authStore.email,
        user_type: 'User',
        referral: authStore.referralCode,
      }
      await signup(data)
      authStore.setState({ emailToBeVerified: authStore.email })
      toast.success('Account created. Check your email for a verification code.')
      navigate('/confirm_email')
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Unable to create account'
          : 'Unable to create account'
      )
    } finally {
      authStore.setState({ signupLoading: false })
    }
  }

  return (
    <AuthLayout
      eyebrow="Become a member"
      title="Start building."
      description="Create your Vhennus account and join a community shaped by shared purpose."
    >
      <div className="space-y-5">
        <AppInput
          label="Username"
          value={authStore.userName}
          onChange={(event) =>
            authStore.setState({ userName: event.target.value })
          }
          placeholder="Lowercase username"
          autoComplete="username"
        />
        <AppInput
          label="Email address"
          type="email"
          value={authStore.email}
          onChange={(event) =>
            authStore.setState({ email: event.target.value })
          }
          placeholder="you@example.com"
          autoComplete="email"
        />
        <AppInput
          label="Password"
          type="password"
          value={authStore.password}
          onChange={(event) =>
            authStore.setState({ password: event.target.value })
          }
          placeholder="Choose a password"
          autoComplete="new-password"
        />
        <AppInput
          label="Confirm password"
          type="password"
          value={authStore.confirmPassword}
          onChange={(event) =>
            authStore.setState({ confirmPassword: event.target.value })
          }
          placeholder="Repeat your password"
          autoComplete="new-password"
        />
        <AppInput
          label="Referral code (optional)"
          value={authStore.referralCode}
          onChange={(event) =>
            authStore.setState({ referralCode: event.target.value })
          }
          placeholder="Referral code"
        />
      </div>

      <AppButton
        fullWidth
        className="mt-8"
        loading={authStore.signupLoading}
        onClick={handleSignup}
      >
        Create account
        <ArrowRight size={18} />
      </AppButton>

      <p className="mt-7 border-t border-[#C9A86A]/60 pt-6 text-center text-[15px] text-[#4d5666]">
        Already a member?{' '}
        <Link
          to="/login"
          className="font-medium text-[#CC5A2A] hover:text-[#0A1931]"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
