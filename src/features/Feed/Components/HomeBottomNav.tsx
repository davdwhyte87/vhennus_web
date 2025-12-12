import { useState } from "react";
import { Home, MessageSquareText, MessagesSquare, AlignJustify } from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    route: string;
    onClick: (tab: string) => void;
}

function HomeBottomNav() {
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(currentPath);

    function handleTabClick(tab: string) {
        setActiveTab(tab);
        navigate(tab);
        console.log(currentPath);
    }

    const navItems: NavItem[] = [
        { route: "/home/feeds", label: 'Feed', icon: Home, onClick: (tab: string) => handleTabClick(tab) },
        { route: "/home/chats", label: 'Chat', icon: MessageSquareText, onClick: (tab: string) => handleTabClick(tab) },
        { route: "/home/groups", label: 'Groups', icon: MessagesSquare, onClick: (tab: string) => handleTabClick(tab) },
        { route: "/home/menu", label: 'Menu', icon: AlignJustify, onClick: (tab: string) => handleTabClick(tab) },
    ];

    return (
        <>
            <style>{`
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }
                
                .animate-bounce-slow {
                    animation: bounce 2s infinite;
                }
                
                .glass-nav {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.1);
                }
                
                .nav-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .nav-item-active .nav-glow {
                    opacity: 1;
                }
            `}</style>

            <nav className="fixed bottom-0 left-0 right-0 glass-nav z-40">
                <div className="relative">
                    {/* Top Glow Line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    
                    {/* Create Post Button (Center) */}
                    {/* <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <button
                            onClick={() => navigate("/home/feeds/create-post")}
                            className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 animate-bounce-slow group"
                        >
                            <PlusCircle className="w-8 h-8 text-white mx-auto transform group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div> */}
                    
                    {/* Navigation Items */}
                    <div className="container mx-auto px-6">
                        <ul className="flex justify-between items-center h-20">
                            {navItems.map(({ route, label, icon: Icon, onClick }) => {
                                const isActive = activeTab === route;
                                return (
                                    <li key={label} className="relative">
                                        <button
                                            onClick={() => onClick(route)}
                                            className={`flex flex-col items-center justify-center space-y-1 p-3 rounded-2xl transition-all duration-300 ${isActive ? 'nav-item-active bg-gradient-to-b from-primary/10 to-transparent' : 'hover:bg-gray-100'}`}
                                        >
                                            {/* Active Indicator Glow */}
                                            {isActive && (
                                                <div className="nav-glow"></div>
                                            )}
                                            
                                            {/* Icon Container */}
                                            <div className={`relative p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-primary to-purple-600 text-white transform -translate-y-2' : 'bg-gray-100 text-gray-600'}`}>
                                                <Icon className="w-5 h-5" />
                                                
                                                {/* Active Ring */}
                                                {isActive && (
                                                    <div className="absolute -inset-1 border-2 border-primary/30 rounded-full animate-ping"></div>
                                                )}
                                            </div>
                                            
                                            {/* Label */}
                                            <span className={`text-xs font-medium transition-colors duration-300 ${isActive ? 'text-primary font-semibold' : 'text-gray-600'}`}>
                                                {label}
                                            </span>
                                            
                                            {/* Active Indicator Dot */}
                                            {isActive && (
                                                <div className="absolute -bottom-1 w-1.5 h-1.5 bg-primary rounded-full"></div>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    
                    {/* Safety Area for iOS */}
                    <div className="h-safe-bottom bg-white/50"></div>
                </div>
            </nav>
            
            {/* Spacer for bottom nav */}
            <div className="h-24"></div>
        </>
    );
}

export default HomeBottomNav;