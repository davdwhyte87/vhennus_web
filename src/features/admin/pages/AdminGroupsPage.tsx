import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'
import PageHeader from '../../../Shared/components/PageHeader.tsx'
import { adminListGroupsAPI } from '../../groups/api.ts'

interface AdminGroupRow {
  id: string
  name: string
  about?: string | null
  image?: string | null
  is_private: boolean
  owner: string
  member_count: number
  categories: string[]
  invite_code?: string | null
  created_at: string
}

export default function AdminGroupsPage() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState<AdminGroupRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminListGroupsAPI(50, 0)
      .then((res) => setGroups(res.data ?? []))
      .catch(() => toast.error('Unable to load groups.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Groups" description="All groups and member counts." />
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[#4d5666]">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading groups…
        </div>
      ) : groups.length === 0 ? (
        <p className="py-10 text-center text-[#6b7180]">No groups yet.</p>
      ) : (
        <div className="mt-6 space-y-2">
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => navigate(`/home/groups/${g.id}`)}
              className="flex w-full items-center gap-3 bg-white p-3 text-left hover:bg-[#F5F5F0]"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0A1931]/10">
                {g.image ? <img src={g.image} alt={g.name} className="h-full w-full object-cover" /> : g.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[#0A1931]">{g.name}</p>
                <p className="truncate text-xs text-[#6b7180]">
                  @{g.owner} · {g.member_count} members · {g.is_private ? 'Private' : 'Public'}
                  {g.categories.length > 0 ? ` · ${g.categories.join(', ')}` : ''}
                </p>
              </div>
              <span className="shrink-0 text-xs text-[#CC5A2A]">View →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
