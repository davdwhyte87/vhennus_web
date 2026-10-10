import { useNavigate } from 'react-router-dom'
import type { MyGroupItem } from '../api'

export default function GroupListItem({
  group,
  unreadCount,
}: {
  group: MyGroupItem
  unreadCount: number
}) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(`/home/groups/${group.id}`)}
      className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left transition-colors hover:bg-[#F5F5F0]"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0A1931]/10 font-serif text-lg text-[#0A1931]">
        {group.image ? (
          <img src={group.image} alt={group.name} className="h-full w-full object-cover" />
        ) : (
          group.name.slice(0, 1).toUpperCase()
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-[#0A1931]">{group.name}</p>
          {group.is_private && (
            <span className="shrink-0 rounded-full bg-[#0A1931]/10 px-2 py-0.5 text-[11px] text-[#4d5666]">
              Private
            </span>
          )}
        </div>
        <p className="truncate text-sm text-[#4d5666]">
          {group.open_topic ? `📌 ${group.open_topic.title}` : (group.last_message?.text ?? group.about ?? 'No messages yet')}
        </p>
        <p className="mt-0.5 text-xs text-[#6b7180]">
          {group.member_count} member{group.member_count === 1 ? '' : 's'}
          {group.categories.slice(0, 2).map((c) => ` · ${c}`).join('')}
        </p>
      </div>
      {unreadCount > 0 && (
        <span className="grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-[#CC5A2A] px-1.5 text-[12px] font-bold text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}
