import axios from 'axios'
import { Check, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { changePasswordAPI, getResetPasswordCodeAPI } from '../api'
import { useAuthStore } from '../useAuthStore'
import AppButton from '../../../Shared/components/Button'
import AppInput from '../../../Shared/components/AppInput'
import AuthLayout from '../components/AuthLayout'

export default function ForgotPasswordPage() {
  const authStore = useAuthStore()
  const navigate = useNavigate()

  const sendCode = async () => {
    if (!authStore.userName) {
      toast.error('Enter your username first')
      return
    }
    authStore.setState({ isGetChangePasswordCodeLoading: true })
    try {
      await getResetPasswordCodeAPI({ user_name: authStore.userName })
      toast.success('A reset code has been sent to your email.')
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Unable to send code'
          : 'Unable to send code'
      )
    } finally {
      authStore.setState({ isGetChangePasswordCodeLoading: false })
    }
  }

  const resetPassword = async () => {
    if (!authStore.userName || !authStore.confirmationCode || !authStore.password) {
      toast.error('Complete all required fields')
      return
    }
    if (authStore.password !== authStore.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    authStore.setState({ isChangePasswordLoading: true })
    try {
      await changePasswordAPI({
        user_name: authStore.userName,
        code: authStore.confirmationCode,
        password: authStore.password,
      })
      toast.success('Password updated. You can now sign in.')
      navigate('/login')
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Unable to reset password'
          : 'Unable to reset password'
      )
    } finally {
      authStore.setState({ isChangePasswordLoading: false })
    }
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Set a new password."
      description="Request a reset code, then choose a new password for your account."
      backTo="/login"
      backLabel="Back to sign in"
    >
      <div className="rounded-none border border-[#C9A86A] bg-[#F5F5F0] p-5 text-[15px] leading-[1.7] text-[#4d5666]">
        <p className="font-medium text-[#0A1931]">How it works</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Enter your username and request a code.</li>
          <li>Check your email for the code.</li>
          <li>Enter the code and your new password below.</li>
        </ol>
      </div>

      <div className="mt-7 space-y-5">
        <AppInput
          label="Username"
          value={authStore.userName}
          onChange={(event) =>
            authStore.setState({ userName: event.target.value })
          }
          placeholder="Your username"
          autoComplete="username"
        />
        <AppButton
          fullWidth
          variant="secondary"
          loading={authStore.isGetChangePasswordCodeLoading}
          onClick={sendCode}
        >
          <Mail size={18} />
          Send reset code
        </AppButton>
        <AppInput
          label="Reset code"
          value={authStore.confirmationCode}
          onChange={(event) =>
            authStore.setState({ confirmationCode: event.target.value })
          }
          placeholder="Code from your email"
        />
        <AppInput
          label="New password"
          type="password"
          value={authStore.password}
          onChange={(event) =>
            authStore.setState({ password: event.target.value })
          }
          placeholder="Choose a new password"
          autoComplete="new-password"
        />
        <AppInput
          label="Confirm new password"
          type="password"
          value={authStore.confirmPassword}
          onChange={(event) =>
            authStore.setState({ confirmPassword: event.target.value })
          }
          placeholder="Repeat your new password"
          autoComplete="new-password"
        />
      </div>

      <AppButton
        fullWidth
        className="mt-8"
        loading={authStore.isChangePasswordLoading}
        onClick={resetPassword}
      >
        Update password
        <Check size={18} />
      </AppButton>

      <p className="mt-7 text-center text-[15px] text-[#4d5666]">
        Remembered it?{' '}
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
