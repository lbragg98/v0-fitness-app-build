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
      const activeWorkout = workouts.find((item) => item.isActive)
      setWorkout(activeWorkout || null)
    } catch (error) {
      console.error('[v0] Error loading workout:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Activity</h1>
          <p className="mt-2 text-muted-foreground">
            View your weekly schedule and start today’s workout.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="h-96 animate-pulse rounded-2xl bg-secondary" />
            <div className="h-96 animate-pulse rounded-2xl bg-secondary" />
          </div>
        ) : !workout ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              No Active Workout Plan
            </h2>
            <p className="mt-2 text-muted-foreground">
              Generate a personalized workout plan from your profile to get started.
            </p>
            <Link
              href="/profile"
              className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90"
            >
              Go to Profile
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <WeeklyCalendar workout={workout} />
            <DailySummary workout={workout} />
          </div>
        )}
      </div>
    </main>
  )
}
