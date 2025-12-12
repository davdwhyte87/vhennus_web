import { Bitcoin, User, Wallet, LogOut, Settings, Users, Bell, Shield, HelpCircle, CreditCard, BarChart, ChevronRight, Lock } from "lucide-react";
import type React from "react";
import { useNavigate } from "react-router-dom";

const MenuPage: React.FC = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        // Add your logout logic here
        navigate('/logout')
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
            `}</style>

            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 pt-10 pb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-start text-3xl font-bold text-white">Menu</h1>
                        <p className="text-blue-100 mt-1">All your settings in one place</p>
                    </div>
                </div>

                {/* User Info Card */}
                {/* <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 animate-fade-in">
                    <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                            <User className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-white">John Doe</h3>
                            <p className="text-blue-100 text-sm">Premium Member</p>
                        </div>
                        <button 
                            onClick={() => navigate('/myprofile')}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div> */}
            </header>

            <main className="px-5 -mt-4 animate-slide-in">
                {/* Menu Grid */}
                <div className="grid gap-3 mb-8">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 gap-3">
                        <MenuItem 
                            text="Wallet" 
                            icon={Wallet} 
                            page="/wallet"
                            color="from-blue-500 to-blue-600"
                            description="Manage your balance"
                        /> 
                        <MenuItem 
                            text="Profile" 
                            icon={User} 
                            page="/myprofile"
                            color="from-purple-500 to-purple-600"
                            description="Edit your profile"
                        />
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-2 gap-3">
                        <MenuItem 
                            text="Earnings" 
                            icon={Bitcoin} 
                            page="/earnings"
                            color="from-amber-500 to-amber-600"
                            description="View your income"
                            disabled={true}
                            disabledReason="Coming to web soon"
                            
                        /> 
                        <MenuItem 
                            text="Friends" 
                            icon={Users} 
                            page="/friends"
                            color="from-green-500 to-green-600"
                            description="Manage connections"
                            disabled={true}
                        />
                    </div>
                </div>

                {/* Settings Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Settings</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <MenuLink 
                            text="Notifications" 
                            icon={Bell} 
                            page="/notifications"
                            badge="3"
                            disabled={true}
                            disabledReason="Coming soon."
                        />
                        <MenuLink 
                            text="Privacy & Security" 
                            icon={Shield} 
                            page="/privacy"
                            disabled={true}
                            disabledReason=""
                        />
                        <MenuLink 
                            text="Payment Methods" 
                            icon={CreditCard} 
                            page="/payments"
                            disabled={true}
                            disabledReason=""
                        />
                        <MenuLink 
                            text="Statistics" 
                            icon={BarChart} 
                            page="/stats"
                            disabled={true}
                            disabledReason=""
                        />
                    </div>
                </div>

                {/* Support Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Support</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <MenuLink 
                            text="Help Center" 
                            icon={HelpCircle} 
                            page="#"
                            disabled={true}
                            disabledReason=""
                        />
                        <MenuLink 
                            text="Settings" 
                            icon={Settings} 
                            page="#"
                            disabled={true}
                            disabledReason=""
                        />
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-2xl p-4 flex items-center justify-center space-x-3 transition-all duration-200 active:scale-[0.98] group"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Logout</span>
                </button>

                {/* App Version */}
                <div className="text-center py-6">
                    <p className="text-sm text-gray-400">Version 2.4.1 • © 2025</p>
                </div>
            </main>

          
        </div>
    )
}

interface MenuItemProps {
    text: string;
    icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref">>;
    page: string;
    color?: string;
    description?: string;
    disabled?: boolean;
    disabledReason?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
    text, 
    icon: Icon, 
    page, 
    color = "from-blue-500 to-blue-600", 
    description, 
    disabled = false,
    disabledReason 
}) => {
    const navigate = useNavigate()
    
    const handleClick = () => {
        if (!disabled) {
            navigate(page)
        }
    }
    
    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`
                bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col items-center justify-center space-y-3 transition-all duration-200
                ${disabled 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-md active:scale-[0.98] group cursor-pointer'
                }
            `}
        >
            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200
                ${disabled 
                    ? `bg-gradient-to-r ${color.replace('500', '300').replace('600', '400')} opacity-70` 
                    : `bg-gradient-to-r ${color} group-hover:scale-110`
                }
            `}>
                <Icon className="w-8 h-8 text-white" />
                {disabled && (
                    <Lock className="w-5 h-5 text-white absolute" />
                )}
            </div>
            <div className="text-center">
                <h3 className={`
                    font-semibold
                    ${disabled ? 'text-gray-500' : 'text-gray-900'}
                `}>
                    {text}
                </h3>
                {description && (
                    <p className={`
                        text-sm mt-1
                        ${disabled ? 'text-gray-400' : 'text-gray-500'}
                    `}>
                        {description}
                    </p>
                )}
                {disabled && disabledReason && (
                    <p className="text-xs text-amber-600 font-medium mt-2 bg-amber-50 px-2 py-1 rounded-full">
                        {disabledReason}
                    </p>
                )}
            </div>
        </button>
    )
}

interface MenuLinkProps {
    text: string;
    icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref">>;
    page: string;
    badge?: string;
    disabled?: boolean;
    disabledReason?: string;
}

const MenuLink: React.FC<MenuLinkProps> = ({ 
    text, 
    icon: Icon, 
    page, 
    badge, 
    disabled = false,
    disabledReason 
}) => {
    const navigate = useNavigate()
    
    const handleClick = () => {
        if (!disabled) {
            navigate(page)
        }
    }
    
    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`
                w-full p-4 flex items-center justify-between transition-colors
                ${disabled 
                    ? 'cursor-not-allowed' 
                    : 'hover:bg-gray-50 cursor-pointer'
                }
            `}
        >
            <div className="flex items-center space-x-3">
                <div className={`
                    p-2 rounded-lg transition-colors
                    ${disabled 
                        ? 'bg-gray-100 text-gray-400' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }
                `}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start">
                    <span className={`
                        font-medium text-left
                        ${disabled ? 'text-gray-400' : 'text-gray-800'}
                    `}>
                        {text}
                    </span>
                    {disabled && disabledReason && (
                        <span className="text-xs text-amber-600 font-medium">
                            {disabledReason}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {badge && !disabled && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                        {badge}
                    </span>
                )}
                {disabled ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
            </div>
        </button>
    )
}
export default MenuPage