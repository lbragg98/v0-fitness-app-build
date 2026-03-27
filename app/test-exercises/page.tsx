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
  secondaryMuscles?: string[]
  instructions?: string[]
}

export default function TestExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [bodyParts, setBodyParts] = useState<string[]>([])
  const [muscles, setMuscles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [selectedFilter, setSelectedFilter] = useState<string>('')
  const [filterType, setFilterType] = useState<'bodypart' | 'muscle'>('bodypart')
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const LIMIT = 30

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
        console.error('Error fetching filter lists:', err)
      }
    }
    fetchLists()
  }, [])

  const fetchByFilter = async (value: string, type: 'bodypart' | 'muscle') => {
    setLoading(true)
    setError('')
    setSelectedFilter(value)
    setFilterType(type)
    setOffset(0)
    try {
      const response = await fetch(`/api/exercises?type=${type}&value=${encodeURIComponent(value)}&limit=${LIMIT}`)
      
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      
      const data = await response.json()
      const exerciseList = Array.isArray(data) ? data : []
      setExercises(exerciseList)
      setHasMore(exerciseList.length === LIMIT)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllExercises = async (newOffset = 0, append = false) => {
    setLoading(true)
    setError('')
    if (!append) {
      setSelectedFilter('all')
      setOffset(0)
    }
    try {
      const response = await fetch(`/api/exercises?type=all&limit=${LIMIT}&offset=${newOffset}`)
      
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      
      const data = await response.json()
      const exerciseList = Array.isArray(data) ? data : []
      
      if (append) {
        setExercises(prev => [...prev, ...exerciseList])
      } else {
        setExercises(exerciseList)
      }
      setOffset(newOffset)
      setHasMore(exerciseList.length === LIMIT)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    fetchAllExercises(offset + LIMIT, true)
  }

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
              onClick={() => fetchAllExercises(0, false)}
              disabled={loading}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Load All Exercises
            </button>
            <span className="ml-2 text-sm text-muted-foreground">
              (Free API returns 30 per page - use &quot;Load More&quot; to paginate)
            </span>
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

        {loading && exercises.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading exercises...</p>
          </div>
        )}

        {exercises.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Results ({exercises.length} exercises loaded)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-lg hover:border-primary transition-all text-left"
                >
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
                      <p><span className="font-medium">Target:</span> {exercise.targetMuscle || 'N/A'}</p>
                      <p><span className="font-medium">Body Part:</span> {exercise.bodyPart || 'N/A'}</p>
                      <p><span className="font-medium">Equipment:</span> {exercise.equipment || 'N/A'}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedFilter === 'all' && hasMore && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {loading ? 'Loading...' : 'Load More Exercises'}
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && exercises.length === 0 && !error && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Click a filter or &quot;Load All&quot; to fetch exercises</p>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedExercise(null)}
        >
          <div 
            className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground capitalize">{selectedExercise.name}</h2>
              <button 
                onClick={() => setSelectedExercise(null)}
                className="text-muted-foreground hover:text-foreground text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              {selectedExercise.gifUrl && (
                <img
                  src={selectedExercise.gifUrl}
                  alt={selectedExercise.name}
                  className="w-full rounded-lg mb-6 bg-secondary"
                />
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Target Muscle</p>
                  <p className="font-semibold text-foreground capitalize">{selectedExercise.targetMuscle || 'N/A'}</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Body Part</p>
                  <p className="font-semibold text-foreground capitalize">{selectedExercise.bodyPart || 'N/A'}</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Equipment</p>
                  <p className="font-semibold text-foreground capitalize">{selectedExercise.equipment || 'N/A'}</p>
                </div>
                {selectedExercise.secondaryMuscles && selectedExercise.secondaryMuscles.length > 0 && (
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Secondary Muscles</p>
                    <p className="font-semibold text-foreground capitalize">
                      {selectedExercise.secondaryMuscles.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Instructions</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="leading-relaxed">{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedExercise.videoUrl && (
                <div className="mt-6">
                  <h3 className="font-semibold text-foreground mb-3">Video</h3>
                  <video 
                    src={selectedExercise.videoUrl} 
                    controls 
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
