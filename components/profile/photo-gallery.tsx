'use client'

import { useRef } from 'react'
import type { Photo } from '@/lib/types'

interface PhotoGalleryProps {
  photos: Photo[]
  onAddPhoto: (photo: Photo) => void
  onDeletePhoto: (photoId: string) => void
}

export function PhotoGallery({ photos, onAddPhoto, onDeletePhoto }: PhotoGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const photoUrl = event.target?.result as string
      const photo: Photo = {
        id: `photo-${Date.now()}`,
        url: photoUrl,
        date: Date.now(),
        caption: '',
      }
      onAddPhoto(photo)
    }
    reader.readAsDataURL(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Progress Photos</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Add Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {photos.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center">
          <p className="text-muted-foreground">No photos yet. Start tracking your progress!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-lg overflow-hidden bg-muted relative group"
            >
              <img
                src={photo.url}
                alt="Progress photo"
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => onDeletePhoto(photo.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                <p className="text-xs text-white">
                  {new Date(photo.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
