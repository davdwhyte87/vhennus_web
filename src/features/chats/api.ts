import { api, type GenericResponse } from "../../Shared/api";
import type { Chat } from "./socket";


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
    const response = await api.get(`/api/v1/auth/chat/get_my_chat_pairs`);
    console.log(response.data);
    return response.data;
}

export interface SendChatReq{
    pair_id?:string;
    message?:string;
    image?:string;
    receiver:string
}

export const sendChatAPI = async (data: SendChatReq): Promise<GenericResponse<Chat>> => {
    const response = await api.post(`/api/v1/auth/chat/create`, data);
    console.log(response.data);
    return response.data;
}


export const getChatsAPI = async (id:string): Promise<GenericResponse<Chat[]>> => {
    const response = await api.get(`/api/v1/auth/chat/get_pair/${id}`);
    console.log(response.data);
    return response.data;
}


export interface GetChatsView {
    chats:Chat[];
    chat_pair:ChatPair;
}
export const getChatsAPI2 = async (userName:string): Promise<GenericResponse<GetChatsView>> => {
    const response = await api.get(`/api/v1/auth/chat/get_chats/${userName}`);
    console.log(response.data);
    return response.data;
}

export const findChatPairAPI = async (userName:string): Promise<GenericResponse<ChatPair>> => {
    const response = await api.get(`/api/v1/auth/chat/find_chat_pair/${userName}`);
    console.log(response.data);
    return response.data;
}

export interface PairUnread {
    pair_id:string;
    unread:number;
}

export interface UnreadResp {
    total:number;
    pairs:PairUnread[];
}

export const getUnreadAPI = async (): Promise<GenericResponse<UnreadResp>> => {
    const response = await api.get(`/api/v1/auth/chat/unread`);
    return response.data;
}

export const markChatReadAPI = async (pairId:string): Promise<GenericResponse<string | null>> => {
    const response = await api.post(`/api/v1/auth/chat/mark_read`, {pair_id:pairId});
    return response.data;
}
