import type React from "react"
import BackNav from "../../../Shared/components/BackNav"
import { getUserProfileAPI, type Friend, type UserProfile } from "../api"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import PageLoad from "../../../Shared/components/PageLoad"
import AppButton from "../../../Shared/components/Button"
import { MessageSquare, User, Users } from "lucide-react"
const profileImage = (await import("../../../assets/profile2.png")).default

const MyFriendsPage = () => {
  const [_userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userFriends, setUserFriends] = useState<Friend[]>([]);
  const [getProfileLoading, setGetProfileLoading] = useState<boolean>(false)

  const getUserProfile = async () => {
    setGetProfileLoading(true)
    try {
      const resp = await getUserProfileAPI();
      console.log("User profile fetched successfully", resp);
      setUserProfile(resp.data.profile);
      setUserFriends(resp.data.friends);
      setGetProfileLoading(false)
    } catch (err) {
      console.error("Error fetching user profile", err);
      toast.error("Error fetching user profile");
      setGetProfileLoading(false)
    }
  }
  
  useEffect(() => {
    getUserProfile()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <BackNav title="My Friends" />
      
      <main className="pb-20">
        <div className="px-4 pt-2 pb-6">
          {/* Friends Summary Card */}
          <div className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Friends List</h3>
                  <p className="text-gray-600 text-sm">
                    {userFriends.length} {userFriends.length === 1 ? 'friend' : 'friends'} in total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{userFriends.length}</div>
              </div>
            </div>
          </div>

          <PageLoad loading={getProfileLoading} />
          
          {/* Friends List Section */}
          <div className="space-y-4">
            {userFriends.length === 0 && !getProfileLoading ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No friends yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
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
  friend: Friend,
}

const FriendComponent: React.FC<FriendsComponentProps> = ({ friend }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 hover:border-blue-300">
      <div className="flex items-center justify-between">
        {/* Profile Info */}
        <div 
          className="flex items-center space-x-4 flex-1 cursor-pointer"
          onClick={() => { navigate(`/user_profile/${friend.user_name}`) }}
        >
          <div className="relative">
            <img 
              className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-sm"
              src={friend.image || profileImage}
              alt={friend.name}
            />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {friend.name}
              </h3>
              {true && (
                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Online
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">@{friend.user_name}</p>
           
          </div>
        </div>

        {/* Action Button */}
        <div className="ml-3">
          <AppButton 
            variant="outline" 
            size="sm"
            className="group hover:bg-blue-50 hover:border-blue-200 transition-colors"
            onClick={() => { navigate(`/chat/single_chat/${friend.user_name}`) }}
          >
            <MessageSquare className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
            <span className="ml-2 hidden sm:inline text-sm font-medium group-hover:text-blue-600">
              Message
            </span>
          </AppButton>
        </div>
      </div>
      
  
    </div>
  )
}

export default MyFriendsPage