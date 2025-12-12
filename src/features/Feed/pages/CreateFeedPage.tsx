import React, { useState, useRef } from 'react';
import AppButton from "../../../Shared/components/Button";
import TextArea from "../../../Shared/components/TextArea";
import {  X, Camera, Sparkles, Loader2 } from 'lucide-react';
import { type CreatePostData, createPost } from '../api';
import {toast} from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { uploadImageDirect } from '../../../Shared/api';

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

    if (!validatePost()){
      setIsCreatePostLoading(false);
      return;
    }
    
    try{
      const postData:CreatePostData ={
        text:postTextValue,
        image:uploadedUrl
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
      } finally {
        setIsUploading(false);
      }
    }
  };
 
  const handleClearImage = async () => {
    try {

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    
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
  <>
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
      .glass-card { 
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
      }
      .gradient-border {
        position: relative;
        border: 2px solid transparent;
        background: linear-gradient(white, white) padding-box,
                    linear-gradient(45deg, #667eea, #764ba2) border-box;
      }
    `}</style>

    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Header */}
      <nav className="sticky top-0 z-50 glass-card border-b border-gray-200/50">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium hidden sm:inline">Cancel</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Create Post
            </h1>
            <p className="text-xs text-gray-500">Share your thoughts</p>
          </div>
          
          <AppButton
            loading={iscreatePostLoading}
            variant="primary"
            size="sm"
            onClick={handleCreatePost}
            className="px-4 sm:px-6 bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg transition-all duration-300"
          >
            {iscreatePostLoading ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Publishing...</span>
              </span>
            ) : (
              <span className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Publish</span>
              </span>
            )}
          </AppButton>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-8 animate-slide-in">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              You
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">You</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Posting to</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Everyone
              </span>
            </div>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="mb-6 animate-fade-in">
          <TextArea
            value={postTextValue}
            onChange={handleTextChange}
            placeholder="What's on your mind?"
            className="w-full min-h-[120px] text-lg border-0 focus:ring-0 p-0 placeholder-gray-400 resize-none"
            rows={4}
          />
          
          {/* Character Counter */}
          <div className="flex justify-end mt-2">
            <span className={`text-sm ${postTextValue.length > 250 ? 'text-red-500' : 'text-gray-500'}`}>
              {postTextValue.length}/500
            </span>
          </div>
        </div>

        {/* Image Upload Area */}
        <div className="mb-8">
          <input 
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          
          {!previewUrl ? (
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <div onClick={handleImageClick} className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add media</h3>
                  <p className="text-gray-500 mb-4">Click to upload an image</p>
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Upload Image
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 animate-fade-in">
              <img
                src={previewUrl || ''}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
              
              {/* Upload Progress */}
              {uploadStatus === 'uploading' && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Uploading image...</span>
                    <span className="text-white font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Success Badge */}
              {uploadStatus === 'success' && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Uploaded</span>
                  </div>
                </div>
              )}
              
              {/* Remove Button */}
              <button
                onClick={handleClearImage}
                className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          )}
        </div>

      

      
      </main>
    </div>
  </>
  );
};
 
export default CreateFeedPage;