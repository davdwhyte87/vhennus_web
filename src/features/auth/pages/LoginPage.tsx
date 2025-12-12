
import { Eye, EyeOff } from "lucide-react";
import AppButton from "../../../Shared/components/Button.tsx";
import { login, type LoginData } from "../api.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../useAuthStore.ts";
import axios from "axios";
import InputField from "../../../Shared/components/InputFIeld.tsx";

const tlogo = await import("../../../assets/tlogo.png");

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const authStore = useAuthStore();

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ userName: e.target.value });
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ password: e.target.value });
    };

    const handleLoginClick = async () => {
        authStore.setState({ isLoginLoading: true });
        try {
            const loginData: LoginData = {
                user_name: authStore.userName,
                password: authStore.password
            };
            const res = await login(loginData);
            authStore.setState({ token: res.token, authUserName: authStore.userName });
            console.log("Login successful token ----", res.token);
            if (res.email_confirmed) {
                navigate("/home/feeds");
            } else {
                authStore.setState({ emailToBeVerified: res.email });
                navigate("/confirm_email");
            }
        } catch (err) {
            authStore.setState({ isLoginLoading: false });
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Error logging in");
            } else {
                toast.error("Error logging in");
            }
        } finally {
            authStore.setState({ isLoginLoading: false });
        }
    };

    return (
        <>
            {/* Add CSS animation styles */}

            {/* Simplified Enhanced Login Page */}
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
                        {/* Logo & Title */}
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <img 
                                    src={tlogo.default} 
                                    className="w-24 h-24 object-contain animate-float"
                                    alt="Logo"
                                />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                                <p className="text-gray-600 text-sm">
                                    Sign in to your account
                                </p>
                            </div>
                        </div>

                        {/* Login Form */}
                        <div className="space-y-4">
                            <InputField
                                name="Username"
                                onChange={handleUserNameChange}
                                placeholder="Enter your username"
                                className="w-full"
                                value={authStore.userName}
                            />
                            
                            <InputField
                                id="password"
                                name="Password"
                                onChange={handlePasswordChange}
                                placeholder="Enter your password"
                                className="w-full"
                                showIcon={false}
                                isPassword={true}
                                type={"password"}
                                inactiveIcon={<EyeOff />}
                                activeIcon={<Eye />}
                                value={authStore.password}
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <a 
                                href="/forgot_password" 
                                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <AppButton
                            className="w-full mt-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                            size="lg"
                            loading={authStore.isLoginLoading}
                            onClick={handleLoginClick}
                        >
                            {authStore.isLoginLoading ? "Signing in..." : "Sign In"}
                        </AppButton>

                        {/* Sign Up Link */}
                        <div className="text-center pt-4 border-t border-gray-100">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{" "}
                                <a 
                                    href="/signup" 
                                    className="text-primary font-semibold hover:text-primary/80 transition-colors"
                                >
                                    Create account
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500 animate-pulse-slow">
                            Secure login with industry-standard encryption
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;