import type { Exercise, ExerciseSet } from './exercise'
import type { SplitPreference } from './user'

export interface WorkoutDay {
  id: string
  dayNumber: number
  calendarDay: number
  name: string
  splitKey: string
  muscleGroups: string[]
  exercises: Exercise[]
  isRestDay?: boolean
  estimatedDuration?: number
}

export interface Workout {
  id: string
  name: string
  description?: string
  frequency: number
  splitPreference?: SplitPreference
  days: WorkoutDay[]
  createdAt: number
  updatedAt: number
  isActive?: boolean
}

export interface WorkoutSession {
  id: string
  planId: string
  dayId: string
  userId: string
  startedAt: number
  completedAt?: number
  exercises: WorkoutSessionExercise[]
  notes?: string
  completed: boolean
}

export interface WorkoutSessionExercise {
  exerciseId: string
  exerciseName: string
  sets: ExerciseSet[]
  completed: boolean
  completedAt?: number
}
