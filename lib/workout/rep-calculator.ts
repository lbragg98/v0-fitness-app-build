import { Intensity } from '@/lib/types'

/**
 * Calculate appropriate rep ranges based on intensity and exercise type
 */
export function calculateRepRange(
  intensity: Intensity,
  exerciseType: 'compound' | 'secondary' | 'accessory' = 'compound'
): { min: number; max: number } {
  const repRanges = {
    light: {
      compound: { min: 10, max: 15 },
      secondary: { min: 12, max: 18 },
      accessory: { min: 15, max: 20 },
    },
    moderate: {
      compound: { min: 8, max: 12 },
      secondary: { min: 10, max: 15 },
      accessory: { min: 12, max: 18 },
    },
    intense: {
      compound: { min: 6, max: 8 },
      secondary: { min: 8, max: 12 },
      accessory: { min: 10, max: 15 },
    },
  }

  return repRanges[intensity][exerciseType]
}

/**
 * Calculate rest period in seconds based on intensity and exercise type
 */
export function calculateRestPeriod(
  intensity: Intensity,
  exerciseType: 'compound' | 'secondary' | 'accessory' = 'compound'
): number {
  const restPeriods = {
    light: {
      compound: 60,
      secondary: 45,
      accessory: 30,
    },
    moderate: {
      compound: 90,
      secondary: 60,
      accessory: 45,
    },
    intense: {
      compound: 120,
      secondary: 90,
      accessory: 60,
    },
  }

  return restPeriods[intensity][exerciseType]
}

/**
 * Calculate number of sets based on intensity and exercise type
 */
export function calculateSets(
  intensity: Intensity,
  exerciseType: 'compound' | 'secondary' | 'accessory' = 'compound'
): number {
  const sets = {
    light: {
      compound: 3,
      secondary: 3,
      accessory: 2,
    },
    moderate: {
      compound: 4,
      secondary: 3,
      accessory: 3,
    },
    intense: {
      compound: 5,
      secondary: 4,
      accessory: 3,
    },
  }

  return sets[intensity][exerciseType]
}
