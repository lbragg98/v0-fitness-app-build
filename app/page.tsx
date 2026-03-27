'use client'

import { useEffect, useState } from 'react'
import { dataStore } from '@/lib/storage/storage-provider'
import type { UserSettings } from '@/lib/types'

export default function StorageTestPage() {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      setIsLoading(true)
      
      // Test data
      const testUser: UserSettings = {
        id: 'test-user-1',
        name: 'Test User',
        age: 25,
        weight: 180,
        height: 70,
        goal: 'muscle-gain',
        intensity: 'moderate',
        frequency: 4,
        equipment: ['barbell', 'dumbbell', 'cable'],
        injuriesOrLimitations: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        timerBreakDuration: 90,
        timerSoundEnabled: true,
        timerVibrationEnabled: true,
        useMetric: false,
      }

      // Test save
      console.log('[v0] Testing storage save...')
      dataStore.saveUserSettings(testUser)

      // Test retrieve
      console.log('[v0] Testing storage retrieve...')
      const retrieved = dataStore.getUserSettings()

      if (retrieved && retrieved.id === testUser.id) {
        console.log('[v0] Storage test passed:', retrieved)
        setTestResult('✅ Storage layer working correctly! User settings saved and retrieved.')
      } else {
        console.log('[v0] Storage test failed:', retrieved)
        setTestResult('❌ Storage layer test failed. Data not retrieved correctly.')
      }
    } catch (error) {
      console.error('[v0] Storage test error:', error)
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-white">Storage Layer Test</h1>
        
        {isLoading ? (
          <div className="text-center text-slate-300">
            <div className="mb-2">Testing storage...</div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div className="h-full animate-pulse bg-blue-500"></div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-slate-700 p-4">
            <p className="font-mono text-sm text-white">{testResult}</p>
          </div>
        )}

        <div className="mt-6 space-y-2 text-xs text-slate-400">
          <p>✓ Types created (user, exercise, workout, activity, timer)</p>
          <p>✓ LocalStorage wrapper implemented</p>
          <p>✓ DataStore interface created</p>
          <p>✓ Testing retrieval...</p>
        </div>
      </div>
    </div>
  )
}
