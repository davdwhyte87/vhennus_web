
import { api, type GenericResponse } from '../../Shared/api';






export interface CreatePostData{
    text:string;
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
}

export const createPost = async (data: CreatePostData): Promise<void> => {
    const response = await api.post('/api/v1/auth/post/create', data);
    console.log(response.data);
    return response.data;
}

export const getPostFeeds = async (): Promise<GenericResponse<PostFeed[]>> => {
    const response = await api.get('/api/v1/auth/post/all');
    console.log(response.data);
    return response.data;
}


export const getAllMyPosts = async (): Promise<GenericResponse<PostFeed[]>> => {
    const response = await api.get('/api/v1/auth/post/allmy');
    console.log(response.data);
    return response.data;
}

export const getAllUserMyPosts = async (userName:string): Promise<GenericResponse<PostFeed[]>> => {
    const response = await api.get(`/api/v1/auth/post/all/${userName}`);
    console.log(response.data);
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

export const getSinglePost = async (id:string): Promise<GenericResponse<SinglePostResponse>> => {
    const response = await api.get(`/api/v1/auth/post/single/${id}`);
    console.log(response.data);
    return response.data;
}

export const likePost = async (id:string): Promise<GenericResponse<string>> => {
    const response = await api.get(`/api/v1/auth/post/like/${id}`);
    console.log(response.data);
    return response.data;
}

export interface AddCommentReq{
  text:string;
}
export const addComment = async (comment:AddCommentReq, id:string): Promise<GenericResponse<string>> => {
    const response = await api.post(`/api/v1/auth/post/${id}/comment/create`, comment);
    console.log(response.data);
    return response.data;
}