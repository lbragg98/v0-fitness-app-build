'use client';

import { useState, useEffect } from 'react';
import { DataStore } from '@/lib/storage/storage-provider';
import type { UserPreferences } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const muscleGroups = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Forearms',
  'Legs',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Core',
];

const equipment = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Machine',
  'Cable',
  'Resistance Band',
  'Bodyweight',
  'Medicine Ball',
];

export function SettingsForm() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = DataStore.getUserPreferences();
    setPreferences(stored);
    setLoading(false);
  }, []);

  if (loading || !preferences) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const handleInputChange = (field: keyof UserPreferences, value: any) => {
    setPreferences((prev) => ({
      ...prev!,
      [field]: value,
    }));
    setSaved(false);
  };

  const handleMuscleGroupToggle = (group: string) => {
    setPreferences((prev) => ({
      ...prev!,
      focusMuscleGroups: prev?.focusMuscleGroups.includes(group)
        ? prev.focusMuscleGroups.filter((g) => g !== group)
        : [...(prev?.focusMuscleGroups || []), group],
    }));
    setSaved(false);
  };

  const handleEquipmentToggle = (equip: string) => {
    setPreferences((prev) => ({
      ...prev!,
      availableEquipment: prev?.availableEquipment.includes(equip)
        ? prev.availableEquipment.filter((e) => e !== equip)
        : [...(prev?.availableEquipment || []), equip],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    DataStore.saveUserPreferences(preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Basic details about you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={preferences.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your name"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Age</label>
            <Input
              type="number"
              value={preferences.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              placeholder="Age"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Experience Level</label>
            <select
              value={preferences.experienceLevel}
              onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Fitness Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Fitness Preferences</CardTitle>
          <CardDescription>Configure your workout goals and intensity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Primary Goal</label>
            <select
              value={preferences.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="muscle">Build Muscle</option>
              <option value="strength">Build Strength</option>
              <option value="endurance">Build Endurance</option>
              <option value="weight_loss">Weight Loss</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Workouts Per Week</label>
            <Input
              type="number"
              min="1"
              max="7"
              value={preferences.workoutsPerWeek}
              onChange={(e) => handleInputChange('workoutsPerWeek', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Intensity Level</label>
            <select
              value={preferences.intensityLevel}
              onChange={(e) => handleInputChange('intensityLevel', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="low">Low (Light weights, high reps)</option>
              <option value="medium">Medium (Moderate weights)</option>
              <option value="high">High (Heavy weights, low reps)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Session Duration (minutes)</label>
            <Input
              type="number"
              value={preferences.sessionDurationMinutes}
              onChange={(e) => handleInputChange('sessionDurationMinutes', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Muscle Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Focus Muscle Groups</CardTitle>
          <CardDescription>Select which muscle groups you want to target</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {muscleGroups.map((group) => (
              <button
                key={group}
                onClick={() => handleMuscleGroupToggle(group)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  preferences.focusMuscleGroups.includes(group)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment */}
      <Card>
        <CardHeader>
          <CardTitle>Available Equipment</CardTitle>
          <CardDescription>Select the equipment you have access to</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {equipment.map((equip) => (
              <button
                key={equip}
                onClick={() => handleEquipmentToggle(equip)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  preferences.availableEquipment.includes(equip)
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

      {/* Timer Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Timer Settings</CardTitle>
          <CardDescription>Configure rest timer preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Rest Duration Between Sets (seconds)</label>
            <Input
              type="number"
              value={preferences.timerSettings.restDurationSeconds}
              onChange={(e) =>
                handleInputChange('timerSettings', {
                  ...preferences.timerSettings,
                  restDurationSeconds: parseInt(e.target.value),
                })
              }
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.timerSettings.enableSound}
              onChange={(e) =>
                handleInputChange('timerSettings', {
                  ...preferences.timerSettings,
                  enableSound: e.target.checked,
                })
              }
              id="enableSound"
            />
            <label htmlFor="enableSound" className="text-sm font-medium">
              Enable Sound Notifications
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.timerSettings.enableVibration}
              onChange={(e) =>
                handleInputChange('timerSettings', {
                  ...preferences.timerSettings,
                  enableVibration: e.target.checked,
                })
              }
              id="enableVibration"
            />
            <label htmlFor="enableVibration" className="text-sm font-medium">
              Enable Vibration Notifications
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Limitations */}
      <Card>
        <CardHeader>
          <CardTitle>Limitations & Injuries</CardTitle>
          <CardDescription>Let us know about any injuries or limitations</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={preferences.injuries || ''}
            onChange={(e) => handleInputChange('injuries', e.target.value)}
            placeholder="e.g., Lower back pain, Knee injury, etc."
            className="w-full p-3 border border-border rounded-md bg-background text-foreground"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-2">
        <Button onClick={handleSave} size="lg" className="flex-1">
          Save Settings
        </Button>
        {saved && <div className="text-sm text-green-600 flex items-center">Saved!</div>}
      </div>
    </div>
  );
}
