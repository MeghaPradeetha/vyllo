import { NextRequest, NextResponse } from 'next/server'
import { revokeToken } from '@/lib/api/youtube'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

/**
 * YouTube Disconnect Endpoint
 * Revokes tokens and removes connection
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
    
    // Check if Firebase Admin is initialized
    if (!adminAuth) {
      console.error('[YouTube Disconnect] Firebase Admin not initialized')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      userId = decodedToken.uid
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Get connection to retrieve access token using Admin SDK
    const connectionDoc = await adminDb
      .collection('users')
      .doc(userId)
      .collection('connections')
      .doc('youtube')
      .get()
    
    // Revoke token if it exists (best effort - don't fail if token is already invalid)
    if (connectionDoc.exists) {
      const connection = connectionDoc.data()!
      if (connection.accessToken) {
        try {
          await revokeToken(connection.accessToken)
          console.log('[YouTube Disconnect] Token revoked successfully')
        } catch (error) {
          console.log('[YouTube Disconnect] Token revocation failed (token may already be invalid):', error)
          // Continue with deletion even if revocation fails
        }
      }
    }
    
    // Delete connection from Firestore using Admin SDK (always do this)
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('connections')
      .doc('youtube')
      .delete()
    
    console.log('[YouTube Disconnect] Connection deleted successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting YouTube:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect' },
      { status: 500 }
    )
  }
}
