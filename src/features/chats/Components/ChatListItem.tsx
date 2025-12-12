// ChatListItem.tsx
import { useNavigate } from "react-router-dom"
import type { ChatPair } from "../api"

import { useAuthStore } from "../../auth/useAuthStore"
import { CheckCheck } from "lucide-react"

const profileImage = (await import("../../../assets/profile2.png")).default

export interface ChatPairItemProps {
    pair: ChatPair
}

const ChatListItem: React.FC<ChatPairItemProps> = ({ pair }) => {
    const navigate = useNavigate()
    const authStore = useAuthStore()

    // Determine the other user
    const isUser1 = authStore.authUserName === pair.user1
    const otherUserName = isUser1 ? pair.user2 : pair.user1
    const otherUserImage = isUser1 ? pair.user2_image || profileImage : pair.user1_image || profileImage

    // Determine if last message was from current user (based on all_read)
    // Since we don't have last_message_sender, we'll assume it's from the other user
    const hasUnread = !pair.all_read

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
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group cursor-pointer ${
                hasUnread 
                    ? 'bg-gradient-to-r from-blue-50/80 to-blue-100/30 border border-blue-100 hover:from-blue-100 hover:to-blue-50' 
                    : 'bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200'
            } shadow-sm hover:shadow-md`}
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
                    <span className={`text-xs font-medium ${
                        hasUnread ? 'text-blue-600' : 'text-gray-400'
                    } whitespace-nowrap ml-2`}>
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
                        <CheckCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    )}
                </div>
            </div>

            {/* Unread Indicator */}
            {hasUnread && (
                <div className="flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
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