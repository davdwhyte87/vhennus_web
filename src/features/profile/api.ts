import { api, type GenericResponse } from "../../Shared/api";


const customHeaders = {
        'Authorization': localStorage.getItem('tokenAuth'),
        'Content-Type': 'application/json',
    };





export const getUserProfileAPI = async (): Promise<GenericResponse<UserProfileResp>> => {
    const response = await api.get('/api/v1/auth/profile/get', { headers: customHeaders });
    console.log(response.data);
    return response.data;
}

export const getOtherUserProfileAPI = async (userName:string): Promise<GenericResponse<UserProfileResp>> => {
    const response = await api.get(`/api/v1/auth/profile/get/${userName}`, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}


export interface FriendRequestResp{
    id:string;
    name:string;
    user_name:string;
    requester:string;
    status:FriendRequestStatus;
    created_at:string;
    updated_at:string;
    image:string;
}

export type FriendRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";


export const sendFriendRequest = async (userName:string): Promise<GenericResponse<FriendRequestResp>> => {
    console.log("Sending friend request to ", userName);
    const response = await api.post(`/api/v1/auth/user/friend_request/send`, {user_name:userName}, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}


export interface UserProfile{
    id:string;
    user_name:string;
    bio:string;
    name:string;    
    image:string;
    created_at:string;
    updated_at:string;
    app_f_token:string;
    wallets:string;
    unclaimed_earnings:string;
    is_earnings_activated:boolean;
    referred_users:string[];
    earnings_wallet:string;
    
}



export interface Friend{
    user_name:string;
    image:string | null;
    bio:string;
    name:string;
}
export interface UserProfileResp{
    profile:UserProfile;
    friends:Friend[];
}

export interface UpdateProfileReq{
    name?:string;
    bio?:string;
    image?:string;
}

export const UpdateUserProfileAPI = async (data:UpdateProfileReq): Promise<GenericResponse<UserProfile>> => {
    const response = await api.post('/api/v1/auth/profile/update',data, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}

export const SearchUserProfileAPI = async (userName:string): Promise<GenericResponse<Friend[]>> => {
    const response = await api.get(`/api/v1/auth/profile/search/${userName}`, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}

export const getMyFriendRequestsAPI = async (): Promise<GenericResponse<FriendRequestResp[]>> => {
    const response = await api.get(`/api/v1/auth/user/friend_requests`, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}

export const acceptFriendRequestsAPI = async (id:string): Promise<GenericResponse<FriendRequestResp[]>> => {
    const response = await api.get(`/api/v1/auth/user/friend_request/accept/${id}`, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}

export const rejectFriendRequestsAPI = async (id:string): Promise<GenericResponse<FriendRequestResp[]>> => {
    const response = await api.get(`/api/v1/auth/user/friend_request/reject/${id}`, { headers: customHeaders });
    console.log(response.data);
    return response.data;
}