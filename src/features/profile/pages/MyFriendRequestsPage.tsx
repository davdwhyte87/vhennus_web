import type React from "react"
import BackNav from "../../../Shared/components/BackNav"
import { acceptFriendRequestsAPI, getMyFriendRequestsAPI, rejectFriendRequestsAPI, type FriendRequestResp } from "../api"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import AppButton from "../../../Shared/components/Button"
import { X, Check, Users, Mail, Calendar } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"
import PageLoad from "../../../Shared/components/PageLoad"
const profileImage = (await import("../../../assets/profile2.png")).default


const MyFriendRequestsPage = () => {
    const [friendRequests, setFriendRequests] = useState<FriendRequestResp[]>([])
    const [isGetMyFriendRequestsLoading, setIsGetMyFriendRequestsLoading] = useState<boolean>(false)

    const getFriendRequests = async () => {
        setIsGetMyFriendRequestsLoading(true)
        try {
            const res = await getMyFriendRequestsAPI()
            console.log("my friend requests", res)
            setFriendRequests(res.data)
            setIsGetMyFriendRequestsLoading(false)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Error getting friend requests", err.response?.data?.message);
            } else {
                console.error("Error getting friend requests", err);
            }
            setIsGetMyFriendRequestsLoading(false)
        }
    }

    useEffect(() => {
        getFriendRequests()
    }, [])

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
                .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
                .glass-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                }
                .request-card {
                    border-left: 3px solid #667eea;
                    transition: all 0.3s ease;
                }
                .request-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <BackNav 
                    title="Friend Requests" 
                    className="glass-card border-b border-gray-200/50"
                />

                <main className="pb-6">
                    <PageLoad loading={isGetMyFriendRequestsLoading} />

                    {/* Header Section */}
                    <div className="px-4 py-6 animate-fade-in">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-gradient-to-r from-primary to-purple-600 rounded-lg">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Friend Requests</h1>
                                <p className="text-sm text-gray-500">Manage your incoming requests</p>
                            </div>
                        </div>

                        {/* Stats Badge */}
                        <div className="flex items-center space-x-4 mt-4">
                            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-gray-700">
                                    {friendRequests.length} request{friendRequests.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Requests List */}
                    <div className="px-4">
                        {friendRequests.length > 0 ? (
                            <div className="space-y-4">
                                {friendRequests.map((req, index) => (
                                    <FriendRequestComponent 
                                        key={req.id} 
                                        friendRequest={req} 
                                        onReset={getFriendRequests}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 animate-fade-in">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                    <Mail className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No friend requests</h3>
                                <p className="text-gray-500 mb-6">
                                    When someone sends you a friend request, it will appear here
                                </p>
                                <AppButton
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="border-2 hover:border-primary"
                                >
                                    Go Back
                                </AppButton>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}

interface FriendRequestComponentProps {
    friendRequest: FriendRequestResp,
    onReset: () => void,
    index: number
}

const FriendRequestComponent: React.FC<FriendRequestComponentProps> = ({ friendRequest, onReset, index }) => {
    const navigate = useNavigate()
    const [isAcceptFriendRequestLoading, setIsAcceptFriendRequestLoading] = useState<boolean>(false)
    const [isRejectFriendRequestLoading, setIsRejectFriendRequestLoading] = useState<boolean>(false)

    const handleAcceptFriendRequest = async () => {
        setIsAcceptFriendRequestLoading(true);
        try {
            const resp = await acceptFriendRequestsAPI(friendRequest.id);
            console.log("Friend request accepted successfully", resp);
            toast.success("✅ Friend request accepted!");
            setIsAcceptFriendRequestLoading(false);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Error accepting friend request", err.response?.data?.message);
                toast.error(err.response?.data?.message || "Error accepting friend request");
            } else {
                console.error("Error accepting friend request", err);
                toast.error("Error accepting friend request");
            }
            setIsAcceptFriendRequestLoading(false);
        }
        onReset()
    }

    const handleCancelFriendRequest = async () => {
        setIsRejectFriendRequestLoading(true);
        try {
            const resp = await rejectFriendRequestsAPI(friendRequest.id);
            console.log("Friend request rejected successfully", resp);
            toast.success("🗑️ Friend request removed");
            setIsRejectFriendRequestLoading(false);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Error rejecting friend request", err.response?.data?.message);
                toast.error(err.response?.data?.message || "Error rejecting friend request");
            } else {
                console.error("Error rejecting friend request", err);
                toast.error("Error rejecting friend request");
            }
            setIsRejectFriendRequestLoading(false);
        }
        onReset()
    }

    // Format date for display
    const formatRequestDate = (dateString?: string) => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    }

    return (
        <div 
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 request-card animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="flex items-start">
                {/* User Info */}
                <div className="flex-1">
                    <div className="flex items-start space-x-3 mb-3">
                        <div 
                            className="relative cursor-pointer"
                            onClick={() => { navigate(`/user_profile/${friendRequest.user_name}`) }}
                        >
                            <img 
                                className="w-12 h-12 rounded-full border-2 border-white shadow object-cover"
                                src={friendRequest.image || profileImage}
                                alt={friendRequest.name}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                        </div>
                        
                        <div className="flex-1">
                            <div 
                                className="cursor-pointer mb-1"
                                onClick={() => { navigate(`/user_profile/${friendRequest.user_name}`) }}
                            >
                                <h3 className="font-semibold text-gray-900">{friendRequest.name}</h3>
                                <p className="text-gray-500 text-sm">@{friendRequest.user_name}</p>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatRequestDate(friendRequest.created_at)}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 mt-4">
                        <AppButton
                            onClick={handleAcceptFriendRequest}
                            loading={isAcceptFriendRequestLoading}
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                        </AppButton>
                        
                        <AppButton
                            variant="outline"
                            onClick={handleCancelFriendRequest}
                            loading={isRejectFriendRequestLoading}
                            size="sm"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Decline
                        </AppButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyFriendRequestsPage