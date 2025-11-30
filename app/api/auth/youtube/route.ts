import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

/**
 * YouTube OAuth Initiation Endpoint
 * Redirects user to Google OAuth consent screen
 */
export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.YOUTUBE_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'YouTube client ID not configured' },
        { status: 500 }
      )
    }
    
    // Get userId from query parameter (sent from client)
    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }
    
    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(7) + Date.now().toString(36)
    
    // Store state with userId in Firestore (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await adminDb.collection('oauth_states').doc(state).set({
      userId,
      expiresAt,
      platform: 'youtube',
    })
    
    // Redirect to Google OAuth
    return NextResponse.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: [
          'https://www.googleapis.com/auth/youtube.readonly',
          'https://www.googleapis.com/auth/youtube.force-ssl',
        ].join(' '),
        access_type: 'offline',
        prompt: 'consent',
        state,
      }).toString()
    )
  } catch (error) {
    console.error('Error initiating YouTube OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    )
  }
}
