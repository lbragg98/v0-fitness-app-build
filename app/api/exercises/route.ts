import { NextRequest, NextResponse } from 'next/server'
import {
  searchExercises,
  getAllExercises,
  getExercisesByMuscle,
  getExercisesByEquipment,
  getExercisesByBodyPart,
  getMuscles,
  getEquipment,
  getBodyParts,
  getExerciseTypes,
} from '@/lib/api/exercise-db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const query = searchParams.get('query')
    const value = searchParams.get('value')
    const category = searchParams.get('category')

    let result

    if (type === 'search' && query) {
      result = await searchExercises(query)
    } else if (type === 'muscle' && value) {
      result = await getExercisesByMuscle(value)
    } else if (type === 'equipment' && value) {
      result = await getExercisesByEquipment(value)
    } else if (type === 'bodypart' && value) {
      result = await getExercisesByBodyPart(value)
    } else if (type === 'list') {
      if (category === 'muscles') {
        result = await getMuscles()
      } else if (category === 'equipment') {
        result = await getEquipment()
      } else if (category === 'bodyparts') {
        result = await getBodyParts()
      } else if (category === 'types') {
        result = await getExerciseTypes()
      } else {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
      }
    } else {
      result = await getAllExercises()
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Exercise API error:', error)
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 })
  }
}
