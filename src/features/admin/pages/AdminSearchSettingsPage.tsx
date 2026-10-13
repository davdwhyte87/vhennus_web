import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Heart, Loader2, Pencil, Plus, Sparkles, Trash2, X } from 'lucide-react'
import AppCard from '../../../Shared/components/AppCard.tsx'
import PageHeader from '../../../Shared/components/PageHeader.tsx'
import {
  createAdminSearchTagAPI,
  deleteAdminSearchTagAPI,
  getAdminSearchTagsAPI,
  updateAdminSearchTagAPI,
  type SearchTag,
} from '../api.tsx'

type Kind = 'skill' | 'interest'

export default function AdminSearchSettingsPage() {
  const [tags, setTags] = useState<SearchTag[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newKind, setNewKind] = useState<Kind>('skill')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    let cancelled = false
    getAdminSearchTagsAPI()
      .then((res) => {
        if (!cancelled) setTags(res.data ?? [])
      })
      .catch(() => {
        if (!cancelled) toast.error('Unable to load skills and interests.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const skills = useMemo(() => tags.filter((t) => t.kind === 'skill'), [tags])
  const interests = useMemo(() => tags.filter((t) => t.kind === 'interest'), [tags])
  const q = filter.trim().toLowerCase()
  const visibleSkills = q ? skills.filter((t) => t.name.toLowerCase().includes(q)) : skills
  const visibleInterests = q ? interests.filter((t) => t.name.toLowerCase().includes(q)) : interests

  const addTag = async () => {
    const name = newName.trim()
    if (!name) return
    setSaving(true)
    try {
      const res = await createAdminSearchTagAPI({ name, kind: newKind })
      setTags((prev) => {
        const exists = prev.some((t) => t.id === res.data.id)
        const next = exists
          ? prev.map((t) => (t.id === res.data.id ? res.data : t))
          : [...prev, res.data]
        return next.sort((a, b) => a.name.localeCompare(b.name))
      })
      setNewName('')
      toast.success(`${newKind === 'skill' ? 'Skill' : 'Interest'} added`)
    } catch {
      toast.error('Failed to add — it may already exist')
    } finally {
      setSaving(false)
    }
  }

  const saveEdit = async (id: string) => {
    const name = editingName.trim()
    if (!name) {
      setEditingId(null)
      return
    }
    try {
      const res = await updateAdminSearchTagAPI(id, { name })
      setTags((prev) => prev.map((t) => (t.id === id ? res.data : t)))
      setEditingId(null)
      toast.success('Renamed')
    } catch {
      toast.error('Failed to rename')
    }
  }

  const removeTag = async (tag: SearchTag) => {
    if (!confirm(`Delete ${tag.kind} "${tag.name}"? It will be removed from every profile.`)) return
    try {
      await deleteAdminSearchTagAPI(tag.id)
      setTags((prev) => prev.filter((t) => t.id !== tag.id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin · Users"
        title="Search settings"
        description="Manage the skills and interests users can add to their profile and filter by when finding friends."
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[#4d5666]">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : (
        <>
          <AppCard className="mt-6 p-4">
            <p className="mb-2 text-sm font-medium text-[#0A1931]">Add new</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="e.g. photography, football…"
                className="flex-1 border border-[#0A1931]/25 px-3 py-2 text-sm outline-none"
              />
              <div className="flex gap-2">
                <select
                  value={newKind}
                  onChange={(e) => setNewKind(e.target.value as Kind)}
                  className="border border-[#0A1931]/25 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="skill">Skill</option>
                  <option value="interest">Interest</option>
                </select>
                <button
                  type="button"
                  onClick={addTag}
                  disabled={saving || !newName.trim()}
                  className="flex items-center gap-1 bg-[#0A1931] px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add
                </button>
              </div>
            </div>
          </AppCard>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={`Filter ${tags.length} tags…`}
                className="w-full border border-[#0A1931]/25 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>
            <TagSection
              title="Skills"
              icon={<Sparkles className="h-4 w-4 text-[#CC5A2A]" />}
              tags={visibleSkills}
              total={skills.length}
              editingId={editingId}
              editingName={editingName}
              onStartEdit={(t) => {
                setEditingId(t.id)
                setEditingName(t.name)
              }}
              onCancelEdit={() => setEditingId(null)}
              onEditChange={setEditingName}
              onSaveEdit={saveEdit}
              onDelete={removeTag}
            />
            <TagSection
              title="Interests"
              icon={<Heart className="h-4 w-4 text-[#CC5A2A]" />}
              tags={visibleInterests}
              total={interests.length}
              editingId={editingId}
              editingName={editingName}
              onStartEdit={(t) => {
                setEditingId(t.id)
                setEditingName(t.name)
              }}
              onCancelEdit={() => setEditingId(null)}
              onEditChange={setEditingName}
              onSaveEdit={saveEdit}
              onDelete={removeTag}
              pill
            />
          </div>
        </>
      )}
    </div>
  )
}

function TagSection({
  title,
  icon,
  tags,
  total,
  editingId,
  editingName,
  onStartEdit,
  onCancelEdit,
  onEditChange,
  onSaveEdit,
  onDelete,
  pill,
}: {
  title: string
  icon: React.ReactNode
  tags: SearchTag[]
  total?: number
  editingId: string | null
  editingName: string
  onStartEdit: (t: SearchTag) => void
  onCancelEdit: () => void
  onEditChange: (v: string) => void
  onSaveEdit: (id: string) => void
  onDelete: (t: SearchTag) => void
  pill?: boolean
}) {
  return (
    <AppCard className="p-4">
      <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#0A1931]">
        {icon}
        {title} ({total !== undefined && total !== tags.length ? `${tags.length} of ${total}` : tags.length})
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) =>
          editingId === t.id ? (
            <span
              key={t.id}
              className="flex items-center gap-1 border border-[#0A1931]/30 bg-white px-2 py-1 text-xs"
            >
              <input
                autoFocus
                value={editingName}
                onChange={(e) => onEditChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveEdit(t.id)
                  if (e.key === 'Escape') onCancelEdit()
                }}
                className="w-28 outline-none"
              />
              <button
                type="button"
                onClick={() => onSaveEdit(t.id)}
                className="font-semibold text-green-700 hover:text-green-900"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                aria-label="Cancel"
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : (
            <span
              key={t.id}
              className={[
                'flex items-center gap-1 px-3 py-1 text-xs text-[#0A1931]',
                pill ? 'rounded-full bg-[#C9A86A]/20' : 'bg-[#0A1931]/10',
              ].join(' ')}
            >
              {t.name}
              <button
                type="button"
                onClick={() => onStartEdit(t)}
                aria-label={`Rename ${t.name}`}
                className="text-[#4d5666] hover:text-[#0A1931]"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(t)}
                aria-label={`Delete ${t.name}`}
                className="text-[#CC5A2A] hover:text-[#0A1931]"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          )
        )}
        {tags.length === 0 && <span className="text-xs text-[#6b7180]">None yet.</span>}
      </div>
    </AppCard>
  )
}
