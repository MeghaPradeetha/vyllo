import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

/**
 * TikTok OAuth Initiation Endpoint
 * Redirects user to TikTok OAuth consent screen
 */
export async function GET(request: NextRequest) {
  try {
    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`
    
    if (!clientKey) {
      return NextResponse.json(
        { error: 'TikTok client key not configured' },
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
      platform: 'tiktok',
    })
    
    // Build TikTok authorization URL
    const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/')
    authUrl.searchParams.set('client_key', clientKey)
    authUrl.searchParams.set('scope', 'user.info.basic,video.list')
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('state', state)
    
    // Redirect to TikTok OAuth
    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error('Error initiating TikTok OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    )
  }
}
