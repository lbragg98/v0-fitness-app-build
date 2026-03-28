'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { dataStore } from '@/lib/storage/storage-provider'
import { generateWorkoutPlan } from '@/lib/workout/generator'
import { getAllExercises } from '@/lib/api/exercise-db'
import type {
  SplitPreference,
  UserSettings,
  Workout,
  WorkoutFrequency,
} from '@/lib/types'

type SplitOption = {
  value: SplitPreference
  label: string
  description: string
}

function getSplitOptionsForFrequency(
  frequency: WorkoutFrequency
): SplitOption[] {
  switch (frequency) {
    case 2:
      return [
        {
          value: 'full_body',
          label: 'Full Body',
          description: 'Two balanced full-body sessions each week.',
        },
        {
          value: 'upper_lower',
          label: 'Upper / Lower',
          description: 'One upper-body day and one lower-body day.',
        },
      ]
    case 3:
      return [
        {
          value: 'full_body',
          label: 'Full Body',
          description: 'Three balanced sessions across the week.',
        },
        {
          value: 'push_pull_legs',
          label: 'Push / Pull / Legs',
          description: 'Separate pushing, pulling, and leg days.',
        },
      ]
    case 4:
      return [
        {
          value: 'upper_lower',
          label: 'Upper / Lower',
          description: 'Two upper days and two lower days.',
        },
        {
          value: 'push_pull_legs',
          label: 'Push / Pull / Legs + Upper',
          description: 'Push, pull, legs, then a final upper-body day.',
        },
        {
          value: 'full_body_focus',
          label: 'Full Body + Focus',
          description: 'Balanced full-body work with extra focus days.',
        },
      ]
    case 5:
      return [
        {
          value: 'push_pull_legs',
          label: 'Push / Pull / Legs + Upper / Lower',
          description: 'A high-frequency split with full weekly coverage.',
        },
        {
          value: 'body_part',
          label: 'Body Part Split',
          description: 'Separate chest, back, legs, shoulders, and arms days.',
        },
        {
          value: 'full_body_focus',
          label: 'Full Body + Focus',
          description: 'Mix of full-body training and targeted work.',
        },
      ]
    case 6:
      return [
        {
          value: 'push_pull_legs',
          label: 'Push / Pull / Legs x2',
          description: 'Repeat push, pull, and legs twice each week.',
        },
        {
          value: 'body_part',
          label: 'Body Part Split',
          description: 'High-frequency, body-part-focused training.',
        },
      ]
    default:
      return [
        {
          value: 'auto',
          label: 'Auto',
          description: 'Let the app choose the best split.',
        },
      ]
  }
}

export default function ProfilePage() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [frequency, setFrequency] = useState<WorkoutFrequency>(3)
  const [splitPreference, setSplitPreference] =
    useState<SplitPreference>('push_pull_legs')

  useEffect(() => {
    const settings = dataStore.getUserSettings()
    const savedWorkouts = dataStore.getWorkouts()

    setUserSettings(settings)
    setWorkouts(savedWorkouts)

    if (settings?.frequency) {
      setFrequency(settings.frequency)
    }
    if (settings?.splitPreference) {
      setSplitPreference(settings.splitPreference)
    }
  }, [])

  const splitOptions = useMemo(
    () => getSplitOptionsForFrequency(frequency),
    [frequency]
  )

  useEffect(() => {
    const stillValid = splitOptions.some((option) => option.value === splitPreference)
    if (!stillValid) {
      setSplitPreference(splitOptions[0]?.value ?? 'auto')
    }
  }, [splitOptions, splitPreference])

  const handleGenerateWorkout = async () => {
    if (!userSettings) {
      setError('Please complete your settings first.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const mergedSettings: UserSettings = {
        ...userSettings,
        frequency,
        splitPreference,
        updatedAt: Date.now(),
      }

      dataStore.saveUserSettings(mergedSettings)
      setUserSettings(mergedSettings)

      const exercises = await getAllExercises()
      const workout = generateWorkoutPlan(mergedSettings, exercises)
      const existing = dataStore.getWorkouts()

      existing.forEach((savedWorkout) => {
        dataStore.saveWorkout({
          ...savedWorkout,
          isActive: savedWorkout.id === workout.id ? true : false,
        })
      })

      workout.isActive = true
      dataStore.saveWorkout(workout)

      const refreshed = dataStore
        .getWorkouts()
        .map((item) => ({ ...item, isActive: item.id === workout.id }))

      refreshed.forEach((item) => dataStore.saveWorkout(item))
      setWorkouts(refreshed)
    } catch (err) {
      console.error('[v0] Generate workout error:', err)
      setError('Failed to generate workout plan. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeleteWorkout = (workoutId: string) => {
    dataStore.deleteWorkout(workoutId)
    setWorkouts((current) => current.filter((workout) => workout.id !== workoutId))
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your training preferences and generate a weekly plan.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {!userSettings ? (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">
              Complete your settings first
            </h2>
            <p className="mt-2 text-muted-foreground">
              Add your basic fitness preferences before generating a workout plan.
            </p>
            <Link
              href="/settings"
              className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90"
            >
              Go to Settings
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-foreground">
                  Generate Workout Plan
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick how many days you want to train, then choose a split that
                  fits that frequency.
                </p>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Workout Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) =>
                    setFrequency(Number(e.target.value) as WorkoutFrequency)
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none ring-0"
                >
                  <option value={2}>2 days / week</option>
                  <option value={3}>3 days / week</option>
                  <option value={4}>4 days / week</option>
                  <option value={5}>5 days / week</option>
                  <option value={6}>6 days / week</option>
                </select>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-foreground">
                  Choose Your Split
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  {splitOptions.map((option) => {
                    const isActive = splitPreference === option.value

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSplitPreference(option.value)}
                        className={[
                          'rounded-2xl border p-4 text-left transition-colors',
                          isActive
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background hover:bg-secondary/50',
                        ].join(' ')}
                      >
                        <div className="text-base font-semibold text-foreground">
                          {option.label}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={handleGenerateWorkout}
                disabled={isGenerating}
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {isGenerating ? 'Generating Workout...' : 'Generate New Workout Plan'}
              </button>
            </section>

            <aside className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground">Current Setup</h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl bg-secondary/40 p-3">
                  <p className="text-muted-foreground">Goal</p>
                  <p className="font-semibold text-foreground">{userSettings.goal}</p>
                </div>

                <div className="rounded-xl bg-secondary/40 p-3">
                  <p className="text-muted-foreground">Intensity</p>
                  <p className="font-semibold text-foreground">{userSettings.intensity}</p>
                </div>

                <div className="rounded-xl bg-secondary/40 p-3">
                  <p className="text-muted-foreground">Equipment</p>
                  <p className="font-semibold text-foreground">
                    {userSettings.equipment?.length
                      ? userSettings.equipment.join(', ')
                      : 'Bodyweight only'}
                  </p>
                </div>

                <div className="rounded-xl bg-secondary/40 p-3">
                  <p className="text-muted-foreground">Focus Muscles</p>
                  <p className="font-semibold text-foreground">
                    {userSettings.focusMuscles?.length
                      ? userSettings.focusMuscles.join(', ')
                      : 'Balanced training'}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Your Workouts ({workouts.length})
            </h2>
          </div>

          {workouts.length === 0 ? (
            <p className="text-muted-foreground">
              No workout plans yet. Generate one to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {workout.name}
                      </h3>
                      {workout.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {workout.description}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-muted-foreground">
                        {workout.days.length} training days • {workout.frequency}x/week
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/20"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {workout.days.map((day) => (
                      <span
                        key={day.id}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {day.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
