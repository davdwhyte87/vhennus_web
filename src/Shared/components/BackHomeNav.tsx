
import { useNavigate } from "react-router-dom";
import AppButton from "./Button";
import {  Home } from "lucide-react";


interface BackHomeNavProp{
    title?:string;
}
const BackHomeNav: React.FC<BackHomeNavProp> = ({title}) => {
    const navigate = useNavigate();
    
    return (
        <nav className="flex sticky top-0 z-50 justify-start w-full py-3 bg-white">
                <AppButton onClick={()=>navigate('/home')} variant="ghost" size="sm"><Home/></AppButton>
                <div className="flex px-5 justify-center items-center w-full">
                    <text className="text-2xl font-bold">{title}</text>
                </div>
        </nav>
        )
}

export default BackHomeNav;