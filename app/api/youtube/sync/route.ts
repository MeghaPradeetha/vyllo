import { NextRequest, NextResponse } from 'next/server'
import { getChannelVideos, refreshAccessToken } from '@/lib/api/youtube'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { YouTubeVideo, ContentType, AspectRatio } from '@/types/database'

/**
 * YouTube Video Sync Endpoint
 * Fetches videos from YouTube and stores them in Firestore
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
    } catch (error: any) {
      console.error('[YouTube Sync] Token verification failed:', error)
      // Log more details if available
      if (error.code) console.error('[YouTube Sync] Error code:', error.code)
      if (error.message) console.error('[YouTube Sync] Error message:', error.message)
      
      return NextResponse.json({ 
        error: 'Invalid token',
        details: error.message 
      }, { status: 401 })
    }
    
    // Check if Firebase Admin is initialized
    if (!adminDb) {
      console.error('Firebase Admin not initialized')
      return NextResponse.json(
        { error: 'Server configuration error: Database not connected' },
        { status: 500 }
      )
    }

    // Get YouTube connection using Admin SDK
    const connectionDoc = await adminDb
      .collection('users')
      .doc(userId)
      .collection('connections')
      .doc('youtube')
      .get()
    
    if (!connectionDoc.exists) {
      return NextResponse.json(
        { error: 'YouTube not connected' },
        { status: 400 }
      )
    }
    
    const connection = connectionDoc.data()!
    
    if (!connection.isConnected) {
      return NextResponse.json(
        { error: 'YouTube not connected' },
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
        .doc('youtube')
        .update({
          accessToken: tokens.access_token,
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        })
    }
    
    if (!accessToken || !connection.channelId) {
      return NextResponse.json(
        { error: 'Invalid connection data' },
        { status: 400 }
      )
    }
    
    // Fetch videos from YouTube
    let allVideos: YouTubeVideo[] = []
    let pageToken: string | undefined = undefined
    let pageCount = 0
    const maxPages = 3 // Limit to 150 videos (50 per page)
    
    do {
      const result = await getChannelVideos(accessToken, connection.channelId, 50, pageToken)
      allVideos = [...allVideos, ...result.videos]
      pageToken = result.nextPageToken
      pageCount++
    } while (pageToken && pageCount < maxPages)
    
    // Save videos to Firestore using Admin SDK
    const contentRef = adminDb.collection('public').doc('data').collection('contentCache')
    let savedCount = 0
    
    for (const video of allVideos) {
      try {
        // Determine content type based on duration
        const duration = parseDuration(video.contentDetails.duration)
        const contentType: ContentType = duration <= 60 ? 'short' : 'video'
        
        // Determine aspect ratio from thumbnails
        const aspectRatio: AspectRatio = '16/9' // YouTube videos are typically 16:9
        
        const docId = `youtube_${video.id}`
        
        await contentRef.doc(docId).set({
          id: docId,
          creatorId: userId,
          platform: 'youtube',
          type: contentType,
          title: video.snippet.title,
          description: video.snippet.description,
          views: parseInt(video.statistics.viewCount || '0'),
          likes: parseInt(video.statistics.likeCount || '0'),
          comments: parseInt(video.statistics.commentCount || '0'),
          mediaUrl: `https://www.youtube.com/watch?v=${video.id}`,
          thumbnailUrl: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
          aspectRatio,
          publishedAt: new Date(video.snippet.publishedAt),
          externalId: video.id,
          externalUrl: `https://www.youtube.com/watch?v=${video.id}`,
        }, { merge: true })
        
        savedCount++
      } catch (error) {
        console.error(`Error saving video ${video.id}:`, error)
      }
    }
    
    // Update last synced timestamp using Admin SDK
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('connections')
      .doc('youtube')
      .update({
        lastSynced: new Date(),
      })
    
    return NextResponse.json({
      success: true,
      itemsAdded: savedCount,
      totalFetched: allVideos.length,
    })
  } catch (error) {
    console.error('Error syncing YouTube videos:', error)
    return NextResponse.json(
      { error: 'Failed to sync videos' },
      { status: 500 }
    )
  }
}

/**
 * Parse ISO 8601 duration to seconds
 * Example: PT1H2M10S -> 3730 seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  return hours * 3600 + minutes * 60 + seconds
}
