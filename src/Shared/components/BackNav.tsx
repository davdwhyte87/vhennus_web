import { useNavigate } from "react-router-dom";
import AppButton from "./Button";
import { ArrowLeft } from "lucide-react";


interface BackNavProp{
    title?:string;
}
const BackNav: React.FC<BackNavProp> = ({title}) => {
    const navigate = useNavigate();
    
    return (
        <nav className="flex sticky top-0 z-50 justify-start w-full py-3 bg-white">
                <AppButton onClick={()=>navigate(-1)} variant="ghost" size="sm"><ArrowLeft/></AppButton>
                <div className="flex px-5 justify-center items-center w-full">
                    <text className="text-2xl font-bold">{title}</text>
                </div>
        </nav>
        )
}

export default BackNav;