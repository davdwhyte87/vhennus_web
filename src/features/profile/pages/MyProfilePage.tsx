import type React from "react";
import AppButton from "../../../Shared/components/Button";
import { ListCheck, UserPlus, Edit3, Users, Grid3x3, Heart } from "lucide-react";
import Post from "../../Feed/Components/Post";
import { getAllMyPosts, type PostFeed } from "../../Feed/api";
import { toast } from "react-toastify";
import { getUserProfileAPI, type Friend, type UserProfile } from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackNav from "../../../Shared/components/BackNav";
import PageLoad from "../../../Shared/components/PageLoad";

const profileImage = (await import("../../../assets/profile2.png")).default

const MyProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userFriends, setUserFriends] = useState<Friend[]>([]);
    const [userPosts, setUserPosts] = useState<PostFeed[]>([]);
    const navigate = useNavigate();
    const [getProfileLoading, setGetProfileLoading] = useState<boolean>(false);

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

    const getMyPosts = async () => {
        try {
            const resp = await getAllMyPosts();
            console.log("User profile fetched successfully", resp);
            setUserPosts(resp.data);
        } catch (err) {
            console.error("Error fetching user profile", err);
            toast.error("Error fetching user profile");
        }
    }

    useEffect(() => {
        getUserProfile();
        getMyPosts();
    }, []);

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
                .floating-action {
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <BackNav 
                    title="My Profile" 
                    className="glass-card border-b border-gray-200/50"
                />

                <main className="pb-24">
                    <PageLoad loading={getProfileLoading} />

                    {/* Cover Image with Gradient Overlay */}
                    <div className="relative h-56 w-full overflow-hidden animate-fade-in">
                        <div className="absolute inset-0 profile-gradient">
                            {userProfile?.image ? (
                                <img
                                    className="w-full h-full object-cover opacity-80"
                                    src={userProfile.image}
                                    alt="Cover"
                                />
                            ) : null}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        
                     
                    </div>

                    {/* Profile Content */}
                    <div className="px-6 -mt-12 animate-slide-in">
                        {/* Profile Picture Section */}
                        <div className="flex items-end justify-between mb-4">
                            <div className="relative">
                                <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-2xl overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={userProfile?.image || profileImage}
                                        alt="Profile"
                                    />
                                </div>
                            </div>

                            <AppButton
                                variant="outline"
                                size="md"
                                onClick={() => { navigate("/editprofile") }}
                                className="border-2 hover:border-primary hover:bg-blue-50 transition-all duration-300 px-6"
                            >
                                <Edit3 className="w-5 h-5 mr-2" />
                                Edit Profile
                            </AppButton>
                        </div>

                        {/* User Info */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{userProfile?.name}</h1>
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="text-gray-600">@{userProfile?.user_name}</span>
                            </div>

                            {/* Bio */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                                <p className="text-gray-700 leading-relaxed">
                                    {userProfile?.bio || "You haven't added a bio yet. Tell people about yourself!"}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center space-x-6 mb-8">
                                <div 
                                    onClick={() => navigate("/my_friends")}
                                    className="text-center cursor-pointer group"
                                >
                                    <div className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{userFriends.length}</div>
                                    <div className="text-sm text-gray-600 flex items-center group-hover:text-primary transition-colors">
                                        <Users className="w-4 h-4 mr-1" />
                                        Friends
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-gray-900">{userPosts.length}</div>
                                    <div className="text-sm text-gray-600 flex items-center">
                                        <Grid3x3 className="w-4 h-4 mr-1" />
                                        Posts
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 gap-3 mb-8">
                                <div 
                                    onClick={() => navigate("/find_friends")}
                                    className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <UserPlus className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Find Friends</div>
                                            <div className="text-sm text-gray-600">Connect with people</div>
                                        </div>
                                    </div>
                                </div>

                                <div 
                                    onClick={() => navigate("/my_friend_requests")}
                                    className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <ListCheck className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Friend Requests</div>
                                            <div className="text-sm text-gray-600">View pending requests</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Posts Section Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">My Posts</h2>
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
                            <div className="text-center py-12 bg-gradient-to-b from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                    <Heart className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
                                <p className="text-gray-500 mb-6">Share your first post with the community!</p>
                                <AppButton
                                    variant="primary"
                                    onClick={() => navigate("/home/feeds/create-post")}
                                    className="bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg px-6"
                                >
                                    Create First Post
                                </AppButton>
                            </div>
                        )}
                    </div>

                    {/* Floating Action Button for Creating Post */}
                    <button
                        onClick={() => navigate("/home/feeds/create-post")}
                        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 animate-fade-in"
                    >
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </main>
            </div>
        </>
    )
}

export default MyProfilePage;