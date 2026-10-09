import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Cake,
  CheckCircle2,
  Flag,
  Loader2,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  XCircle,
} from 'lucide-react'
import { toast } from 'react-toastify'
import AppCard from '../../../Shared/components/AppCard.tsx'
import AppButton from '../../../Shared/components/Button.tsx'
import AppInput from '../../../Shared/components/AppInput.tsx'
import PageHeader from '../../../Shared/components/PageHeader.tsx'
import {
  approveApplicationAPI,
  getAdminApplicationAPI,
  rejectApplicationAPI,
  takeUnderReviewAPI,
  type AdminApplicationDetail,
} from '../api.tsx'

const AdminRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<AdminApplicationDetail | null>(null)
  const [reason, setReason] = useState('')
  const [acting, setActing] = useState(false)

  const reload = async () => {
    if (!id) return
    setLoading(true)
    try {
      const result = await getAdminApplicationAPI(id)
      setDetail(result.data)
    } catch {
      toast.error('Unable to load application.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const decide = async (approve: boolean) => {
    if (!id || acting) return
    setActing(true)
    try {
      if (approve) {
        await approveApplicationAPI(id, reason || undefined)
        toast.success('Membership approved.')
      } else {
        await rejectApplicationAPI(id, reason || undefined)
        toast.success('Membership rejected.')
      }
      navigate('/admin/requests')
    } catch {
      toast.error('Unable to record decision. Please try again.')
    } finally {
      setActing(false)
    }
  }

  const takeToReview = async () => {
    if (!id || acting) return
    setActing(true)
    try {
      await takeUnderReviewAPI(id)
      toast.success('Application under review.')
      await reload()
    } catch {
      toast.error('Unable to update application. Please try again.')
    } finally {
      setActing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-[#4d5666]">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading application…
      </div>
    )
  }

  if (!detail) {
    return (
      <AppCard className="mt-6 p-6 text-center text-[#4d5666]">
        Application not found.
      </AppCard>
    )
  }

  const { application, answers } = detail
  const isSubmitted = application.status === 'submitted'
  const isUnderReview = application.status === 'under_review'

  const statusStyles: Record<string, string> = {
    submitted: 'bg-[#C9A86A]/20 text-[#8a6d2f]',
    under_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  const contactRows = [
    { icon: Mail, label: 'Email', value: application.email },
    { icon: Phone, label: 'Phone', value: application.phone_number },
    { icon: Flag, label: 'Country of origin', value: application.country_of_origin },
    { icon: MapPin, label: 'Current country', value: application.current_country },
    { icon: MapPinned, label: 'State of origin', value: application.state_of_origin },
    { icon: Cake, label: 'Date of birth', value: application.date_of_birth },
  ]

  return (
    <div>
      <PageHeader eyebrow="Membership request" title={application.user_name} />

      <AppCard className="mt-4 p-5">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#0A1931] font-serif text-2xl text-[#C9A86A]">
            {application.user_name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-[#0A1931]">
              {application.user_name}
            </p>
            <span
              className={[
                'mt-1 inline-block px-2 py-0.5 text-xs font-medium capitalize',
                statusStyles[application.status] ??
                  'bg-[#0A1931]/5 text-[#4d5666]',
              ].join(' ')}
            >
              {application.status.replace('_', ' ')}
            </span>
          </div>
          <div className="ml-auto shrink-0 text-right">
            <p className="font-serif text-3xl text-[#0A1931]">
              {application.score}
              <span className="text-base text-[#4d5666]">
                /{detail.total_questions}
              </span>
            </p>
            <p className="text-xs text-[#4d5666]">Score</p>
          </div>
        </div>
      </AppCard>

      <AppCard className="mt-4 p-0">
        <p className="border-b border-[#C9A86A]/40 px-5 py-3 font-mono text-[11px] uppercase tracking-[.15em] text-[#4d5666]">
          Contact details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {contactRows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#0A1931]/5 text-[#0A1931]">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-[#4d5666]">
                  {label}
                </p>
                <p className="truncate text-[15px] text-[#0A1931]">
                  {value ?? 'Not provided'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </AppCard>

      <p className="mb-3 mt-6 font-mono text-[11px] uppercase tracking-[.15em] text-[#4d5666]">
        Answers
      </p>
      <div className="space-y-3">
        {answers.map((answer, qi) => (
          <AppCard key={answer.question_id} className="p-4">
            <p className="whitespace-pre-wrap break-words text-left font-medium text-[#0A1931]">
              <span className="mr-2 font-mono text-xs text-[#CC5A2A]">
                {qi + 1}
              </span>
              {answer.question}
            </p>
            <p className="mt-2 flex items-start gap-2 text-left text-[15px] text-[#4d5666]">
              {answer.is_correct === true && (
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-600" />
              )}
              {answer.is_correct === false && (
                <XCircle className="mt-1 h-4 w-4 shrink-0 text-[#CC5A2A]" />
              )}
              <span className="whitespace-pre-wrap break-words text-left">
                {answer.option_text ?? 'Not answered'}
              </span>
            </p>
          </AppCard>
        ))}
      </div>

      {isSubmitted && (
        <AppCard className="mt-6 p-4">
          <AppButton fullWidth loading={acting} onClick={takeToReview}>
            Take to under review
          </AppButton>
        </AppCard>
      )}

      {isUnderReview && (
        <AppCard className="mt-6 p-4">
          <AppInput
            label="Decision reason (optional)"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Reason for approval or rejection"
          />
          <div className="mt-4 flex gap-3">
            <AppButton
              fullWidth
              loading={acting}
              onClick={() => decide(true)}
            >
              Approve
            </AppButton>
            <AppButton
              fullWidth
              variant="outline"
              loading={acting}
              onClick={() => decide(false)}
            >
              Reject
            </AppButton>
          </div>
        </AppCard>
      )}
    </div>
  )
}

export default AdminRequestDetailPage
