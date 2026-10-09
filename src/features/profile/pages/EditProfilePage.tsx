import { Camera, User, Edit2, Upload, CheckCircle } from "lucide-react"
import AppButton from "../../../Shared/components/Button"
import AppInput from "../../../Shared/components/AppInput"
import TextArea from "../../../Shared/components/TextArea"
import { useEffect, useRef, useState } from "react"
import { uploadImageDirect } from "../../../Shared/api"
import { toast } from "react-toastify"
import { getUserProfileAPI, UpdateUserProfileAPI, type UpdateProfileReq, type UserProfile } from "../api"
import BackNav from "../../../Shared/components/BackNav"
import PageLoad from "../../../Shared/components/PageLoad"

const profileImage = (await import("../../../assets/profile2.png")).default

const EditProfilePage: React.FC = () => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [_selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [_isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [name, setName] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [getProfileLoading, setGetProfileLoading] = useState<boolean>(true);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setUploadProgress(0);
            setUploadStatus('uploading');
            setIsUploading(true);

            try {
                const url = await uploadImageDirect(file, "profile", (percent) => {
                    setUploadProgress(percent);
                });
                setUploadedUrl(url);
                setUploadStatus('success');
                //toast.success("Image uploaded successfully!");
            } catch (err) {
                console.error('Upload error', err);
                setUploadStatus('error');
                toast.error("Error uploading image");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const getUserProfile = async () => {
        setGetProfileLoading(true);
        try {
            const resp = await getUserProfileAPI();
            console.log("User profile fetched successfully", resp);
            setUserProfile(resp.data.profile);
            setName(resp.data.profile.name ?? "");
            setBio(resp.data.profile.bio ?? "");
            setGetProfileLoading(false);
        } catch (err) {
            console.error("Error fetching user profile", err);
            toast.error("Error fetching user profile");
            setGetProfileLoading(false);
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.target.value);
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const data: UpdateProfileReq = {
                name: name,
                bio: bio,
                image: uploadedUrl || undefined
            }
            await UpdateUserProfileAPI(data);
            console.log("Profile updated successfully");
            toast.success("Profile updated successfully!");
            setIsSaving(false);
        } catch (err) {
            console.error("Error updating profile", err);
            toast.error("Error updating profile");
            setIsSaving(false);
        }
    }

    useEffect(() => {
        getUserProfile();
    }, []);

    return (
        <div className="min-h-screen">
            <style>{`
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 0 0 rgba(204, 90, 42, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(204, 90, 42, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(204, 90, 42, 0); }
                }
                .animate-pulse-glow { animation: pulse-glow 2s infinite; }
            `}</style>

            <BackNav title="Edit Profile" className="bg-white border-b border-gray-200" />

            <main className="pb-20">
                <PageLoad loading={getProfileLoading} />

                {/* Profile Image Upload Section */}
                <div className="relative bg-[#0A1931] py-8">
                    <div className="flex flex-col items-center justify-center px-4">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden">
                                <img
                                    className="w-full h-full object-cover"
                                    src={previewUrl || userProfile?.image || profileImage}
                                    alt="Profile"
                                />
                            </div>
                            
                            {/* Camera Button Overlay */}
                            <div 
                                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                                onClick={handleImageClick}
                            >
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            {/* Upload Status Indicator */}
                            <div className="absolute -bottom-2 -right-2">
                                {uploadStatus === 'uploading' ? (
                                    <div className="bg-[#CC5A2A] text-white p-2 rounded-full animate-pulse-glow">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                ) : uploadStatus === 'success' ? (
                                    <div className="bg-green-600 text-white p-2 rounded-full">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="bg-gray-600 text-white p-2 rounded-full">
                                        <User className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />

                        {/* Upload Progress Bar */}
                        {uploadStatus === 'uploading' && (
                            <div className="mt-6 w-full max-w-xs">
                                <div className="flex justify-between text-sm text-white mb-1">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-white/30 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleImageClick}
                            className="mt-4 text-white/90 hover:text-white font-medium text-sm flex items-center gap-2 transition-colors"
                        >
                            <Camera className="w-4 h-4" />
                            {uploadStatus === 'uploading' ? 'Uploading...' : 'Change Profile Photo'}
                        </button>
                    </div>
                </div>

                {/* Edit Form Section */}
                <div className="px-4 -mt-4">
                    <div className="border border-[#C9A86A]/60 bg-white p-6">
                        {/* Form Header */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="bg-[#C9A86A]/20 p-2">
                                <Edit2 className="w-5 h-5 text-[#0A1931]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                                <p className="text-sm text-gray-500">Update your personal details</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div>
                                <AppInput
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={handleNameChange}
                                    name="name"
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-500 mt-2">This name will be displayed on your profile</p>
                            </div>

                            <div>
                                <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                                    Bio
                                </label>
                                <div className="relative">
                                    <TextArea
                                        label=""
                                        placeholder="Tell us something about yourself..."
                                        value={bio}
                                        onChange={handleBioChange}
                                        name="bio"
                                        rows={4}
                                        className="w-full p-3 border-2 border-gray-200 focus:border-[#CC5A2A] focus:ring-2 focus:ring-[#C9A86A]/30 resize-none transition-all"
                                    />
                                    <div className="text-xs text-gray-500 mt-2 text-right">
                                        {(bio ?? "").length}/150
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info Card (Read-only) */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Username</p>
                                        <p className="font-medium text-gray-900">@{userProfile?.user_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Member Since</p>
                                        <p className="font-medium text-gray-900">
                                            {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <AppButton
                                fullWidth
                                loading={isSaving}
                                onClick={handleSaveChanges}
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </AppButton>

                            {/* Cancel Button */}
                            <AppButton
                                fullWidth
                                variant="secondary"
                                className="mt-3"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </AppButton>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-6 border border-[#C9A86A]/60 bg-[#C9A86A]/10 p-5">
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0A1931]">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Tips for a great profile
                        </h3>
                        <ul className="space-y-1 text-sm text-[#4d5666]">
                            <li className="flex items-start gap-2">
                                <span className="text-[#CC5A2A]">•</span>
                                <span>Use a clear, friendly profile picture</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#CC5A2A]">•</span>
                                <span>Write a bio that reflects your personality</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#CC5A2A]">•</span>
                                <span>Keep your name recognizable to friends</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default EditProfilePage