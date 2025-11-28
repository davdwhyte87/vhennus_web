import type React from "react"
import BackNav from "../../../Shared/components/BackNav"
import { acceptFriendRequestsAPI, getMyFriendRequestsAPI, rejectFriendRequestsAPI, type FriendRequestResp } from "../api"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import AppButton from "../../../Shared/components/Button"
import { X } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"
import PageLoad from "../../../Shared/components/PageLoad"
const profileImage = (await import("../../../assets/profile2.png")).default


const MyFriendRequestsPage = ()=>{
    const [friendRequests, setFriendRequests] = useState<FriendRequestResp[]>([])
    const [isGetMyFriendRequestsLoading,setIsGetMyFriendRequestsLoading ] = useState<boolean>(false)


    const getFriendRequests = async ()=>{ 
        setIsGetMyFriendRequestsLoading(true)
       
        try{
            const res =await  getMyFriendRequestsAPI()
            console.log("my friend requests", res)
            setFriendRequests(res.data)
               setIsGetMyFriendRequestsLoading(false)
        }catch(err){
                if (axios.isAxiosError(err)) {
                console.error("Error sending friend request", err.response?.data?.message);
                //toast.error( err.response?.data?.message || "Error sending friend request");
            }else{
                console.error("Error sending friend request", err);
                //toast.error("Error sending friend request");
            }

            setIsGetMyFriendRequestsLoading(false)
        }
    }

    useEffect(()=>{
        getFriendRequests()
    }, [])


    return (
        <div>
            <BackNav title="Requests" />
            <main>
                <div className="flex flex-col space-y-3 p-5">
                    <PageLoad loading={isGetMyFriendRequestsLoading} />

                    
                    {
                        friendRequests.map((req)=>(
                            <FriendRequestComponent onReset={()=>getFriendRequests()} friendRequest={req} />
                        ))
                    }

                </div>
            </main>
        </div>
    )
}


interface FriendRequestComponentProps{
    friendRequest: FriendRequestResp,
    onReset: ()=>void
}

const FriendRequestComponent:React.FC<FriendRequestComponentProps> = ({friendRequest, onReset})=>{
    const navigate = useNavigate()
    const [isAcceptFriendRequestLoading, setIsAcceptFriendRequestLoading] = useState<boolean>(false)
    const [isRejectFriendRequestLoading, setIsRejectFriendRequestLoading] = useState<boolean>(false)
  

    const handleAcceptFriendRequest = async ()=>{
        setIsAcceptFriendRequestLoading(true);
        // accept friend request to user
        try{
            const resp = await acceptFriendRequestsAPI(friendRequest.id);
            console.log("Friend request sent successfully", resp);
            toast.success("Friend request sent successfully");
            setIsAcceptFriendRequestLoading(false);
        }
        catch(err){
            if (axios.isAxiosError(err)) {
                console.error("Error sending friend request", err.response?.data?.message);
                toast.error( err.response?.data?.message || "Error sending friend request");
            }else{
                console.error("Error sending friend request", err);
                toast.error("Error sending friend request");
            }
       
            setIsAcceptFriendRequestLoading(false);
        }

        onReset()
    }
    const handleCancelFriendRequest = async ()=>{

        setIsRejectFriendRequestLoading(true);
       
        try{
            const resp = await rejectFriendRequestsAPI(friendRequest.id);
            console.log("Friend accepting sent successfully", resp);
            toast.success("Friend request accepted successfully");
            setIsRejectFriendRequestLoading(false);
        }
        catch(err){
            if (axios.isAxiosError(err)) {
                console.error("Error rejecting friend request", err.response?.data?.message);
                toast.error( err.response?.data?.message || "Error rejecting friend request");
            }else{
                console.error("Error accepting friend request", err);
                toast.error("Error accepting friend request");
            }
       
            setIsRejectFriendRequestLoading(false);
        }
    }


    
    return (
        <div className="flex flex-row justify-evenly w-full shadow-md p-3">
            <div className="" onClick={()=>{navigate(`/user_profile/${friendRequest.user_name}`)}} > <img className="w-15 h-15 object-cover rounded-full" src={friendRequest.image || profileImage } /></div>
            <div className="flex flex-col justify-start items-start">
                <text onClick={()=>{navigate(`/user_profile/${friendRequest.user_name}`)}} className="text-lg font-bold">{friendRequest.name}</text>
                <text className="text-gray-400">@{friendRequest.user_name}</text>
            </div>
            <div>
                <AppButton onClick={()=>{handleAcceptFriendRequest()}} loading={isAcceptFriendRequestLoading} size="sm">Accept</AppButton>
            </div>
            <div>
                <AppButton variant="outline" onClick={()=>{handleCancelFriendRequest()}} loading={isRejectFriendRequestLoading} size="sm"><X/></AppButton>
            </div>
        </div>
    )
}


export default MyFriendRequestsPage