import { MessageSquare, Heart, Share2, Bookmark, MoreVertical } from "lucide-react";
import { likePost, type PostFeed } from "../api";
import RelativeTime from "../../../Shared/components/RelativeTime";
import AppButton from "../../../Shared/components/Button";
import { useLikedPosts } from "./LikedPostContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const profileImage = (await import("../../../assets/profile2.png")).default;

export interface PostProps {
    mpost: PostFeed;
    isSingle?: boolean;
}

const Post: React.FC<PostProps> = ({
    mpost,
    isSingle = false
}) => {
    const post = mpost;
    const { isLiked, toggleLike } = useLikedPosts();
    const [likeCount, setLikeCount] = useState<number>(post.like_count);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const navigate = useNavigate();

    const incrLikes = () => {
        if (isLiked(post.id)) {
            if (likeCount <= 0) return;
            setLikeCount(likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
        }
    };

    const handleLikePost = async (id: string) => {
        try {
            const resp = await likePost(id);
            console.log("Like post response:", resp);
        } catch (error) {
            console.error("Error liking post:", error);
            toast.error("Failed to like the post. Please try again.");
        }
    };

    const handlePostClick = () => {
        if (post == null || post.id == "") return;
        navigate(`/home/post/${post.id}`);
    };

    const openUserProfile = () => {
        if (post == null || post.id == "") return;
        navigate(`/user_profile/${post.user_name}`);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.name,
                text: post.text,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden mb-6 animate-fade-in">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                    <div 
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={openUserProfile}
                    >
                        <div className="relative">
                            <img 
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:border-primary transition-colors duration-300" 
                                src={post?.profile_image || profileImage} 
                                alt={post?.name}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                                    {post?.name}
                                </h3>
                                <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 text-primary rounded-full font-medium">
                                    @{post?.user_name}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-gray-500">
                                    <RelativeTime date={post?.created_at} />
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-primary font-medium">
                                    {post.comment_count} comments
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div 
                onClick={() => !isSingle && handlePostClick()} 
                className={`px-6 pb-4 ${!isSingle ? 'cursor-pointer' : ''}`}
            >
                <p className="text-start text-gray-800 leading-relaxed whitespace-pre-line mb-4">
                    {post?.text}
                </p>
                
                {post?.image && (
                    <div className="rounded-xl overflow-hidden mb-4 border border-gray-200 shadow-sm">
                        <img 
                            className="w-full h-auto max-h-96 object-cover bg-gray-50 hover:scale-[1.01] transition-transform duration-500" 
                            src={post.image} 
                            alt="Post content"
                            loading="lazy"
                        />
                    </div>
                )}
            </div>

            {/* Stats and Actions */}
            <div className="px-6 pb-4">
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    {/* Left side - Stats */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <div className={`absolute -inset-2 bg-red-100 rounded-full ${isAnimating ? 'animate-ping' : ''}`}></div>
                                <AppButton 
                                    variant="ghost" 
                                    size="sm"
                                    className="relative z-10 hover:bg-red-50"
                                    onClick={() => {
                                        if (!post) return;
                                        toggleLike(post.id);
                                        incrLikes();
                                        handleLikePost(post.id);
                                    }}
                                >
                                    {isLiked(post.id) ? (
                                        <Heart fill="#EE4B2B" className={`w-5 h-5 ${isAnimating ? 'scale-125' : ''} transition-transform duration-300`} />
                                    ) : (
                                        <Heart className="w-5 h-5" />
                                    )}
                                    <span className={`ml-2 font-semibold ${isLiked(post.id) ? 'text-red-500' : 'text-gray-700'}`}>
                                        {likeCount}
                                    </span>
                                </AppButton>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <AppButton 
                                variant="ghost" 
                                size="sm"
                                className="hover:bg-blue-50"
                                onClick={() => !isSingle && handlePostClick()}
                            >
                                <MessageSquare className="w-5 h-5" />
                                <span className="ml-2 font-semibold text-gray-700">
                                    {post?.comment_count}
                                </span>
                            </AppButton>
                        </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={handleShare}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                            title="Share"
                        >
                            <Share2 className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                        </button>
                        
                        <button 
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                            title="Bookmark"
                        >
                            <Bookmark 
                                className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500 group-hover:text-yellow-500'}`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;