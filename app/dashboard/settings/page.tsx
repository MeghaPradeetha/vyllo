"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfile } from "@/lib/db/users"
import { uploadAvatarAction } from "@/app/actions/upload-avatar"
import { Loader2, Upload, Save, User as UserIcon, Globe } from "lucide-react"

export default function SettingsPage() {
  const { user, userProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    bio: userProfile?.bio || '',
    username: userProfile?.username || '',
  })

  // Update form data when userProfile loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName,
        bio: userProfile.bio || '',
        username: userProfile.username,
      })
    }
  }, [userProfile])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    setUploadProgress(0)
    setMessage(null)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 150)

    try {
      // Get ID token for server-side verification
      const idToken = await user.getIdToken()
      
      // Create FormData for server action
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.uid)

      // Call server action
      const result = await uploadAvatarAction(formData, idToken)

      if (result.error) {
        throw new Error(result.error)
      }

      if (!result.url) {
        throw new Error("No URL returned from upload")
      }

      // Complete progress
      setUploadProgress(100)
      
      const downloadURL = result.url
      await updateUserProfile(user.uid, { avatar: downloadURL })
      
      // Small delay to show 100% before reload
      setTimeout(() => {
        window.location.reload()
      }, 500)
      
    } catch (error: any) {
      clearInterval(progressInterval)
      console.error("Error uploading avatar:", error)
      setMessage({ type: 'error', text: error.message || "Failed to upload avatar" })
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setMessage(null)

    try {
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        bio: formData.bio,
      })
      setMessage({ type: 'success', text: "Profile updated successfully" })
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ type: 'error', text: "Failed to update profile" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your profile and account settings</p>
      </div>

      <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer" onClick={isUploading ? undefined : handleAvatarClick}>
            {/* Modern Animated Loader */}
            {isUploading && (
              <div className="absolute -inset-1 rounded-full z-10">
                {/* Rotating Gradient Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-purple-500 animate-spin-slow opacity-75 blur-sm" />
                <div className="absolute inset-0.5 rounded-full bg-zinc-900" />
                
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="rgba(168, 85, 247, 0.1)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 46}`}
                    strokeDashoffset={`${2 * Math.PI * 46 * (1 - uploadProgress / 100)}`}
                    className="transition-all duration-300 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
            
            <div className={`relative w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 transition-all duration-300 z-20 ${
              isUploading ? 'border-transparent scale-95' : 'border-white/10 group-hover:border-purple-500'
            }`}>
              <img 
                src={userProfile.avatar || '/images/default.jpg'} 
                alt={userProfile.username} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-50' : ''}`}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = '/images/default.jpg'
                }}
              />
              
              {/* Upload overlay */}
              {isUploading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[1px]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-md opacity-20 animate-pulse" />
                    <span className="relative text-sm font-bold text-white tabular-nums tracking-tight drop-shadow-lg">
                      {uploadProgress}%
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-purple-200 font-medium mt-1 opacity-80">
                    Uploading
                  </span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <Upload className="w-6 h-6 text-white drop-shadow-md transform group-hover:scale-110 transition-transform duration-200" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Profile Picture</h3>
            <p className="text-sm text-gray-400 mb-2">
              {isUploading ? 'Uploading...' : 'Click the image to upload a new photo'}
            </p>
            <p className="text-xs text-zinc-500">JPG, GIF or PNG. Max size of 800K</p>
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Username</label>
              <input
                type="text"
                value={formData.username}
                disabled
                className="w-full px-4 py-2 bg-zinc-950/50 border border-white/10 rounded-lg text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-zinc-500">Username cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-950/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-zinc-950/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Portfolio URL</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={`${window.location.origin}/portfolio/${userProfile?.username}`}
                disabled
                className="w-full pl-9 pr-4 py-2 bg-zinc-950/50 border border-white/10 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-zinc-500">Your public portfolio link</p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
