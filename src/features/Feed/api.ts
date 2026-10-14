
import { api, type GenericResponse } from '../../Shared/api';






export interface CreatePostData{
    text:string;
    image?:string  | null;
    poll_options?: string[];
}

export interface PollOptionResult {
  id: string;
  text: string;
  position: number;
  vote_count: number;
}

export interface PostPollData {
  options: PollOptionResult[];
  total_votes: number;
  user_voted_option_id?: string | null;
  has_poll: boolean;
}

export interface PostFeed{
  comment_count: number;
  created_at: string;
  id:string;
  image:string;
  like_count:number
  name:string;
  profile_image:string;
  text:string
  updated_at:string;
  user_name:string;
  poll?: PostPollData | null;
}

export const createPost = async (data: CreatePostData): Promise<void> => {
    const response = await api.post('/api/v1/auth/post/create', data);
    return response.data;
}

export const getPostFeeds = async (): Promise<GenericResponse<PostFeed[]>> => {
    const response = await api.get('/api/v1/auth/post/all');
    return response.data;
}


export const getAllMyPosts = async (): Promise<GenericResponse<PostFeed[]>> => {
    const response = await api.get('/api/v1/auth/post/allmy');
    return response.data;
}

export const getAllUserMyPosts = async (userName:string): Promise<GenericResponse<PostFeed[]>> => {
    const response = await api.get(`/api/v1/auth/post/all/${userName}`);
    return response.data;
}

export interface Comment{
  created_at:string;
  id:string;
  post_id:string;
  text:string;
  user_name:string;
}
export interface SinglePostResponse{
  comments:Comment[];
  post:PostFeed;
}

export const votePoll = async (postId: string, optionId: string): Promise<GenericResponse<PostPollData>> => {
    const response = await api.post(`/api/v1/auth/post/${postId}/poll/vote`, { option_id: optionId });
    return response.data;
}

export const getPoll = async (postId: string): Promise<GenericResponse<PostPollData>> => {
    const response = await api.get(`/api/v1/auth/post/${postId}/poll`);
    return response.data;
}

export const getSinglePost = async (id:string): Promise<GenericResponse<SinglePostResponse>> => {
    const response = await api.get(`/api/v1/auth/post/single/${id}`);
    return response.data;
}

export const likePost = async (id:string): Promise<GenericResponse<string>> => {
    const response = await api.post(`/api/v1/auth/post/like/${id}`);
    return response.data;
}

export interface AddCommentReq{
  text:string;
}
export const addComment = async (comment:AddCommentReq, id:string): Promise<GenericResponse<string>> => {
    const response = await api.post(`/api/v1/auth/post/${id}/comment/create`, comment);
    return response.data;
}