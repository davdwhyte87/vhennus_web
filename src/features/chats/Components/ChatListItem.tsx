// ChatListItem.tsx
import { useNavigate } from "react-router-dom"
import type { ChatPair } from "../api"

import { useAuthStore } from "../../auth/useAuthStore"
import { CheckCheck } from "lucide-react"

const profileImage = (await import("../../../assets/profile2.png")).default

export interface ChatPairItemProps {
    pair: ChatPair
    unreadCount?: number
}

const ChatListItem: React.FC<ChatPairItemProps> = ({ pair, unreadCount = 0 }) => {
    const navigate = useNavigate()
    const authStore = useAuthStore()

    // Determine the other user
    const isUser1 = authStore.authUserName === pair.user1
    const otherUserName = isUser1 ? pair.user2 : pair.user1
    const otherUserImage = isUser1 ? pair.user2_image || profileImage : pair.user1_image || profileImage

    // Real unread count from read receipts (all_read is legacy).
    const hasUnread = unreadCount > 0

    // Format time display
    const formatDisplayTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffHours = diffMs / (1000 * 60 * 60)
        
        if (diffHours < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60))
            if (diffMinutes < 1) return "Just now"
            return `${diffMinutes}m`
        } else if (diffHours < 24) {
            return `${Math.floor(diffHours)}h`
        } else if (diffHours < 168) { // 7 days
            const diffDays = Math.floor(diffHours / 24)
            return `${diffDays}d`
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
        }
    }

    const handleOpenChat = () => {
        navigate(`/chat/single_chat/${otherUserName}?pair_id=${pair.id}`)
    }

    return (
        <div
            onClick={handleOpenChat}
            className={`flex cursor-pointer items-center gap-4 border p-4 shadow-sm transition-colors group ${
                hasUnread
                    ? 'border-[#C9A86A] bg-[#C9A86A]/10 hover:border-[#CC5A2A]'
                    : 'border-[#C9A86A]/40 bg-white hover:border-[#C9A86A] hover:shadow-md'
            }`}
        >
            {/* Avatar with Status Indicator */}
            <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img
                        src={otherUserImage}
                        className="w-full h-full object-cover"
                        alt={otherUserName}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = profileImage
                        }}
                    />
                </div>
                {/* Online Status Indicator (static for now) */}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate ${hasUnread ? 'text-gray-900' : 'text-gray-800'}`}>
                        {otherUserName}
                    </h3>
                    <span className={`ml-2 whitespace-nowrap text-xs font-medium ${
                        hasUnread ? 'text-[#CC5A2A]' : 'text-gray-400'
                    }`}>
                        {formatDisplayTime(pair.updated_at)}
                    </span>
                </div>
                
                <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${
                        hasUnread ? 'text-gray-900 font-medium' : 'text-gray-600'
                    }`}>
                        {truncateText(pair.last_message, 35)}
                    </p>
                    
                    {/* Read Status Indicator */}
                    {!hasUnread && (
                        <CheckCheck className="w-3.5 h-3.5 text-[#C9A86A] flex-shrink-0" />
                    )}
                </div>
            </div>

            {/* Unread Indicator */}
            {hasUnread && (
                <div className="flex-shrink-0">
                    <div className="grid h-6 min-w-6 place-items-center rounded-full bg-[#CC5A2A] px-1.5 text-xs font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                </div>
            )}

            {/* Hover Effect Arrow */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    )
}

function truncateText(text: string, maxLength: number): string {
    if (!text || text.trim() === "") return "Start a conversation..."
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + '...';
}

export default ChatListItem;