import { useEffect, useState } from 'react'
import { Loader2, Medal, Users } from 'lucide-react'
import AppCard from '../../../Shared/components/AppCard.tsx'
import PageHeader from '../../../Shared/components/PageHeader.tsx'
import { getAdminStatsAPI, type AdminStats } from '../api.tsx'

const AdminHomePage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const result = await getAdminStatsAPI()
        if (!cancelled) setStats(result.data)
      } catch {
        if (!cancelled) setError('Unable to load stats.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Home"
        description="Community overview."
      />
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[#4d5666]">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading stats…
        </div>
      ) : error !== null ? (
        <AppCard className="mt-6 p-6 text-center text-[#CC5A2A]">
          {error}
        </AppCard>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AppCard className="p-6 text-center">
            <Users className="mx-auto h-8 w-8 text-[#C9A86A]" />
            <p className="mt-3 font-serif text-4xl text-[#0A1931]">
              {stats?.total_users ?? 0}
            </p>
            <p className="mt-1 text-[15px] text-[#4d5666]">Users</p>
          </AppCard>
          <AppCard className="p-6 text-center">
            <Medal className="mx-auto h-8 w-8 text-[#C9A86A]" />
            <p className="mt-3 font-serif text-4xl text-[#0A1931]">
              {stats?.total_members ?? 0}
            </p>
            <p className="mt-1 text-[15px] text-[#4d5666]">Members</p>
          </AppCard>
        </div>
      )}
    </div>
  )
}

export default AdminHomePage
