import { useNavigate } from "react-router-dom";
import AppButton from "./Button";
import { ArrowLeft } from "lucide-react";


const BackNav: React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <nav className="flex sticky top-0 z-50 justify-start w-full py-1 bg-white">
                <AppButton onClick={()=>navigate(-1)} variant="ghost" size="sm"><ArrowLeft/></AppButton>
            </nav>
        )
}

export default BackNav;