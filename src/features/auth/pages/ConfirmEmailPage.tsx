import axios from "axios";
import AppButton from "../../../Shared/components/Button";

import { isValidEmailStrict } from "../../../Shared/utils";
import { useAuthStore } from "../useAuthStore";
import { toast } from "react-toastify";
import { getCodeAPI, verifyEmailAPI } from "../api";
import { Mail, ArrowLeft } from "lucide-react";
import InputField from "../../../Shared/components/InputFIeld";

const tlogo = await import("../../../assets/mail.png");

const ConfirmEmailPage = () => {
    const authStore = useAuthStore();

    
    const handleConfirmationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.setState({ confirmationCode: e.target.value });
    };

    const handleResendCode = async () => {
        if (!isValidEmailStrict(authStore.emailToBeVerified)) {
            toast.error("Invalid email");
            return false;
        }

        authStore.setState({ isVerifyEmail: true });
        try {
            const resp = await getCodeAPI({ email: authStore.emailToBeVerified });
            console.log(resp);
            toast.success("Code has been sent to your email");
        } catch (err) {
            authStore.setState({ isVerifyEmail: false });
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Error sending verification code");
            } else {
                toast.error("Error sending verification code");
            }
            console.log(err);
        } finally {
            authStore.setState({ isVerifyEmail: false });
        }
    };

    const handleConfirmEmail = async () => {
        if (!isValidEmailStrict(authStore.emailToBeVerified)) {
            toast.error("Invalid email");
            return false;
        }
        
        if (authStore.confirmationCode.length < 1) {
            toast.error("Confirmation code cannot be empty");
            return false;
        }

        authStore.setState({ isConfirmEmailLoading: true });
        try {
            const resp = await verifyEmailAPI({ 
                email: authStore.emailToBeVerified, 
                code: authStore.confirmationCode 
            });
            console.log(resp);
            toast.success("Email verified successfully!");
        } catch (err) {
            authStore.setState({ isConfirmEmailLoading: false });
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Error verifying email");
            } else {
                toast.error("Error verifying email");
            }
            console.log(err);
        } finally {
            authStore.setState({ isConfirmEmailLoading: false });
        }
    };

    return (
        <>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
                        {/* Back Button */}
                        <a
                            href="/signup"
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group w-fit"
                        >
                            <ArrowLeft className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to signup</span>
                        </a>

                        {/* Logo & Title */}
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <img
                                    src={tlogo.default}
                                    className="w-20 h-20 object-contain animate-float"
                                    alt="Email Icon"
                                />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-gray-900">Confirm Your Email</h1>
                                <p className="text-gray-600 text-sm">
                                    Enter the verification code sent to your email
                                </p>
                            </div>
                        </div>

                        {/* Email Display */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-sm text-gray-700 font-medium">Email to verify:</p>
                            <p className="text-gray-900 font-semibold truncate">{authStore.emailToBeVerified}</p>
                        </div>

                        {/* Verification Code */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Verification Code
                            </label>
                            <InputField
                                name="confirmationCode"
                                onChange={handleConfirmationCodeChange}
                                placeholder="Enter 6-digit code"
                                className="w-full"
                                value={authStore.confirmationCode}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <AppButton
                                className="w-full shadow-md hover:shadow-lg transition-all duration-300"
                                size="lg"
                                loading={authStore.isConfirmEmailLoading}
                                onClick={handleConfirmEmail}
                            >
                                {authStore.isConfirmEmailLoading ? "Verifying..." : "Verify Email"}
                            </AppButton>

                            <AppButton
                                className="w-full"
                                size="md"
                                variant="outline"
                                loading={authStore.isVerifyEmail}
                                onClick={handleResendCode}
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                {authStore.isVerifyEmail ? "Sending..." : "Resend Code"}
                            </AppButton>
                        </div>

                        {/* Login Link */}
                        <div className="text-center pt-4">
                            <p className="text-gray-600 text-sm">
                                Already confirmed?{" "}
                                <a
                                    href="/login"
                                    className="text-primary font-semibold hover:text-primary/80 transition-colors"
                                >
                                    Go to login
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmEmailPage;