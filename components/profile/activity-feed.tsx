'use client'

import { useEffect, useState } from 'react'
import { dataStore } from '@/lib/storage/storage-provider'
import type { WorkoutCompletion, Photo } from '@/lib/types'
import { FeedItem } from '@/components/profile/feed-item'
import { PhotoGallery } from '@/components/profile/photo-gallery'

export function ProfileFeed() {
  const [completions, setCompletions] = useState<WorkoutCompletion[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [activeTab, setActiveTab] = useState<'activity' | 'photos'>('activity')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      const comps = dataStore.getAllWorkoutCompletions().sort(
        (a, b) => b.date - a.date
      )
      setCompletions(comps)

      const photosList = dataStore.getAllPhotos().sort(
        (a, b) => b.date - a.date
      )
      setPhotos(photosList)
    } catch (error) {
      console.error('[v0] Error loading profile data:', error)
    }
  }

  const handleAddPhoto = (photo: Photo) => {
    try {
      dataStore.savePhoto(photo)
      loadData()
    } catch (error) {
      console.error('[v0] Error adding photo:', error)
    }
  }

  const handleDeletePhoto = (photoId: string) => {
    try {
      dataStore.deletePhoto(photoId)
      loadData()
    } catch (error) {
      console.error('[v0] Error deleting photo:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === 'activity'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Activity Feed ({completions.length})
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === 'photos'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Progress Photos ({photos.length})
        </button>
      </div>

      {activeTab === 'activity' && (
        <div className="space-y-4">
          {completions.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">
                No workouts completed yet. Start one from Activity to see it here!
              </p>
            </div>
          ) : (
            completions.map((completion) => (
              <FeedItem key={completion.id} completion={completion} />
            ))
          )}
        </div>
      )}

      {activeTab === 'photos' && (
        <PhotoGallery
          photos={photos}
          onAddPhoto={handleAddPhoto}
          onDeletePhoto={handleDeletePhoto}
        />
      )}
    </div>
  )
}
