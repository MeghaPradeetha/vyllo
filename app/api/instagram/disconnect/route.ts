import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const idToken = authHeader.split('Bearer ')[1]
    
    // Check if Firebase Admin is initialized
    if (!adminAuth || !adminDb) {
      console.error('[Instagram Disconnect] Firebase Admin not initialized')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const userId = decodedToken.uid
    
    // Delete connection from Firestore
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('connections')
      .doc('instagram')
      .delete()
      
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting Instagram:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect Instagram' },
      { status: 500 }
    )
  }
}
