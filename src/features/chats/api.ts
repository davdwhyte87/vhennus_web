import { api, type GenericResponse } from "../../Shared/api";
import type { Chat } from "./socket";


const customHeaders = {
        'Authorization': localStorage.getItem('tokenAuth'),
        'Content-Type': 'application/json',
};


export interface ChatPair{
    all_read:boolean;
    created_at:string;
    id:string;
    last_message:string;
    updated_at:string;
    user1:string;
    user2:string;
    user1_image:string;
    user2_image:string;
}


export const getAllMyChatPairsAPI = async (): Promise<GenericResponse<ChatPair[]>> => {
    const response = await api.get(`/api/v1/auth/chat/get_my_chat_pairs`, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}

export interface CreateChatReq{
    pair_id?:string;
    message:string;
    receiver:string
}

export const createChatAPI = async (): Promise<GenericResponse<ChatPair[]>> => {
    const response = await api.get(`/api/v1/auth/chat/get_my_chat_pairs`, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}


export const getChatsAPI = async (id:string): Promise<GenericResponse<Chat[]>> => {
    const response = await api.get(`/api/v1/auth/chat/get_pair/${id}`, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}


export interface GetChatsView {
    chats:Chat[];
    chat_pair:ChatPair;
}
export const getChatsAPI2 = async (userName:string): Promise<GenericResponse<GetChatsView>> => {
    const response = await api.get(`/api/v1/auth/chat/get_chats/${userName}`, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}

export const findChatPairAPI = async (userName:string): Promise<GenericResponse<ChatPair>> => {
    const response = await api.get(`/api/v1/auth/chat/find_chat_pair/${userName}`, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}