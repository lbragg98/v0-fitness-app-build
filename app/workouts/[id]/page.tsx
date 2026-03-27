'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { dataStore } from '@/lib/storage/storage-provider'
import type { Workout } from '@/lib/types'
import { ExerciseCard } from '@/components/workouts/exercise-card'

export default function WorkoutDetailPage() {
  const params = useParams()
  const workoutId = params.id as string
  
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [selectedDay, setSelectedDay] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const foundWorkout = dataStore.getWorkout(workoutId)
    setWorkout(foundWorkout)
    setIsLoading(false)
  }, [workoutId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Workout Not Found</h1>
          <p className="text-muted-foreground mb-6">This workout plan doesn&apos;t exist or has been deleted.</p>
          <Link
            href="/workouts"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            Back to Workouts
          </Link>
        </div>
      </div>
    )
  }

  const currentDay = workout.days[selectedDay]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/workouts"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{workout.name}</h1>
            <p className="text-muted-foreground text-sm">{workout.frequency} days/week</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {workout.days.map((day, idx) => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(idx)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedDay === idx
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-secondary'
              }`}
            >
              {day.name}
            </button>
          ))}
        </div>

        {currentDay && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">{currentDay.name}</h2>
                <p className="text-muted-foreground text-sm">
                  {currentDay.exercises.length} exercises
                  {currentDay.estimatedDuration && ` · ${currentDay.estimatedDuration} min`}
                </p>
              </div>
              
              {currentDay.exercises.length > 0 && (
                <Link
                  href={`/session?dayId=${currentDay.id}`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Start Workout
                </Link>
              )}
            </div>

            {currentDay.muscleGroups && currentDay.muscleGroups.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentDay.muscleGroups.map((muscle) => (
                  <span
                    key={muscle}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            )}

            {currentDay.isRestDay ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-lg text-muted-foreground">Rest Day</p>
                <p className="text-sm text-muted-foreground mt-2">Recovery is essential for muscle growth</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentDay.exercises.map((exercise, idx) => (
                  <div
                    key={exercise.id + idx}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="flex gap-4">
                      {exercise.gifUrl && (
                        <img
                          src={exercise.gifUrl}
                          alt={exercise.name}
                          className="w-20 h-20 object-cover rounded-lg bg-secondary"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                        {exercise.targetMuscle && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Target: {exercise.targetMuscle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
