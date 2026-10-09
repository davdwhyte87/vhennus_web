import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Loader2 } from 'lucide-react'
import AppCard from '../../../Shared/components/AppCard.tsx'
import PageHeader from '../../../Shared/components/PageHeader.tsx'
import {
  getAdminApplicationsAPI,
  type ApplicationWithContact,
} from '../api.tsx'

const STATUS_FILTERS = ['', 'submitted', 'under_review', 'approved', 'rejected']

const AdminRequestsPage: React.FC = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<ApplicationWithContact[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getAdminApplicationsAPI(status || undefined)
        if (!cancelled) setApplications(result.data ?? [])
      } catch {
        if (!cancelled) setError('Unable to load membership requests.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [status])

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Membership Requests"
        description="Review applications to join the community."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((value) => (
          <button
            key={value || 'all'}
            type="button"
            onClick={() => setStatus(value)}
            className={[
              'px-3 py-1.5 text-sm font-medium transition-colors',
              status === value
                ? 'bg-[#0A1931] text-white'
                : 'bg-white text-[#4d5666] hover:text-[#0A1931]',
            ].join(' ')}
          >
            {value === '' ? 'All' : value.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[#4d5666]">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading requests…
        </div>
      ) : error !== null ? (
        <AppCard className="mt-4 p-6 text-center text-[#CC5A2A]">
          {error}
        </AppCard>
      ) : applications.length === 0 ? (
        <AppCard className="mt-4 p-6 text-center text-[#4d5666]">
          No membership requests found.
        </AppCard>
      ) : (
        <AppCard className="mt-4 p-0">
          <div className="divide-y divide-[#C9A86A]/40">
            {applications.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => navigate(`/admin/requests/${app.id}`)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#F5F5F0]"
              >
                <span>
                  <span className="block font-medium text-[#0A1931]">
                    {app.user_name}
                  </span>
                  <span className="mt-1 block text-sm capitalize text-[#4d5666]">
                    {app.status.replace('_', ' ')} · Score {app.score}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#4d5666]" />
              </button>
            ))}
          </div>
        </AppCard>
      )}
    </div>
  )
}

export default AdminRequestsPage
