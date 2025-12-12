import { useState } from "react";
import { Bell, } from "lucide-react";

const HomeNav: React.FC = () => {
   
    const [notifications] = useState(3);

    return (
        <>
            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slide-down {
                    animation: slideDown 0.3s ease-out forwards;
                }
            `}</style>

            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-xl">V</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    Vhennus
                                </h1>
                                <p className="text-xs text-gray-500">Social Network</p>
                            </div>
                        </div>

                       

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-3">
                           
                            {/* Notifications */}
                            <div className="relative">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    {notifications > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                            {notifications}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* User Profile */}
                            {/* <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <img
                                        className="w-10 h-10 rounded-full border-2 border-white shadow"
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                                        alt="User"
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-semibold">John Doe</p>
                                    <p className="text-xs text-gray-500">@johndoe</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default HomeNav;