// AllChatsPage.tsx
import axios from "axios";
import ChatListItem from "../Components/ChatListItem.tsx";
import { toast } from "react-toastify";
import { type ChatPair, getAllMyChatPairsAPI } from "../api.ts";
import { useEffect, useState } from "react";
import { Search, MessageSquarePlus, Filter } from "lucide-react";
import AppButton from "../../../Shared/components/Button";

const AllChatsPage: React.FC = () => {
    const [chatPairs, setChatPairs] = useState<ChatPair[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const getAllChatPairs = async () => {
        setIsLoading(true)
        try {
            const resp = await getAllMyChatPairsAPI()
            setChatPairs(resp.data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Error getting chat pairs", err.response?.data?.message);
                toast.error(err.response?.data?.message || "Error getting chat pairs");
            } else {
                console.error("Error getting chat pairs", err);
                toast.error("Error sending api request");
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getAllChatPairs()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {chatPairs.length} {chatPairs.length === 1 ? 'conversation' : 'conversations'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Filter className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-100/80 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                    />
                </div>
            </header>

            <main className="pb-20">
                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-14 h-14 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading conversations...</p>
                    </div>
                ) : (
                    <>
                        {/* Empty State */}
                        {chatPairs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 px-4">
                                <div className="w-24 h-24 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-6">
                                    <MessageSquarePlus className="w-12 h-12 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">No conversations yet</h3>
                                <p className="text-gray-500 text-center max-w-sm mb-8">
                                    Start messaging your friends to begin your conversations
                                </p>
                                <AppButton
                                    variant="primary"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 px-8"
                                >
                                    Start New Chat
                                </AppButton>
                            </div>
                        ) : (
                            /* Chats List */
                            <div className="px-4">
                                {/* Unread Chats Section */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between px-2 mb-3">
                                        <h2 className="text-sm font-semibold text-gray-700">Recent</h2>
                                        <span className="text-xs text-gray-400">
                                            {chatPairs.filter(pair => !pair.all_read).length} unread
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {chatPairs.filter(pair => !pair.all_read).map((pair, index) => (
                                            <div 
                                                key={pair.id} 
                                                className="animate-fade-in-up"
                                                style={{ animationDelay: `${index * 0.05}s` }}
                                            >
                                                <ChatListItem pair={pair} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* All Chats Section */}
                                <div className="mt-6">
                                    <h2 className="text-sm font-semibold text-gray-700 px-2 mb-3">All Conversations</h2>
                                    <div className="space-y-2">
                                        {chatPairs.filter(pair => pair.all_read).map((pair, index) => (
                                            <div 
                                                key={pair.id}
                                                className="animate-fade-in-up"
                                                style={{ animationDelay: `${index * 0.05}s` }}
                                            >
                                                <ChatListItem pair={pair} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* No Results State for Search */}
                                {searchTerm && chatPairs.length > 0 && !chatPairs.some(pair => 
                                    pair.user1.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    pair.user2.toLowerCase().includes(searchTerm.toLowerCase())
                                ) && (
                                    <div className="text-center py-12">
                                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No conversations found</p>
                                        <button 
                                            onClick={() => setSearchTerm("")}
                                            className="text-blue-600 text-sm font-medium mt-2"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-20">
                <AppButton
                    variant="primary"
                    size="lg"
                    className="rounded-full w-16 h-16 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                    <MessageSquarePlus className="w-7 h-7" />
                </AppButton>
            </div>
        </div>
    )
}

export default AllChatsPage