import { useNavigate } from "react-router-dom";
import AppButton from "./Button";
import { ArrowLeft } from "lucide-react";

const profileImage = (await import("../../assets/profile2.png")).default

interface ChatNavProp{
    userName?:string;
    image:string;
}
const ChatNav: React.FC<ChatNavProp> = ({userName, image}) => {
    const navigate = useNavigate();
    
    return (
        <nav className="flex flex-row sticky top-0 z-50 justify-start w-full py-3 bg-white">
                <AppButton onClick={()=>navigate(-1)} variant="ghost" size="sm"><ArrowLeft/></AppButton>
                
                    <img src={image || profileImage}  className="rounded-full w-10 h-10" />
                
                
                <div className="flex px-2 items-center">
                    <text className="text-lg font-normal">{userName}</text>
                </div>
        </nav>
    )
}

export default ChatNav;