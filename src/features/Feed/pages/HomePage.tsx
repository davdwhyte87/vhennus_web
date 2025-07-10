import Post from "../Components/Post.tsx";
import {Plus} from "lucide-react";

const HomePage:React.FC = ()=>{

    return (
        <div className="flex flex-col justify-center min-h-screen w-full pb-safe">
            <div className="flex justify-center w-full p-5">
                <text className="text-2xl font-bold">Vhennus</text>
            </div>
            <div className="flex flex-col items-center w-full">
                <Post></Post>
                <Post></Post>
            </div>
            <button className="fixed bottom-24 right-4 flex items-center justify-center
             rounded-full shadow-lg bg-primary hover:bg-primary/75 transition-colors duration-300 w-20 h-20">
                <Plus className="w-10 h-10 text-white" />
            </button>

        </div>
    )
}


export default HomePage