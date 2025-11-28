import type React from "react";
import AppButton from "../../../Shared/components/Button";
import { ListCheck, Plus, UserPlus } from "lucide-react";
import Post from "../../Feed/Components/Post";
import { getAllMyPosts, type PostFeed } from "../../Feed/api";
import { toast } from "react-toastify";
import { getUserProfileAPI, type Friend, type UserProfile } from "../api";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackNav from "../../../Shared/components/BackNav";
import PageLoad from "../../../Shared/components/PageLoad";


const profileImage = (await import("../../../assets/profile2.png")).default

const MyProfilePage:React.FC = ()=>{  

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userFriends, setUserFriends] = useState<Friend[]>([]);
    const [userPosts, setUserPosts] = useState<PostFeed[]>([]);
    const navigate = useNavigate();
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

    const getMyPosts = async ()=>{
        // fetch user profile from api

        try{
            const resp = await getAllMyPosts();
            console.log("User profile fetched successfully", resp);
            setUserPosts(resp.data);

        }catch(err){
            console.error("Error fetching user profile", err);
            toast.error("Error fetching user profile");
        }
    }

    useEffect(()=>{
        getUserProfile();  
        getMyPosts(); 
    }, []);

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
                                <AppButton variant="outline" size="sm" onClick={()=>{navigate("/editprofile")}}>
                                    Edit Profile
                                </AppButton>
                            </div>
                        </div>
                        <text className="text-base text-gray-500 text-start">
                            {userProfile?.bio || "No bio yet." }
                        </text>
                        <div onClick={()=>navigate("/my_friends")} className="flex flex-row space-x-2">
                            <text className="cursor-pointer underline text-base text-start">
                                {userFriends.length}
                            </text>
                            <text className="text-base text-gray-500 text-start">
                                Friends
                            </text>
                        </div>
                        <text className="text-xl font-bold text-start">
                            Friends
                        </text>
                        <div onClick={()=>navigate("/find_friends")} className="shadow-lg cursor-pointer active:bg-gray-300 hover:bg-gray-300 flex flex-row space-x-3 p-5 rounded-lg overflow-x-auto">
                            <UserPlus/>
                            <text className="text-base font-medium">Add Friend</text>
                        </div>
                        <div onClick={()=>navigate("/my_friend_requests")} className="shadow-lg cursor-pointer active:bg-gray-300 hover:bg-gray-300 flex flex-row space-x-3 p-5 rounded-lg overflow-x-auto">
                            <ListCheck/>
                            <text className="text-base font-medium">Requests</text>
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

export default MyProfilePage;