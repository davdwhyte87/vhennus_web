import React, { useState, useRef } from 'react'
import AppButton from '../../../Shared/components/Button'
import TextArea from '../../../Shared/components/TextArea'
import { X, Camera, Sparkles } from 'lucide-react'
import { type CreatePostData, createPost } from '../api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { uploadImageDirect } from '../../../Shared/api'

const CreateFeedPage = () => {
  const [postTextValue, setTextValue] = useState('')
  const [_selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [_isUploading, setIsUploading] = useState(false)
  const [iscreatePostLoading, setIsCreatePostLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const validatePost = (): boolean => {
    if (postTextValue == '') {
      toast.error('Post text cannot be empty')
      return false
    }
    return true
  }

  const handleCreatePost = async () => {
    setIsCreatePostLoading(true)
    if (!validatePost()) {
      setIsCreatePostLoading(false)
      return
    }
    try {
      const postData: CreatePostData = {
        text: postTextValue,
        image: uploadedUrl,
      }
      await createPost(postData)
      toast.success('Post created successfully')
    } catch (err) {
      console.error('Error creating post:', err)
      toast.error('Error creating post')
    }
    setIsCreatePostLoading(false)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value)
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setUploadProgress(0)
      setUploadStatus('uploading')
      try {
        const url = await uploadImageDirect(file, 'posts', (percent) => {
          setUploadProgress(percent)
        })
        setUploadedUrl(url)
        setUploadStatus('success')
      } catch (err) {
        console.error('Upload error', err)
        setUploadStatus('error')
        toast.error('Error uploading image')
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleClearImage = async () => {
    try {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setSelectedImage(null)
      setPreviewUrl(null)
      setUploadProgress(null)
      setUploadedUrl(null)
      setUploadStatus('idle')
      setIsUploading(false)
    } catch (err) {
      console.error('Error deleting image:', err)
      toast.error('Failed to delete image')
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-[#C9A86A]/60 bg-[#F5F5F0]/95 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#4d5666] transition-colors hover:text-[#0A1931]"
          >
            <X className="h-5 w-5" />
            <span className="hidden font-medium sm:inline">Cancel</span>
          </button>

          <div className="text-center">
            <h1 className="font-serif text-lg text-[#0A1931]">
              Create Post
            </h1>
            <p className="text-xs text-[#4d5666]">Share your thoughts</p>
          </div>

          <AppButton
            loading={iscreatePostLoading}
            size="sm"
            onClick={handleCreatePost}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Publish</span>
          </AppButton>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center bg-[#0A1931] font-bold text-[#C9A86A]">
            You
          </div>
          <div>
            <h3 className="font-semibold text-[#0A1931]">You</h3>
            <div className="flex items-center gap-2 text-sm text-[#4d5666]">
              <span>Posting to</span>
              <span className="bg-[#C9A86A]/20 px-2 py-0.5 text-xs font-medium text-[#0A1931]">
                Everyone
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <TextArea
            value={postTextValue}
            onChange={handleTextChange}
            placeholder="What's on your mind?"
            className="min-h-[120px] w-full resize-none border-0 p-0 text-lg placeholder-gray-400 focus:ring-0"
            rows={4}
          />
          <div className="mt-2 flex justify-end">
            <span
              className={[
                'text-sm',
                postTextValue.length > 250
                  ? 'text-red-500'
                  : 'text-[#4d5666]',
              ].join(' ')}
            >
              {postTextValue.length}/500
            </span>
          </div>
        </div>

        <div className="mb-8">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {!previewUrl ? (
            <div className="border-2 border-dashed border-[#C9A86A] p-8 text-center transition-colors hover:border-[#CC5A2A]">
              <div onClick={handleImageClick} className="space-y-4">
                <div className="mx-auto grid h-16 w-16 place-items-center bg-[#0A1931]/5">
                  <Camera className="h-8 w-8 text-[#CC5A2A]" />
                </div>
                <div>
                  <h3 className="mb-2 font-serif text-lg text-[#0A1931]">
                    Add media
                  </h3>
                  <p className="mb-4 text-[#4d5666]">
                    Click to upload an image
                  </p>
                  <AppButton
                    variant="secondary"
                    size="sm"
                    onClick={handleImageClick}
                  >
                    Upload Image
                  </AppButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden border border-[#C9A86A]/60">
              <img
                src={previewUrl || ''}
                alt="Preview"
                className="h-64 w-full object-cover"
              />

              {uploadStatus === 'uploading' && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-white">
                      Uploading image...
                    </span>
                    <span className="font-semibold text-white">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-700/50">
                    <div
                      className="h-2 rounded-full bg-[#C9A86A] transition-all duration-300"
                      style={{ width: `${uploadProgress || 0}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadStatus === 'success' && (
                <div className="absolute right-4 top-4">
                  <div className="flex items-center gap-2 bg-[#0A1931] px-3 py-1.5 text-sm font-medium text-white">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#C9A86A]" />
                    Uploaded
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleClearImage}
                aria-label="Remove image"
                className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-lg transition-all hover:scale-110 hover:bg-white"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default CreateFeedPage
