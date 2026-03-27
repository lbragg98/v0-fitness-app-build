'use client'

import { useState } from 'react'
import type { WorkoutCompletion } from '@/lib/types'

interface FeedItemProps {
  completion: WorkoutCompletion
}

export function FeedItem({ completion }: FeedItemProps) {
  const date = new Date(completion.date)
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: completion.date < Date.now() - 30 * 24 * 60 * 60 * 1000 ? 'numeric' : undefined,
  })

  const durationHours = Math.floor(completion.duration / 60)
  const durationMins = completion.duration % 60

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-foreground">{completion.workoutName}</h4>
          <p className="text-sm text-muted-foreground">{dateFormatter.format(date)}</p>
        </div>
        <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded text-xs font-semibold">
          Completed
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm mb-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Exercises</p>
          <p className="font-bold text-foreground">{completion.exercisesCompleted}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Duration</p>
          <p className="font-bold text-foreground">
            {durationHours > 0 ? `${durationHours}h ${durationMins}m` : `${durationMins}m`}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Muscles</p>
          <p className="font-bold text-foreground">{completion.muscleGroups.length}</p>
        </div>
      </div>

      {completion.muscleGroups.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {completion.muscleGroups.map((muscle) => (
            <span
              key={muscle}
              className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
            >
              {muscle}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
