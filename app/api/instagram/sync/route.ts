import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { getUserMedia, refreshAccessToken } from '@/lib/api/instagram'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const userId = decodedToken.uid
    
    // Get connection details
    const connectionDoc = await adminDb
      .collection('users')
      .doc(userId)
      .collection('connections')
      .doc('instagram')
      .get()
      
    if (!connectionDoc.exists) {
      return NextResponse.json(
        { error: 'Instagram not connected' },
        { status: 400 }
      )
    }
    
    const connection = connectionDoc.data()!
    let accessToken = connection.accessToken
    
    // Check if token needs refresh (refresh if < 10 days remaining)
    const expiresAt = connection.expiresAt.toDate()
    const daysRemaining = (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    
    if (daysRemaining < 10) {
      try {
        const refreshed = await refreshAccessToken(accessToken)
        accessToken = refreshed.access_token
        
        // Update token in database
        const newExpiresAt = new Date()
        newExpiresAt.setSeconds(newExpiresAt.getSeconds() + refreshed.expires_in)
        
        await connectionDoc.ref.update({
          accessToken,
          expiresAt: newExpiresAt,
        })
      } catch (error) {
        console.error('Error refreshing token:', error)
        // Continue with existing token if refresh fails
      }
    }
    
    // Fetch media from Instagram
    const { media } = await getUserMedia(accessToken, 50) // Fetch last 50 items
    
    // Store media in Firestore
    const batch = adminDb.batch()
    let itemsAdded = 0
    
    for (const item of media) {
      // Only sync images and videos (skip albums for now unless they have a media_url)
      if (!item.media_url) continue
      
      const contentRef = adminDb
        .collection('users')
        .doc(userId)
        .collection('content')
        .doc(`ig_${item.id}`)
        
      batch.set(contentRef, {
        platform: 'instagram',
        platformId: item.id,
        type: item.media_type.toLowerCase(),
        url: item.media_url,
        thumbnailUrl: item.thumbnail_url || item.media_url, // Video thumbnails might be missing in Basic Display
        title: item.caption || '',
        description: item.caption || '',
        permalink: item.permalink,
        publishedAt: new Date(item.timestamp),
        syncedAt: new Date(),
        creatorId: userId,
      }, { merge: true })
      
      itemsAdded++
    }
    
    // Update last synced timestamp
    batch.update(connectionDoc.ref, {
      lastSynced: new Date(),
    })
    
    await batch.commit()
    
    return NextResponse.json({ 
      success: true, 
      itemsAdded 
    })
  } catch (error) {
    console.error('Error syncing Instagram:', error)
    return NextResponse.json(
      { error: 'Failed to sync Instagram content' },
      { status: 500 }
    )
  }
}
