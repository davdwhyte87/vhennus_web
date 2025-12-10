import { Camera } from "lucide-react"
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


const EditProfilePage:React.FC = ()=>{

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [_selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [isUploading, setIsUploading] = useState(false);
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
  
        try {
          const url = await uploadImageDirect(file,"profile", (percent) => {
            setUploadProgress(percent);
          });
          setUploadedUrl(url);
          setUploadStatus('success');
        } catch (err) {
          console.error('Upload error', err);
          setUploadStatus('error');
          toast.error("Error uploading image");
          // handle error UI as needed
        } finally {
          setIsUploading(false);
        }
      }
    };

    const getUserProfile = async ()=>{
        // fetch user profile from api
        setGetProfileLoading(true);
        try{
            const resp = await getUserProfileAPI();
            console.log("User profile fetched successfully", resp);
            setUserProfile(resp.data.profile);
            setName(resp.data.profile.name);
            setBio(resp.data.profile.bio);
            setGetProfileLoading(false);

        }catch(err){
            console.error("Error fetching user profile", err);
            toast.error("Error fetching user profile");
            setGetProfileLoading(false);
        }
    }

    const handleNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleBioChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.target.value);
    };


    const handleSaveChanges = async ()=>{
        // save profile changes to api

        setIsSaving(true);
        try{
            const data:UpdateProfileReq = {
                name: name,
                bio: bio,
                image: uploadedUrl || undefined
            }
            const res = await UpdateUserProfileAPI(data);

            console.log("Profile updated successfully");
            toast.success("Profile updated successfully", res);
            setIsSaving(false);
        }catch(err){    
            console.error("Error updating profile", err);
            toast.error("Error updating profile");
            setIsSaving(false);
        }
    }

    useEffect(()=>{
        
        getUserProfile();  
    }, []);

    return(
          <div>
            <BackNav/>
            <main>
                <div className="flex flex-col space-y-2">
                    <PageLoad loading={getProfileLoading}/>
                    <div className="w-full h-[30vh]">
                        <img className="w-full h-full object-cover" src={previewUrl  || userProfile?.image || profileImage} alt="Profile Image"  />
                    </div>
                    <div className='flex space-x-1'>
                        {(uploadStatus === 'uploading' || uploadStatus === 'success') && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${
                                uploadStatus === 'success' ? 'bg-green-500' : 'bg-blue-600'
                                }`}
                                style={{ width: `${uploadProgress || 0}%` }}
                            ></div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col p-5 space-y-5">
                        <div className="flex flex-row justify-between w-full">
                            <div className="flex flex-col justify-start items-start">
                            
                            </div>
                            <div>
                                <input 
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageChange}/>
                                <AppButton variant="outline" size="sm" loading={isUploading} onClick={()=>handleImageClick()}>
                                <Camera />
                                </AppButton>
                            </div>
                        </div>

                        <div>
                            <InputFIeld label="Name" placeholder="Enter your name" value={name} onChange={(e) => { handleNameChange(e) } } name={""} />
                        </div>
                        <div>
                            <TextArea label="" placeholder="Enter your bio" value={bio} onChange={(e) => {handleBioChange(e) } } name={""} />
                        </div>

                        <AppButton variant="primary" size="md" loading={isSaving} onClick={()=>handleSaveChanges()}   >
                            Save Changes
                        </AppButton>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default EditProfilePage