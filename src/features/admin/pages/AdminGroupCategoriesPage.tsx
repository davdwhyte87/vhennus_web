import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import AppCard from '../../../Shared/components/AppCard.tsx'
import PageHeader from '../../../Shared/components/PageHeader.tsx'
import {
  adminAddCategoryAPI,
  adminDeleteCategoryAPI,
  listGroupCategoriesAPI,
  type GroupCategory,
} from '../../groups/api.ts'

export default function AdminGroupCategoriesPage() {
  const [categories, setCategories] = useState<GroupCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [newCat, setNewCat] = useState('')

  useEffect(() => {
    listGroupCategoriesAPI()
      .then((res) => setCategories(res.data ?? []))
      .catch(() => toast.error('Unable to load categories.'))
      .finally(() => setLoading(false))
  }, [])

  const addCategory = async () => {
    if (!newCat.trim()) return
    try {
      const res = await adminAddCategoryAPI(newCat.trim())
      setCategories((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewCat('')
      toast.success('Category added')
    } catch {
      toast.error('Failed to add category')
    }
  }

  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Groups keep everything else.`)) return
    try {
      await adminDeleteCategoryAPI(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success('Category deleted')
    } catch {
      toast.error('Failed to delete category')
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Group Categories" description="Categories users can attach to groups." />
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[#4d5666]">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading categories…
        </div>
      ) : (
        <AppCard className="mt-6 p-4">
          <p className="mb-2 text-sm font-medium text-[#0A1931]">Categories ({categories.length})</p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <span key={c.id} className="flex items-center gap-1 rounded-full bg-[#0A1931]/10 px-3 py-1 text-xs text-[#0A1931]">
                {c.name}
                <button type="button" onClick={() => deleteCategory(c.id, c.name)} aria-label={`Delete ${c.name}`} className="text-[#CC5A2A] hover:text-[#0A1931]">
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
            {categories.length === 0 && <span className="text-xs text-[#6b7180]">No categories.</span>}
          </div>
          <div className="flex gap-2">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              placeholder="New category name…"
              className="flex-1 border border-[#0A1931]/25 px-3 py-2 text-sm outline-none"
            />
            <button type="button" onClick={addCategory} className="flex items-center gap-1 bg-[#0A1931] px-4 py-2 text-sm text-white">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </AppCard>
      )}
    </div>
  )
}
