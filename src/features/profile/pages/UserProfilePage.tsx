import type React from "react";
import AppButton from "../../../Shared/components/Button";
import { ListCheck, MessageSquare, Plus, UserPlus } from "lucide-react";
import Post from "../../Feed/Components/Post";
import { getAllMyPosts, getAllUserMyPosts, type PostFeed } from "../../Feed/api";
import { toast } from "react-toastify";
import { getOtherUserProfileAPI, getUserProfileAPI, sendFriendRequest, type Friend, type UserProfile } from "../api";
import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackNav from "../../../Shared/components/BackNav";
import PageLoad from "../../../Shared/components/PageLoad";
import axios from "axios";
import { getUserLocalData } from "../../../Shared/AuthData";


const profileImage = (await import("../../../assets/profile2.png")).default

const UserProfilePage:React.FC = ()=>{  
    const { id } = useParams<{ id: string }>();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userFriends, setUserFriends] = useState<Friend[]>([]);
    const [userPosts, setUserPosts] = useState<PostFeed[]>([]);
    const navigate = useNavigate();
    const [getProfileLoading, setGetProfileLoading] = useState<boolean>(false)
    const [isSendFriendReuqestLoading, setIsSendFriendRequestLoading] = useState<boolean>(false)
    const [myUserName, setMyUserName] = useState<string>("")
    const [isFriends, setIsFriends] = useState<boolean>(false)
    const getUserProfile = async ()=>{
        // fetch user profile from api
        setGetProfileLoading(true)
        try{
            if (id==undefined) throw("Error getting user")
            const resp = await getOtherUserProfileAPI(id);
            console.log("User profile fetched successfully", resp);
            setUserProfile(resp.data.profile);
            
            setUserFriends(resp.data.friends);
            setGetProfileLoading(false)

        }catch(err){
            console.error("Error fetching user profile", err);
            toast.error("Error fetching user profile");
            setGetProfileLoading(false)
        }
    }

    const getMyPosts = async ()=>{
        // fetch user profile from api

        try{
            if (id==undefined) throw("Error getting user posts")
            const resp = await getAllUserMyPosts(id);
            console.log("User profile fetched successfully", resp);
            setUserPosts(resp.data);

        }catch(err){
            console.error("Error fetching user profile", err);
            toast.error("Error fetching user profile");
        }
    }

    const handleSendFriendRequest = async ()=>{
        setIsSendFriendRequestLoading(true);
        // send friend request to user
        try{
            const resp = await sendFriendRequest(userProfile!.user_name);
            console.log("Friend request sent successfully", resp);
            toast.success("Friend request sent successfully");
            setIsSendFriendRequestLoading(false);
        }
        catch(err){
            if (axios.isAxiosError(err)) {
                console.error("Error sending friend request", err.response?.data?.message);
                toast.error( err.response?.data?.message || "Error sending friend request");
            }else{
                console.error("Error sending friend request", err);
                toast.error("Error sending friend request");
            }
       
            setIsSendFriendRequestLoading(false);
        }   
    }

    useEffect(()=>{
        const user =getUserLocalData()
        if(user){
            setMyUserName(user.user_name)
        }
        getUserProfile();  
        getMyPosts(); 
    }, []);

    useEffect(()=>{

        userFriends.forEach((friend)=>{
            if (friend.user_name == myUserName ){
                console.log("setting friend to ture")
                setIsFriends(true)
            }
        })
    }, [userFriends, myUserName])
    return(
        <div>
            <BackNav/>
            <main>

                <div className="flex flex-col space-y-5">
                    <PageLoad loading={getProfileLoading}/>
                    <div className="w-full h-[30vh]">
                        <img className="w-full h-full object-cover" src={userProfile?.image || profileImage} alt="Profile Image"  />
                    </div>
                    <div className="flex flex-col p-5 space-y-5">
                        <div className="flex flex-row justify-between w-full">
                            <div className="flex flex-col justify-start items-start">
                                <text className="text-2xl font-bold">{userProfile?.name}</text>
                                <text className="text-sm text-gray-500">@{userProfile?.user_name}</text>
                            </div>
                            <div>
                              
                            </div>
                        </div>
                        <div className="flex flex-row w-full justify-between px-5">
                            <AppButton loading={isSendFriendReuqestLoading} disabled={userFriends.some(friend => friend.user_name === getUserLocalData()?.user_name)} variant="primary" size="sm" onClick={()=>{handleSendFriendRequest()}}>
                                Send Request
                            </AppButton>
                            <AppButton variant="outline" disabled={!isFriends}  className="p-3" size="sm" onClick={()=>{navigate(`/chat/single_chat/${userProfile?.user_name}`)}}>
                                Message   <MessageSquare />
                            </AppButton>
                        </div>
                        <text className="text-base text-gray-500 text-start">
                            {userProfile?.bio || "No bio yet." }
                        </text>
                        <div className="flex flex-row space-x-2">
                            <text className="cursor-pointer underline text-base text-start">
                                {userFriends.length}
                            </text>
                            <text className="text-base text-gray-500 text-start">
                                Friends
                            </text>
                        </div>
                        

                        <text className="text-xl font-bold text-start">
                            Posts
                        </text>
                        {
                            userPosts.map((val, index)=>(
                            <Post mpost={val} key={index}/> 
                            ))
                        }
                    
                    </div>
   
                </div>
            </main>
        </div>
    )
}

export default UserProfilePage;