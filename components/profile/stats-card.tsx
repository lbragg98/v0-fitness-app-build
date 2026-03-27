'use client'

import { UserSettings } from '@/lib/types'

interface StatsCardProps {
  userSettings: UserSettings | null
}

export function StatsCard({ userSettings }: StatsCardProps) {
  if (!userSettings) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-bold text-card-foreground mb-4">Your Stats</h2>
        <p className="text-muted-foreground">Complete your settings first to see your profile stats.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-bold text-card-foreground mb-6">Your Stats</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Goal</p>
          <p className="font-semibold text-foreground capitalize">{userSettings.goal}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Experience</p>
          <p className="font-semibold text-foreground capitalize">{userSettings.experienceLevel}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Workouts/Week</p>
          <p className="font-semibold text-foreground">{userSettings.frequency}x</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Intensity</p>
          <p className="font-semibold text-foreground capitalize">{userSettings.intensity}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Session Duration</p>
          <p className="font-semibold text-foreground">{userSettings.sessionDuration} mins</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Rest Period</p>
          <p className="font-semibold text-foreground">{userSettings.timerBreakDuration}s</p>
        </div>
      </div>

      {userSettings.focusMuscles && userSettings.focusMuscles.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Focus Areas</p>
          <div className="flex flex-wrap gap-2">
            {userSettings.focusMuscles.map(muscle => (
              <span
                key={muscle}
                className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>
      )}

      {userSettings.equipment && userSettings.equipment.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Available Equipment</p>
          <div className="flex flex-wrap gap-2">
            {userSettings.equipment.map(eq => (
              <span
                key={eq}
                className="inline-block rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {eq}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
