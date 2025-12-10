
import {MessageSquare, Heart} from "lucide-react"
import { likePost, type PostFeed } from "../api"
import RelativeTime from "../../../Shared/components/RelativeTime"
import AppButton from "../../../Shared/components/Button"
import { useLikedPosts } from "./LikedPostContext"
import { use, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const imageTest =await import("../../../assets/react.svg")
const profileImage = (await import("../../../assets/profile2.png")).default



export interface PostProps{
    mpost:PostFeed;
    isSingle?:boolean;
}
const Post:React.FC<PostProps> = ({
    mpost,
    isSingle = false
})=>{
   
    const post =  mpost;
    const { isLiked, toggleLike } = useLikedPosts();
    const [likeCount, setLikeCount] =useState<number>(post.like_count);
    const navigate = useNavigate();

    const incrLikes = ()=>{
        if(isLiked(post.id)){
            if(likeCount<=0) return
            setLikeCount(likeCount-1);
        }
        else{
            setLikeCount(likeCount+1);
        }
        
    }

    const handleLikePost = async(id:string)=>{
        try{
            const resp = await likePost(id);
            console.log("Like post response:", resp);

        }catch(error){
            console.error("Error liking post:", error);
            toast.error("Failed to like the post. Please try again.");
        }
    }

    const handlePostClick = ()=>{
        // navigate to single post page

        if(post==null || post.id == "") return;
        navigate(`/home/post/${post.id}`);
    }

    const openUserProfile = ()=>{
        if(post==null || post.id == "") return;
        navigate(`/user_profile/${post.user_name}`);
    }

    return(
        <div className="flex flex-col  hover:bg-gray-50 w-full content-center border-b-2 border-gray-200 p-4">
            <div className="flex space-x-4">
                <div onClick={()=>{openUserProfile()}}><img className="w-10 h-10 rounded-full object-cover" src={post?.profile_image || profileImage} /></div>
                <div onClick={()=>{openUserProfile()}} className="flex-col space-y-1">
                    <div  className="flex flex-row gap-1">
                        <div className="flex"><text className="text-base font-bold">{post?.name}</text></div>
                        <div className="flex"><text className="text-sm p-1 text-black/75">@{post?.user_name}</text></div>

                    </div>
                    <text className="flex text-sm text-black/75"><RelativeTime date={post?.created_at}/></text>
                </div>
            </div>
            <div onClick={()=>isSingle? null: handlePostClick()}  className="flex cursor-pointer">
                <text className="text-sm lg:text-lg md:text-lg text-start w-full p-0.5 py-4 ">
                   {post?.text}
                </text>
            </div>
            <div className="flex">
                <img className="w-full h-auto  bg-gray-50" src={post?.image} />
            </div>
            <div className="flex justify-end pt-6">
                <div className="flex-row flex gap-2">
                    <div className="flex flex-row gap-1">
                        <AppButton variant="ghost" size="sm">
                             <MessageSquare className="w-6 h-6"/>
                            <text className="text-xs p-1">{post?.comment_count}</text>
                        </AppButton>
                       
                    </div>
                    <div className="flex flex-row gap-1">
                        <AppButton variant="ghost" size="sm" onClick={()=>{
                            if(post===null) return;
                            toggleLike(post?.id);
                            incrLikes();
                            handleLikePost(post?.id);
                            }}>{isLiked(post.id)?<Heart fill="#EE4B2B" strokeWidth={0} className="w-6 h-6" />:<Heart className="w-6 h-6" /> }  <text className="text-xs p-1">{likeCount}</text></AppButton>
                        
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Post