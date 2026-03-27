'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { dataStore } from '@/lib/storage/storage-provider'
import type { Workout, Exercise, ExerciseSet } from '@/lib/types'
import { ExerciseView } from '@/components/session/exercise-view'
import { SetTracker } from '@/components/session/set-tracker'
import { TimedExercise } from '@/components/session/timed-exercise'

interface SessionExercise {
  exercise: Exercise
  sets: ExerciseSet[]
}

export default function SessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dayId = searchParams.get('dayId')

  const [workout, setWorkout] = useState<Workout | null>(null)
  const [exercises, setExercises] = useState<SessionExercise[]>([])
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionStartTime] = useState(Date.now())
  const [userSettings, setUserSettings] = useState<any>(null)
  const [showTimedExercise, setShowTimedExercise] = useState(false)

  useEffect(() => {
    loadWorkoutDay()
    const settings = dataStore.getUserSettings()
    setUserSettings(settings)
  }, [dayId])

  const loadWorkoutDay = () => {
    try {
      const workouts = dataStore.getWorkouts()
      const active = workouts.find((w) => w.isActive)

      if (!active) {
        throw new Error('No active workout')
      }

      setWorkout(active)

      if (dayId) {
        const day = active.days.find((d) => d.id === dayId)
        if (day && day.exercises) {
          const sessionExercises: SessionExercise[] = day.exercises.map((ex) => ({
            exercise: ex,
            sets: Array.from({ length: ex.sets || 3 }, (_, i) => ({
              setNumber: i + 1,
              targetReps: ex.reps || 10,
              actualReps: 0,
              weight: 0,
              weightUnit: 'lbs' as const,
              completed: false,
            })),
          }))
          setExercises(sessionExercises)
        }
      }
    } catch (error) {
      console.error('[v0] Error loading workout day:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteSet = (setIndex: number, actualReps: number, weight: number) => {
    const updated = [...exercises]
    updated[currentExerciseIdx].sets[setIndex].actualReps = actualReps
    updated[currentExerciseIdx].sets[setIndex].weight = weight
    updated[currentExerciseIdx].sets[setIndex].completed = true
    updated[currentExerciseIdx].sets[setIndex].completedAt = Date.now()
    setExercises(updated)
  }

  const allSetsCompleted =
    exercises.length > 0 &&
    exercises.every((ex) => ex.sets.every((set) => set.completed))

  const handleFinishWorkout = () => {
    // Save workout session
    const session = {
      id: `session-${Date.now()}`,
      planId: workout?.id || '',
      dayId: dayId || '',
      userId: 'user-1',
      startedAt: sessionStartTime,
      completedAt: Date.now(),
      exercises: exercises.map((ex) => ({
        exerciseId: ex.exercise.id,
        exerciseName: ex.exercise.name,
        sets: ex.sets,
        completed: true,
        completedAt: Date.now(),
      })),
      notes: '',
      completed: true,
    }

    try {
      dataStore.saveWorkoutSession(session)

      // Save workout completion for feed
      const completion = {
        id: `completion-${Date.now()}`,
        sessionId: session.id,
        date: Date.now(),
        workoutName: workout?.name || 'Workout',
        muscleGroups: exercises
          .map((ex) => ex.exercise.targetMuscle)
          .filter(Boolean),
        duration: Math.round((Date.now() - sessionStartTime) / 60000),
        exercisesCompleted: exercises.length,
        totalExercises: exercises.length,
      }
      dataStore.saveWorkoutCompletion(completion)

      router.push('/activity')
    } catch (error) {
      console.error('[v0] Error saving session:', error)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="h-96 bg-secondary rounded-lg animate-pulse" />
        </div>
      </main>
    )
  }

  if (exercises.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground mb-4">No workout data found</p>
            <button
              onClick={() => router.push('/activity')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90"
            >
              Back to Activity
            </button>
          </div>
        </div>
      </main>
    )
  }

  const current = exercises[currentExerciseIdx]

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {workout?.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Exercise {currentExerciseIdx + 1} of {exercises.length}
            </p>
          </div>
          <button
            onClick={() => router.push('/activity')}
            className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors"
          >
            Exit
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <ExerciseView
            exercise={current.exercise}
            currentSet={current.sets.filter((s) => s.completed).length + 1}
            totalSets={current.sets.length}
          />
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <SetTracker
            sets={current.sets}
            targetReps={current.exercise.reps || 10}
            restDuration={userSettings?.timerBreakDuration || 90}
            onCompleteSet={handleCompleteSet}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              setCurrentExerciseIdx(Math.max(0, currentExerciseIdx - 1))
            }
            disabled={currentExerciseIdx === 0}
            className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary disabled:opacity-50 font-semibold transition-colors"
          >
            Previous
          </button>

          {currentExerciseIdx < exercises.length - 1 ? (
            <button
              onClick={() =>
                setCurrentExerciseIdx(
                  Math.min(exercises.length - 1, currentExerciseIdx + 1)
                )
              }
              disabled={!current.sets.every((s) => s.completed)}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 font-semibold transition-colors"
            >
              Next Exercise
            </button>
          ) : (
            <button
              onClick={handleFinishWorkout}
              disabled={!allSetsCompleted}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-semibold transition-colors"
            >
              Finish Workout
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
