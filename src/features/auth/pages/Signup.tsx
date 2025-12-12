
import { Eye, EyeOff } from "lucide-react";
import AppButton from "../../../Shared/components/Button.tsx";
import { signup, type SignupData } from "../api.ts";
import { toast } from "react-toastify";
import { isAllLowercase, isValidEmailStrict } from "../../../Shared/utils.ts";
import axios from "axios";
import { useAuthStore } from "../useAuthStore.ts";
import { useNavigate } from "react-router-dom";
import InputField from "../../../Shared/components/InputFIeld.tsx";

const tlogo = await import("../../../assets/tlogo.png");

const SignupPage: React.FC = () => {
    const authStore = useAuthStore();
    const navigate = useNavigate();

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ userName: e.target.value });
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ password: e.target.value });
    };
    
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ email: e.target.value });
    };
    
    const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ referralCode: e.target.value });
    };
    
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ confirmPassword: e.target.value });
    };

    const validatePassword = (userName: string, email: string, password: string, confirmPassword: string): boolean => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        if (password.length < 1) {
            toast.error("Passwords cannot be empty");
            return false;
        }
        if (userName.length < 1) {
            toast.error("Username cannot be empty");
            return false;
        }
        if (!isAllLowercase(userName)) {
            toast.error("Username should be lowercase");
            return false;
        }
        if (!isValidEmailStrict(email)) {
            toast.error("Invalid email");
            return false;
        }
        return true;
    };

    const handleSignupClick = async () => {
        if (!validatePassword(authStore.userName, authStore.email, authStore.password, authStore.confirmPassword)) {
            return;
        }

        authStore.setState({ signupLoading: true });
        try {
            const data: SignupData = {
                user_name: authStore.userName,
                password: authStore.password,
                email: authStore.email,
                user_type: "User",
                referral: authStore.referralCode,
            };
            const res = await signup(data);
            toast.success("Signup successful");
            console.log(res);
            authStore.setState({ emailToBeVerified: authStore.email });
            navigate("/confirm_email");
        } catch (err) {
            authStore.setState({ signupLoading: false });
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Error signing up");
            } else {
                toast.error("Error signing up");
            }
            console.log(err);
        } finally {
            authStore.setState({ signupLoading: false });
            console.log("finally");
        }
    };

    return (
        <>
            {/* Add CSS animation styles */}
            <style>{`
             
            `}</style>

            {/* Updated Signup Page with enhanced design */}
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
                        {/* Logo with animation */}
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <img 
                                    src={tlogo.default} 
                                    className="w-24 h-24 object-contain animate-float"
                                    alt="Logo"
                                />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                                <p className="text-gray-600 text-sm">
                                    Join our community today
                                </p>
                            </div>
                        </div>

                        {/* Form Fields with enhanced styling */}
                        <div className="space-y-4">
                            <InputField
                                name="Username"
                                onChange={handleUserNameChange}
                                placeholder="Enter username (lowercase only)"
                                className="w-full"
                                value={authStore.userName}
                            />
                            
                            <InputField
                                name="Email"
                                onChange={handleEmailChange}
                                placeholder="your.email@example.com"
                                className="w-full"
                                type={'email'}
                                value={authStore.email}
                            />
                            
                            <InputField
                                id="password"
                                name="Password"
                                onChange={handlePasswordChange}
                                placeholder="Enter your password"
                                className="w-full"
                                isPassword={true}
                                type={"password"}
                                inactiveIcon={<EyeOff />}
                                activeIcon={<Eye />}
                                value={authStore.password}
                            />
                            
                            <InputField
                                id="confirmPassword"
                                name="Confirm Password"
                                onChange={handleConfirmPasswordChange}
                                placeholder="Confirm your password"
                                className="w-full"
                                isPassword={true}
                                type={"password"}
                                inactiveIcon={<EyeOff />}
                                activeIcon={<Eye />}
                                value={authStore.confirmPassword}
                            />
                            
                            <InputField
                                name="Ref"
                                onChange={handleReferralCodeChange}
                                placeholder="Referral Code (Optional)"
                                className="w-full"
                                value={authStore.referralCode}
                            />
                        </div>

                        {/* Enhanced Button */}
                        <AppButton
                            className="w-full mt-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                            size="lg"
                            loading={authStore.signupLoading}
                            onClick={() => handleSignupClick()}
                        >
                            {authStore.signupLoading ? (
                                <span className="flex items-center justify-center">
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    Create Account
                                    <svg 
                                        className="w-5 h-5 ml-2" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M13 7l5 5m0 0l-5 5m5-5H6" 
                                        />
                                    </svg>
                                </span>
                            )}
                        </AppButton>

                        {/* Enhanced Login Link */}
                        <div className="text-center pt-4">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <a 
                                    href="/login" 
                                    className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200 inline-flex items-center group"
                                >
                                    Sign in
                                    <svg 
                                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M13 7l5 5m0 0l-5 5m5-5H6" 
                                        />
                                    </svg>
                                </a>
                            </p>
                        </div>
                    </div>
                    
                    {/* Footer Note */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500 animate-pulse-slow">
                            By signing up, you agree to our terms and acknowledge you've read our privacy policy.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignupPage;