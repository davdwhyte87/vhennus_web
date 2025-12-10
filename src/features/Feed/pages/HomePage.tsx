import { useNavigate } from "react-router-dom";
import Post from "../Components/Post.tsx";
import {Plus} from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getPostFeeds, type PostFeed } from "../api.ts";
import HomeNav from "../../../Shared/components/HomeNav.tsx";
import PageLoad from "../../../Shared/components/PageLoad.tsx";
import { useWs } from "../../chats/socket.tsx";

const HomePage:React.FC = ()=>{
    const navigate = useNavigate();
    const [posts, setPosts] = useState<PostFeed[]>([]);
    const [isPostsLoading, setIsPostLoading] = useState<boolean>(false)
    const { isConnected } = useWs();


    const getFeeds = async ()=>{
        // fetch feeds from api
        setIsPostLoading(true)
        try{
            const result = await getPostFeeds();
            console.log("Feeds fetched successfully", result);
            setPosts(result.data);
            setIsPostLoading(false)
        }catch(err){
            console.error("Error fetching feeds", err);
            toast.error("Error fetching feeds");
            setIsPostLoading(false)
        }
    }

    useEffect(()=>{
        getFeeds();
    }, []);
    return (
        <div>
            <HomeNav />
            <main>
                <div className="flex flex-col justify-center items-center min-h-screen w-full pb-safe">
                    <PageLoad loading={isPostsLoading}/>
                    <div className="flex flex-col md:w-200 items-center">
                       
                    {posts.map((post)=>(
                        <Post key={post.id} mpost={post} />
                    ))}
                    </div>
                    <button onClick={()=>navigate("/home/feeds/create-post")} className="fixed bottom-24 right-4 flex items-center justify-center
                    rounded-full shadow-lg bg-primary hover:bg-primary/75 transition-colors duration-300 w-15 h-15">
                        <Plus className="w-10 h-10 text-white" />
                    </button>
                </div>
            </main>
        </div>
           
           

        
    )
}


export default HomePage