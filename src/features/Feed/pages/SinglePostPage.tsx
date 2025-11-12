import { useNavigate, useParams } from "react-router-dom";
import Post from "../Components/Post.tsx";
import {ArrowLeft, Plus} from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { addComment, getPostFeeds, getSinglePost, type Comment, type PostFeed } from "../api.ts";
import RelativeTime from "../../../Shared/components/RelativeTime.tsx";
import AppButton from "../../../Shared/components/Button.tsx";
import TextArea from "../../../Shared/components/TextArea.tsx";
import { se } from "date-fns/locale";
import BackNav from "../../../Shared/components/BackNav.tsx";

const SinglePostPage:React.FC = ()=>{
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<PostFeed | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [isCommentLoading, setIsCommentLoading] = useState<boolean>(false);
    const getFeeds = async ()=>{
        // fetch feeds from api
        try{

            if(!id) {
                toast.error("Post ID is missing");
                return;
            }
            const result = await getSinglePost(id);
            console.log("Post fetched successfully", result);
            setPost(result.data.post);
            setComments(result.data.comments);
        }catch(err){
            console.error("Error fetching post", err);
            toast.error("Error fetching post");
        }
    }

     const handleTextChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
      };

    const handleAddComment = async ()=>{
        if(newComment.trim() === ""){
            toast.error("Comment cannot be empty");
            return;
        }

        setIsCommentLoading(true);
        try{
            let result = await addComment({text:newComment}, id!); 
            console.log("Comment added successfully", result);
            toast.success("Comment added successfully");
            setNewComment("");
            setIsCommentLoading(false);
            // refresh comments
            await getFeeds();
        }catch(err){
            console.error("Error adding comment", err);
            toast.error("Error adding comment");
            setIsCommentLoading(false);
        }
    }

    useEffect(()=>{
        getFeeds();
    }, []);
    return (
        <div className="flex flex-col items-center  min-h-screen w-full pb-safe">
            <BackNav/>
            <main>
                <div className="flex flex-col md:w-200 items-center w-full space-y-2 p-5">
                    <div className="w-full">
                        {post ? (
                        <Post key={post.id} mpost={post} isSingle={true} />
                        ) : null}
                    </div>
                    <div>
                        <text className="text-xl font-bold">Comments</text>
                    </div>

                    <div className='flex flex-col justify-end items-end space-y-1 w-full'>
                        <div className="flex w-full">
                            <TextArea rows={2} value={newComment} onChange={handleTextChange} />
                        </div>
                        <div>
                            <AppButton onClick={()=>handleAddComment()} loading={isCommentLoading}  variant="primary" size="sm">
                                Comment
                            </AppButton> 
                        </div>
                    
                    </div>
                    <div className="flex flex-col space-y-2 w-full">
                        {
                            comments.map((comment, index)=>(
                                <Comment key={index} comment={comment}  />
                            ))
                        }
                    </div>

                </div>

            </main>
        </div>
    )
}

interface CommentProps{
    comment:Comment
}
const Comment:React.FC<CommentProps> = ({comment})=> {
    return(
        <div className="flex flex-col space-y-1 justify-start w-full ">
            <div className="flex">
                <text className="font-bold">@{comment.user_name}</text>
            </div>
             <div className="flex">
                <text className="font-normal text-sm"><RelativeTime date={comment.created_at}/></text>
            </div>
             <div className="flex">
                <text className="text-sm text-start font-normal">{comment.text} </text>
            </div>
        </div>
    )
}

export default SinglePostPage