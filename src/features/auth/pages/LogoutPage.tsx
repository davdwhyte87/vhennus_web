import { useNavigate } from "react-router-dom"
import AppButton from "../../../Shared/components/Button"

import { useAuthStore } from "../useAuthStore"
import { LogOut, AlertTriangle, X, Shield, User } from "lucide-react"
import {  useState } from "react"

export const LogoutPage = () => {
    const navigate = useNavigate()
    const authStore = useAuthStore()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        // Simulate a brief delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800))
        
        authStore.setState({ token: '', authUserName: '' })
        setIsLoggingOut(false)
        navigate("/login")
    }

    const handleClose = () => {
        navigate(-1)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(-100px); opacity: 0; }
                }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
                .animate-slide-out { animation: slideOut 0.3s ease-out forwards; }
            `}</style>

            <div className="animate-fade-in w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-red-500 to-amber-500 p-6 relative">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
                                <LogOut className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white text-center mb-2">
                            Logout Confirmation
                        </h2>
                        <p className="text-white/90 text-center text-sm">
                            Are you sure you want to sign out?
                        </p>
                    </div>

                    {/* Warning Section */}
                    <div className="p-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-amber-800 mb-1">
                                        You'll be signed out from:
                                    </h4>
                                    <ul className="text-sm text-amber-700 space-y-1">
                                        <li className="flex items-center">
                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                                            This device
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                                            Active sessions
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                                            Any ongoing activities
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Currently signed in as</p>
                                    <p className="font-semibold text-gray-900">{authStore.authUserName || "User"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <AppButton
                                variant="outline"
                                size="md"
                                onClick={handleClose}
                                className="w-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium py-3.5 rounded-xl transition-all duration-200"
                            >
                                Cancel
                            </AppButton>
                            
                            <AppButton
                                variant="primary"
                                size="md"
                                loading={isLoggingOut}
                                onClick={handleLogout}
                                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoggingOut ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing out...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <LogOut className="w-5 h-5 mr-2" />
                                        Sign Out
                                    </span>
                                )}
                            </AppButton>
                        </div>

                        {/* Security Note */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-center text-gray-500 text-sm">
                                <Shield className="w-4 h-4 mr-2" />
                                Your data is securely stored
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar for Logout */}
                    {isLoggingOut && (
                        <div className="px-6 pb-6">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-red-500 to-amber-500 h-2 rounded-full animate-pulse-slow transition-all duration-300"></div>
                            </div>
                            <p className="text-center text-sm text-gray-600 mt-2">
                                Clearing session data...
                            </p>
                        </div>
                    )}
                </div>

                {/* Optional: Stats or Info */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400">
                        You can always sign back in anytime
                    </p>
                </div>
            </div>
        </div>
    )
}