'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { dataStore } from '@/lib/storage/storage-provider'
import type { Workout } from '@/lib/types'
import { WorkoutCard } from '@/components/workouts/workout-card'

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWorkouts()
  }, [])

  const loadWorkouts = () => {
    try {
      const allWorkouts = dataStore.getWorkouts()
      setWorkouts(allWorkouts)
      const active = allWorkouts.find((w) => w.isActive)
      setActiveWorkoutId(active?.id || null)
    } catch (error) {
      console.error('[v0] Error loading workouts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectWorkout = (workout: Workout) => {
    try {
      // Deactivate all workouts
      workouts.forEach((w) => {
        w.isActive = false
        dataStore.saveWorkout(w)
      })

      // Activate selected
      workout.isActive = true
      dataStore.saveWorkout(workout)

      setActiveWorkoutId(workout.id)
      loadWorkouts()
    } catch (error) {
      console.error('[v0] Error selecting workout:', error)
    }
  }

  const handleDeleteWorkout = (workoutId: string) => {
    try {
      if (confirm('Are you sure you want to delete this workout?')) {
        dataStore.deleteWorkout(workoutId)
        loadWorkouts()
      }
    } catch (error) {
      console.error('[v0] Error deleting workout:', error)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Workouts</h1>
            <p className="text-muted-foreground">Manage and activate your workout plans</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/workouts/search"
              className="px-4 py-2 bg-secondary text-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors border border-border"
            >
              Search Exercises
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Generate New
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-32 bg-secondary rounded-lg animate-pulse" />
            <div className="h-32 bg-secondary rounded-lg animate-pulse" />
          </div>
        ) : workouts.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">No Workouts Yet</h3>
            <p className="text-muted-foreground mb-6">
              Generate your first personalized workout plan from your profile.
            </p>
            <Link
              href="/profile"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Generate Workout Plan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                isActive={activeWorkoutId === workout.id}
                onSelect={handleSelectWorkout}
                onDelete={handleDeleteWorkout}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
