'use client'

import Link from 'next/link'
import type { Workout } from '@/lib/types'

interface DailySummaryProps {
  workout: Workout | null
}

function formatLabel(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function DailySummary({ workout }: DailySummaryProps) {
  const today = new Date()
  const weekday = today.getDay()

  const todayWorkout =
    workout?.days.find((day) => day.calendarDay === weekday) ||
    workout?.days.find((day) => day.dayNumber === weekday) ||
    null

  if (!workout) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-muted-foreground">
          No workout plan yet. Generate one from your profile.
        </p>
      </section>
    )
  }

  if (!todayWorkout) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground">Rest Day</h2>
        <p className="mt-2 text-muted-foreground">
          Take it easy today. Recovery is part of the plan.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold text-foreground">Today</h2>

      <div className="mt-4 rounded-2xl bg-background p-4">
        <h3 className="text-lg font-semibold text-foreground">
          {formatLabel(todayWorkout.name)}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {todayWorkout.exercises.length} exercises
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-secondary/40 p-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Duration
            </p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {todayWorkout.estimatedDuration || 45} min
            </p>
          </div>

          <div className="rounded-xl bg-secondary/40 p-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Focus Areas
            </p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {todayWorkout.muscleGroups.length}
            </p>
          </div>
        </div>

        {todayWorkout.muscleGroups.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Muscle Groups
            </p>
            <div className="flex flex-wrap gap-2">
              {todayWorkout.muscleGroups.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {formatLabel(muscle)}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={`/session?dayId=${todayWorkout.id}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90"
        >
          Start Your Day
        </Link>
      </div>
    </section>
  )
}
