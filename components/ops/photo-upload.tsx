"use client"

import { useState, useRef } from "react"
import { Camera, X, Upload } from "lucide-react"

interface PhotoUploadProps {
  photos: string[]
  onPhotosChange: (photos: string[]) => void
  label: string
  maxPhotos?: number
}

export function PhotoUpload({ photos, onPhotosChange, label, maxPhotos = 5 }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const newPhotos: string[] = []
      
      for (const file of Array.from(files)) {
        // For now, convert to base64 data URL
        // In production, you'd upload to Vercel Blob or similar
        const reader = new FileReader()
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        newPhotos.push(dataUrl)
      }

      onPhotosChange([...photos, ...newPhotos].slice(0, maxPhotos))
    } catch (error) {
      console.error("Error uploading photos:", error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      
      <div className="flex flex-wrap gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="relative">
            <img
              src={photo}
              alt={`${label} ${index + 1}`}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-teal-500 hover:text-teal-500 disabled:opacity-50"
          >
            {uploading ? (
              <Upload className="h-6 w-6 animate-pulse" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
            <span className="mt-1 text-xs">Add</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <p className="mt-2 text-xs text-slate-500">
        {photos.length}/{maxPhotos} photos
      </p>
    </div>
  )
}
