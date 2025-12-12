import type React from "react";
import AppButton from "../../../Shared/components/Button";
import { MessageSquare, Users, Mail, MoreVertical, Check, UserPlus, Camera } from "lucide-react";
import Post from "../../Feed/Components/Post";
import { getAllUserMyPosts, type PostFeed } from "../../Feed/api";
import { toast } from "react-toastify";
import { getOtherUserProfileAPI, sendFriendRequest, type Friend, type UserProfile } from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackNav from "../../../Shared/components/BackNav";
import PageLoad from "../../../Shared/components/PageLoad";
import axios from "axios";

import { useAuthStore } from "../../auth/useAuthStore";

const profileImage = (await import("../../../assets/profile2.png")).default

const UserProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userFriends, setUserFriends] = useState<Friend[]>([]);
    const [userPosts, setUserPosts] = useState<PostFeed[]>([]);
    const navigate = useNavigate();
    const [getProfileLoading, setGetProfileLoading] = useState<boolean>(false)
    const [isSendFriendReuqestLoading, setIsSendFriendRequestLoading] = useState<boolean>(false)
    const [myUserName, setMyUserName] = useState<string>("")
    const [isFriends, setIsFriends] = useState<boolean>(false)

    const authState = useAuthStore()


    const getUserProfile = async () => {
        setGetProfileLoading(true)
        try {
            if (id == undefined) throw ("Error getting user")
            const resp = await getOtherUserProfileAPI(id);
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

    const getMyPosts = async () => {
        try {
            if (id == undefined) throw ("Error getting user posts")
            const resp = await getAllUserMyPosts(id);
            console.log("User profile fetched successfully", resp);
            setUserPosts(resp.data);
        } catch (err) {
            console.error("Error fetching user profile", err);
            toast.error("Error fetching user profile");
        }
    }

    const handleSendFriendRequest = async () => {
        setIsSendFriendRequestLoading(true);
        try {
            const resp = await sendFriendRequest(userProfile!.user_name);
            console.log("Friend request sent successfully", resp);
            toast.success("Friend request sent successfully");
            setIsSendFriendRequestLoading(false);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Error sending friend request", err.response?.data?.message);
                toast.error(err.response?.data?.message || "Error sending friend request");
            } else {
                console.error("Error sending friend request", err);
                toast.error("Error sending friend request");
            }
            setIsSendFriendRequestLoading(false);
        }
    }

    useEffect(() => {
        const user = authState.authUserName
        if (user) {
            setMyUserName(user)
           
        }
        getUserProfile();
        getMyPosts();
    }, []);

    // Fix: Check if current user is in the other user's friends list
    useEffect(() => {
        if (userFriends.length > 0 && myUserName) {
            const isFriend = userFriends.some(friend => friend.user_name === myUserName);
            console.log("Checking friendship:", {
                myUserName,
                userFriends,
                isFriend
            });
            setIsFriends(isFriend);
        } else {
            setIsFriends(false);
        }
    }, [userFriends, myUserName]);

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
                .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
                .profile-gradient {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                }
                .stat-card {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    border: 1px solid #e2e8f0;
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <BackNav title="Profile" className="glass-card border-b border-gray-200/50" />

                <main className="pb-20">
                    <PageLoad loading={getProfileLoading} />

                    {/* Enhanced Profile Header */}
                    <div className="relative animate-fade-in">
                        {/* Cover Image Section */}
                        <div className="h-40 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                            {userProfile?.image ? (
                                <img
                                    className="w-full h-full object-cover opacity-80"
                                    src={userProfile.image}
                                    alt="Cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-600/90"></div>
                            )}
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>

                        {/* Profile Picture - Positioned over the cover */}
                        <div className="absolute -bottom-16 left-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={userProfile?.image || profileImage}
                                        alt="Profile"
                                    />
                                </div>
                                {/* Online Status */}
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content - Adjusted for image overlap */}
                    <div className="pt-20 px-6 animate-slide-in">
                        {/* User Info with Stats */}
                        <div className="mb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{userProfile?.name}</h1>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-gray-600">@{userProfile?.user_name}</span>
                                        {isFriends && (
                                            <span className="px-2 py-0.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                                                <Check className="w-3 h-3 inline mr-1" />
                                                Friends
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Bio Section */}
                            <div className="mt-4">
                                <p className="text-gray-600 leading-relaxed">
                                    {userProfile?.bio || "This user hasn't added a bio yet."}
                                </p>
                            </div>

                            {/* User Details */}
                            <div className="mt-6 space-y-3">
                                {userProfile?.user_name && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                        {userProfile.user_name}
                                    </div>
                                )}
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                                    <span className="font-medium mr-1">{userFriends.length}</span> friends
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {/* Add Friend Button */}
                            <AppButton
                                loading={isSendFriendReuqestLoading}
                                disabled={isFriends || (userProfile?.user_name === myUserName)}
                                variant="primary"
                                size="lg"
                                onClick={handleSendFriendRequest}
                                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg transition-all duration-300"
                            >
                                {isFriends ? (
                                    <span className="flex items-center justify-center">
                                        <Check className="w-5 h-5 mr-2" />
                                        Friends
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        {userProfile?.user_name === myUserName ? "Your Profile" : "Add Friend"}
                                    </span>
                                )}
                            </AppButton>

                            {/* Message Button - Only enabled if we are friends */}
                            <AppButton
                                variant="outline"
                                disabled={!isFriends}
                                size="lg"
                                className={`w-full border-2 transition-all duration-300 ${
                                    isFriends 
                                        ? "hover:border-primary hover:bg-blue-50 cursor-pointer" 
                                        : "opacity-50 cursor-not-allowed border-gray-300"
                                }`}
                                onClick={() => {
                                    if (isFriends && userProfile?.user_name) {
                                        navigate(`/chat/single_chat/${userProfile.user_name}`)
                                    }
                                }}
                            >
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Message
                                {!isFriends && (
                                    <span className="ml-1 text-xs opacity-75">(Add friend first)</span>
                                )}
                            </AppButton>
                        </div>

                        {/* Posts Section Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Posts</h2>
                                <div className="text-sm text-gray-500">
                                    {userPosts.length} posts
                                </div>
                            </div>
                            <div className="h-1 w-full bg-gradient-to-r from-primary to-purple-500 rounded-full mt-2"></div>
                        </div>

                        {/* Posts List */}
                        {userPosts.length > 0 ? (
                            <div className="space-y-6">
                                {userPosts.map((val, index) => (
                                    <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <Post mpost={val} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                    <Camera className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts yet</h3>
                                <p className="text-gray-500 mb-6">This user hasn't shared any posts.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}

export default UserProfilePage;