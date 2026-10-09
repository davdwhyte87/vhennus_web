import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Plus, RotateCw, Sparkles, TrendingUp } from 'lucide-react'
import { toast } from 'react-toastify'
import Post from '../Components/Post.tsx'
import { getPostFeeds, type PostFeed } from '../api.ts'
import HomeNav from '../../../Shared/components/HomeNav.tsx'
import PageLoad from '../../../Shared/components/PageLoad.tsx'
import AppButton from '../../../Shared/components/Button.tsx'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<PostFeed[]>([])
  const [isPostsLoading, setIsPostLoading] = useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const refreshButtonClassName = [
    'flex items-center gap-2 border border-[#0A1931]/20 px-4 py-2',
    'text-sm font-medium text-[#0A1931] transition-colors',
    'hover:border-[#CC5A2A] hover:text-[#CC5A2A] disabled:opacity-60',
  ].join(' ')
  const fabClassName = [
    'fixed bottom-28 right-5 z-40 grid h-14 w-14 place-items-center',
    'rounded-full bg-[#0A1931] text-white shadow-xl transition-colors',
    'hover:bg-[#CC5A2A] sm:right-8 lg:bottom-8',
  ].join(' ')
  const toTopClassName = [
    'fixed bottom-44 right-5 z-40 grid h-11 w-11 place-items-center',
    'rounded-full border border-[#C9A86A]/60 bg-white shadow-lg',
    'transition-colors hover:text-[#CC5A2A] sm:right-8 lg:bottom-24',
  ].join(' ')

  const getFeeds = async () => {
    setIsPostLoading(true)
    try {
      const result = await getPostFeeds()
      setPosts(result.data)
    } catch (err) {
      console.error('Error fetching feeds', err)
      toast.error('Error fetching feeds')
    } finally {
      setIsPostLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await getFeeds()
  }

  useEffect(() => {
    getFeeds()
  }, [])

  return (
    <div className="min-h-screen">
      <HomeNav />

      <div className="sticky top-16 z-30 mt-6 border border-[#C9A86A]/60 bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center bg-[#0A1931] text-[#C9A86A]">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs text-[#4d5666]">Community feed</p>
              <p className="text-sm font-semibold text-[#0A1931]">
                {posts.length} post{posts.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={refreshButtonClassName}
          >
            <RotateCw
              className={['h-4 w-4', isRefreshing ? 'animate-spin' : ''].join(' ')}
            />
            Refresh
          </button>
        </div>
      </div>

      <div className="py-6">
        <PageLoad loading={isPostsLoading} />

        {posts.length === 0 && !isPostsLoading ? (
          <div className="border border-[#C9A86A]/60 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full bg-[#0A1931]/5">
              <Sparkles className="h-12 w-12 text-[#C9A86A]" />
            </div>
            <h3 className="font-serif text-xl text-[#0A1931]">
              No posts yet
            </h3>
            <p className="mt-2 text-[#4d5666]">
              Be the first to share something amazing.
            </p>
            <AppButton
              className="mt-6"
              onClick={() => navigate('/home/feeds/create-post')}
            >
              <Plus className="h-5 w-5" />
              Create First Post
            </AppButton>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {posts.map((post) => (
              <Post key={post.id} mpost={post} />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate('/home/feeds/create-post')}
        aria-label="Create post"
        className={fabClassName}
      >
        <Plus className="h-7 w-7" />
      </button>

      {posts.length > 5 && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className={toTopClassName}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default HomePage
