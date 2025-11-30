import { NextRequest, NextResponse } from 'next/server'
import { revokeToken } from '@/lib/api/tiktok'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

/**
 * TikTok Disconnect Endpoint
 * Revokes access token and deletes connection
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const idToken = authHeader.split('Bearer ')[1]
    let userId: string
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      userId = decodedToken.uid
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Get connection
    const connectionDoc = await adminDb
      .collection('users')
      .doc(userId)
      .collection('connections')
      .doc('tiktok')
      .get()
    
    if (connectionDoc.exists) {
      const connection = connectionDoc.data()!
      
      // Try to revoke the token (TikTok may not support this)
      if (connection.accessToken) {
        await revokeToken(connection.accessToken)
      }
    }
    
    // Delete connection
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('connections')
      .doc('tiktok')
      .delete()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting TikTok:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect' },
      { status: 500 }
    )
  }
}
