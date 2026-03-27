'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { dataStore } from '@/lib/storage/storage-provider'
import { generateWorkoutPlan } from '@/lib/workout/generator'
import { getAllExercises } from '@/lib/api/exercise-db'
import type { UserSettings, Workout, NormalizedExercise } from '@/lib/types'
import { StatsCard } from '@/components/profile/stats-card'

export const metadata = {
  title: 'Profile - FitFlow',
  description: 'Your fitness profile and stats',
}

export default function ProfilePage() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const settings = dataStore.getUserSettings()
    setUserSettings(settings)

    const savedWorkouts = dataStore.getWorkouts()
    setWorkouts(savedWorkouts)
  }, [])

  const handleGenerateWorkout = async () => {
    if (!userSettings) {
      setError('Please complete your settings first')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const exercises = await getAllExercises()
      const workout = generateWorkoutPlan(userSettings, exercises)

      dataStore.saveWorkout(workout)
      setWorkouts([...workouts, workout])
    } catch (err) {
      setError('Failed to generate workout plan. Please try again.')
      console.error('[v0] Generate workout error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeleteWorkout = (workoutId: string) => {
    dataStore.deleteWorkout(workoutId)
    setWorkouts(workouts.filter(w => w.id !== workoutId))
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your fitness profile and generate workouts</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 mb-8">
          <StatsCard userSettings={userSettings} />

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-card-foreground mb-4">Workout Generation</h2>

            {!userSettings ? (
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  You need to complete your settings before generating a workout plan.
                </p>
                <Link
                  href="/settings"
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Go to Settings
                </Link>
              </div>
            ) : (
              <button
                onClick={handleGenerateWorkout}
                disabled={isGenerating}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating Workout...' : 'Generate New Workout Plan'}
              </button>
            )}
          </div>
        </div>

        {workouts.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Your Workouts ({workouts.length})</h2>
            <div className="space-y-4">
              {workouts.map(workout => (
                <Link
                  key={workout.id}
                  href={`/workouts/${workout.id}`}
                  className="block p-4 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-card-foreground mb-1">{workout.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{workout.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{workout.days.length} days • {workout.frequency}x/week</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDeleteWorkout(workout.id)
                      }}
                      className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {workouts.length === 0 && userSettings && (
          <div className="text-center py-12 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground mb-4">No workout plans yet. Generate one to get started!</p>
          </div>
        )}
      </div>
    </main>
  )
}
