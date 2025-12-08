import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, getChannelInfo } from '@/lib/api/youtube'
import { adminDb } from '@/lib/firebase-admin'

/**
 * YouTube OAuth Callback Endpoint
 * Handles the OAuth callback, exchanges code for tokens, and stores connection
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/connections?error=${error}`
      )
    }
    
    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/connections?error=missing_params`
      )
    }
    
    // Get userId from Firestore state
    const stateDoc = await adminDb.collection('oauth_states').doc(state).get()
    
    if (!stateDoc.exists) {
      console.error('Invalid state: not found in database')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/connections?error=invalid_state`
      )
    }
    
    const stateData = stateDoc.data()!
    const userId = stateData.userId
    const expiresAt = stateData.expiresAt.toDate()
    
    // Check if state has expired
    if (new Date() > expiresAt) {
      console.error('State has expired')
      await adminDb.collection('oauth_states').doc(state).delete()
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/connections?error=state_expired`
      )
    }
    
    // Delete the state document (one-time use)
    await adminDb.collection('oauth_states').doc(state).delete()
    
    // Exchange code for tokens
    console.log('[YouTube Auth Callback] Exchanging code for tokens...')
    const tokens = await exchangeCodeForTokens(code)
    console.log('[YouTube Auth Callback] Tokens received. Getting channel info...')
    
    // Get channel information
    const channelInfo = await getChannelInfo(tokens.access_token)
    console.log('[YouTube Auth Callback] Channel info received:', channelInfo.id)
    
    // Calculate token expiration time
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + tokens.expires_in)
    
    // Save connection to Firestore using Admin SDK
    console.log('[YouTube Auth Callback] Saving to Firestore:', userId)
    await adminDb.collection('users').doc(userId).collection('connections').doc('youtube').set({
      platform: 'youtube',
      isConnected: true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      channelId: channelInfo.id,
      username: channelInfo.snippet.title,
      expiresAt: tokenExpiresAt,
      lastSynced: new Date(),
    }, { merge: true })
    console.log('[YouTube Auth Callback] Saved successfully')
    
    // Redirect back to connections page with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/connections?success=youtube_connected`
    )
  } catch (error: any) {
    console.error('Error in YouTube OAuth callback:', error)
    // Log detailed error response if from Axios
    if (error.response?.data) {
      console.error('Detailed API Error:', JSON.stringify(error.response.data, null, 2))
    }
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/connections?error=oauth_failed`
    )
  }
}
