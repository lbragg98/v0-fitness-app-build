'use client'

import { useMemo } from 'react'
import type { Workout } from '@/lib/types'

interface WeeklyCalendarProps {
  workout: Workout | null
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function WeeklyCalendar({ workout }: WeeklyCalendarProps) {
  const today = useMemo(() => {
    const current = new Date()
    current.setHours(0, 0, 0, 0)
    return current
  }, [])

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + index)
      return date
    })
  }, [today])

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  })

  const getWorkoutForWeekday = (weekday: number) => {
    if (!workout) return null
    return (
      workout.days.find((day) => day.calendarDay === weekday) ||
      workout.days.find((day) => day.dayNumber === weekday) ||
      null
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold text-foreground">This Week</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {weekDays.map((date, index) => {
          const weekday = date.getDay()
          const scheduledDay = getWorkoutForWeekday(weekday)
          const isToday = date.getTime() === today.getTime()
          const bullets = scheduledDay?.muscleGroups?.slice(0, 3) || []

          return (
            <div
              key={date.toISOString()}
              className={[
                'rounded-2xl border p-4',
                isToday
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background',
              ].join(' ')}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {dayLabels[index]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatter.format(date)}
                  </p>
                </div>

                {isToday && (
                  <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">
                    Today
                  </span>
                )}
              </div>

              <div className="mt-4">
                {scheduledDay ? (
                  <>
                    <p className="text-sm font-semibold text-foreground">
                      {scheduledDay.name}
                    </p>

                    <div className="mt-2 space-y-1">
                      {bullets.map((muscle) => (
                        <p
                          key={`${date.toISOString()}-${muscle}`}
                          className="text-xs text-muted-foreground"
                        >
                          • {muscle}
                        </p>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-foreground">Rest</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Recovery day
                    </p>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
