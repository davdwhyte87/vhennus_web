import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import AppCard from '../../../Shared/components/AppCard.tsx'
import AppButton from '../../../Shared/components/Button.tsx'
import {
  createMembershipApplicationAPI,
  getMembershipQuestionsAPI,
  getMyMembershipApplicationAPI,
  submitMembershipAnswersAPI,
  type MembershipQuestion,
} from '../api.tsx'
import {
  getUserProfileAPI,
  UpdateUserProfileAPI,
} from '../../profile/api.ts'
import ContactInfoModal, {
  type ContactInfo,
} from '../components/ContactInfoModal.tsx'
import { ANSWERS_CACHE_KEY } from '../membershipUtils.ts'

type AnswersMap = Record<string, string>

const readCachedAnswers = (): AnswersMap => {
  try {
    const raw = localStorage.getItem(ANSWERS_CACHE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed !== null && typeof parsed === 'object') return parsed
    return {}
  } catch {
    return {}
  }
}

const MembershipQuestionsPage: React.FC = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<MembershipQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswersMap>({})
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [contactInitial, setContactInitial] = useState<Partial<ContactInfo>>({})
  const [contactSaving, setContactSaving] = useState(false)

  // Create the application when the user finally submits (with contact
  // details when freshly collected). Returns the application id, if any.
  const ensureApplication = async (
    extras?: ContactInfo
  ): Promise<string | null> => {
    try {
      const created = await createMembershipApplicationAPI(
        extras?.phone_number,
        extras
          ? {
              country_of_origin: extras.country_of_origin,
              state_of_origin: extras.state_of_origin,
              date_of_birth: extras.date_of_birth,
              current_country: extras.current_country,
            }
          : undefined
      )
      setApplicationId(created.data.id)
      return created.data.id
    } catch {
      // Most likely "already have a pending application" — refetch it.
      const refetch = await getMyMembershipApplicationAPI().catch(() => null)
      if (refetch?.data) {
        setApplicationId(refetch.data.id)
        return refetch.data.id
      }
      return null
    }
  }

  // Contact step only updates the profile; the application is created later
  // when answers are submitted.
  const handleContactSave = async (info: ContactInfo) => {
    setContactSaving(true)
    try {
      await UpdateUserProfileAPI({
        phone_number: info.phone_number,
        country_of_origin: info.country_of_origin,
        state_of_origin: info.state_of_origin,
        date_of_birth: info.date_of_birth,
        current_country: info.current_country,
      })
      toast.success('Details saved.')
      setContactOpen(false)
    } catch {
      toast.error('Unable to save your details. Please try again.')
    } finally {
      setContactSaving(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [questionsRes, myAppRes, profileRes] = await Promise.all([
          getMembershipQuestionsAPI(),
          getMyMembershipApplicationAPI().catch(() => null),
          getUserProfileAPI().catch(() => null),
        ])
        if (cancelled) return
        const sorted = [...(questionsRes.data ?? [])].sort(
          (a, b) =>
            a.display_order - b.display_order || a.id.localeCompare(b.id)
        )
        setQuestions(sorted)

        // Reuse a pending application if one exists. A new one is only
        // created when the user finally submits their answers.
        const existing = myAppRes?.data
        if (existing && ['submitted', 'under_review'].includes(existing.status)) {
          setApplicationId(existing.id)
        }

        // Collect missing contact details before applying.
        const profile = profileRes?.data?.profile
        const missing =
          !profile?.phone_number ||
          !profile?.country_of_origin ||
          !profile?.state_of_origin ||
          !profile?.date_of_birth ||
          !profile?.current_country
        if (missing) {
          if (!cancelled) {
            setContactInitial({
              phone_number: profile?.phone_number ?? undefined,
              country_of_origin: profile?.country_of_origin ?? undefined,
              state_of_origin: profile?.state_of_origin ?? undefined,
              date_of_birth: profile?.date_of_birth ?? undefined,
              current_country: profile?.current_country ?? undefined,
            })
            setContactOpen(true)
          }
        }

        if (!cancelled) setAnswers(readCachedAnswers())
      } catch {
        if (!cancelled) toast.error('Unable to load membership questions')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: optionId }
      try {
        localStorage.setItem(ANSWERS_CACHE_KEY, JSON.stringify(next))
      } catch {
        // Cache is best-effort only.
      }
      return next
    })
  }

  const handleSubmitAll = async () => {
    if (submitting) return
    const payload = questions
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => ({ question_id: q.id, option_id: answers[q.id] }))
    if (payload.length === 0) {
      toast.error('Please answer at least one question')
      return
    }
    setSubmitting(true)
    try {
      // Create the application now (or reuse the pending one), then send
      // ALL answers in one batch request.
      const appId = applicationId ?? (await ensureApplication())
      if (!appId) {
        toast.error('Unable to start your application. Please try again.')
        return
      }
      await submitMembershipAnswersAPI(appId, payload)
      try {
        localStorage.removeItem(ANSWERS_CACHE_KEY)
      } catch {
        // ignore
      }
      navigate('/home/membership/thank-you')
    } catch {
      toast.error('Unable to submit your answers. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center gap-2 py-16 text-[#4d5666]">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading questions…
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen">
        <main className="px-5 py-6 sm:px-8">
          <AppCard className="p-6 text-center text-[#4d5666]">
            No membership questions are available right now.
          </AppCard>
        </main>
      </div>
    )
  }

  const current = questions[index]
  const isLast = index === questions.length - 1
  const selected = answers[current.id]
  const canGoNext = selected !== undefined || !current.is_required
  const requiredUnanswered = questions.filter(
    (q) => q.is_required && answers[q.id] === undefined
  ).length

  return (
    <div className="min-h-screen">
      <main className="px-5 py-6 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[.15em] text-[#CC5A2A]">
          Question {index + 1} of {questions.length}
        </p>
        <div className="mt-2 h-2 w-full bg-[#0A1931]/10">
          <div
            className="h-full bg-[#C9A86A] transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>

        <AppCard className="mt-4 p-6">
          <h2 className="whitespace-pre-wrap break-words text-left text-[17px] font-medium leading-[1.7] text-[#0A1931]">
            {current.question}
          </h2>
          <div className="mt-4 space-y-2">
            {current.options.map((option) => {
              const active = selected === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectOption(current.id, option.id)}
                  className={[
                    'flex w-full items-start gap-3 border p-3 text-left transition-colors',
                    active
                      ? 'border-[#CC5A2A] bg-[#CC5A2A]/5'
                      : 'border-[#C9A86A]/60 bg-white hover:border-[#CC5A2A]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border',
                      active
                        ? 'border-[#CC5A2A] text-[#CC5A2A]'
                        : 'border-[#4d5666] text-transparent',
                    ].join(' ')}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="whitespace-pre-wrap break-words text-left text-[15px] text-[#0A1931]">
                    {option.option_text}
                  </span>
                </button>
              )
            })}
          </div>
        </AppCard>

        <div className="mt-4 flex gap-3">
          {index > 0 && (
            <AppButton
              variant="outline"
              fullWidth
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              Back
            </AppButton>
          )}
          {!isLast ? (
            <AppButton
              fullWidth
              disabled={!canGoNext}
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            >
              Next
            </AppButton>
          ) : (
            <AppButton
              fullWidth
              loading={submitting}
              disabled={requiredUnanswered > 0}
              onClick={handleSubmitAll}
            >
              Submit answers
            </AppButton>
          )}
        </div>
        {requiredUnanswered > 0 && (
          <p className="mt-3 text-center text-sm text-[#CC5A2A]">
            {requiredUnanswered} required question
            {requiredUnanswered === 1 ? '' : 's'} still unanswered.
          </p>
        )}
      </main>

      <ContactInfoModal
        isOpen={contactOpen}
        initial={contactInitial}
        saving={contactSaving}
        onSave={handleContactSave}
      />
    </div>
  )
}

export default MembershipQuestionsPage
