import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import AppCard from '../../../Shared/components/AppCard.tsx'
import PageHeader from '../../../Shared/components/PageHeader.tsx'
import { getAdminUsersAPI, type AdminUserRow } from '../api.tsx'

const AdminUsersPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const result = await getAdminUsersAPI()
        if (!cancelled) setUsers(result.data ?? [])
      } catch {
        if (!cancelled) setError('Unable to load users.')
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
        title="Users"
        description="Everyone with an account."
      />
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[#4d5666]">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading users…
        </div>
      ) : error !== null ? (
        <AppCard className="mt-6 p-6 text-center text-[#CC5A2A]">
          {error}
        </AppCard>
      ) : users.length === 0 ? (
        <AppCard className="mt-6 p-6 text-center text-[#4d5666]">
          No users found.
        </AppCard>
      ) : (
        <AppCard className="mt-6 p-0">
          <div className="divide-y divide-[#C9A86A]/40">
            {users.map((user) => (
              <div
                key={user.user_name}
                className="flex items-center justify-between gap-3 p-4"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-[#0A1931]">
                    {user.name || user.user_name}
                  </span>
                  <span className="block truncate text-sm text-[#4d5666]">
                    @{user.user_name}
                    {user.email ? ` · ${user.email}` : ''}
                    {user.phone_number ? ` · ${user.phone_number}` : ''}
                  </span>
                </span>
                <span
                  className={[
                    'shrink-0 px-2 py-0.5 text-xs font-medium',
                    user.membership
                      ? 'bg-[#0A1931] text-[#C9A86A]'
                      : 'bg-[#0A1931]/5 text-[#4d5666]',
                  ].join(' ')}
                >
                  {user.membership ? 'Member' : 'Not a member'}
                </span>
              </div>
            ))}
          </div>
        </AppCard>
      )}
    </div>
  )
}

export default AdminUsersPage
