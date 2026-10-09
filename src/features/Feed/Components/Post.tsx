import { MessageSquare, Heart, Share2 } from "lucide-react";
import { likePost, type PostFeed } from "../api";
import RelativeTime from "../../../Shared/components/RelativeTime";
import AppButton from "../../../Shared/components/Button";
import { useLikedPosts } from "./LikedPostContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import profileImage from "../../../assets/profile2.png";

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
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const navigate = useNavigate();

    // Stay in sync when the feed data refreshes underneath us.
    useEffect(() => {
        setLikeCount(post.like_count);
    }, [post.like_count]);

    const handleLikeClick = async () => {
        if (!post) return;
        const wasLiked = isLiked(post.id);
        // Optimistic update with rollback on failure.
        toggleLike(post.id);
        setLikeCount((count) => (wasLiked ? Math.max(0, count - 1) : count + 1));
        if (!wasLiked) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
        }
        try {
            await likePost(post.id);
        } catch (error) {
            toggleLike(post.id);
            setLikeCount(post.like_count);
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

    const handleShare = async () => {
        const postUrl = `${window.location.origin}/home/post/${post.id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.name,
                    text: post.text,
                    url: postUrl,
                });
            } catch {
                // User dismissed the share sheet; nothing to do.
            }
        } else {
            try {
                await navigator.clipboard.writeText(postUrl);
                toast.success("Link copied to clipboard!");
            } catch {
                toast.error("Unable to copy the link.");
            }
        }
    };

    return (
        <div className="mb-6 overflow-hidden border border-[#C9A86A]/60 bg-white transition-shadow duration-300 hover:shadow-xl">
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
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                                    {post?.name}
                                </h3>
                                <span className="rounded-full bg-[#C9A86A]/20 px-2 py-0.5 text-xs font-medium text-[#0A1931]">
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
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
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
                                    onClick={handleLikeClick}
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
                                className="hover:bg-[#F5F5F0]"
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
                            aria-label="Share post"
                        >
                            <Share2 className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;