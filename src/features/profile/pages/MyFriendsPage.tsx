import type React from 'react'
import BackNav from '../../../Shared/components/BackNav'
import { getUserProfileAPI, unfriendAPI, type Friend, type UserProfile } from '../api'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import PageLoad from '../../../Shared/components/PageLoad'
import { MessageSquare, User, UserMinus, Users } from 'lucide-react'

const profileImage = (await import('../../../assets/profile2.png')).default

const MyFriendsPage = () => {
  const [_userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userFriends, setUserFriends] = useState<Friend[]>([])
  const [getProfileLoading, setGetProfileLoading] = useState<boolean>(false)

  const getUserProfile = async () => {
    setGetProfileLoading(true)
    try {
      const resp = await getUserProfileAPI()
      setUserProfile(resp.data.profile)
      setUserFriends(resp.data.friends)
      setGetProfileLoading(false)
    } catch (err) {
      console.error('Error fetching user profile', err)
      toast.error('Error fetching user profile')
      setGetProfileLoading(false)
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [])

  return (
    <div className="min-h-screen">
      <BackNav title="My Friends" />

      <main className="pb-20">
        <div className="px-4 pb-6 pt-2 sm:px-6">
          <div className="mb-6 border border-[#C9A86A]/60 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[#C9A86A]/20 p-3">
                  <Users className="h-6 w-6 text-[#0A1931]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A1931]">
                    Friends List
                  </h3>
                  <p className="text-sm text-[#4d5666]">
                    {userFriends.length}{' '}
                    {userFriends.length === 1 ? 'friend' : 'friends'} in total
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-[#CC5A2A]">
                {userFriends.length}
              </div>
            </div>
          </div>

          <PageLoad loading={getProfileLoading} />

          <div className="space-y-3">
            {userFriends.length === 0 && !getProfileLoading ? (
              <div className="border border-[#C9A86A]/60 bg-white px-6 py-12 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#0A1931]/5">
                  <User className="h-8 w-8 text-[#C9A86A]" />
                </div>
                <h3 className="mb-2 font-serif text-lg text-[#0A1931]">
                  No friends yet
                </h3>
                <p className="mx-auto max-w-sm text-[#4d5666]">
                  Start connecting with people to see your friends list here
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {userFriends.map((friend) => (
                  <FriendComponent
                    key={friend.user_name}
                    friend={friend}
                    onRemoved={(userName) =>
                      setUserFriends((prev) =>
                        prev.filter((f) => f.user_name !== userName)
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

interface FriendsComponentProps {
  friend: Friend
  onRemoved: (userName: string) => void
}

const FriendComponent: React.FC<FriendsComponentProps> = ({
  friend,
  onRemoved,
}) => {
  const navigate = useNavigate()
  const [removing, setRemoving] = useState(false)

  const handleUnfriend = async () => {
    if (!window.confirm(`Remove @${friend.user_name} from your friends?`)) return
    setRemoving(true)
    try {
      await unfriendAPI(friend.user_name)
      toast.success('Friend removed')
      onRemoved(friend.user_name)
    } catch {
      toast.error('Unable to remove friend')
      setRemoving(false)
    }
  }

  return (
    <div className="overflow-hidden border border-[#C9A86A]/60 bg-white transition-colors hover:border-[#CC5A2A]">
      <div className="h-1 bg-gradient-to-r from-[#0A1931] via-[#C9A86A] to-[#CC5A2A]" />
      <div className="flex items-center gap-4 p-4 text-left">
        <div
          className="relative shrink-0 cursor-pointer"
          onClick={() => {
            navigate(`/user_profile/${friend.user_name}`)
          }}
        >
          <img
            className="h-14 w-14 rounded-full border-2 border-[#C9A86A]/60 object-cover"
            src={friend.image || profileImage}
            alt={friend.name}
          />
          <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
        </div>

        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => {
            navigate(`/user_profile/${friend.user_name}`)
          }}
        >
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-[#0A1931]">
              {friend.name}
            </h3>
            <span className="shrink-0 bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">
              Friends
            </span>
          </div>
          <p className="truncate text-sm text-[#4d5666]">
            @{friend.user_name}
          </p>
          {friend.bio && (
            <p className="mt-0.5 truncate text-left text-sm text-[#4d5666]">
              {friend.bio}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigate(`/chat/single_chat/${friend.user_name}`)
            }}
            aria-label={`Message ${friend.user_name}`}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#0A1931] text-white transition-colors hover:bg-[#CC5A2A]"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleUnfriend}
            disabled={removing}
            aria-label={`Unfriend ${friend.user_name}`}
            className="grid h-10 w-10 place-items-center rounded-full text-[#4d5666] transition-colors hover:bg-red-50 hover:text-[#CC5A2A] disabled:opacity-50"
          >
            <UserMinus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyFriendsPage
