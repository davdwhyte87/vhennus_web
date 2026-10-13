import { useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import type { SearchTag } from '../../features/profile/api.ts'

interface TagPickerProps {
  tags: SearchTag[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  /** Hard cap on selections (mirrors the backend limit). */
  maxSelected?: number
  placeholder?: string
  /** Rounded pills (interests) vs square chips (skills). */
  pill?: boolean
  emptyText?: string
  onLimitReached?: () => void
}

/**
 * Searchable multi-select for skills/interests.
 * Scales to hundreds of tags: type to filter, pick from the dropdown,
 * selected items show as removable pills. Nothing renders the full list.
 */
export default function TagPicker({
  tags,
  selectedIds,
  onChange,
  maxSelected,
  placeholder = 'Type to search…',
  pill = false,
  emptyText = 'No options yet.',
  onLimitReached,
}: TagPickerProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const capped = maxSelected !== undefined && selectedIds.length >= maxSelected

  const selected = useMemo(
    () => tags.filter((t) => selectedIds.includes(t.id)),
    [tags, selectedIds]
  )

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = q
      ? tags.filter((t) => t.name.toLowerCase().includes(q))
      : tags
    return pool.slice(0, 50)
  }, [tags, query])

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
    } else {
      if (capped) {
        onLimitReached?.()
        return
      }
      onChange([...selectedIds, id])
    }
  }

  const chipClass = (active: boolean) =>
    [
      'flex items-center gap-1 px-3 py-1 text-xs font-medium transition-colors',
      pill ? 'rounded-full' : '',
      active
        ? pill
          ? 'bg-[#CC5A2A] text-white'
          : 'bg-[#0A1931] text-[#C9A86A]'
        : pill
          ? 'bg-[#C9A86A]/20 text-[#0A1931]'
          : 'bg-[#0A1931]/5 text-[#0A1931]',
    ].join(' ')

  return (
    <div>
      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selected.map((t) => (
            <span key={t.id} className={chipClass(true)}>
              {t.name}
              <button
                type="button"
                onClick={() => toggle(t.id)}
                aria-label={`Remove ${t.name}`}
                className="opacity-80 hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="flex items-center border border-[#0A1931]/25 bg-white px-3">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const first = matches.find((m) => !selectedIds.includes(m.id))
                if (first) {
                  toggle(first.id)
                  setQuery('')
                }
              }
              if (e.key === 'Escape') {
                setQuery('')
                inputRef.current?.blur()
              }
            }}
            placeholder={
              capped
                ? `Limit reached (${selectedIds.length}/${maxSelected})`
                : tags.length === 0
                  ? emptyText
                  : `${placeholder} (${tags.length})`
            }
            disabled={tags.length === 0}
            className="h-10 w-full bg-transparent px-2 text-sm text-[#0A1931] outline-none placeholder:text-[#6b7180] disabled:opacity-60"
          />
          {query ? (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setQuery('')}
              aria-label="Clear"
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
          )}
        </div>

        {open && tags.length > 0 && (
          <div className="absolute inset-x-0 top-full z-30 max-h-52 overflow-y-auto border border-[#0A1931]/25 bg-white shadow-lg">
            {matches.length === 0 ? (
              <p className="px-3 py-3 text-sm text-gray-500">
                No matches for “{query.trim()}”
              </p>
            ) : (
              matches.map((t) => {
                const active = selectedIds.includes(t.id)
                const disabled = !active && capped
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={disabled}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      toggle(t.id)
                      setQuery('')
                      inputRef.current?.focus()
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[#0A1931] hover:bg-[#C9A86A]/15 disabled:opacity-40"
                  >
                    <span className="truncate">{t.name}</span>
                    {active && <Check className="h-4 w-4 shrink-0 text-green-700" />}
                  </button>
                )
              })
            )}
            {query.trim() === '' && tags.length > 50 && (
              <p className="border-t border-gray-100 px-3 py-1.5 text-[11px] text-gray-400">
                Showing first 50 — keep typing to narrow down
              </p>
            )}
          </div>
        )}
      </div>

      {maxSelected !== undefined && (
        <p className="mt-1 text-right text-[11px] text-gray-500">
          {selectedIds.length}/{maxSelected} selected
        </p>
      )}
    </div>
  )
}
