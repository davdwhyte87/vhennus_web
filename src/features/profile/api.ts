import { api, type GenericResponse } from "../../Shared/api";





export const getUserProfileAPI = async (): Promise<GenericResponse<UserProfileResp>> => {
    const response = await api.get('/api/v1/auth/profile/get');
    console.log(response.data);
    return response.data;
}

export const getOtherUserProfileAPI = async (userName:string): Promise<GenericResponse<UserProfileResp>> => {
    const response = await api.get(`/api/v1/auth/profile/get/${userName}`);
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
    const response = await api.post(`/api/v1/auth/user/friend_request/send`, {user_name:userName});
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
    membership:boolean;
    phone_number?:string | null;
    country_of_origin?:string | null;
    state_of_origin?:string | null;
    date_of_birth?:string | null;
    current_country?:string | null;
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
    phone_number?:string;
    country_of_origin?:string;
    state_of_origin?:string;
    date_of_birth?:string;
    current_country?:string;
}

export const UpdateUserProfileAPI = async (data:UpdateProfileReq): Promise<GenericResponse<UserProfile>> => {
    const response = await api.post('/api/v1/auth/profile/update',data);
    console.log(response.data);
    return response.data;
}

export const SearchUserProfileAPI = async (userName:string): Promise<GenericResponse<Friend[]>> => {
    const response = await api.get(`/api/v1/auth/profile/search/${userName}`);
    console.log(response.data);
    return response.data;
}

// ---------- Skills & interests (friend search) ----------

export interface SearchTag {
    id: string;
    name: string;
    kind: 'skill' | 'interest';
    created_at: string;
    updated_at: string;
}

export interface FriendSearchHit {
    user_name: string;
    name: string | null;
    bio: string | null;
    image: string | null;
    skills: SearchTag[];
    interests: SearchTag[];
}

export interface MyTagsResp {
    tag_ids: string[];
    tags: SearchTag[];
}

export interface SearchFriendsReq {
    query?: string;
    skill_ids?: string[];
    interest_ids?: string[];
    limit?: number;
}

// Keep in sync with the backend (search_tags/models.rs).
export const MAX_SKILLS_PER_USER = 5
export const MAX_INTERESTS_PER_USER = 10

export const listSearchTagsAPI = async (kind?: 'skill' | 'interest'): Promise<GenericResponse<SearchTag[]>> => {
    const response = await api.get('/api/v1/auth/search/tags', {
        params: kind ? { kind } : {},
    });
    return response.data;
}

export const searchFriendsAPI = async (req: SearchFriendsReq): Promise<GenericResponse<FriendSearchHit[]>> => {
    const response = await api.post('/api/v1/auth/search/friends', {
        query: req.query ?? null,
        skill_ids: req.skill_ids ?? null,
        interest_ids: req.interest_ids ?? null,
        limit: req.limit ?? 30,
    });
    return response.data;
}

export const getMyTagsAPI = async (): Promise<GenericResponse<MyTagsResp>> => {
    const response = await api.get('/api/v1/auth/profile/my_tags');
    return response.data;
}

export const setMyTagsAPI = async (tagIds: string[]): Promise<GenericResponse<MyTagsResp>> => {
    const response = await api.post('/api/v1/auth/profile/my_tags', { tag_ids: tagIds });
    return response.data;
}

export const getMyFriendRequestsAPI = async (): Promise<GenericResponse<FriendRequestResp[]>> => {
    const response = await api.get(`/api/v1/auth/user/friend_requests`);
    console.log(response.data);
    return response.data;
}

export const acceptFriendRequestsAPI = async (id:string): Promise<GenericResponse<FriendRequestResp[]>> => {
    const response = await api.post(`/api/v1/auth/user/friend_request/accept/${id}`);
    console.log(response.data);
    return response.data;
}

export const rejectFriendRequestsAPI = async (id:string): Promise<GenericResponse<FriendRequestResp[]>> => {
    const response = await api.post(`/api/v1/auth/user/friend_request/reject/${id}`);
    console.log(response.data);
    return response.data;
}

export const unfriendAPI = async (userName:string): Promise<GenericResponse<string | null>> => {
    const response = await api.post(`/api/v1/auth/user/friend_request/unfriend`, {user_name:userName});
    console.log(response.data);
    return response.data;
}