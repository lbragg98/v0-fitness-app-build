'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ExerciseDetailsModal } from '@/components/session/exercise-details-modal'
import { ExerciseView } from '@/components/session/exercise-view'
import { SetTracker } from '@/components/session/set-tracker'
import { dataStore } from '@/lib/storage/storage-provider'
import type { Exercise, ExerciseSet, Workout } from '@/lib/types'

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
  const [showExerciseDetails, setShowExerciseDetails] = useState(false)

  useEffect(() => {
    const settings = dataStore.getUserSettings()
    setUserSettings(settings)
    loadWorkoutDay()
  }, [dayId])

  const loadWorkoutDay = () => {
    const workouts = dataStore.getWorkouts()
    const active = workouts.find((w) => w.isActive)

    if (!active) {
      setIsLoading(false)
      return
    }

    setWorkout(active)

    if (dayId) {
      const day = active.days.find((d) => d.id === dayId)

      if (day?.exercises?.length) {
        const sessionExercises: SessionExercise[] = day.exercises.map((ex) => ({
          exercise: ex,
          sets: Array.from({ length: ex.sets || 3 }, (_, i) => ({
            setNumber: i + 1,
            targetReps: ex.reps || ex.repsMin || 10,
            actualReps: 0,
            weight: 0,
            weightUnit: 'lbs' as const,
            completed: false,
          })),
        }))

        setExercises(sessionExercises)
      }
    }

    setIsLoading(false)
  }

  const handleCompleteSet = (setIndex: number, actualReps: number, weight: number) => {
    setExercises((previous) => {
      const updated = [...previous]
      const currentExercise = {
        ...updated[currentExerciseIdx],
        sets: updated[currentExerciseIdx].sets.map((set) => ({ ...set })),
      }

      currentExercise.sets[setIndex].actualReps = actualReps
      currentExercise.sets[setIndex].weight = weight
      currentExercise.sets[setIndex].completed = true
      currentExercise.sets[setIndex].completedAt = Date.now()

      for (let i = setIndex + 1; i < currentExercise.sets.length; i++) {
        if (!currentExercise.sets[i].completed && currentExercise.sets[i].weight === 0) {
          currentExercise.sets[i].weight = weight
        }
      }

      updated[currentExerciseIdx] = currentExercise
      return updated
    })
  }

  const allSetsCompleted =
    exercises.length > 0 &&
    exercises.every((ex) => ex.sets.every((set) => set.completed))

  const handleFinishWorkout = () => {
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
      console.error('Failed to save workout session:', error)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="h-96 animate-pulse rounded-lg bg-secondary" />
        </div>
      </main>
    )
  }

  if (exercises.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="mb-4 text-muted-foreground">No workout data found</p>
            <button
              onClick={() => router.push('/activity')}
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90"
            >
              Back to Activity
            </button>
          </div>
        </div>
      </main>
    )
  }

  const current = exercises[currentExerciseIdx]
  const completedSetCount = current.sets.filter((s) => s.completed).length
  const currentSetNumber = Math.min(completedSetCount + 1, current.sets.length)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{workout?.name}</h1>
            <p className="mt-1 text-muted-foreground">
              Exercise {currentExerciseIdx + 1} of {exercises.length}
            </p>
          </div>

          <button
            onClick={() => router.push('/activity')}
            className="rounded-lg border border-border px-4 py-2 text-foreground transition-colors hover:bg-secondary"
          >
            Exit
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowExerciseDetails(true)}
          className="mb-2 w-full rounded-lg border border-border bg-card p-6 text-left"
        >
          <ExerciseView
            exercise={current.exercise}
            currentSet={currentSetNumber}
            totalSets={current.sets.length}
          />
        </button>

        <p className="mb-6 text-center text-xs text-muted-foreground">
          Tap the exercise card to view full instructions
        </p>

        <div className="mb-6 rounded-lg border border-border bg-card p-6">
          <SetTracker
            sets={current.sets}
            targetReps={current.exercise.reps || current.exercise.repsMin || 10}
            restDuration={userSettings?.timerBreakDuration || 90}
            onCompleteSet={handleCompleteSet}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentExerciseIdx(Math.max(0, currentExerciseIdx - 1))}
            disabled={currentExerciseIdx === 0}
            className="flex-1 rounded-lg border border-border px-4 py-3 font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
          >
            Previous
          </button>

          {currentExerciseIdx < exercises.length - 1 ? (
            <button
              onClick={() =>
                setCurrentExerciseIdx(Math.min(exercises.length - 1, currentExerciseIdx + 1))
              }
              disabled={!current.sets.every((s) => s.completed)}
              className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
            >
              Next Exercise
            </button>
          ) : (
            <button
              onClick={handleFinishWorkout}
              disabled={!allSetsCompleted}
              className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
            >
              Finish Workout
            </button>
          )}
        </div>
      </div>

      <ExerciseDetailsModal
        exercise={current.exercise}
        isOpen={showExerciseDetails}
        onClose={() => setShowExerciseDetails(false)}
      />
    </main>
  )
}
