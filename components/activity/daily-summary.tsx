'use client'

import Link from 'next/link'
import type { Workout } from '@/lib/types'

interface DailySummaryProps {
  workout: Workout | null
}

export function DailySummary({ workout }: DailySummaryProps) {
  const today = new Date()
  const dayOfWeek = today.getDay()
  
  const todayWorkout = workout?.days.find((d) => d.dayNumber === dayOfWeek)
  const isRestDay = !todayWorkout || todayWorkout.isRestDay

  if (!workout) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-muted-foreground">No workout plan yet. Generate one from your profile.</p>
      </div>
    )
  }

  if (isRestDay) {
    return (
      <div className="rounded-lg border border-border bg-secondary/20 p-6 text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">Rest Day</h3>
        <p className="text-muted-foreground">Take it easy today. Recovery is important!</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-foreground">{todayWorkout?.name}</h3>
        <p className="text-muted-foreground mt-1">{todayWorkout?.exercises.length || 0} exercises</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Duration</p>
          <p className="text-lg font-bold text-foreground">{todayWorkout?.estimatedDuration || 45} min</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Muscle Groups</p>
          <p className="text-lg font-bold text-foreground">{todayWorkout?.muscleGroups.length || 0}</p>
        </div>
      </div>

      {todayWorkout?.muscleGroups && todayWorkout.muscleGroups.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Focus Areas</p>
          <div className="flex flex-wrap gap-2">
            {todayWorkout.muscleGroups.map((muscle) => (
              <span
                key={muscle}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>
      )}

      <Link
        href={`/session?dayId=${todayWorkout?.id || ''}`}
        className="block w-full mt-4 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
      >
        Start Your Day
      </Link>
    </div>
  )
}
