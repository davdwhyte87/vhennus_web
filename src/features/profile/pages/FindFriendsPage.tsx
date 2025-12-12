import { useEffect, useState } from "react";
import BackNav from "../../../Shared/components/BackNav";

import { Search, UserPlus, Users, Clock, Check, X, UserCheck, Mail, MoreVertical } from "lucide-react";
import AppButton from "../../../Shared/components/Button";
import { type FriendRequestResp, getMyFriendRequestsAPI, SearchUserProfileAPI, sendFriendRequest, type Friend } from "../api";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import InputField from "../../../Shared/components/InputFIeld";

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
                    border-left: 4px solid #667eea;
                }
                .search-highlight {
                    background: linear-gradient(120deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <BackNav title="Find Friends" className="glass-card border-b border-gray-200/50" />

                <main className="h-screen flex flex-col">
                    {/* Search Section */}
                    <div className="p-4 flex-shrink-0 animate-fade-in">
                        <div className="relative mb-2">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="p-2 bg-gradient-to-r from-primary to-purple-600 rounded-lg">
                                    <Search className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Search Friends</h2>
                            </div>
                            
                            <div className="relative">
                                <InputField
                                    name={"Search"}
                                    value={searchData}
                                    onChange={handleChangeSearchData}
                                    showIcon={true}
                                    icon={<Search className="w-5 h-5" />}
                                    iconClick={() => getFriend()}
                                    loading={isLoadingsearch}
                                    placeholder="Enter name or username..."
                                    className="w-full"
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
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Mail className="w-5 h-5 text-blue-600" />
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
                                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg"
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
                                        {friendSearchResults.map((data, index) => (
                                            <FriendSearchResult 
                                                key={data.user_name} 
                                                friend={data} 
                                                friendRequests={friendRequests}
                                                index={index}
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
                                        <button
                                            onClick={clearSearch}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                        >
                                            Try a different search
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : !searchData && friendSearchResults.length === 0 && !hasSearched ? (
                            <div className="text-center py-12 animate-fade-in">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                    <UserPlus className="w-12 h-12 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Find Your Friends</h3>
                                <p className="text-gray-600 max-w-md mx-auto mb-8 px-4">
                                    Enter a name or username above to search for friends
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 px-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                                            <Search className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1 text-center">1. Search</h4>
                                        <p className="text-sm text-gray-500 text-center">Enter name or username</p>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                                            <UserCheck className="w-5 h-5 text-purple-600" />
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
    index: number
}

const FriendSearchResult: React.FC<FriendSearchProps> = ({ friend, friendRequests, index }) => {
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
        <div 
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-primary transition-all duration-300 animate-fade-in group"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="flex items-center justify-between">
                {/* User Info */}
                <div 
                    className="flex items-center space-x-4 cursor-pointer flex-1"
                    onClick={() => { navigate(`/user_profile/${friend.user_name}`) }}
                >
                    <div className="relative">
                        <img 
                            className="w-14 h-14 rounded-full border-2 border-white shadow-md group-hover:border-primary transition-colors object-cover"
                            src={friend.image || profileImage}
                            alt={friend.name}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{friend.name}</h3>
                        <p className="text-sm text-gray-500">@{friend.user_name}</p>
                        {hasPendingRequest && (
                            <div className="flex items-center space-x-1 mt-1">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-yellow-600 font-medium">Request Pending</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0 ml-4">
                    {hasPendingRequest ? (
                        <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm font-medium flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Requested
                        </div>
                    ) : (
                        <AppButton
                            disabled={hasPendingRequest}
                            onClick={() => { handleSendFriendRequest() }}
                            loading={isSendFriendReuqestLoading}
                            size="sm"
                            className="bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Friend
                        </AppButton>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FindFriendsPage;