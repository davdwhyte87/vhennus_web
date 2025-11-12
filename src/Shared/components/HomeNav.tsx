import { useNavigate } from "react-router-dom";

const HomeNav: React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <nav className="flex sticky top-0 z-50 justify-start w-full p-5 bg-gray-100">
            <text className="text-2xl font-bold">Vhennus</text>
        </nav>
        )
}

export default HomeNav;