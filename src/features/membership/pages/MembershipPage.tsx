import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award,
  BadgeCheck,
  Flag,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Loader2,
  Shovel,
  Sparkles,
  Star,
  Swords,
} from 'lucide-react'
import AppCard from '../../../Shared/components/AppCard.tsx'
import AppButton from '../../../Shared/components/Button.tsx'
import Modal from '../../../Shared/components/modal.tsx'
import { useAuthStore } from '../../auth/useAuthStore.ts'
import {
  getMembershipStatusAPI,
  type MembershipApplication,
} from '../api.tsx'
import {
  ALL_BADGES,
  DUMMY_BADGES,
  DUMMY_COMMITMENT_LEVEL,
  getMembershipFromToken,
  WHITE_PAPER_URL,
} from '../membershipUtils.ts'

const MembershipPage: React.FC = () => {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)

  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState<boolean | null>(null)
  const [application, setApplication] =
    useState<MembershipApplication | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [whitePaperOpen, setWhitePaperOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      // Fast path: membership flag carried in the JWT.
      const fromToken = getMembershipFromToken(token)
      if (fromToken !== null && !cancelled) setIsMember(fromToken)
      try {
        // Source of truth: fresh status from the backend
        // (tokens are long-lived and can go stale after approval).
        const result = await getMembershipStatusAPI()
        if (cancelled) return
        const member =
          result.data.is_member ||
          result.data.application?.status === 'approved'
        setIsMember(member)
        setApplication(result.data.application)
      } catch {
        if (cancelled) return
        if (fromToken === null) {
          setError('Unable to load membership status.')
        }
        // Otherwise keep the token-derived value.
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [token])

  const pendingReview =
    application !== null &&
    ['submitted', 'under_review'].includes(application.status)

  return (
    <div className="min-h-screen">
      <main className="px-5 py-6 sm:px-8">
        {loading || isMember === null ? (
          <div className="flex items-center justify-center gap-2 py-16 text-[#4d5666]">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading membership…
          </div>
        ) : error !== null ? (
          <AppCard className="p-6 text-center text-[#CC5A2A]">{error}</AppCard>
        ) : isMember ? (
          <MemberView />
        ) : pendingReview ? (
          <AppCard className="p-6 text-center">
            <BadgeCheck className="mx-auto h-10 w-10 text-[#C9A86A]" />
            <h2 className="mt-3 font-serif text-2xl text-[#0A1931]">
              Application received
            </h2>
            <p className="mt-2 text-[15px] text-[#4d5666]">
              Thank you, we will evaluate and be in touch with you.
            </p>
          </AppCard>
        ) : (
          <AppCard className="p-6 text-center">
            <Award className="mx-auto h-10 w-10 text-[#C9A86A]" />
            <h2 className="mt-3 font-serif text-2xl text-[#0A1931]">
              You are not a member yet
            </h2>
            <p className="mt-2 text-[15px] text-[#4d5666]">
              Join the Vhennus community and build together.
            </p>
            <AppButton
              className="mt-5"
              onClick={() => setWhitePaperOpen(true)}
            >
              Become a member
            </AppButton>
          </AppCard>
        )}
      </main>

      <Modal
        isOpen={whitePaperOpen}
        onClose={() => setWhitePaperOpen(false)}
        title="Become a member"
      >
        <p className="text-[15px] text-[#0A1931]">
          Have you read the white paper?
        </p>
        <div className="mt-4 flex gap-3">
          <AppButton
            fullWidth
            onClick={() => {
              setWhitePaperOpen(false)
              navigate('/home/membership/questions')
            }}
          >
            Yes
          </AppButton>
          <AppButton
            fullWidth
            variant="outline"
            onClick={() => setWhitePaperOpen(false)}
          >
            No
          </AppButton>
        </div>
        <p className="mt-4 text-sm text-[#4d5666]">
          You can read the white paper on our{' '}
          <button
            type="button"
            className="font-medium text-[#CC5A2A] underline"
            onClick={() => {
              setWhitePaperOpen(false)
              navigate('/')
            }}
          >
            home page
          </button>{' '}
          or{' '}
          <a
            className="font-medium text-[#CC5A2A] underline"
            href={WHITE_PAPER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            download it directly
          </a>
          .
        </p>
      </Modal>
    </div>
  )
}

const BADGE_STYLES: Record<
  string,
  { icon: typeof Flag; tile: string; iconColor: string; pill: string }
> = {
  member: {
    icon: Star,
    tile: 'bg-sky-100 border-sky-300',
    iconColor: 'text-sky-600',
    pill: 'bg-sky-500 text-white',
  },
  contributor: {
    icon: HeartHandshake,
    tile: 'bg-teal-100 border-teal-300',
    iconColor: 'text-teal-600',
    pill: 'bg-teal-500 text-white',
  },
  builder: {
    icon: Shovel,
    tile: 'bg-orange-100 border-orange-300',
    iconColor: 'text-orange-600',
    pill: 'bg-orange-500 text-white',
  },
  inventor: {
    icon: Lightbulb,
    tile: 'bg-yellow-100 border-yellow-300',
    iconColor: 'text-yellow-600',
    pill: 'bg-yellow-500 text-white',
  },
  scholar: {
    icon: GraduationCap,
    tile: 'bg-indigo-100 border-indigo-300',
    iconColor: 'text-indigo-600',
    pill: 'bg-indigo-500 text-white',
  },
  luminary: {
    icon: Sparkles,
    tile: 'bg-fuchsia-100 border-fuchsia-300',
    iconColor: 'text-fuchsia-600',
    pill: 'bg-fuchsia-500 text-white',
  },
  founder: {
    icon: Flag,
    tile: 'bg-amber-100 border-amber-300',
    iconColor: 'text-amber-600',
    pill: 'bg-amber-500 text-white',
  },
  warrior: {
    icon: Swords,
    tile: 'bg-rose-100 border-rose-300',
    iconColor: 'text-rose-600',
    pill: 'bg-rose-500 text-white',
  },
}

const MemberView: React.FC = () => {
  const navigate = useNavigate()
  const owned = new Set<string>(DUMMY_BADGES)
  const authUserName = useAuthStore((state) => state.authUserName)
  const earned = ALL_BADGES.filter((badge) => owned.has(badge))
  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl bg-[#0A1931] text-[#F5F5F0]">
        <div className="h-1 bg-gradient-to-r from-[#C9A86A] via-[#e8c97a] to-[#CC5A2A]" />
        <div className="flex items-center gap-4 p-6 text-left">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#C9A86A] font-serif text-2xl text-[#0A1931]">
            {(authUserName || 'V').charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#C9A86A]">
              Vhennus Member
            </p>
            <h2 className="mt-1 truncate font-serif text-2xl tracking-tight">
              {authUserName || 'Welcome'}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#d7dce4]">
              <BadgeCheck className="h-4 w-4 text-[#C9A86A]" />
              Membership active
            </p>
          </div>
        </div>
      </div>

      <section className="text-left">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-xl text-[#0A1931]">Commitment</h3>
          <p className="text-sm font-medium text-[#CC5A2A]">
            Level {DUMMY_COMMITMENT_LEVEL} of 10
          </p>
        </div>
        <div className="mt-3 rounded-2xl border border-[#C9A86A]/60 bg-white p-5">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#0A1931]/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C9A86A] to-[#CC5A2A]"
              style={{ width: `${DUMMY_COMMITMENT_LEVEL * 10}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-[#4d5666]">
            Keep building with the community to raise your commitment.
          </p>
        </div>
      </section>

      <section className="text-left">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-xl text-[#0A1931]">Badges</h3>
          <div className="flex items-baseline gap-3">
            <p className="text-sm text-[#4d5666]">{earned.length} earned</p>
            <button
              type="button"
              onClick={() => navigate('/home/membership/badges')}
              className="text-sm font-medium text-[#CC5A2A] hover:text-[#0A1931]"
            >
              Read more about badges
            </button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {earned.map((badge) => {
            const style = BADGE_STYLES[badge]
            const Icon = style.icon
            return (
              <div
                key={badge}
                className={[
                  'flex flex-col items-center rounded-2xl border px-2 py-4 text-center capitalize shadow-sm',
                  style.tile,
                ].join(' ')}
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white shadow-md ring-2 ring-white/60">
                  <Icon
                    className={['h-7 w-7 fill-current', style.iconColor].join(
                      ' '
                    )}
                  />
                </span>
                <p className="mt-2 text-xs font-semibold text-[#0A1931]">
                  {badge}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default MembershipPage
