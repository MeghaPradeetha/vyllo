import { NextRequest, NextResponse } from 'next/server'
import { revokeToken } from '@/lib/api/youtube'
import { deleteConnection, getConnection } from '@/lib/db/connections'
import { adminAuth } from '@/lib/firebase-admin'

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
    
    // Get connection to retrieve access token
    const connection = await getConnection(userId, 'youtube')
    
    // Revoke token if it exists
    if (connection?.accessToken) {
      try {
        await revokeToken(connection.accessToken)
      } catch (error) {
        console.error('Error revoking token:', error)
        // Continue with deletion even if revocation fails
      }
    }
    
    // Delete connection from Firestore
    await deleteConnection(userId, 'youtube')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting YouTube:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect' },
      { status: 500 }
    )
  }
}
