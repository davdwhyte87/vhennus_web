import React, { useState, useRef } from 'react'
import AppButton from '../../../Shared/components/Button'
import {
  X,
  ImagePlus,
  BarChart3,
  Plus,
  ArrowLeft,
  Globe,
  Check,
} from 'lucide-react'
import { type CreatePostData, createPost } from '../api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { uploadImageDirect } from '../../../Shared/api'
import { useAuthStore } from '../../auth/useAuthStore'

const MAX_POLL_OPTIONS = 5
const MIN_POLL_OPTIONS = 2
const MAX_POST_LENGTH = 500
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

const CreateFeedPage = () => {
  const [postTextValue, setTextValue] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [iscreatePostLoading, setIsCreatePostLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle')
  const [showPoll, setShowPoll] = useState(false)
  const [pollOptions, setPollOptions] = useState<string[]>(['', ''])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const authUserName = useAuthStore((s) => s.authUserName)

  const displayName = authUserName ? `@${authUserName}` : 'You'
  const avatarInitial = (authUserName || 'Y').charAt(0).toUpperCase()
  const trimmedLength = postTextValue.trim().length
  const isUploadingImage = uploadStatus === 'uploading'
  const isPublishDisabled =
    trimmedLength === 0 || iscreatePostLoading || isUploadingImage
  const countColor =
    postTextValue.length >= MAX_POST_LENGTH
      ? 'text-red-500'
      : postTextValue.length > 400
        ? 'text-amber-600'
        : 'text-gray-400'

  const validatePost = (): boolean => {
    if (postTextValue.trim() === '') {
      toast.error('Write something first')
      return false
    }
    if (showPoll) {
      const cleaned = pollOptions.map((o) => o.trim()).filter((o) => o !== '')
      if (cleaned.length < MIN_POLL_OPTIONS) {
        toast.error('Poll needs at least 2 options')
        return false
      }
      if (cleaned.length > MAX_POLL_OPTIONS) {
        toast.error(`Poll can have at most ${MAX_POLL_OPTIONS} options`)
        return false
      }
      if (cleaned.some((o) => o.length > 280)) {
        toast.error('Each poll option must be 280 characters or fewer')
        return false
      }
    }
    return true
  }

  const handleCreatePost = async () => {
    if (!validatePost()) return
    setIsCreatePostLoading(true)
    try {
      const postData: CreatePostData = {
        text: postTextValue.trim(),
        image: uploadedUrl,
      }
      if (showPoll) {
        postData.poll_options = pollOptions
          .map((o) => o.trim())
          .filter((o) => o !== '')
      }
      await createPost(postData)
      toast.success('Post published')
      navigate('/home/feeds')
    } catch (err) {
      console.error('Error creating post:', err)
      const serverMessage = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message
      toast.error(
        serverMessage && serverMessage.trim() !== ''
          ? serverMessage
          : 'Error creating post',
      )
      setIsCreatePostLoading(false)
    }
  }

  const handleAddPollOption = () => {
    if (pollOptions.length >= MAX_POLL_OPTIONS) {
      toast.info(`Maximum ${MAX_POLL_OPTIONS} options`)
      return
    }
    setPollOptions((prev) => [...prev, ''])
  }

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length <= MIN_POLL_OPTIONS) return
    setPollOptions((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePollOptionChange = (index: number, value: string) => {
    setPollOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)))
  }

  const handleTogglePoll = () => {
    if (showPoll) {
      setShowPoll(false)
      setPollOptions(['', ''])
    } else {
      setShowPoll(true)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
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
      }
    }
  }

  const handleClearImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
    setPreviewUrl(null)
    setUploadProgress(null)
    setUploadedUrl(null)
    setUploadStatus('idle')
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <nav className="sticky top-0 z-40 border-b border-[#E8E0CF] bg-[#F5F5F0]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-xl items-center justify-between gap-2 px-4 sm:h-16 sm:px-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="grid h-10 w-10 place-items-center rounded-full text-[#0A1931] transition-colors hover:bg-[#0A1931]/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate font-serif text-base text-[#0A1931] sm:text-lg">
              Create post
            </h1>
          </div>

          <AppButton
            loading={iscreatePostLoading}
            size="sm"
            disabled={isPublishDisabled}
            onClick={handleCreatePost}
            className="shrink-0 rounded-full px-4"
          >
            Publish
          </AppButton>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-xl px-4 pb-10 pt-4 sm:px-2 sm:pt-6">
        {/* Author */}
        <div className="flex items-center justify-start gap-3 text-left">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0A1931] text-sm font-bold text-[#C9A86A]">
            {avatarInitial}
          </div>
          <div className="min-w-0 text-left">
            <p className="truncate text-left text-sm font-semibold text-[#0A1931]">
              {displayName}
            </p>
            <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-[#E8E0CF] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#4d5666]">
              <Globe className="h-3 w-3" />
              Everyone can see this
            </span>
          </div>
        </div>

        {/* Composer card */}
        <section className="mt-3 rounded-2xl border border-[#E8E0CF] bg-white shadow-[0_1px_2px_rgba(10,25,49,0.06)]">
          <div className="p-4 sm:p-5">
            <label htmlFor="post-text" className="sr-only">
              Post text
            </label>
            <textarea
              id="post-text"
              value={postTextValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              maxLength={MAX_POST_LENGTH}
              className="min-h-[140px] w-full resize-none bg-transparent text-[15px] leading-relaxed text-[#0A1931] placeholder:text-gray-400 focus:outline-none sm:text-base"
            />
            <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400">
                {showPoll ? 'Post + poll' : 'Plain text post'}
                {uploadedUrl ? ' • 1 photo' : ''}
              </p>
              <span className={`text-xs font-medium tabular-nums ${countColor}`}>
                {postTextValue.length}/{MAX_POST_LENGTH}
              </span>
            </div>
          </div>

          {/* Attach toolbar */}
          <div className="grid grid-cols-2 gap-2 border-t border-gray-100 p-3 sm:p-4">
            <button
              type="button"
              onClick={handleImageClick}
              className={[
                'flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors',
                previewUrl
                  ? 'border-[#0A1931] bg-[#0A1931] text-white'
                  : 'border-[#E8E0CF] bg-white text-[#0A1931] hover:border-[#CC5A2A] hover:text-[#CC5A2A]',
              ].join(' ')}
            >
              {previewUrl ? (
                <Check className="h-4 w-4" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              {previewUrl ? 'Photo added' : 'Photo'}
            </button>
            <button
              type="button"
              onClick={handleTogglePoll}
              aria-pressed={showPoll}
              className={[
                'flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors',
                showPoll
                  ? 'border-[#0A1931] bg-[#0A1931] text-white'
                  : 'border-[#E8E0CF] bg-white text-[#0A1931] hover:border-[#CC5A2A] hover:text-[#CC5A2A]',
              ].join(' ')}
            >
              <BarChart3 className="h-4 w-4" />
              {showPoll ? 'Poll on' : 'Poll'}
            </button>
          </div>

          {/* Poll editor */}
          {showPoll && (
            <div className="border-t border-gray-100 p-3 sm:p-4">
              <div className="rounded-xl border border-[#E8E0CF] bg-[#F5F5F0]/70 p-3">
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#4d5666]">
                    Poll options
                  </p>
                  <span className="text-[11px] font-medium text-gray-400">
                    {pollOptions.length}/{MAX_POLL_OPTIONS}
                  </span>
                </div>
                <div className="space-y-2">
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="grid h-10 w-8 shrink-0 place-items-center rounded-lg border border-[#E8E0CF] bg-white text-xs font-bold text-[#0A1931]">
                        {OPTION_LETTERS[idx] ?? idx + 1}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          handlePollOptionChange(idx, e.target.value)
                        }
                        placeholder={`Option ${idx + 1}`}
                        maxLength={280}
                        aria-label={`Poll option ${idx + 1}`}
                        className="h-10 min-w-0 flex-1 rounded-xl border border-[#E8E0CF] bg-white px-3 text-sm text-[#0A1931] placeholder:text-gray-400 focus:border-[#CC5A2A] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        disabled={pollOptions.length <= MIN_POLL_OPTIONS}
                        aria-label={`Remove option ${idx + 1}`}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E0CF] bg-white text-gray-400 transition-colors hover:border-red-300 hover:text-red-500 disabled:opacity-30"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {pollOptions.length < MAX_POLL_OPTIONS ? (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#C9A86A] bg-white px-3 py-2.5 text-sm font-semibold text-[#0A1931] transition-colors hover:border-[#CC5A2A] hover:text-[#CC5A2A]"
                  >
                    <Plus className="h-4 w-4" />
                    Add option
                  </button>
                ) : null}
                <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
                  2–{MAX_POLL_OPTIONS} options. Results and vote counts appear
                  after you publish.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Photo section */}
        <section className="mt-3 rounded-2xl border border-[#E8E0CF] bg-white p-3 shadow-[0_1px_2px_rgba(10,25,49,0.06)] sm:p-4">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {!previewUrl ? (
            <button
              type="button"
              onClick={handleImageClick}
              className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#E3D9C2] px-4 py-7 text-center transition-colors hover:border-[#CC5A2A] sm:py-8"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#0A1931]/5">
                <ImagePlus className="h-6 w-6 text-[#CC5A2A]" />
              </span>
              <span className="text-sm font-semibold text-[#0A1931]">
                Add a photo
              </span>
              <span className="text-xs text-gray-400">
                Optional — JPG or PNG
              </span>
            </button>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-[#E8E0CF]">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="max-h-[320px] w-full bg-gray-50 object-cover"
              />
              {isUploadingImage && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-white">
                    <span>Uploading…</span>
                    <span className="tabular-nums">{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
                    <div
                      className="h-full rounded-full bg-[#C9A86A] transition-all duration-300"
                      style={{ width: `${uploadProgress || 0}%` }}
                    />
                  </div>
                </div>
              )}
              {uploadStatus === 'success' && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#0A1931] px-2.5 py-1 text-[11px] font-semibold text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A86A]" />
                  Uploaded
                </span>
              )}
              <button
                type="button"
                onClick={handleClearImage}
                aria-label="Remove photo"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default CreateFeedPage
