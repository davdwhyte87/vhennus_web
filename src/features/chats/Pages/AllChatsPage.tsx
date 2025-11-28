import axios from "axios";
import ChatListItem from "../Components/ChatListItem.tsx";
import { toast } from "react-toastify";
import {type ChatPair, getAllMyChatPairsAPI } from "../api.ts";
import { useEffect, useState } from "react";


const AllChatsPage:React.FC = ()=>{
    const [chatPairs, setChatPairs] = useState<ChatPair[]>([])
    const getAllChatPairs = async ()=>{


        try{
            const resp = await getAllMyChatPairsAPI()
            setChatPairs(resp.data)

        }catch(err){
            
            if (axios.isAxiosError(err)) {
                console.error("Error getting chat pairs", err.response?.data?.message);
                toast.error( err.response?.data?.message || "Error getting chat pairs");
            }else{
                console.error("Error getting chat pairs", err);
                toast.error("Error sending api request");
            }
        }
    }


    useEffect(()=>{
        getAllChatPairs()
    }, [])
    
    return (
        <div className="flex flex-col space-y-2  min-h-screen w-full pb-safe">
            <div className="flex justify-center w-full p-5">
                <text className="text-2xl font-bold">Chats</text>
            </div>
            <div className="flex flex-col w-full">

                {
                    chatPairs.map((pair)=>(
                    <ChatListItem pair={pair} />
                    ))
                }
                
            </div>

        </div>
    )
}
export default AllChatsPage