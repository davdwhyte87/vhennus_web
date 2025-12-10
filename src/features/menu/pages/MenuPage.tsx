import { Bitcoin, icons, LogOut, User, Wallet, X, type LucideProps } from "lucide-react";
import type React from "react";
import { useNavigate } from "react-router-dom";


const MenuPage:React.FC = () => {
    return (
        <div className="bg-gray-100 w-full h-">
            <nav className="flex justify-start p-5">
                <text className="text-3xl font-bold">Menu</text>
            </nav>
            <main>
                <div className="grid grid-cols-2 w-full p-5 space-x-4 space-y-4">
                    <MenuItem text="Wallet" icon={Wallet} page="/wallet"/> 
                    <MenuItem text="Profile" icon={User} page="/myprofile"/>
                    <MenuItem text="Earnings" icon={Bitcoin} page=""/> 
                    <MenuItem text="Logout" icon={X} page="/logout" />
                </div>
            </main>
        </div>
    )
}


interface MenuItemProps{
    text:string;
    icon:React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
    page:string
}
const MenuItem:React.FC<MenuItemProps> = ({text, icon:Icon, page})=>{
    const navigate = useNavigate()
    return (
        <div onClick={()=>{navigate(page)}} className="flex flex-col active:bg-gray-100 justify-center items-center p-5 space-y-2 shadow-lg bg-white">
            <Icon className="w-8 h-8" />
            <text className="text-lg">{text}</text>
        </div>
    )
}

export default MenuPage;