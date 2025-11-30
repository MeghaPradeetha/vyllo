import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

/**
 * Instagram OAuth Initiation Endpoint
 * Redirects user to Instagram OAuth consent screen
 */
export async function GET(request: NextRequest) {
  try {
    const appId = process.env.INSTAGRAM_APP_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`
    
    if (!appId) {
      return NextResponse.json(
        { error: 'Instagram App ID not configured' },
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
      platform: 'instagram',
    })
    
    // Build Instagram authorization URL
    const authUrl = new URL('https://api.instagram.com/oauth/authorize')
    authUrl.searchParams.set('client_id', appId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', 'user_profile,user_media')
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('state', state)
    
    // Redirect to Instagram OAuth
    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error('Error initiating Instagram OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    )
  }
}
