import { useEffect, useState } from "react";
import BackNav from "../../../Shared/components/BackNav";

import { Search, UserPlus, Users, Clock, Check, X, UserCheck, Mail, MoreVertical, Loader2 } from "lucide-react";
import AppButton from "../../../Shared/components/Button";
import AppInput from "../../../Shared/components/AppInput";
import { type FriendRequestResp, getMyFriendRequestsAPI, SearchUserProfileAPI, sendFriendRequest, type Friend } from "../api";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const profileImage = (await import("../../../assets/profile2.png")).default

const FindFriendsPage = () => {
    const [searchData, setSearchData] = useState<string>("");
    const [friendSearchResults, setfriendSearchResults] = useState<Friend[]>([])
    const [friendRequests, setFriendRequests] = useState<FriendRequestResp[]>([])
    const [isLoadingsearch, setIsLoadingsearch] = useState<boolean>(false)
    const [showRequests, setShowRequests] = useState<boolean>(true)
    const [hasSearched, setHasSearched] = useState<boolean>(false)

    const handleChangeSearchData = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchData(e.target.value);
        // Clear search results when user starts typing new search
        if (e.target.value === "") {
            setfriendSearchResults([]);
            setHasSearched(false);
        }
    }

    const getFriend = async () => {
        if (searchData.trim() === "") {
            toast.info("Please enter a name or username to search");
            return;
        }
        setIsLoadingsearch(true);
        setHasSearched(true);
        try {
            const res = await SearchUserProfileAPI(searchData)
            console.log("ok", res)
            setfriendSearchResults(res.data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Error searching", err.response?.data?.message);
                toast.error(err.response?.data?.message || "Error searching");
            } else {
                console.error("Error searching", err);
                toast.error("Error searching");
            }
            setfriendSearchResults([]);
        } finally {
            setIsLoadingsearch(false);
        }
    }

    const getFriendRequests = async () => {
        try {
            const res = await getMyFriendRequestsAPI()
            console.log("my friend requests", res)
            setFriendRequests(res.data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Error getting friend requests", err.response?.data?.message);
            } else {
                console.error("Error getting friend requests", err);
            }
        }
    }

    useEffect(() => {
        getFriendRequests()
    }, [])

    const clearSearch = () => {
        setSearchData("");
        setfriendSearchResults([]);
        setHasSearched(false);
    }

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
                .search-card {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    border: 1px solid #e2e8f0;
                }
                .request-card {
                    border-left: 4px solid #C9A86A;
                }
                .search-highlight {
                    background: rgba(201, 168, 106, 0.12);
                }
            `}</style>

            <div className="min-h-screen">
                <BackNav title="Find Friends" />

                <main className="h-screen flex flex-col">
                    {/* Search Section */}
                    <div className="p-4 flex-shrink-0 animate-fade-in">
                        <div className="relative mb-2">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="bg-[#0A1931] p-2">
                                    <Search className="w-5 h-5 text-[#C9A86A]" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Search Friends</h2>
                            </div>
                            
                            <div className="relative">
                                <AppInput
                                    name={"Search"}
                                    value={searchData}
                                    onChange={handleChangeSearchData}
                                    placeholder="Enter name or username..."
                                    className="w-full"
                                    rightElement={
                                        <button
                                            type="button"
                                            onClick={() => getFriend()}
                                            disabled={isLoadingsearch}
                                            className="flex h-full items-center bg-primary p-3 text-white transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:opacity-70"
                                            aria-label="Search"
                                        >
                                            {isLoadingsearch ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                                        </button>
                                    }
                                />
                                {searchData && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between mt-2 px-1">
                                <p className="text-sm text-gray-500">
                                    Press enter or click search button
                                </p>
                                {searchData && !isLoadingsearch && (
                                    <button
                                        onClick={getFriend}
                                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Search Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Friend Requests Section */}
                    {friendRequests.length > 0 && !hasSearched && (
                        <div className="px-4 pb-4 animate-slide-in">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-[#C9A86A]/20 p-2">
                                        <Mail className="w-5 h-5 text-[#0A1931]" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Friend Requests</h3>
                                </div>
                                <div className="relative">
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {friendRequests.length}
                                    </span>
                                    <button
                                        onClick={() => setShowRequests(!showRequests)}
                                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showRequests ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>
                            
                            {showRequests && (
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                    {friendRequests.map((request, index) => (
                                        <div 
                                            key={request.id} 
                                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 request-card animate-fade-in"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="relative">
                                                        <img 
                                                            className="w-12 h-12 rounded-full border-2 border-white shadow"
                                                            src={request.image || profileImage}
                                                            alt={request.name}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{request.name}</h4>
                                                        <p className="text-sm text-gray-500">@{request.user_name}</p>
                                                    </div>
                                                </div>
                                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                                    <MoreVertical className="w-5 h-5 text-gray-400" />
                                                </button>
                                            </div>
                                            <div className="flex space-x-2 mt-3">
                                                <AppButton 
                                                    size="sm" 
                                                    className="flex-1 bg-green-700"
                                                >
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Accept
                                                </AppButton>
                                                <AppButton 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                    Ignore
                                                </AppButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search Results Section */}
                    <div className="flex-1 px-4 pb-4 overflow-y-auto">
                        {hasSearched ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                                        <Search className="w-5 h-5 text-gray-400" />
                                        <span>Search Results</span>
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {friendSearchResults.length} found
                                    </span>
                                </div>
                                
                                {(friendSearchResults.length > 0) ? (
                                    <div className="space-y-3">
                                        {friendSearchResults.map((data) => (
                                            <FriendSearchResult
                                                key={data.user_name}
                                                friend={data}
                                                friendRequests={friendRequests}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 animate-fade-in">
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                            <Users className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No users found</h3>
                                        <p className="text-gray-500 mb-6">No results for "{searchData}"</p>
                                        <AppButton
                                            variant="secondary"
                                            size="sm"
                                            onClick={clearSearch}
                                        >
                                            Try a different search
                                        </AppButton>
                                    </div>
                                )}
                            </>
                        ) : !searchData && friendSearchResults.length === 0 && !hasSearched ? (
                            <div className="text-center py-12 animate-fade-in">
                                    <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-[#C9A86A]/20">
                                        <UserPlus className="w-12 h-12 text-[#0A1931]" />
                                    </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Find Your Friends</h3>
                                <p className="text-gray-600 max-w-md mx-auto mb-8 px-4">
                                    Enter a name or username above to search for friends
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 px-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="mx-auto mb-3 grid h-10 w-10 place-items-center bg-[#0A1931]/5">
                                            <Search className="w-5 h-5 text-[#0A1931]" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1 text-center">1. Search</h4>
                                        <p className="text-sm text-gray-500 text-center">Enter name or username</p>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="mx-auto mb-3 grid h-10 w-10 place-items-center bg-[#0A1931]/5">
                                            <UserCheck className="w-5 h-5 text-[#CC5A2A]" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1 text-center">2. Connect</h4>
                                        <p className="text-sm text-gray-500 text-center">Send friend requests</p>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                                            <Clock className="w-5 h-5 text-green-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1 text-center">3. Connect</h4>
                                        <p className="text-sm text-gray-500 text-center">Start chatting</p>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </main>
            </div>
        </>
    )
}

interface FriendSearchProps {
    friend: Friend,
    friendRequests: FriendRequestResp[],
}

const FriendSearchResult: React.FC<FriendSearchProps> = ({ friend, friendRequests }) => {
    const [isSendFriendReuqestLoading, setIsSendFriendRequestLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const hasPendingRequest = friendRequests.some((fr) => fr.user_name == friend.user_name || fr.requester == friend.user_name)

    const handleSendFriendRequest = async () => {
        setIsSendFriendRequestLoading(true);
        try {
            const resp = await sendFriendRequest(friend.user_name);
            console.log("Friend request sent successfully", resp);
            toast.success("✅ Friend request sent!");
            setIsSendFriendRequestLoading(false);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Error sending friend request");
            } else {
                toast.error("Error sending friend request");
            }
            setIsSendFriendRequestLoading(false);
        }
    }

    return (
        <div className="border border-[#C9A86A]/60 bg-white p-4 transition-colors hover:border-[#CC5A2A]">
            <div className="flex items-center justify-between gap-3">
                {/* User Info */}
                <div
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 text-left"
                    onClick={() => { navigate(`/user_profile/${friend.user_name}`) }}
                >
                    <div className="relative shrink-0">
                        <img
                            className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
                            src={friend.image || profileImage}
                            alt={friend.name}
                        />
                        <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-[#0A1931]">{friend.name}</h3>
                        <p className="truncate text-sm text-[#4d5666]">@{friend.user_name}</p>
                        {friend.bio && (
                            <p className="mt-0.5 truncate text-left text-sm text-[#4d5666]">{friend.bio}</p>
                        )}
                        {hasPendingRequest && (
                            <p className="mt-1 text-xs font-medium text-[#CC5A2A]">
                                Request pending
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <div className="ml-3 shrink-0">
                    {hasPendingRequest ? (
                        <span className="bg-[#C9A86A]/20 px-3 py-2 text-sm font-medium text-[#0A1931]">
                            Requested
                        </span>
                    ) : (
                        <AppButton
                            onClick={() => { handleSendFriendRequest() }}
                            loading={isSendFriendReuqestLoading}
                            size="sm"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span className="ml-2 hidden text-sm font-medium sm:inline">
                                Add Friend
                            </span>
                        </AppButton>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FindFriendsPage;