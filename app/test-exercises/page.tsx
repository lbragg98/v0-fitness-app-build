'use client'

import { useEffect, useState } from 'react'
import type { Exercise } from '@/lib/types'

export default function TestExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const fetchExercises = async (muscleGroup: string) => {
    setLoading(true)
    setError('')
    try {
      console.log('[v0] Fetching exercises for muscle group:', muscleGroup)
      const response = await fetch(`/api/exercises?muscle=${muscleGroup}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('[v0] API response:', data)
      setExercises(data.exercises || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[v0] Error fetching exercises:', message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">ExerciseDB API Test</h1>

        <div className="mb-8 p-4 bg-secondary rounded-lg">
          <h2 className="text-lg font-semibold text-foreground mb-4">Fetch Exercises by Muscle Group</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'legs', 'glutes', 'hamstrings', 'quadriceps', 'calves', 'abs'].map((muscle) => (
              <button
                key={muscle}
                onClick={() => fetchExercises(muscle)}
                disabled={loading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity capitalize"
              >
                {muscle}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
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
              {exercises.map((exercise, idx) => (
                <div key={idx} className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
                  {exercise.gifUrl && (
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      className="w-full h-48 object-cover bg-secondary"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22200%22 height=%22200%22/%3E%3C/svg%3E'
                      }}
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground capitalize mb-2">{exercise.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><span className="font-medium">Muscle:</span> {exercise.targetMuscle}</p>
                      <p><span className="font-medium">Type:</span> {exercise.type}</p>
                      {exercise.equipment && <p><span className="font-medium">Equipment:</span> {exercise.equipment}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && exercises.length === 0 && !error && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Click a muscle group to load exercises</p>
          </div>
        )}
      </div>
    </div>
  )
}
