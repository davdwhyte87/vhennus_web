import { useNavigate } from "react-router-dom"
import type { ChatPair } from "../api"
import { getUserLocalData } from "../../../Shared/AuthData"
import RelativeTime from "../../../Shared/components/RelativeTime"
import formatISOTime from "../../../Shared/formatISOString"
import { useAuthStore } from "../../auth/useAuthStore"

const prof = await import("../../../assets/react.svg")


const profileImage = (await import("../../../assets/profile2.png")).default

export interface ChatPairItemProps{
    pair:ChatPair
}
const ChatListItem:React.FC<ChatPairItemProps> = ({pair})=>{
    const navigate = useNavigate()
    const authStore = useAuthStore()
    const userData = getUserLocalData()
    const handleOpenChat = (id:string)=>{
        navigate(`/chat/single_chat/${id}?pair_id=${pair.id}`)

    }

    return (
        <div onClick={()=>handleOpenChat( (authStore.authUserName == pair.user1)? pair.user2: pair.user1
                     )} className="flex flex-row space-x-2 p-2">
            <div>
                <img src={
                    (authStore.authUserName == pair.user1)? pair.user2_image|| profileImage:  pair.user1_image|| profileImage
                     
                    }  className="rounded-full w-13 h-13" />
            </div>
            <div className="flex flex-col space-y-1">
                <div className="text-start font-bold">{
                    (authStore.authUserName  == pair.user1)? pair.user2: pair.user1
                     
                    } <span className="text-black/30"></span></div>
                <div className="text-start">{truncateText(pair.last_message, 25)}</div>
            </div>
            <div className="flex flex-col items-end ml-auto ">
                <div className="text-end">{formatISOTime(pair.updated_at)}</div>
                {/* <div className="flex rounded-full w-3 h-3 bg-primary text-end justify-end">  </div> */}
            </div>
        </div>
    )
}
function truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
        return text;
    }
    // Slice the text and append the ellipsis
    return text.slice(0, maxLength) + '...';
}


export default ChatListItem;