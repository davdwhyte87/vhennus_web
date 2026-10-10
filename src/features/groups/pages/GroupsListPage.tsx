import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { ImagePlus, Loader2, Plus, Search, Users, X } from 'lucide-react'
import PageHeader from '../../../Shared/components/PageHeader.tsx'
import { uploadImageDirect } from '../../../Shared/api.ts'
import AppButton from '../../../Shared/components/Button.tsx'
import GroupListItem from '../components/GroupListItem.tsx'
import {
  createGroupAPI,
  getMyGroupsAPI,
  listGroupCategoriesAPI,
  searchGroupsAPI,
  type GroupDetail,
  type MyGroupItem,
} from '../api.ts'
import { useGroupStore } from '../useGroupStore.ts'
import { useAuthStore } from '../../auth/useAuthStore.ts'

export const GroupsListPage = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'mine' | 'discover'>('mine')
  const [groups, setGroups] = useState<MyGroupItem[]>([])
  const [results, setResults] = useState<GroupDetail[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const unreadByGroup = useGroupStore((s) => s.unreadByGroup)
  const unreadTotal = useGroupStore((s) => s.unreadTotal)
  const setGroupsStore = useGroupStore((s) => s.setGroups)
  const refreshUnread = useGroupStore((s) => s.refreshUnread)
  const myName = useAuthStore((s) => s.authUserName ?? '')

  const loadMine = async () => {
    setLoading(true)
    try {
      const resp = await getMyGroupsAPI()
      setGroups(resp.data ?? [])
      setGroupsStore(resp.data ?? [])
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data?.message || 'Error loading groups')
      else toast.error('Error loading groups')
    } finally {
      setLoading(false)
    }
  }

  const runSearch = async () => {
    setSearching(true)
    try {
      const resp = await searchGroupsAPI({
        q: searchTerm.trim() || undefined,
        category: category || undefined,
        limit: 30,
      })
      setResults(resp.data ?? [])
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data?.message || 'Search failed')
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    loadMine()
    refreshUnread()
    listGroupCategoriesAPI()
      .then((r) => setCategories((r.data ?? []).map((c) => c.name)))
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (tab === 'discover') runSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const countOf = (g: (typeof groups)[number]) => unreadByGroup[g.id] ?? g.unread_count ?? 0
  const unreadGroups = groups.filter((g) => countOf(g) > 0)
  const readGroups = groups.filter((g) => countOf(g) === 0)

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#C9A86A]/60 bg-[#F5F5F0]/95 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <PageHeader eyebrow={`${groups.length} group${groups.length === 1 ? '' : 's'}`} title="Groups" />
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            aria-label="Create group"
            className="grid h-10 w-10 place-items-center rounded-full bg-[#0A1931] text-white hover:bg-[#CC5A2A]"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-2">
          {(['mine', 'discover'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-medium capitalize ${
                tab === t ? 'bg-[#0A1931] text-white' : 'bg-white text-[#0A1931] hover:bg-[#0A1931]/5'
              }`}
            >
              {t === 'mine' ? `My groups${unreadTotal > 0 ? ` (${unreadTotal})` : ''}` : 'Discover'}
            </button>
          ))}
        </div>
        {tab === 'discover' && (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4d5666]" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                placeholder="Search by name..."
                className="w-full border border-[#0A1931]/25 bg-white py-2.5 pl-11 pr-4 outline-none placeholder:text-[#6b7180] focus:border-[#CC5A2A]"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-[#0A1931]/25 bg-white px-3 py-2.5 text-sm outline-none"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <AppButton onClick={runSearch}>Search</AppButton>
            </div>
          </div>
        )}
      </header>

      <main className="pb-20">
        {tab === 'mine' ? (
          loading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-[#4d5666]">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading groups…
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-24">
              <div className="mb-6 grid h-24 w-24 place-items-center rounded-full bg-[#0A1931]/5">
                <Users className="h-12 w-12 text-[#C9A86A]" />
              </div>
              <h3 className="mb-2 font-serif text-xl text-[#0A1931]">No groups yet</h3>
              <p className="mb-6 max-w-sm text-center text-[#4d5666]">
                Create one or discover public groups to join.
              </p>
              <AppButton onClick={() => setShowCreate(true)}>Create group</AppButton>
            </div>
          ) : (
            <div className="space-y-2 px-4 pt-4 sm:px-6">
              {unreadGroups.length > 0 && (
                <>
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-sm font-semibold text-[#0A1931]">Recent</h2>
                    <span className="text-xs text-[#4d5666]">
                      {unreadGroups.length} unread group{unreadGroups.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  {unreadGroups.map((g) => (
                    <GroupListItem key={g.id} group={g} unreadCount={countOf(g)} />
                  ))}
                  <h2 className="px-2 pt-4 text-sm font-semibold text-[#0A1931]">All groups</h2>
                </>
              )}
              {readGroups.map((g) => (
                <GroupListItem key={g.id} group={g} unreadCount={0} />
              ))}
            </div>
          )
        ) : searching ? (
          <div className="flex items-center justify-center gap-2 py-20 text-[#4d5666]">
            <Loader2 className="h-5 w-5 animate-spin" /> Searching…
          </div>
        ) : results.length === 0 ? (
          <p className="py-20 text-center text-[#4d5666]">No public groups found. Try another search.</p>
        ) : (
          <div className="space-y-2 px-4 pt-4 sm:px-6">
            {results.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => navigate(g.is_member ? `/home/groups/${g.id}` : `/home/groups/join/${g.invite_code}`)}
                className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left hover:bg-[#F5F5F0]"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0A1931]/10 font-serif text-lg">
                  {g.image ? <img src={g.image} alt={g.name} className="h-full w-full object-cover" /> : g.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[#0A1931]">{g.name}</p>
                  <p className="truncate text-sm text-[#4d5666]">{g.about || 'No description'}</p>
                  <p className="text-xs text-[#6b7180]">
                    {g.member_count} members{g.is_member ? ' · Joined' : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {showCreate && (
        <CreateGroupModal
          categories={categories}
          ownerName={myName}
          onClose={() => setShowCreate(false)}
          onCreated={(id) => {
            setShowCreate(false)
            loadMine()
            navigate(`/home/groups/${id}`)
          }}
        />
      )}
    </div>
  )
}

function CreateGroupModal({
  categories,
  ownerName,
  onClose,
  onCreated,
}: {
  categories: string[]
  ownerName: string
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [picked, setPicked] = useState<string[]>([])
  const [categoryQuery, setCategoryQuery] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  void ownerName

  const filteredCategories = categories
    .filter((c) => c.toLowerCase().includes(categoryQuery.trim().toLowerCase()))
    .sort((a, b) => Number(picked.includes(b)) - Number(picked.includes(a)))

  const toggle = (c: string) => setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]))

  const submit = async () => {
    if (!name.trim()) {
      toast.error('Group name is required')
      return
    }
    setSaving(true)
    try {
      const resp = await createGroupAPI({
        name: name.trim(),
        about: about.trim() || undefined,
        image: imageUrl ?? undefined,
        is_private: isPrivate,
        categories: picked,
      })
      toast.success('Group created')
      onCreated(resp.data.id)
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data?.message || 'Failed to create group')
      else toast.error('Failed to create group')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-serif text-2xl text-[#0A1931]">New group</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
          maxLength={100}
          className="mt-4 w-full border border-[#0A1931]/25 px-3 py-2.5 outline-none focus:border-[#CC5A2A]"
        />
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="About this group..."
          rows={3}
          maxLength={500}
          className="mt-2 w-full border border-[#0A1931]/25 px-3 py-2.5 outline-none focus:border-[#CC5A2A]"
        />
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-[#0A1931]">
          <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
          Private group (join by request, hidden from search)
        </label>
        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0A1931]/10 font-serif text-xl">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              (name.trim() || '?').slice(0, 1).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setUploading(true)
                try {
                  const url = await uploadImageDirect(file, 'group_images')
                  setImageUrl(url)
                } catch {
                  toast.error('Image upload failed')
                } finally {
                  setUploading(false)
                  if (fileRef.current) fileRef.current.value = ''
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 border border-[#0A1931]/25 px-3 py-1.5 text-xs text-[#0A1931] disabled:opacity-50"
              >
                <ImagePlus className="h-4 w-4" /> {uploading ? 'Uploading…' : imageUrl ? 'Change image' : 'Add image'}
              </button>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="flex items-center gap-1 px-2 py-1.5 text-xs text-[#CC5A2A] hover:underline"
                >
                  <X className="h-3.5 w-3.5" /> Remove
                </button>
              )}
            </div>
          </div>
        </div>
        <p className="mb-1 mt-4 text-sm font-medium text-[#0A1931]">Categories</p>
        {categories.length > 0 && (
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7180]" />
            <input
              value={categoryQuery}
              onChange={(e) => setCategoryQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full border border-[#0A1931]/25 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-[#6b7180] focus:border-[#CC5A2A]"
            />
          </div>
        )}
        <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
          {filteredCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggle(c)}
              className={`rounded-full px-3 py-1 text-xs ${
                picked.includes(c) ? 'bg-[#0A1931] text-white' : 'bg-[#0A1931]/10 text-[#0A1931]'
              }`}
            >
              {c}
            </button>
          ))}
          {categories.length === 0 && <span className="text-xs text-[#6b7180]">No categories yet.</span>}
          {categories.length > 0 && filteredCategories.length === 0 && (
            <span className="text-xs text-[#6b7180]">No categories match “{categoryQuery.trim()}”.</span>
          )}
        </div>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 border border-[#0A1931]/25 py-2.5 text-sm">
            Cancel
          </button>
          <AppButton onClick={submit} className="flex-1">
            {saving ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Create'}
          </AppButton>
        </div>
      </div>
    </div>
  )
}
