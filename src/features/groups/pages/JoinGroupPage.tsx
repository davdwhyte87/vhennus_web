import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { ArrowLeft, Loader2 } from 'lucide-react'
import AppButton from '../../../Shared/components/Button.tsx'
import { invitePreviewAPI, joinGroupAPI, type GroupDetail } from '../api.ts'

export default function JoinGroupPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [group, setGroup] = useState<GroupDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (!code) return
    invitePreviewAPI(code)
      .then((r) => setGroup(r.data))
      .catch((err) => {
        if (axios.isAxiosError(err)) toast.error(err.response?.data?.message || 'Invalid invite link')
        navigate('/home/groups')
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const join = async () => {
    if (!group) return
    if (group.is_member) {
      navigate(`/home/groups/${group.id}`)
      return
    }
    setJoining(true)
    try {
      const resp = await joinGroupAPI(group.id)
      const status = resp.data.status
      if (status === 'joined' || status === 'already') {
        toast.success('Welcome to the group!')
        navigate(`/home/groups/${group.id}`)
      } else {
        toast.success('Join request sent. The owner will review it.')
      }
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data?.message || 'Could not join group')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-[#4d5666]">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading invite…
      </div>
    )
  }
  if (!group) return null

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <button type="button" onClick={() => navigate('/home/groups')} className="mb-4 flex items-center gap-1 text-sm text-[#4d5666] hover:text-[#0A1931]">
        <ArrowLeft className="h-4 w-4" /> All groups
      </button>
      <div className="bg-white p-6 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-[#0A1931]/10 font-serif text-3xl">
          {group.image ? <img src={group.image} alt={group.name} className="h-full w-full object-cover" /> : group.name.slice(0, 1).toUpperCase()}
        </div>
        <h1 className="mt-4 font-serif text-2xl text-[#0A1931]">{group.name}</h1>
        {group.about && <p className="mt-2 text-[#4d5666]">{group.about}</p>}
        <p className="mt-2 text-xs text-[#6b7180]">
          {group.member_count} member{group.member_count === 1 ? '' : 's'}
          {group.is_private ? ' · Private' : ' · Public'}
          {group.categories.length > 0 ? ` · ${group.categories.join(', ')}` : ''}
        </p>
        {group.open_topic && (
          <p className="mt-3 bg-[#0A1931]/5 px-3 py-2 text-sm text-[#0A1931]">📌 {group.open_topic.title}</p>
        )}
        <AppButton onClick={join} className="mt-6 w-full">
          {joining ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : group.is_member ? 'Open group' : group.is_private ? 'Request to join' : 'Join group'}
        </AppButton>
      </div>
    </div>
  )
}
