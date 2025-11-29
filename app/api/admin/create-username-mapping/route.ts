import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminAuth } from '@/lib/firebase-admin'

/**
 * Create username mapping for a user
 * This is a one-time admin endpoint to fix missing username mappings
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, username } = await request.json()
    
    if (!userId || !username) {
      return NextResponse.json(
        { error: 'userId and username required' },
        { status: 400 }
      )
    }
    
    // Create username mapping
    await adminDb.collection('usernames').doc(username.toLowerCase()).set({
      username: username.toLowerCase(),
      userId: userId
    })
    
    return NextResponse.json({
      success: true,
      message: `Username mapping created: ${username} -> ${userId}`,
      portfolioUrl: `/portfolio/${username}`
    })
  } catch (error) {
    console.error('Error creating username mapping:', error)
    return NextResponse.json(
      { error: 'Failed to create username mapping' },
      { status: 500 }
    )
  }
}
