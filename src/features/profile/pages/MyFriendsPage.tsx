import type React from 'react'
import BackNav from '../../../Shared/components/BackNav'
import { getUserProfileAPI, type Friend, type UserProfile } from '../api'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import PageLoad from '../../../Shared/components/PageLoad'
import AppButton from '../../../Shared/components/Button'
import { MessageSquare, User, Users } from 'lucide-react'

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
                  <FriendComponent key={friend.user_name} friend={friend} />
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
}

const FriendComponent: React.FC<FriendsComponentProps> = ({ friend }) => {
  const navigate = useNavigate()

  return (
    <div className="border border-[#C9A86A]/60 bg-white p-4 transition-colors hover:border-[#CC5A2A]">
      <div className="flex items-center justify-between">
        <div
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-4"
          onClick={() => {
            navigate(`/user_profile/${friend.user_name}`)
          }}
        >
          <div className="relative">
            <img
              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
              src={friend.image || profileImage}
              alt={friend.name}
            />
            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold text-[#0A1931]">
                {friend.name}
              </h3>
              <span className="bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Online
              </span>
            </div>
            <p className="truncate text-sm text-[#4d5666]">
              @{friend.user_name}
            </p>
          </div>
        </div>

        <div className="ml-3">
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => {
              navigate(`/chat/single_chat/${friend.user_name}`)
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="ml-2 hidden text-sm font-medium sm:inline">
              Message
            </span>
          </AppButton>
        </div>
      </div>
    </div>
  )
}

export default MyFriendsPage
