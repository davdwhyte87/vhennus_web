import axios from "axios";
import AppButton from "../../../Shared/components/Button";

import { useAuthStore } from "../useAuthStore";
import { toast } from "react-toastify";
import { changePasswordAPI, getResetPasswordCodeAPI } from "../api";
import { Eye, EyeOff, ArrowLeft, Mail, Key } from "lucide-react";
import InputField from "../../../Shared/components/InputFIeld";

const tlogo = await import("../../../assets/tlogo.png");

const ForgotPasswordPage = () => {
    const authStore = useAuthStore();

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ userName: e.target.value });
    };
    
    const handleConfirmationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ confirmationCode: e.target.value });
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ password: e.target.value });
    };
    
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ confirmPassword: e.target.value });
    };

    const validateData = (): boolean => {
        if (authStore.password !== authStore.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        if (authStore.password.length < 1) {
            toast.error("Passwords cannot be empty");
            return false;
        }
        if (authStore.userName.length < 1) {
            toast.error("Username cannot be empty");
            return false;
        }
        if (authStore.confirmationCode.length < 1) {
            toast.error("Confirmation code cannot be empty");
            return false;
        }
        return true;
    };

    const handleSendChangePasswordCode = async () => {
        if (authStore.userName.length < 1) {
            toast.error("Username cannot be empty");
            return false;
        }

        authStore.setState({ isGetChangePasswordCodeLoading: true });
        try {
            const resp = await getResetPasswordCodeAPI({ user_name: authStore.userName });
            console.log(resp);
            toast.success("Code has been sent to your email");
        } catch (err) {
            authStore.setState({ isGetChangePasswordCodeLoading: false });
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Error sending code");
            } else {
                toast.error("Error sending code");
            }
            console.log(err);
        } finally {
            authStore.setState({ isGetChangePasswordCodeLoading: false });
        }
    };

    const handleResetPassword = async () => {
        if (!validateData()) {
            return false;
        }

        authStore.setState({ isChangePasswordLoading: true });
        try {
            const resp = await changePasswordAPI({
                user_name: authStore.userName,
                code: authStore.confirmationCode,
                password: authStore.password,
            });
            console.log(resp);
            toast.success("Password has been changed. Login now.");
        } catch (err) {
            authStore.setState({ isChangePasswordLoading: false });
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Error changing password");
            } else {
                toast.error("Error changing password");
            }
            console.log(err);
        } finally {
            authStore.setState({ isChangePasswordLoading: false });
        }
    };

    return (
        <>
            {/* Add CSS animation styles */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }
                
                .animate-pulse-slow {
                    animation: pulse 2s ease-in-out infinite;
                }
            `}</style>

            {/* Enhanced Forgot Password Page - Single Step */}
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
                        {/* Back Button */}
                        <a
                            href="/login"
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group w-fit"
                        >
                            <ArrowLeft className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to login</span>
                        </a>

                        {/* Logo & Title */}
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <img
                                    src={tlogo.default}
                                    className="w-20 h-20 object-contain animate-float"
                                    alt="Logo"
                                />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                                <p className="text-gray-600 text-sm">
                                    Enter your username and reset code to set a new password
                                </p>
                            </div>
                        </div>

                        {/* Instruction Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <Key className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-blue-800 font-medium">
                                        1. Enter your username and click "Send Code"
                                    </p>
                                    <p className="text-sm text-blue-800 font-medium mt-1">
                                        2. Check your email for the reset code
                                    </p>
                                    <p className="text-sm text-blue-800 font-medium mt-1">
                                        3. Enter the code and your new password below
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Username Field with Send Code Button */}
                        <div className="space-y-4">
                            <div className="flex space-x-2">
                                <div className="flex-grow">
                                    <InputField
                                        name="Username"
                                        onChange={handleUsername}
                                        placeholder="Enter username"
                                        value={authStore.userName}
                                    />
                                </div>
                                <AppButton
                                    size="md"
                                    variant="outline"
                                    loading={authStore.isGetChangePasswordCodeLoading}
                                    onClick={handleSendChangePasswordCode}
                                    className="whitespace-nowrap"
                                >
                                    <Mail className="w-4 h-4 mr-1" />
                                    Send Code
                                </AppButton>
                            </div>

                            {/* Reset Code Field */}
                            <InputField
                                name="confirmationCode"
                                onChange={handleConfirmationCodeChange}
                                placeholder="Enter reset code"
                                value={authStore.confirmationCode}
                            />

                            {/* Password Fields */}
                            <div className="space-y-3">
                                <InputField
                                    name="password"
                                    onChange={handlePasswordChange}
                                    placeholder="New password"
                                    isPassword={true}
                                    inactiveIcon={<EyeOff />}
                                    activeIcon={<Eye />}
                                    type={"password"}
                                    value={authStore.password}
                                />

                                <InputField
                                    name="confirmPassword"
                                    onChange={handleConfirmPasswordChange}
                                    placeholder="Confirm new password"
                                    isPassword={true}
                                    type={"password"}
                                    inactiveIcon={<EyeOff />}
                                    activeIcon={<Eye />}
                                    value={authStore.confirmPassword}
                                />
                            </div>
                        </div>

                        {/* Reset Password Button */}
                        <AppButton
                            className="w-full mt-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                            size="lg"
                            loading={authStore.isChangePasswordLoading}
                            onClick={handleResetPassword}
                        >
                            {authStore.isChangePasswordLoading ? (
                                "Resetting Password..."
                            ) : (
                                <>
                                    Reset Password
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
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </>
                            )}
                        </AppButton>

                        {/* Login Link */}
                        <div className="text-center pt-4 border-t border-gray-100">
                            <p className="text-gray-600 text-sm">
                                Remembered your password?{" "}
                                <a
                                    href="/login"
                                    className="text-primary font-semibold hover:text-primary/80 transition-colors"
                                >
                                    Back to login
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500 animate-pulse-slow">
                            For security, reset codes are valid for 15 minutes only
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;