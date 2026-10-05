import { useParams } from "react-router-dom";
import Post from "../Components/Post.tsx";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import { addComment, getSinglePost, type Comment, type PostFeed } from "../api.ts";
import RelativeTime from "../../../Shared/components/RelativeTime.tsx";
import AppButton from "../../../Shared/components/Button.tsx";
import TextArea from "../../../Shared/components/TextArea.tsx";
import BackNav from "../../../Shared/components/BackNav.tsx";
import { 
  Send, 
  MessageCircle, 
  Share2, 
   
  Heart, 
  MoreVertical,
  
  Flag,
  
  Users
} from "lucide-react";
import { useAuthStore } from "../../auth/useAuthStore.ts";

const SinglePostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<PostFeed | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [isCommentLoading, setIsCommentLoading] = useState<boolean>(false);
    const [_viewCount, setViewCount] = useState<number>(0);
    const [_isBookmarked, _setIsBookmarked] = useState<boolean>(false);
    // const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    const authState = useAuthStore()
    const getFeeds = async () => {
        try {
            if (!id) {
                toast.error("Post ID is missing");
                return;
            }
            const result = await getSinglePost(id);
            console.log("Post fetched successfully", result);
            setPost(result.data.post);
            setComments(result.data.comments);
            setViewCount(Math.floor(Math.random() * 1000) + 100); // Mock view count
        } catch (err) {
            console.error("Error fetching post", err);
            toast.error("Error fetching post");
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = async () => {
        if (newComment.trim() === "") {
            toast.error("Comment cannot be empty");
            return;
        }

        setIsCommentLoading(true);
        try {
            let result = await addComment({ text: newComment }, id!);
            console.log("Comment added successfully", result);
            toast.success("💬 Comment added!");
            
            // Add new comment to the list immediately
            const newCommentObj: Comment = {
                id: Date.now().toString(),
                text: newComment,
                user_name: authState.authUserName,
                post_id:id? id:'',
                created_at: new Date().toISOString(),
            };
            
            setComments(prev => [newCommentObj, ...prev]);
            setNewComment("");
            
            // Scroll to the new comment
            setTimeout(() => {
                commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            
        } catch (err) {
            console.error("Error adding comment", err);
            toast.error("Error adding comment");
        } finally {
            setIsCommentLoading(false);
        }
    };

    const handleShare = () => {
        const postUrl = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: post?.text.substring(0, 50) + '...' || 'Check out this post',
                text: post?.text || '',
                url: postUrl,
            });
        } else {
            navigator.clipboard.writeText(postUrl);
            toast.success("📋 Link copied to clipboard!");
        }
    };

    // const handleCopyLink = () => {
    //     navigator.clipboard.writeText(window.location.href);
    //     toast.success("🔗 Link copied!");
    // };

    const handleReport = () => {
        toast.info("📢 Report submitted. Our team will review this post.");
    };

    // const handleFollowUser = () => {
    //     setIsFollowing(!isFollowing);
    //     toast.success(isFollowing ? "👋 Unfollowed user" : "✅ Now following user");
    // };

    useEffect(() => {
        getFeeds();
    }, []);

    return (
            <div className="min-h-screen">
                <BackNav 
                    title="Post Details" 
                
                />
                
                <main className="container mx-auto max-w-3xl px-4 py-6">

                    {/* Post Content */}
                    <div className="mb-8">
                        {post ? (
                            <div className="relative">
                                <Post key={post.id} mpost={post} isSingle={true} />
                                <div className="absolute -top-4 -right-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                                        <div className="relative bg-white p-2 rounded-full shadow-lg">
                                            <Heart className="w-6 h-6 text-primary" fill="#CC5A2A" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-[#C9A86A]/60 bg-white p-8 text-center">
                                <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-[#0A1931]/5">
                                    <MessageCircle className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading post...</h3>
                                <p className="text-gray-500">Fetching the latest content</p>
                            </div>
                        )}
                    </div>

                    {/* Comment Input */}
                    <div className="mb-8 border border-[#C9A86A]/60 bg-white p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                                <MessageCircle className="w-6 h-6 text-primary" />
                                <span>Add a Comment</span>
                            </h2>
                            <span className="text-sm text-gray-500">{newComment.length}/500</span>
                        </div>
                        
                        <div className="relative mb-4">
                            <TextArea 
                                rows={3} 
                                value={newComment} 
                                onChange={handleTextChange}
                                placeholder="Share your thoughts..."
                                maxLength={500}
                                className="w-full border-2 border-gray-200 focus:border-primary rounded-xl p-4 pr-12"
                            />
                            <div className="absolute bottom-3 right-3">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => setNewComment('')}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                            
                            <AppButton
                                size="md"
                                onClick={handleAddComment}
                                loading={isCommentLoading}
                            >
                                <Send className="w-5 h-5 mr-2" />
                                Post Comment
                            </AppButton>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="overflow-hidden border border-[#C9A86A]/60 bg-white">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                                    <div className="relative">
                                        <MessageCircle className="w-6 h-6 text-primary" />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                                            {comments.length}
                                        </div>
                                    </div>
                                    <span>Comments</span>
                                </h2>
                                
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={handleReport}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Report"
                                    >
                                        <Flag className="w-5 h-5 text-gray-400 hover:text-red-500" />
                                    </button>
                                    
                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <MoreVertical className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                            
                            {comments.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                        <Users className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No comments yet</h3>
                                    <p className="text-gray-500 mb-6">Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-6">
                                    {comments.map((comment, index) => (
                                        <div
                                            key={comment.id}
                                        >
                                            <Comment key={comment.id} comment={comment} isLatest={index === 0} />
                                        </div>
                                    ))}
                                    <div ref={commentsEndRef} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Floating Actions */}
                    <div className="fixed bottom-28 right-5 z-30 flex flex-col gap-3 sm:right-8 lg:bottom-8">
                        <button 
                            onClick={handleShare}
                            className="bg-white p-4 shadow-xl transition-all duration-300 hover:shadow-2xl group"
                        >
                            <Share2 className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
                        </button>
                        
                     
                    </div>
                </main>
            </div>
    );
};

interface CommentProps {
    comment: Comment;
    isLatest?: boolean;
}

const Comment: React.FC<CommentProps> = ({ comment, isLatest = false }) => {
    // const [isLiked, setIsLiked] = useState<boolean>(false);
    // const [likeCount, setLikeCount] = useState<number>(0);

    return (
        <div className={`bg-[#F5F5F0] p-5 transition-colors hover:bg-[#C9A86A]/15 ${isLatest ? 'border-l-4 border-primary' : ''}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-10 h-10 bg-[#0A1931] flex items-center justify-center text-[#C9A86A] font-bold">
                            {comment.user_name.charAt(0).toUpperCase()}
                        </div>
                        {isLatest && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-gray-900">@{comment.user_name}</h4>
                            {isLatest && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-semibold rounded-full">
                                    Latest
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <RelativeTime date={comment.created_at} />
                            <span>•</span>
                            <span>Just now</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  
                    
                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>
            
            <div className="pl-12">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {comment.text}
                </p>
                
                <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200">
            
                    <button className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
                        Share
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
                        Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SinglePostPage;