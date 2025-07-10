//import {useState} from "react";
import {Home, MessageSquareText,MessagesSquare,
    AlignJustify} from "lucide-react";
import navBg from "../../../assets/navBg.png";
import {useLocation, useNavigate} from 'react-router-dom'


interface NavItem {
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    bgImage: string;
    route:string;
    onClick: (tb:string) => void;
}
function HomeBottomNav() {
    //const [selectedTab, setSelectedTab] = useState<string>('/home/feeds')
    const location = useLocation();
    const currentPath =location.pathname;
    const navigate = useNavigate();
    function handleTabClick(tab: string) {
        //setSelectedTab(tab)
        navigate(tab)
        console.log(currentPath)
    }
    const navItems: NavItem[] = [
        { route:"/home/feeds", label: 'Feed', icon: Home, bgImage: navBg, onClick: (tab:string) => handleTabClick(tab) },
        {route:"/home/chats", label: 'Chat', icon: MessageSquareText, bgImage: navBg, onClick: (tab:string) => handleTabClick(tab) },
        {route:"/home/groups", label: 'Groups', icon: MessagesSquare, bgImage: navBg, onClick: (tab:string) => handleTabClick(tab)},
        {route:"/home/menu", label: 'Menu', icon: AlignJustify, bgImage: navBg, onClick: (tab:string) => handleTabClick(tab) },
    ];
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-nav shadow-inner pb-8 pl-4 pr-4 ">
            <ul className="flex gap-2 justify-between h-full">
                {navItems.map(({route, label, icon: Icon, onClick }) => (
                    <li key={label} className="flex-1 flex">
                        <button
                            onClick={()=>onClick(route)}
                            className={`w-full h-16 flex flex-col items-center justify-center  bg-center pt-4 pb-2 transition-all   ${(currentPath==route)? "rounded-b-[1000px] bg-white ": "bg-nav"} bg-no-repeat `}

                        >
                            <Icon className="w-6 h-6 " />
                            <span className="text-xs mt-1 text-primary-800">{label}</span>
                        </button>

                    </li>
                ))}
            </ul>
        </nav>

    )
}
export default HomeBottomNav