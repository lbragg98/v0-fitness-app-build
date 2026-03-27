'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { dataStore } from '@/lib/storage/storage-provider'
import type { Workout } from '@/lib/types'
import { WeeklyCalendar } from '@/components/activity/weekly-calendar'
import { DailySummary } from '@/components/activity/daily-summary'

export default function ActivityPage() {
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const workouts = dataStore.getWorkouts()
      const activeWorkout = workouts.find((w) => w.isActive)
      setWorkout(activeWorkout || null)
    } catch (error) {
      console.error('[v0] Error loading workout:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Activity</h1>
          <p className="text-muted-foreground">View your workout schedule and track your progress</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-32 bg-secondary rounded-lg animate-pulse" />
            <div className="h-64 bg-secondary rounded-lg animate-pulse" />
          </div>
        ) : (
          <div className="space-y-8">
            <DailySummary workout={workout} />
            
            {!workout && (
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">No Active Workout Plan</h3>
                <p className="text-muted-foreground mb-4">
                  Generate a personalized workout plan from your profile to get started.
                </p>
                <Link
                  href="/profile"
                  className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Go to Profile
                </Link>
              </div>
            )}

            {workout && <WeeklyCalendar workout={workout} />}
          </div>
        )}
      </div>
    </main>
  )
}
