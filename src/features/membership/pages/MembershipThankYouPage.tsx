import { useNavigate } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import AppCard from '../../../Shared/components/AppCard.tsx'
import AppButton from '../../../Shared/components/Button.tsx'

const MembershipThankYouPage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen">
      <main className="px-5 py-6 sm:px-8">
        <AppCard className="p-6 text-center">
          <BadgeCheck className="mx-auto h-10 w-10 text-[#C9A86A]" />
          <h2 className="mt-3 font-serif text-2xl text-[#0A1931]">Thank you!</h2>
          <p className="mt-2 text-[15px] text-[#4d5666]">
            Thank you, we will evaluate and be in touch with you.
          </p>
          <AppButton
            className="mt-5"
            variant="outline"
            onClick={() => navigate('/home/membership')}
          >
            Back to membership
          </AppButton>
        </AppCard>
      </main>
    </div>
  )
}

export default MembershipThankYouPage
