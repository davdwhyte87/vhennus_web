import { useNavigate } from "react-router-dom";
import Post from "../Components/Post.tsx";
import { Plus, Sparkles, TrendingUp, Users } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import { getPostFeeds, type PostFeed } from "../api.ts";
import HomeNav from "../../../Shared/components/HomeNav.tsx";
import PageLoad from "../../../Shared/components/PageLoad.tsx";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<PostFeed[]>([]);
    const [isPostsLoading, setIsPostLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const getFeeds = async () => {
        setIsPostLoading(true);
        try {
            const result = await getPostFeeds();
            console.log("Feeds fetched successfully", result);
            setPosts(result.data);
        } catch (err) {
            console.error("Error fetching feeds", err);
            toast.error("Error fetching feeds");
        } finally {
            setIsPostLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await getFeeds();
    };

    useEffect(() => {
        getFeeds();
    }, []);

    const handleScroll = () => {
        if (containerRef.current) {
            //const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            // You can add infinite scroll logic here
        }
    };

    return (
        <>
            {/* Add CSS animations */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }
                
                @keyframes shimmer {
                    0% {
                        background-position: -200px 0;
                    }
                    100% {
                        background-position: calc(200px + 100%) 0;
                    }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                .animate-pulse-slow {
                    animation: pulse 2s ease-in-out infinite;
                }
                
                .animate-shimmer {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200px 100%;
                    animation: shimmer 1.5s infinite;
                }
                
                /* Custom scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                
                /* Gradient text */
                .gradient-text {
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <HomeNav />
                
                <main className="relative">
                    {/* Floating Stats Bar */}
                    <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
                        <div className="container mx-auto px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    {/* <div className="flex items-center space-x-2">
                                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Trending</p>
                                            <p className="text-sm font-semibold gradient-text">Live Now</p>
                                        </div>
                                    </div> */}
                                    
                                    <div className="flex items-center space-x-2">
                                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                                            <Users className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Online</p>
                                            <p className="text-sm font-semibold">1.2k+</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <TrendingUp className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    <span className="text-sm font-medium">Refresh</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Posts Container */}
                    <div 
                        ref={containerRef}
                        onScroll={handleScroll}
                        className="container mx-auto px-4 py-6 max-w-3xl custom-scrollbar"
                    >
                        <div className="mb-6 text-center animate-fade-in">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Vhennus</h1>
                            <p className="text-gray-600">Discover what's happening in your community</p>
                        </div>

                        <PageLoad loading={isPostsLoading} />
                        
                        {posts.length === 0 && !isPostsLoading ? (
                            <div className="text-center py-16 animate-fade-in">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center animate-pulse-slow">
                                    <Sparkles className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
                                <p className="text-gray-500 mb-6">Be the first to share something amazing!</p>
                                <button
                                    onClick={() => navigate("/home/feeds/create-post")}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create First Post
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {posts.map((post, index) => (
                                    <div 
                                        key={post.id} 
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <Post key={post.id} mpost={post} />
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Loading more indicator */}
                        {isPostsLoading && posts.length > 0 && (
                            <div className="text-center py-8">
                                <div className="inline-block">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-4">Loading more posts...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Floating Action Button */}
                    <button 
                        onClick={() => navigate("/home/feeds/create-post")} 
                        className="fixed bottom-24 right-6 flex items-center justify-center rounded-full shadow-2xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 w-16 h-16 animate-float z-50 group"
                    >
                        <Plus className="w-8 h-8 text-white transform group-hover:rotate-90 transition-transform duration-300" />
                       
                    </button>
                    
                    {/* Floating Back to Top */}
                    {posts.length > 5 && (
                        <button
                            onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="fixed bottom-40 right-6 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 group"
                        >
                            <svg 
                                className="w-6 h-6 text-gray-600 group-hover:text-primary transform group-hover:-translate-y-1 transition-transform" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>
                    )}
                </main>
            </div>
        </>
    );
};

export default HomePage;