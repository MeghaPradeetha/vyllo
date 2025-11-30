import { NextRequest, NextResponse } from 'next/server'
import { getUserVideos, refreshAccessToken } from '@/lib/api/tiktok'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { ContentType, AspectRatio } from '@/types/database'

/**
 * TikTok Video Sync Endpoint
 * Fetches videos from TikTok and stores them in Firestore
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
    
    // Get TikTok connection using Admin SDK
    const connectionDoc = await adminDb
      .collection('users')
      .doc(userId)
      .collection('connections')
      .doc('tiktok')
      .get()
    
    if (!connectionDoc.exists) {
      return NextResponse.json(
        { error: 'TikTok not connected' },
        { status: 400 }
      )
    }
    
    const connection = connectionDoc.data()!
    
    if (!connection.isConnected) {
      return NextResponse.json(
        { error: 'TikTok not connected' },
        { status: 400 }
      )
    }
    
    let accessToken = connection.accessToken
    
    // Refresh token if expired
    if (connection.expiresAt && connection.expiresAt.toDate() <= new Date() && connection.refreshToken) {
      const tokens = await refreshAccessToken(connection.refreshToken)
      accessToken = tokens.access_token
      
      // Update stored access token
      await adminDb
        .collection('users')
        .doc(userId)
        .collection('connections')
        .doc('tiktok')
        .update({
          accessToken: tokens.access_token,
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        })
    }
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Invalid connection data' },
        { status: 400 }
      )
    }
    
    // Fetch videos from TikTok
    let allVideos: any[] = []
    let cursor: number | undefined = undefined
    let pageCount = 0
    const maxPages = 5 // Limit to 100 videos (20 per page)
    
    do {
      const result = await getUserVideos(accessToken, 20, cursor)
      allVideos = [...allVideos, ...result.videos]
      cursor = result.hasMore ? result.cursor : undefined
      pageCount++
    } while (cursor && pageCount < maxPages)
    
    // Save videos to Firestore using Admin SDK
    const contentRef = adminDb.collection('public').doc('data').collection('contentCache')
    let savedCount = 0
    
    for (const video of allVideos) {
      try {
        const docId = `tiktok_${video.id}`
        
        await contentRef.doc(docId).set({
          id: docId,
          creatorId: userId,
          platform: 'tiktok',
          type: 'short' as ContentType, // TikTok videos are always shorts
          title: video.title || video.video_description || 'TikTok Video',
          description: video.video_description || '',
          views: video.view_count || 0,
          likes: video.like_count || 0,
          comments: video.comment_count || 0,
          shares: video.share_count || 0,
          mediaUrl: video.share_url,
          thumbnailUrl: video.cover_image_url,
          aspectRatio: '9/16' as AspectRatio, // TikTok is vertical
          publishedAt: new Date(video.create_time * 1000),
          externalId: video.id,
          externalUrl: video.share_url,
        }, { merge: true })
        
        savedCount++
      } catch (error) {
        console.error(`Error saving TikTok video ${video.id}:`, error)
      }
    }
    
    // Update last synced timestamp using Admin SDK
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('connections')
      .doc('tiktok')
      .update({
        lastSynced: new Date(),
      })
    
    return NextResponse.json({
      success: true,
      itemsAdded: savedCount,
      totalFetched: allVideos.length,
    })
  } catch (error) {
    console.error('Error syncing TikTok videos:', error)
    return NextResponse.json(
      { error: 'Failed to sync videos' },
      { status: 500 }
    )
  }
}
