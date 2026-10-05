import axios from 'axios'
import { Check, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { isValidEmailStrict } from '../../../Shared/utils'
import { getCodeAPI, verifyEmailAPI } from '../api'
import { useAuthStore } from '../useAuthStore'
import AppButton from '../../../Shared/components/Button'
import AppInput from '../../../Shared/components/AppInput'
import AuthLayout from '../components/AuthLayout'

export default function ConfirmEmailPage() {
  const authStore = useAuthStore()
  const navigate = useNavigate()

  const resend = async () => {
    if (!isValidEmailStrict(authStore.emailToBeVerified)) {
      toast.error('Enter a valid email address')
      return
    }
    authStore.setState({ isVerifyEmail: true })
    try {
      await getCodeAPI({ email: authStore.emailToBeVerified })
      toast.success('A new verification code has been sent.')
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Unable to send a code'
          : 'Unable to send a code'
      )
    } finally {
      authStore.setState({ isVerifyEmail: false })
    }
  }

  const confirm = async () => {
    if (
      !isValidEmailStrict(authStore.emailToBeVerified) ||
      !authStore.confirmationCode
    ) {
      toast.error('Enter the verification code from your email')
      return
    }
    authStore.setState({ isConfirmEmailLoading: true })
    try {
      await verifyEmailAPI({
        email: authStore.emailToBeVerified,
        code: authStore.confirmationCode,
      })
      toast.success('Email verified. Welcome to Vhennus.')
      navigate('/home/feeds')
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Unable to verify email'
          : 'Unable to verify email'
      )
    } finally {
      authStore.setState({ isConfirmEmailLoading: false })
    }
  }

  return (
    <AuthLayout
      eyebrow="Confirm your email"
      title="One more step."
      description="Use the code we sent to activate your Vhennus account."
      backTo="/signup"
      backLabel="Back to account creation"
    >
      <div className="border border-[#C9A86A] bg-[#F5F5F0] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[.14em] text-[#CC5A2A]">
          Email address
        </p>
        <p className="mt-2 truncate text-[17px] font-medium text-[#0A1931]">
          {authStore.emailToBeVerified || 'Your email address'}
        </p>
      </div>

      <div className="mt-7">
        <AppInput
          label="Verification code"
          value={authStore.confirmationCode}
          onChange={(event) =>
            authStore.setState({ confirmationCode: event.target.value })
          }
          placeholder="Code from your email"
        />
      </div>

      <div className="mt-8 space-y-3">
        <AppButton
          fullWidth
          loading={authStore.isConfirmEmailLoading}
          onClick={confirm}
        >
          Verify email
          <Check size={18} />
        </AppButton>
        <AppButton
          fullWidth
          variant="secondary"
          loading={authStore.isVerifyEmail}
          onClick={resend}
        >
          <Mail size={18} />
          Resend code
        </AppButton>
      </div>

      <p className="mt-7 text-center text-[15px] text-[#4d5666]">
        Already confirmed?{' '}
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
