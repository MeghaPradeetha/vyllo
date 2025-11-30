import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

/**
 * Test endpoint to verify Firestore connectivity
 */
export async function GET() {
  try {
    console.log('[Test API] Testing Firestore connection...')
    
    // Test 1: List usernames collection
    const usernamesSnapshot = await adminDb.collection('usernames').limit(5).get()
    console.log('[Test API] Usernames collection size:', usernamesSnapshot.size)
    
    const usernames: any[]  = []
    usernamesSnapshot.forEach((doc) => {
      usernames.push({ id: doc.id, ...doc.data() })
    })
    
    // Test 2: List users collection
    const usersSnapshot = await adminDb.collection('users').limit(5).get()
    console.log('[Test API] Users collection size:', usersSnapshot.size)
    
    const users: any[] = []
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id })
    })
    
    // Test 3: Check specific user
    const specificUserId = 'wFxyyki0E6XiekkSyLQ6SnMOway2'
    const profileDoc = await adminDb
      .collection('users')
      .doc(specificUserId)
      .collection('profile')
      .doc('public')
      .get()
    
    console.log('[Test API] Specific user profile exists:', profileDoc.exists)
    
    return NextResponse.json({
      success: true,
      tests: {
        usernamesCollection: {
          size: usernamesSnapshot.size,
          sample: usernames
        },
        usersCollection: {
          size: usersSnapshot.size,
          sampleIds: users
        },
        specificUserProfile: {
          exists: profileDoc.exists,
          data: profileDoc.exists ? Object.keys(profileDoc.data()!) : null
        }
      }
    })
  } catch (error: any) {
    console.error('[Test API] Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
