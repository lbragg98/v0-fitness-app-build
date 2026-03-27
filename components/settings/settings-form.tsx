'use client'

import { useState, useEffect } from 'react'
import { dataStore } from '@/lib/storage/storage-provider'
import type { UserSettings } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const equipmentOptions = [
  'barbell', 'dumbbell', 'kettlebell', 'machine',
  'cable', 'resistance band', 'bodyweight', 'pull-up bar',
]

const defaultSettings: UserSettings = {
  id: 'user-1',
  name: '',
  age: 25,
  weight: 150,
  height: 68,
  goal: 'muscle-gain',
  intensity: 'moderate',
  frequency: 4,
  equipment: ['dumbbell', 'barbell'],
  injuriesOrLimitations: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  timerBreakDuration: 90,
  timerSoundEnabled: true,
  timerVibrationEnabled: true,
  useMetric: false,
}

export function SettingsForm() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = dataStore.getUserSettings()
    if (stored) setSettings(stored)
    setLoading(false)
  }, [])

  const handleChange = <K extends keyof UserSettings>(field: K, value: UserSettings[K]) => {
    setSettings((prev) => ({ ...prev, [field]: value, updatedAt: Date.now() }))
    setSaved(false)
  }

  const toggleEquipment = (equip: string) => {
    const current = settings.equipment || []
    const updated = current.includes(equip)
      ? current.filter((e) => e !== equip)
      : [...current, equip]
    handleChange('equipment', updated)
  }

  const handleSave = () => {
    dataStore.saveUserSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Basic details about you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              value={settings.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your name"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Age</label>
              <Input
                type="number"
                value={settings.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Weight ({settings.useMetric ? 'kg' : 'lbs'})
              </label>
              <Input
                type="number"
                value={settings.weight}
                onChange={(e) => handleChange('weight', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Height ({settings.useMetric ? 'cm' : 'inches'})
            </label>
            <Input
              type="number"
              value={settings.height}
              onChange={(e) => handleChange('height', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fitness Preferences</CardTitle>
          <CardDescription>Configure your workout goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Primary Goal</label>
            <select
              value={settings.goal}
              onChange={(e) => handleChange('goal', e.target.value as UserSettings['goal'])}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="muscle-gain">Build Muscle</option>
              <option value="strength">Build Strength</option>
              <option value="fat-loss">Fat Loss</option>
              <option value="endurance">Endurance</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Workouts Per Week</label>
            <select
              value={settings.frequency}
              onChange={(e) => handleChange('frequency', parseInt(e.target.value) as UserSettings['frequency'])}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="3">3 days</option>
              <option value="4">4 days</option>
              <option value="5">5 days</option>
              <option value="6">6 days</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Intensity Level</label>
            <select
              value={settings.intensity}
              onChange={(e) => handleChange('intensity', e.target.value as UserSettings['intensity'])}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="low">Low — light weights, high reps</option>
              <option value="moderate">Moderate — balanced</option>
              <option value="high">High — heavy weights, low reps</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Equipment</CardTitle>
          <CardDescription>Select the equipment you have access to</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {equipmentOptions.map((equip) => (
              <button
                key={equip}
                type="button"
                onClick={() => toggleEquipment(equip)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors capitalize ${
                  settings.equipment.includes(equip)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                {equip}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timer Settings</CardTitle>
          <CardDescription>Configure rest timer preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Rest Duration Between Sets (seconds)
            </label>
            <Input
              type="number"
              value={settings.timerBreakDuration}
              onChange={(e) => handleChange('timerBreakDuration', parseInt(e.target.value) || 60)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sound"
              checked={settings.timerSoundEnabled}
              onChange={(e) => handleChange('timerSoundEnabled', e.target.checked)}
            />
            <label htmlFor="sound" className="text-sm font-medium text-foreground">
              Enable sound notifications
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="vibration"
              checked={settings.timerVibrationEnabled}
              onChange={(e) => handleChange('timerVibrationEnabled', e.target.checked)}
            />
            <label htmlFor="vibration" className="text-sm font-medium text-foreground">
              Enable vibration notifications
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="metric"
              checked={settings.useMetric}
              onChange={(e) => handleChange('useMetric', e.target.checked)}
            />
            <label htmlFor="metric" className="text-sm font-medium text-foreground">
              Use metric units (kg, cm)
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limitations & Injuries</CardTitle>
          <CardDescription>Let us know about any injuries or limitations</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={settings.injuriesOrLimitations?.join(', ') || ''}
            onChange={(e) =>
              handleChange(
                'injuriesOrLimitations',
                e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              )
            }
            placeholder="e.g., Lower back pain, Knee injury"
            className="w-full p-3 border border-border rounded-md bg-background text-foreground min-h-[80px] resize-none"
          />
        </CardContent>
      </Card>

      <div className="flex gap-4 items-center pb-4">
        <Button onClick={handleSave} size="lg" className="flex-1">
          Save Settings
        </Button>
        {saved && (
          <span className="text-sm font-medium" style={{ color: 'oklch(0.68 0.18 215)' }}>
            Saved!
          </span>
        )}
      </div>
    </div>
  )
}
