import type React from "react"
import BackNav from "../../../Shared/components/BackNav"
import InputFIeld from "../../../Shared/components/InputFIeld"
import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"
import { useParams, useSearchParams } from "react-router-dom"
import { type ChatPair, findChatPairAPI, getChatsAPI, type CreateChatReq, getChatsAPI2 } from "../api"
import { type Chat, useWs } from "../socket"
import axios from "axios"
import { toast } from "react-toastify"
import { getUserLocalData } from "../../../Shared/AuthData"
import ChatNav from "../../../Shared/components/ChatNav"
import TextArea from "../../../Shared/components/TextArea"
import AppButton from "../../../Shared/components/Button"
import formatISOTime from "../../../Shared/formatISOString"
import { useAuthStore } from "../../auth/useAuthStore"


const profileImage = (await import("../../../assets/profile2.png")).default

const SingleChatPage:React.FC = ()=>{
    const [message, setMessage] = useState<string>("")
    const {id} = useParams()
    // const [isConnected, setIsConnected] = useState(socket.connected);
    const ws = useRef<WebSocket | null>(null);
    const { messages, sendMessage } = useWs();
    const [chatMessages, setChatMessages] = useState<Chat[]>([])
    const [searchParams, setSearchParams] = useSearchParams();
    const pairId = searchParams.get("pair_id")
    const authStore = useAuthStore()
    const [chatPair, setChatPair] = useState<ChatPair |null>(null)
    const scrollableContainerRef = useRef<HTMLDivElement>(null);
  

    const handleMessageChange= (e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setMessage(e.target.value)
    }

    const getChats = async ()=>{
        try{
            const resp = await getChatsAPI2(id ||"")
            setChatMessages(resp.data.chats)
            setChatPair(resp.data.chat_pair)

        }catch(err){
            
            if (axios.isAxiosError(err)) {
                console.error("Error getting chats", err.response?.data?.message);
                //toast.error( err.response?.data?.message || "Error getting chats");
            }else{
                console.error("Error getting chats", err);
                //toast.error("Error getting chats from API");
            }
        }
    }

    const findChatPair = async ()=>{
        try{
            const resp = await findChatPairAPI(id ||"")
            setChatPair(resp.data)

        }catch(err){
            
            if (axios.isAxiosError(err)) {
                // silent error
                console.error("Error getting chat pair", err.response?.data?.message);
                //toast.error( err.response?.data?.message || "Error getting chat pair");
            }else{
                console.error("Error getting chat pair", err);
                //toast.error("Error getting chat pair");
            }
        }
    }

    useEffect(()=>{
        getChats()
        // findChatPair()
    },[])

   // Function to send a message
    const handleSend = () => {
        if(id==null){
            return
        }
        if (message.trim() !== '') {
            const createChat:CreateChatReq ={
                    message,
                    receiver: id
            }
            sendMessage(createChat)
            const date = new Date(); 
            
            let chat:Chat ={
                id: "",
                pair_id: pairId?pairId:"",
                sender: authStore.authUserName?authStore.authUserName:"",
                receiver: id?id:"",
                message: message,
                created_at: date.toISOString(),
                updated_at:date.toISOString()
            }
            setChatMessages([...chatMessages, chat])
            setMessage("")
            
        }
    };

    const scrollToBottom = (smooth = false) => {
    const container = scrollableContainerRef.current;
    if (!container) return;
        container.scrollTo({ top: container.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    };

    
    useEffect(() => {
        scrollToBottom(false);
    }, [chatMessages, messages]);

    return(
        <div>
            <ChatNav userName={id} image={
                    (authStore.authUserName == chatPair?.user1)? chatPair?.user2_image|| profileImage:  chatPair?.user1_image|| profileImage
                     
                    }/>
            <main className="">
                <div className="h-screen flex flex-col">
                    <div ref={scrollableContainerRef} className="flex-1 overflow-y-auto pb-28">
                        <div className="flex flex-col space-y-3 p-2">
                            {chatMessages.map((chat)=>(
                                
                             <ChatComponent isSender={authStore.authUserName==chat.sender} chat={chat} />   
                            ))}
                            
                        </div>
                    </div>
                    <div className="sticky bottom-0 safe-area-inset-bottom bg-white">
                        <div className="flex flex-row space-x-3" >
                            <TextArea 
                            name={"Message"} 
                            value={message} 
                            onChange={(e)=>handleMessageChange(e)}
                            rows={1}
                            />
                            <div className="pt-1">
                                <AppButton onClick={()=>handleSend()} variant="outline"  size="sm" ><Send/></AppButton>
                            </div>
                            
                        </div>
                     
                    </div>
                </div>
            </main>
        </div>
    )
}


interface ChatComponentProps{
    isSender:boolean,
    chat:Chat
}
const ChatComponent:React.FC<ChatComponentProps> = ({isSender, chat})=>{
    return (
        <div className={`flex flex-col w-full ${isSender? "justify-end items-end" : " justify-start items-start"}`}>
            <div className={`${isSender?"bg-primary":"bg-gray-500"} text-white  rounded-lg text-start p-2 w-3/5`}>
            {chat.message}
            </div>
            <div className="text-gray-600 text-xs font-normal">{formatISOTime(chat.updated_at)}</div>
        </div>
    )
}

export default SingleChatPage