// AllChatsPage.tsx
import axios from 'axios'
import ChatListItem from '../Components/ChatListItem.tsx'
import { toast } from 'react-toastify'
import { type ChatPair, getAllMyChatPairsAPI } from '../api.ts'
import { useEffect, useState } from 'react'
import { Search, MessageSquarePlus, Filter } from 'lucide-react'
import AppButton from '../../../Shared/components/Button'
import PageHeader from '../../../Shared/components/PageHeader.tsx'

const AllChatsPage: React.FC = () => {
  const [chatPairs, setChatPairs] = useState<ChatPair[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const getAllChatPairs = async () => {
    setIsLoading(true)
    try {
      const resp = await getAllMyChatPairsAPI()
      setChatPairs(resp.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Error getting chat pairs')
      } else {
        toast.error('Error sending api request')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAllChatPairs()
  }, [])

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#C9A86A]/60 bg-[#F5F5F0]/95 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <PageHeader
            eyebrow={`${chatPairs.length} ${
              chatPairs.length === 1 ? 'conversation' : 'conversations'
            }`}
            title="Chats"
          />
          <button
            type="button"
            aria-label="Filter"
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-[#0A1931]/5"
          >
            <Filter className="h-5 w-5 text-[#0A1931]" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4d5666]" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#0A1931]/25 bg-white py-3 pl-11 pr-4 outline-none transition-colors placeholder:text-[#6b7180] focus:border-[#CC5A2A] focus:ring-1 focus:ring-[#CC5A2A]"
          />
        </div>
      </header>

      <main className="pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 h-14 w-14 animate-spin rounded-full border-[3px] border-[#C9A86A]/40 border-t-[#CC5A2A]" />
            <p className="font-medium text-[#4d5666]">
              Loading conversations...
            </p>
          </div>
        ) : (
          <>
            {chatPairs.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-24">
                <div className="mb-6 grid h-24 w-24 place-items-center rounded-full bg-[#0A1931]/5">
                  <MessageSquarePlus className="h-12 w-12 text-[#C9A86A]" />
                </div>
                <h3 className="mb-3 font-serif text-xl text-[#0A1931]">
                  No conversations yet
                </h3>
                <p className="mb-8 max-w-sm text-center text-[#4d5666]">
                  Start messaging your friends to begin your conversations
                </p>
                <AppButton>Start New Chat</AppButton>
              </div>
            ) : (
              <div className="px-4 sm:px-6">
                <div className="mb-3">
                  <div className="mb-3 flex items-center justify-between px-2">
                    <h2 className="text-sm font-semibold text-[#0A1931]">
                      Recent
                    </h2>
                    <span className="text-xs text-[#4d5666]">
                      {chatPairs.filter((pair) => !pair.all_read).length}{' '}
                      unread
                    </span>
                  </div>
                  <div className="space-y-2">
                    {chatPairs
                      .filter((pair) => !pair.all_read)
                      .map((pair) => (
                        <div key={pair.id}>
                          <ChatListItem pair={pair} />
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="mb-3 px-2 text-sm font-semibold text-[#0A1931]">
                    All Conversations
                  </h2>
                  <div className="space-y-2">
                    {chatPairs
                      .filter((pair) => pair.all_read)
                      .map((pair) => (
                        <div key={pair.id}>
                          <ChatListItem pair={pair} />
                        </div>
                      ))}
                  </div>
                </div>

                {searchTerm &&
                  chatPairs.length > 0 &&
                  !chatPairs.some(
                    (pair) =>
                      pair.user1
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      pair.user2.toLowerCase().includes(searchTerm.toLowerCase())
                  ) && (
                    <div className="py-12 text-center">
                      <Search className="mx-auto mb-4 h-12 w-12 text-[#C9A86A]" />
                      <p className="text-[#4d5666]">No conversations found</p>
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-sm font-medium text-[#CC5A2A] hover:text-[#0A1931]"
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

      <div className="fixed bottom-28 right-5 z-30 sm:right-8 lg:bottom-8">
        <AppButton className="h-16 w-16 shadow-lg">
          <MessageSquarePlus className="h-7 w-7" />
        </AppButton>
      </div>
    </div>
  )
}

export default AllChatsPage
