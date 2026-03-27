import type { Exercise, ExerciseSet } from './exercise'

export interface WorkoutDay {
  id: string
  dayNumber: number
  dayName: string
  muscleGroups: string[]
  exercises: Exercise[]
  isRestDay: boolean
  estimatedDuration: number // in minutes
}

export interface WorkoutPlan {
  id: string
  name: string
  frequency: number // 3, 4, 5, or 6 days
  days: WorkoutDay[]
  createdAt: number
  updatedAt: number
  isActive: boolean
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
