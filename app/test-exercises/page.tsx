'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Exercise {
  id: string
  name: string
  targetMuscle: string
  equipment: string
  bodyPart: string
  gifUrl: string
  videoUrl?: string
}

export default function TestExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [bodyParts, setBodyParts] = useState<string[]>([])
  const [muscles, setMuscles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [selectedFilter, setSelectedFilter] = useState<string>('')
  const [filterType, setFilterType] = useState<'bodypart' | 'muscle'>('bodypart')

  // Fetch available body parts and muscles on mount
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [bodyPartsRes, musclesRes] = await Promise.all([
          fetch('/api/exercises?type=list&category=bodyparts'),
          fetch('/api/exercises?type=list&category=muscles')
        ])
        
        if (bodyPartsRes.ok) {
          const data = await bodyPartsRes.json()
          setBodyParts(Array.isArray(data) ? data : [])
        }
        if (musclesRes.ok) {
          const data = await musclesRes.json()
          setMuscles(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('[v0] Error fetching filter lists:', err)
      }
    }
    fetchLists()
  }, [])

  const fetchByFilter = async (value: string, type: 'bodypart' | 'muscle') => {
    setLoading(true)
    setError('')
    setSelectedFilter(value)
    setFilterType(type)
    try {
      const response = await fetch(`/api/exercises?type=${type}&value=${encodeURIComponent(value)}&limit=20`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      setExercises(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[v0] Error fetching exercises:', message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllExercises = async () => {
    setLoading(true)
    setError('')
    setSelectedFilter('all')
    try {
      const response = await fetch('/api/exercises?type=all&limit=30')
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      setExercises(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[v0] Error fetching all exercises:', message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Fallback values
  const displayBodyParts = bodyParts.length > 0 ? bodyParts : [
    'back', 'cardio', 'chest', 'lower arms', 'lower legs',
    'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
  ]
  
  const displayMuscles = muscles.length > 0 ? muscles : [
    'abs', 'biceps', 'calves', 'delts', 'glutes', 'hamstrings',
    'lats', 'pectorals', 'quads', 'traps', 'triceps'
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground">&larr; Back</Link>
          <h1 className="text-3xl font-bold text-foreground">ExerciseDB API Test</h1>
        </div>

        <div className="mb-8 p-4 bg-secondary rounded-lg">
          <h2 className="text-lg font-semibold text-foreground mb-4">Fetch Exercises</h2>
          
          <div className="mb-4">
            <button
              onClick={fetchAllExercises}
              disabled={loading}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Load All (30 exercises)
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Filter by Body Part:</p>
            <div className="flex flex-wrap gap-2">
              {displayBodyParts.map((part) => (
                <button
                  key={part}
                  onClick={() => fetchByFilter(part, 'bodypart')}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all capitalize ${
                    selectedFilter === part && filterType === 'bodypart'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:bg-muted'
                  } disabled:opacity-50`}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Filter by Target Muscle:</p>
            <div className="flex flex-wrap gap-2">
              {displayMuscles.map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => fetchByFilter(muscle, 'muscle')}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all capitalize ${
                    selectedFilter === muscle && filterType === 'muscle'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:bg-muted'
                  } disabled:opacity-50`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading exercises...</p>
          </div>
        )}

        {!loading && exercises.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Results ({exercises.length} exercises)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
                  {exercise.gifUrl ? (
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      className="w-full h-48 object-cover bg-secondary"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-secondary flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground capitalize mb-2">{exercise.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><span className="font-medium">Target:</span> {exercise.targetMuscle}</p>
                      <p><span className="font-medium">Body Part:</span> {exercise.bodyPart}</p>
                      <p><span className="font-medium">Equipment:</span> {exercise.equipment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && exercises.length === 0 && !error && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Click a filter or &quot;Load All&quot; to fetch exercises</p>
          </div>
        )}
      </div>
    </div>
  )
}
