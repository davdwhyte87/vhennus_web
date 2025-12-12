import { Camera, User, Edit2, Upload, CheckCircle } from "lucide-react"
import AppButton from "../../../Shared/components/Button"
import InputFIeld from "../../../Shared/components/InputFIeld"
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
            setName(resp.data.profile.name);
            setBio(resp.data.profile.bio);
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <style>{`
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                .animate-pulse-glow { animation: pulse-glow 2s infinite; }
            `}</style>

            <BackNav title="Edit Profile" className="bg-white border-b border-gray-200" />

            <main className="pb-20">
                <PageLoad loading={getProfileLoading} />

                {/* Profile Image Upload Section */}
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-8">
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
                                    <div className="bg-blue-600 text-white p-2 rounded-full animate-pulse-glow">
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
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        {/* Form Header */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <Edit2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                                <p className="text-sm text-gray-500">Update your personal details</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <InputFIeld
                                    label=""
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={handleNameChange}
                                    name="name"
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-2">This name will be displayed on your profile</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
                                    />
                                    <div className="text-xs text-gray-500 mt-2 text-right">
                                        {bio.length}/150
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
                                variant="primary"
                                size="lg"
                                loading={isSaving}
                                onClick={handleSaveChanges}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                {isSaving ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Save Changes
                                    </span>
                                )}
                            </AppButton>

                            {/* Cancel Button */}
                            <button
                                onClick={() => window.history.back()}
                                className="w-full mt-3 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl border border-gray-300 hover:border-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Tips for a great profile
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                <span>Use a clear, friendly profile picture</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                <span>Write a bio that reflects your personality</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
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