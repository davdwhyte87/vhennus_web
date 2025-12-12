import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Send, Image as ImageIcon, Paperclip, MoreVertical, ArrowLeft, CheckCheck } from "lucide-react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { type ChatPair, type CreateChatReq, getChatsAPI2 } from "../api"
import { type Chat, useWs } from "../socket"
import axios from "axios"
import TextArea from "../../../Shared/components/TextArea"
import AppButton from "../../../Shared/components/Button"
import formatISOTime from "../../../Shared/formatISOString"
import { useAuthStore } from "../../auth/useAuthStore"

const profileImage = (await import("../../../assets/profile2.png")).default

const SingleChatPage: React.FC = () => {
    const [message, setMessage] = useState<string>("")
    const { id } = useParams()
    const { messages, sendMessage } = useWs();
    const [chatMessages, setChatMessages] = useState<Chat[]>([])
    const [searchParams, _setSearchParam] = useSearchParams();
    const pairId = searchParams.get("pair_id")
    const authStore = useAuthStore()
    const [chatPair, setChatPair] = useState<ChatPair | null>(null)
    const scrollableContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate()

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
    }

    const getChats = async () => {
        try {
            const resp = await getChatsAPI2(id || "")
            setChatMessages(resp.data.chats)
            setChatPair(resp.data.chat_pair)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Error getting chats", err.response?.data?.message);
            } else {
                console.error("Error getting chats", err);
            }
        }
    }

    useEffect(() => {
        getChats()
    }, [])

    const handleSend = () => {
        if (id == null) {
            return
        }
        if (message.trim() !== '') {
            const createChat: CreateChatReq = {
                message,
                receiver: id
            }
            sendMessage(createChat)
            const date = new Date();

            let chat: Chat = {
                id: "",
                pair_id: pairId ? pairId : "",
                sender: authStore.authUserName ? authStore.authUserName : "",
                receiver: id ? id : "",
                message: message,
                created_at: date.toISOString(),
                updated_at: date.toISOString()
            }
            setChatMessages([...chatMessages, chat])
            setMessage("")
        }
    };

    const scrollToBottom = useCallback((smooth = false) => {
        const container = scrollableContainerRef.current;
        if (!container) return;
        container.scrollTo({ top: container.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    }, []);

    useEffect(() => {
        scrollToBottom(false);
    }, [chatMessages, messages, scrollToBottom]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const formatMessageDate = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return 'Today'
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday'
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        }
    }

    const groupedMessages = chatMessages.reduce((groups: { [key: string]: Chat[] }, chat) => {
        const date = formatMessageDate(chat.created_at)
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(chat)
        return groups
    }, {})

    const otherUserName = chatPair ? (authStore.authUserName === chatPair.user1 ? chatPair.user2 : chatPair.user1) : id || ""
    const otherUserImage = chatPair ? (authStore.authUserName === chatPair.user1 ? chatPair.user2_image || profileImage : chatPair.user1_image || profileImage) : profileImage

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
            `}</style>

            {/* Clean Header */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <img
                                    src={otherUserImage}
                                    className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                                    alt={otherUserName}
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">{otherUserName}</h2>
                                <p className="text-xs text-gray-500">Active recently</p>
                            </div>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </header>

            {/* Chat Messages Area */}
            <main className="flex-1 overflow-hidden">
                <div
                    ref={scrollableContainerRef}
                    className="h-full overflow-y-auto scroll-smooth px-4 py-4"
                >
                    {/* Simple Welcome Message */}
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-full border-2 border-gray-200 overflow-hidden">
                            <img
                                src={otherUserImage}
                                className="w-full h-full object-cover"
                                alt={otherUserName}
                            />
                        </div>
                        <h3 className="font-semibold text-gray-900">{otherUserName}</h3>
                        <p className="text-sm text-gray-500">
                            Start your conversation here
                        </p>
                    </div>

                    {/* Chat Messages */}
                    {Object.entries(groupedMessages).map(([date, messages]) => (
                        <div key={date} className="mb-6">
                            {/* Date Separator */}
                            <div className="flex items-center justify-center my-6">
                                <div className="px-4 py-1 bg-gray-200 rounded-full">
                                    <span className="text-xs font-medium text-gray-600">{date}</span>
                                </div>
                            </div>

                            {/* Messages for this date */}
                            {messages.map((chat, index) => {
                                const isSender = authStore.authUserName == chat.sender
                                const showTime = index === messages.length - 1 || 
                                    messages[index + 1].sender !== chat.sender

                                return (
                                    <div
                                        key={chat.id}
                                        className={`flex mb-3 ${isSender ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] ${isSender ? 'ml-4' : 'mr-4'}`}>
                                            <div
                                                className={`rounded-2xl px-4 py-3 ${isSender
                                                        ? 'bg-blue-600 text-white rounded-br-md'
                                                        : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                    {chat.message}
                                                </p>
                                            </div>

                                            {showTime && (
                                                <div className={`flex items-center mt-1 space-x-1 text-xs ${
                                                    isSender ? 'justify-end text-gray-500' : 'text-gray-400'
                                                }`}>
                                                    <span>{formatISOTime(chat.updated_at)}</span>
                                                    {isSender && (
                                                        <CheckCheck className="w-3 h-3 ml-1 text-blue-500" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </main>

            {/* Clean Message Input */}
            <footer className="sticky bottom-0 bg-white border-t border-gray-200 p-4 safe-area-inset-bottom">
                <div className="flex items-center space-x-3">
                    {/* Attachment Button */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                        <Paperclip className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* Image Button */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                        <ImageIcon className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* Message Input */}
                    <div className="flex-1 bg-gray-100 rounded-xl border border-gray-300 focus-within:border-blue-500 transition-all duration-200">
                        <TextArea
                            name="message"
                            value={message}
                            onChange={handleMessageChange}
                            onKeyDown={handleKeyPress}
                            rows={1}
                            placeholder="Type a message..."
                            className="w-full bg-transparent border-0 focus:ring-0 resize-none min-h-[46px] max-h-32 py-3 px-4 text-gray-900 placeholder-gray-500"
                        />
                    </div>

                    {/* Send Button */}
                    <AppButton
                        onClick={handleSend}
                        variant="primary"
                        size="sm"
                        disabled={!message.trim()}
                        className={`rounded-full w-11 h-11 flex items-center justify-center ${
                            message.trim()
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-300 cursor-not-allowed'
                        } transition-colors`}
                    >
                        <Send className="w-5 h-5 text-white" />
                    </AppButton>
                </div>
            </footer>
        </div>
    )
}

export default SingleChatPage