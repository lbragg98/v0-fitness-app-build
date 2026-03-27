'use client'

import { useMemo } from 'react'
import type { Workout } from '@/lib/types'

interface WeeklyCalendarProps {
  workout: Workout | null
}

export function WeeklyCalendar({ workout }: WeeklyCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weekDays = useMemo(() => {
    const days = []
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      days.push(date)
    }
    return days
  }, [today])

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

  const getWorkoutForDay = (dayIndex: number) => {
    if (!workout) return null
    // Find workout day that matches the day of week (0-6, Sun-Sat)
    return workout.days.find((d) => d.dayNumber === dayIndex) || null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">This Week</h3>
      
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, index) => {
          const workoutDay = getWorkoutForDay(date.getDay())
          const isToday = date.getTime() === today.getTime()
          const isRestDay = !workoutDay || workoutDay.isRestDay

          return (
            <div
              key={index}
              className={`
                flex flex-col items-center p-3 rounded-lg border-2 transition-colors
                ${isToday
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
                }
                ${isRestDay ? 'bg-muted/30' : 'bg-card'}
              `}
            >
              <div className="text-xs font-semibold text-muted-foreground uppercase">
                {dayLabels[index]}
              </div>
              <div className="text-sm font-bold text-foreground mt-1">
                {monthFormatter.format(date).split(' ')[1]}
              </div>

              {isToday && (
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              )}

              {!isRestDay && workoutDay && (
                <div className="mt-2 space-y-1 w-full">
                  <div className="text-xs text-center text-card-foreground font-medium truncate">
                    {workoutDay.name}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {workoutDay.muscleGroups.slice(0, 2).map((muscle) => (
                      <span
                        key={muscle}
                        className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded"
                      >
                        {muscle.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isRestDay && (
                <div className="text-xs text-muted-foreground mt-2 font-medium">Rest</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
