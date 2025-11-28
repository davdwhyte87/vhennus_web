import { useEffect, useState } from "react";
import BackNav from "../../../Shared/components/BackNav";
import InputFIeld from "../../../Shared/components/InputFIeld";
import { Search } from "lucide-react";
import AppButton from "../../../Shared/components/Button";
import { type FriendRequestResp, getMyFriendRequestsAPI, SearchUserProfileAPI, sendFriendRequest, type Friend } from "../api";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const profileImage = (await import("../../../assets/profile2.png")).default

const FindFriendsPage = () => {
    const [searchData, setSearchData] = useState<string>("");
    const [friendSearchResults , setfriendSearchResults] = useState<Friend[]>([])
    const [friendRequests, setFriendRequests] = useState<FriendRequestResp[]>([])



    const handleChangeSearchData = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchData(e.target.value);
    }
    const [isLoadingsearch, setIsLoadingsearch] = useState<boolean>(false)


    const getFriend = async ()=>{
        if(searchData == "" ){
            return
        }
        setIsLoadingsearch(true)
        try{
            const res =await  SearchUserProfileAPI(searchData)
            console.log("ok", res)
            setfriendSearchResults(res.data)
            setIsLoadingsearch(false)

        }catch(err){
                if (axios.isAxiosError(err)) {
                console.error("Error sending friend request", err.response?.data?.message);
                toast.error( err.response?.data?.message || "Error sending friend request");
            }else{
                console.error("Error sending friend request", err);
                toast.error("Error sending friend request");
            }

            setIsLoadingsearch(false)
        }

    }

    
    const getFriendRequests = async ()=>{ 
       
        try{
            const res =await  getMyFriendRequestsAPI()
            console.log("my friend requests", res)
            setFriendRequests(res.data)
        }catch(err){
                if (axios.isAxiosError(err)) {
                console.error("Error sending friend request", err.response?.data?.message);
                //toast.error( err.response?.data?.message || "Error sending friend request");
            }else{
                console.error("Error sending friend request", err);
                //toast.error("Error sending friend request");
            }
        }
    }

    useEffect(()=>{
        getFriendRequests()
    }, [])

   
    return (
        <div>
            <BackNav title="Search"/>
            <main className="h-screen flex flex-col">
                <div className="p-5  flex-shrink-0">
                    <InputFIeld name={"Search"} value={searchData}
                     onChange={(e)=>handleChangeSearchData(e)} 
                     showIcon={true}
                     icon={<Search/>}
                     iconClick={()=>getFriend()}
                     loading={isLoadingsearch}
                     />
                </div>
                <div className="flex-1 space-y-4 p-5  overflow-y-auto">
                    {friendSearchResults.map((data)=>(
                        <FriendSearchResult friend={data} friendRequests={friendRequests} />
                    ))}
                </div>
            </main>
        </div>
    )
}


interface FriendSearchProps  {
    friend:Friend,
    friendRequests:FriendRequestResp[]
}
const FriendSearchResult:React.FC<FriendSearchProps> = ({friend,friendRequests})=>{
    const [isSendFriendReuqestLoading, setIsSendFriendRequestLoading] = useState<boolean>(false)
    const navigate = useNavigate()



     const handleSendFriendRequest = async ()=>{
        setIsSendFriendRequestLoading(true);
        // send friend request to user
        try{
            const resp = await sendFriendRequest(friend.user_name);
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
    return (
        <div className="flex flex-row space-x-3">
            <div className="w-15 h-15" onClick={()=>{navigate(`/user_profile/${friend.user_name}`)}} > <img className="w-15 h-15 object-cover rounded-full" src={friend.image || profileImage } /></div>
            <div className="flex flex-col items-start space-y-1">
                <text onClick={()=>{navigate(`/user_profile/${friend.user_name}`)}} className="text-lg font-bold">{friend.name}</text>
                <text className="text-gray-400">@{friend.user_name}</text>
                <AppButton disabled={friendRequests.some((fr)=>{fr.user_name == friend.user_name || fr.requester == friend.user_name })} onClick={()=>{handleSendFriendRequest()}} loading={isSendFriendReuqestLoading} size="sm">Add Friend</AppButton>
            </div>
        </div>
    )
}

export default FindFriendsPage;