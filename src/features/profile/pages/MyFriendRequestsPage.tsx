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
                    border-left: 3px solid #C9A86A;
                    transition: all 0.3s ease;
                }
                .request-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
                }
            `}</style>

            <div className="min-h-screen">
                <BackNav
                    title="Friend Requests"
                />

                <main className="pb-6">
                    <PageLoad loading={isGetMyFriendRequestsLoading} />

                    {/* Header Section */}
                    <div className="px-4 py-6 animate-fade-in">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="bg-[#0A1931] p-2">
                                <Mail className="w-5 h-5 text-[#C9A86A]" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Friend Requests</h1>
                                <p className="text-sm text-gray-500">Manage your incoming requests</p>
                            </div>
                        </div>

                        {/* Stats Badge */}
                        <div className="flex items-center space-x-4 mt-4">
                            <div className="flex items-center space-x-2 px-3 py-2 bg-[#C9A86A]/15">
                                <Users className="w-4 h-4 text-[#0A1931]" />
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
                                {friendRequests.map((req) => (
                                    <FriendRequestComponent
                                        key={req.id}
                                        friendRequest={req}
                                        onReset={getFriendRequests}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 animate-fade-in">
                                <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-[#0A1931]/5">
                                    <Mail className="w-10 h-10 text-[#C9A86A]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No friend requests</h3>
                                <p className="text-gray-500 mb-6">
                                    When someone sends you a friend request, it will appear here
                                </p>
                                <AppButton
                                    variant="outline"
                                    onClick={() => window.history.back()}
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
}

const FriendRequestComponent: React.FC<FriendRequestComponentProps> = ({ friendRequest, onReset }) => {
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
        <div className="border border-[#C9A86A]/60 bg-white p-4 transition-colors hover:border-[#CC5A2A]">
            <div
                className="flex cursor-pointer items-center gap-4 text-left"
                onClick={() => { navigate(`/user_profile/${friendRequest.requester}`) }}
            >
                <div className="relative shrink-0">
                    <img
                        className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
                        src={friendRequest.image || profileImage}
                        alt={friendRequest.name}
                    />
                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-[#0A1931]">{friendRequest.name}</h3>
                    <p className="truncate text-sm text-[#4d5666]">@{friendRequest.requester}</p>
                    <p className="mt-0.5 flex items-center text-xs text-[#4d5666]">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatRequestDate(friendRequest.created_at)}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex gap-2">
                <AppButton
                    onClick={handleAcceptFriendRequest}
                    loading={isAcceptFriendRequestLoading}
                    size="sm"
                    fullWidth
                >
                    <Check className="h-4 w-4" />
                    Accept
                </AppButton>
                <AppButton
                    variant="outline"
                    onClick={handleCancelFriendRequest}
                    loading={isRejectFriendRequestLoading}
                    size="sm"
                    fullWidth
                    className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                >
                    <X className="h-4 w-4" />
                    Decline
                </AppButton>
            </div>
        </div>
    )
}

export default MyFriendRequestsPage