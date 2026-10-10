import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { ArrowLeft, Copy, ImagePlus, Loader2, X } from 'lucide-react'
import AppButton from '../../../Shared/components/Button.tsx'
import PageHeader from '../../../Shared/components/PageHeader.tsx'
import { uploadImageDirect } from '../../../Shared/api.ts'
import { getGroupAPI, getGroupMembersAPI, listJoinRequestsAPI, removeMemberAPI, respondJoinAPI, updateGroupAPI, type GroupDetail, type GroupMember, type JoinRequest } from '../api.ts'
import { useAuthStore } from '../../auth/useAuthStore.ts'

export default function GroupSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const myName = useAuthStore((s) => s.authUserName ?? '')
  const [group, setGroup] = useState<GroupDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [peopleTab, setPeopleTab] = useState<'members' | 'requests'>('members')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!id) return
    getGroupAPI(id)
      .then((r) => {
        const g = r.data
        if (g.owner !== myName) {
          toast.error('Only the group owner can open settings')
          navigate(`/home/groups/${id}`, { replace: true })
          return
        }
        setGroup(g)
        setName(g.name)
        setAbout(g.about ?? '')
        setIsPrivate(g.is_private)
        setImageUrl(g.image ?? null)
        getGroupMembersAPI(g.id).then((r) => setMembers(r.data ?? [])).catch(() => {})
        listJoinRequestsAPI(g.id).then((r) => setRequests(r.data ?? [])).catch(() => {})
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) toast.error(err.response?.data?.message || 'Error loading group')
        else toast.error('Error loading group')
        navigate('/home/groups', { replace: true })
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setProgress(0)
    try {
      const url = await uploadImageDirect(file, 'group_images', setProgress)
      setImageUrl(url)
      toast.success('Image uploaded — hit Save to apply')
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const save = async () => {
    if (!id || !group) return
    if (!name.trim()) {
      toast.error('Group name is required')
      return
    }
    setSaving(true)
    try {
      await updateGroupAPI(id, {
        name: name.trim(),
        about: about.trim(),
        image: imageUrl ?? '',
        is_private: isPrivate,
      })
      toast.success('Group updated')
      navigate(`/home/groups/${id}`)
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data?.message || 'Update failed')
      else toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-[#4d5666]">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading settings…
      </div>
    )
  }
  if (!group) return null

  const inviteUrl = `${window.location.origin}/home/groups/join/${group.invite_code}`

  return (
    <div className="min-h-screen pb-20">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/home/groups/${group.id}`)}
          aria-label="Back to group"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#0A1931]/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <PageHeader eyebrow="Group owner" title="Group settings" />
      </div>

      {/* Group image */}
      <section className="mb-3 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-[#0A1931]">Group image</p>
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0A1931]/10 font-serif text-2xl">
            {imageUrl ? (
              <img src={imageUrl} alt={name || 'Group'} className="h-full w-full object-cover" />
            ) : (
              (name || '?').slice(0, 1).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickImage} />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 border border-[#0A1931]/25 px-3 py-2 text-sm text-[#0A1931] disabled:opacity-50"
              >
                <ImagePlus className="h-4 w-4" /> {imageUrl ? 'Change image' : 'Upload image'}
              </button>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  disabled={uploading}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-[#CC5A2A] hover:underline disabled:opacity-50"
                >
                  <X className="h-4 w-4" /> Remove
                </button>
              )}
            </div>
            {uploading && <p className="mt-2 text-xs text-[#6b7180]">Uploading… {progress}%</p>}
          </div>
        </div>
      </section>

      {/* Group info */}
      <section className="mb-3 space-y-2 bg-white p-4">
        <p className="text-sm font-medium text-[#0A1931]">Group info</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
          maxLength={100}
          className="w-full border border-[#0A1931]/25 px-3 py-2.5 text-sm outline-none focus:border-[#CC5A2A]"
        />
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="About this group..."
          rows={3}
          maxLength={500}
          className="w-full border border-[#0A1931]/25 px-3 py-2.5 text-sm outline-none focus:border-[#CC5A2A]"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[#0A1931]">
          <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
          Private group (join by request, hidden from search)
        </label>
        <AppButton onClick={save} className="w-full">
          {saving ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Save changes'}
        </AppButton>
      </section>

      {/* Group link */}
      <section className="mb-3 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-[#0A1931]">Group link</p>
        <p className="mb-2 text-xs text-[#6b7180]">Share this link so people can preview and join the group.</p>
        <div className="flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate bg-[#0A1931]/5 px-2 py-2 text-xs">{inviteUrl}</code>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                .writeText(inviteUrl)
                .then(() => toast.success('Invite link copied'))
                .catch(() => toast.error('Copy failed'))
            }}
            className="flex shrink-0 items-center gap-1 bg-[#0A1931] px-3 py-2 text-xs text-white"
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
        </div>
      </section>

      {/* Members + requests tabs */}
      <section className="mb-3 bg-white p-4">
        <div className="mb-3 flex gap-2">
          {(['members', 'requests'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPeopleTab(t)}
              className={`flex-1 py-2 text-sm font-medium capitalize ${
                peopleTab === t ? 'bg-[#0A1931] text-white' : 'bg-[#0A1931]/5 text-[#0A1931] hover:bg-[#0A1931]/10'
              }`}
            >
              {t}
              {t === 'members' ? ` (${members.length})` : requests.length > 0 ? ` (${requests.length})` : ''}
            </button>
          ))}
        </div>

        {peopleTab === 'members' ? (
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {members.map((m) => (
              <div key={m.user_name} className="flex items-center gap-2 py-1">
                <button type="button" onClick={() => navigate(`/user_profile/${m.user_name}`)} className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0A1931]/10 text-sm">
                  {m.profile?.image ? <img src={m.profile.image} alt="" className="h-full w-full object-cover" /> : m.user_name.slice(0, 1).toUpperCase()}
                </button>
                <button type="button" onClick={() => navigate(`/user_profile/${m.user_name}`)} className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm text-[#0A1931]">{m.profile?.name || m.user_name}</span>
                  <span className="block text-xs text-[#6b7180]">@{m.user_name} · {m.role}</span>
                </button>
                {m.user_name !== group.owner && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm(`Remove @${m.user_name}?`)) return
                      try {
                        await removeMemberAPI(group.id, m.user_name)
                        setMembers((prev) => prev.filter((x) => x.user_name !== m.user_name))
                        toast.success('Member removed')
                      } catch {
                        toast.error('Failed to remove member')
                      }
                    }}
                    className="shrink-0 text-xs text-[#CC5A2A] hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {members.length === 0 && <p className="text-sm text-[#6b7180]">No members yet.</p>}
          </div>
        ) : requests.length === 0 ? (
          <p className="text-sm text-[#6b7180]">No pending join requests.</p>
        ) : (
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center gap-2">
                <button type="button" onClick={() => navigate(`/user_profile/${r.user_name}`)} className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm text-[#0A1931]">{r.profile?.name || r.user_name}</span>
                  <span className="block truncate text-xs text-[#6b7180]">@{r.user_name} — view profile before deciding</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await respondJoinAPI(group.id, r.id, 'accept')
                      setRequests((prev) => prev.filter((x) => x.id !== r.id))
                      getGroupMembersAPI(group.id).then((resp) => setMembers(resp.data ?? [])).catch(() => {})
                      toast.success('Request accepted')
                    } catch {
                      toast.error('Failed to accept')
                    }
                  }}
                  className="shrink-0 bg-[#0A1931] px-3 py-1.5 text-xs text-white"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await respondJoinAPI(group.id, r.id, 'reject')
                      setRequests((prev) => prev.filter((x) => x.id !== r.id))
                    } catch {
                      toast.error('Failed to reject')
                    }
                  }}
                  className="shrink-0 border border-[#0A1931]/25 px-3 py-1.5 text-xs"
                >
                  Reject
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
