import { NextResponse } from 'next/server'
import { writeFileSync, readFileSync } from 'fs'
import path from 'path'

export async function POST() {
  try {
    const GAMEPIX_API = 'https://games.gamepix.com/api/games'
    const response = await fetch(GAMEPIX_API)
    const games = await response.json()
    
    const filePath = path.join(process.cwd(), 'data/games.json')
    writeFileSync(filePath, JSON.stringify(games, null, 2))
    
    return NextResponse.json({ success: true, count: games.length })
  } catch (error) {
    console.error('Update failed:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data/games.json')
    const data = readFileSync(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json([], { status: 500 })
  }
}
