import { NextRequest, NextResponse } from 'next/server'
import {
  getExercisesByMuscle,
  getExercisesByEquipment,
  getExercisesByBodyPart,
  getAllExercises,
  getMuscles,
  getEquipment,
  getBodyParts,
} from '@/lib/api/exercise-db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const value = searchParams.get('value')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '30')
    const offset = parseInt(searchParams.get('offset') || '0')

    let result

    if (type === 'muscle' && value) {
      result = await getExercisesByMuscle(value)
    } else if (type === 'equipment' && value) {
      result = await getExercisesByEquipment(value)
    } else if (type === 'bodypart' && value) {
      result = await getExercisesByBodyPart(value)
    } else if (type === 'all') {
      result = await getAllExercises(limit, offset)
    } else if (type === 'list') {
      if (category === 'muscles') {
        result = await getMuscles()
      } else if (category === 'equipment') {
        result = await getEquipment()
      } else if (category === 'bodyparts') {
        result = await getBodyParts()
      } else {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
      }
    } else {
      result = await getAllExercises(limit, offset)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Exercise API error:', error)
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 })
  }
}
