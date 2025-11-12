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
