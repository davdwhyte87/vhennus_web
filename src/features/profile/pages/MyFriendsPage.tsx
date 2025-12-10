import type React from "react"
import BackNav from "../../../Shared/components/BackNav"
import {  getUserProfileAPI, type Friend, type UserProfile } from "../api"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import { toast } from "react-toastify"

import PageLoad from "../../../Shared/components/PageLoad"
import AppButton from "../../../Shared/components/Button"
import { MessageSquare } from "lucide-react"
const profileImage = (await import("../../../assets/profile2.png")).default


const MyFriendsPage = ()=>{
   const [_userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userFriends, setUserFriends] = useState<Friend[]>([]);
    const [getProfileLoading, setGetProfileLoading] = useState<boolean>(false)


    const getUserProfile = async ()=>{
        // fetch user profile from api
        setGetProfileLoading(true)
        try{
            const resp = await getUserProfileAPI();
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
    useEffect(()=>{
        getUserProfile()
    }, [])


    return (
        <div>
            <BackNav title="My Friends" />
            <main>
                <div className="flex flex-col space-y-3 p-5">
                    <PageLoad loading={getProfileLoading} />
                    
                    {
                        userFriends.map((friend)=>(
                            <FriendComponent  friend={friend} />
                        ))
                    }

                </div>
            </main>
        </div>
    )
}


interface FriendsComponentProps{
    friend: Friend,
}

const FriendComponent:React.FC<FriendsComponentProps> = ({friend})=>{
    const navigate = useNavigate()

    
    return (
        <div className="flex flex-row justify-evenly w-full shadow-md p-3 space-x-3">
            <div className="" onClick={()=>{navigate(`/user_profile/${friend.user_name}`)}} > <img className="w-15 h-15 object-cover rounded-full" src={friend.image || profileImage } /></div>
            <div className="flex flex-col justify-start items-start">
                <text onClick={()=>{navigate(`/user_profile/${friend.user_name}`)}} className="text-lg font-bold">{friend.name}</text>
                <text className="text-gray-400">@{friend.user_name}</text>
            </div>
            <div>
                <AppButton variant="outline" size="sm" onClick={()=>{navigate(`/chat/single_chat/${friend.user_name}`)}}>
                    <MessageSquare/>
                </AppButton>
            </div>
        </div>
    )
}


export default MyFriendsPage