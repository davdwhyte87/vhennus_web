import React, { useState, useRef } from 'react';
import AppButton from "../../../Shared/components/Button";
import TextArea from "../../../Shared/components/TextArea";
import { Image, X } from 'lucide-react';
import { type CreatePostData, createPost } from '../api';
import {toast} from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { deleteImage, uploadImageDirect } from '../../../Shared/api';

const CreateFeedPage = () => {
  const [postTextValue, setTextValue] = useState('');
  const [_selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [_isUploading, setIsUploading] = useState(false);
  const [iscreatePostLoading, setIsCreatePostLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();



  const validatePost = (): boolean => {

    if (postTextValue == ''){
      toast.error("Post text cannot be empty");
      return false;
    }

    return true;
  }
  const handleCreatePost = async () => {
    setIsCreatePostLoading(true);

    // validate input data 
    if (!validatePost()){
      setIsCreatePostLoading(false);
      return;
    }
    try{
      const postData:CreatePostData ={
        text:postTextValue,
        // image: uploadedUrl ?? undefined
      }

      const result = await createPost(postData);
      console.log('Post created:', result);
      toast.success("Post created successfully");
    }catch(err){
      setIsCreatePostLoading(false);
      console.error('Error creating post:', err);
      toast.error("Error creating post");
    }

    setIsCreatePostLoading(false);
  }
  const handleTextChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };
 
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
        const url = await uploadImageDirect(file, "posts", (percent) => {
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
 
  const handleClearImage = async () => {
    try {
      // Only attempt to delete if we have an uploaded URL
      console.log('Deleting image:', uploadedUrl);
      if (uploadedUrl) {
        await deleteImage(uploadedUrl);
      }

      // Reset file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    
      // Reset all other states
      setSelectedImage(null);
      setPreviewUrl(null);
      setUploadProgress(null);
      setUploadedUrl(null);
      setUploadStatus('idle');
      setIsUploading(false);
    } catch (err) {
      console.error('Error deleting image:', err);
      toast.error('Failed to delete image');
    }
  };
 
  return(
  <div className="m-0">
    <nav className="flex flex-row justify-between sticky top-0 w-full p-5">
      <div className="flex">
        <AppButton onClick={()=>navigate(-1)} variant="outline" size="sm">Cancel</AppButton>
      </div>
      <div className="flex">
        <AppButton loading={iscreatePostLoading} variant="primary" size="sm" onClick={handleCreatePost}>Post</AppButton>
      </div>
    </nav>
 
    <main>
      <div className='flex flex-col px-5'>
        <div className='flex py-3 space-x-3'>
          <input 
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <AppButton variant="outline" size='sm' onClick={handleImageClick}>
            <Image />
          </AppButton>
    
        </div>
        <div className='flex space-x-3'>
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
        <div className='flex w-full'>
          <TextArea value={postTextValue} onChange={handleTextChange} />
        </div>
        <div className='flex'>
          {previewUrl && (
            <div className="flex items-center space-x-2 relative">
              <div className="relative">
                <img src={previewUrl} alt="preview" className="h-16 w-16 object-cover rounded" />
                <div className="absolute -top-2 -right-2">
                  <AppButton 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearImage}
                    className="rounded-full p-1 bg-white"
                  >
                    <X className="h-4 w-4" />
                  </AppButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  </div>
  );
 
}
 
export default CreateFeedPage;