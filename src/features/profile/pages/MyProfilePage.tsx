import type React from "react";
import AppButton from "../../../Shared/components/Button";
import { ListCheck, UserPlus, Edit3, Users, Grid3x3, Heart } from "lucide-react";
import Post from "../../Feed/Components/Post";
import { getAllMyPosts, type PostFeed } from "../../Feed/api";
import { toast } from "react-toastify";
import { getUserProfileAPI, getMyFriendRequestsAPI, type Friend, type UserProfile } from "../api";
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
    const [pendingRequests, setPendingRequests] = useState<number>(0);

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
        getMyFriendRequestsAPI()
            .then((resp) => setPendingRequests(resp.data?.length ?? 0))
            .catch(() => setPendingRequests(0));
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
                    background: linear-gradient(135deg, #0A1931 0%, #CC5A2A 100%);
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                }
                .floating-action {
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                }
            `}</style>

            <div className="min-h-screen">
                <BackNav
                    title="My Profile"
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
                                <p className="text-left text-gray-700 leading-relaxed">
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
                                    className="border border-[#C9A86A]/60 bg-white p-4 cursor-pointer hover:border-[#CC5A2A] transition-colors group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="grid h-12 w-12 place-items-center bg-[#0A1931]">
                                            <UserPlus className="w-6 h-6 text-[#C9A86A]" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Find Friends</div>
                                            <div className="text-sm text-gray-600">Connect with people</div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => navigate("/my_friend_requests")}
                                    className="border border-[#C9A86A]/60 bg-white p-4 cursor-pointer hover:border-[#CC5A2A] transition-colors group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative grid h-12 w-12 place-items-center bg-[#0A1931]">
                                            <ListCheck className="w-6 h-6 text-[#C9A86A]" />
                                            {pendingRequests > 0 && (
                                                <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#CC5A2A] text-xs font-bold text-white">
                                                    {pendingRequests}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Friend Requests</div>
                                            <div className="text-sm text-gray-600">
                                                {pendingRequests > 0
                                                    ? `${pendingRequests} pending request${pendingRequests === 1 ? '' : 's'}`
                                                    : 'No pending requests'}
                                            </div>
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
                            <div className="h-1 w-full bg-gradient-to-r from-primary to-accent mt-2"></div>
                        </div>

                        {/* Posts List */}
                        {userPosts.length > 0 ? (
                            <div className="space-y-6">
                                {userPosts.map((val) => (
                                    <div key={val.id} className="animate-fade-in">
                                        <Post mpost={val} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-[#C9A86A] bg-white px-6 py-12 text-center">
                                <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-[#0A1931]/5">
                                    <Heart className="w-10 h-10 text-[#C9A86A]" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
                                <p className="text-gray-500 mb-6">Share your first post with the community!</p>
                                <AppButton
                                    onClick={() => navigate("/home/feeds/create-post")}
                                >
                                    Create First Post
                                </AppButton>
                            </div>
                        )}
                    </div>

                    {/* Floating Action Button for Creating Post */}
                    <button
                        type="button"
                        onClick={() => navigate("/home/feeds/create-post")}
                        aria-label="Create post"
                        className="fixed bottom-28 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#0A1931] text-white shadow-2xl transition-colors hover:bg-[#CC5A2A] sm:right-8 lg:bottom-8"
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