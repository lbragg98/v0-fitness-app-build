import type { UserSettings, WorkoutPlan, WorkoutSession, WorkoutCompletion, Photo } from '@/lib/types'
import { storage } from './local-storage'

/**
 * Abstract interface for data persistence
 * Supports localStorage now, easy to swap for Supabase later
 */

interface DataStore {
  // User settings
  getUserSettings(): UserSettings | null
  saveUserSettings(settings: UserSettings): void
  
  // Workout plans
  getWorkoutPlan(planId: string): WorkoutPlan | null
  getAllWorkoutPlans(): WorkoutPlan[]
  saveWorkoutPlan(plan: WorkoutPlan): void
  deleteWorkoutPlan(planId: string): void
  
  // Workout sessions (history)
  getWorkoutSession(sessionId: string): WorkoutSession | null
  getAllWorkoutSessions(): WorkoutSession[]
  saveWorkoutSession(session: WorkoutSession): void
  
  // Workout completions (feed)
  getWorkoutCompletion(completionId: string): WorkoutCompletion | null
  getAllWorkoutCompletions(): WorkoutCompletion[]
  saveWorkoutCompletion(completion: WorkoutCompletion): void
  
  // Photos
  getPhoto(photoId: string): Photo | null
  getAllPhotos(): Photo[]
  savePhoto(photo: Photo): void
  deletePhoto(photoId: string): void
  
  // Clear all data
  clearAllData(): void
}

class LocalDataStore implements DataStore {
  // User settings
  getUserSettings(): UserSettings | null {
    return storage.get<UserSettings>('user_settings')
  }

  saveUserSettings(settings: UserSettings): void {
    storage.set('user_settings', settings)
  }

  // Workout plans
  getWorkoutPlan(planId: string): WorkoutPlan | null {
    const plans = this.getAllWorkoutPlans()
    return plans.find((p) => p.id === planId) || null
  }

  getAllWorkoutPlans(): WorkoutPlan[] {
    return storage.get<WorkoutPlan[]>('workout_plans') || []
  }

  saveWorkoutPlan(plan: WorkoutPlan): void {
    const plans = this.getAllWorkoutPlans()
    const index = plans.findIndex((p) => p.id === plan.id)
    if (index >= 0) {
      plans[index] = plan
    } else {
      plans.push(plan)
    }
    storage.set('workout_plans', plans)
  }

  deleteWorkoutPlan(planId: string): void {
    const plans = this.getAllWorkoutPlans().filter((p) => p.id !== planId)
    storage.set('workout_plans', plans)
  }

  // Workout sessions
  getWorkoutSession(sessionId: string): WorkoutSession | null {
    const sessions = this.getAllWorkoutSessions()
    return sessions.find((s) => s.id === sessionId) || null
  }

  getAllWorkoutSessions(): WorkoutSession[] {
    return storage.get<WorkoutSession[]>('workout_sessions') || []
  }

  saveWorkoutSession(session: WorkoutSession): void {
    const sessions = this.getAllWorkoutSessions()
    const index = sessions.findIndex((s) => s.id === session.id)
    if (index >= 0) {
      sessions[index] = session
    } else {
      sessions.push(session)
    }
    storage.set('workout_sessions', sessions)
  }

  // Workout completions
  getWorkoutCompletion(completionId: string): WorkoutCompletion | null {
    const completions = this.getAllWorkoutCompletions()
    return completions.find((c) => c.id === completionId) || null
  }

  getAllWorkoutCompletions(): WorkoutCompletion[] {
    return storage.get<WorkoutCompletion[]>('workout_completions') || []
  }

  saveWorkoutCompletion(completion: WorkoutCompletion): void {
    const completions = this.getAllWorkoutCompletions()
    const index = completions.findIndex((c) => c.id === completion.id)
    if (index >= 0) {
      completions[index] = completion
    } else {
      completions.push(completion)
    }
    storage.set('workout_completions', completions)
  }

  // Photos
  getPhoto(photoId: string): Photo | null {
    const photos = this.getAllPhotos()
    return photos.find((p) => p.id === photoId) || null
  }

  getAllPhotos(): Photo[] {
    return storage.get<Photo[]>('photos') || []
  }

  savePhoto(photo: Photo): void {
    const photos = this.getAllPhotos()
    const index = photos.findIndex((p) => p.id === photo.id)
    if (index >= 0) {
      photos[index] = photo
    } else {
      photos.push(photo)
    }
    storage.set('photos', photos)
  }

  deletePhoto(photoId: string): void {
    const photos = this.getAllPhotos().filter((p) => p.id !== photoId)
    storage.set('photos', photos)
  }

  // Clear all data
  clearAllData(): void {
    storage.clear()
  }
}

export const dataStore = new LocalDataStore()
export type { DataStore }
