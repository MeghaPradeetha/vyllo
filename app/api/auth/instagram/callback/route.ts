import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, getLongLivedToken, getUserInfo } from '@/lib/api/instagram'
import { adminDb } from '@/lib/firebase-admin'

/**
 * Instagram OAuth Callback Endpoint
 * Handles the OAuth callback, exchanges code for tokens, and stores connection
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorReason = searchParams.get('error_reason')
    const errorDescription = searchParams.get('error_description')
    
    // Check for OAuth errors
    if (error) {
      console.error('Instagram OAuth error:', error, errorReason, errorDescription)
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
    
    // 1. Exchange code for short-lived token
    const shortLivedToken = await exchangeCodeForTokens(code)
    
    // 2. Exchange short-lived token for long-lived token (60 days)
    const longLivedToken = await getLongLivedToken(shortLivedToken.access_token)
    
    // 3. Get user information
    const userInfo = await getUserInfo(longLivedToken.access_token)
    
    // Calculate token expiration time
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + longLivedToken.expires_in)
    
    // Save connection to Firestore using Admin SDK
    await adminDb.collection('users').doc(userId).collection('connections').doc('instagram').set({
      platform: 'instagram',
      isConnected: true,
      accessToken: longLivedToken.access_token,
      userId: userInfo.id,
      username: userInfo.username,
      accountType: userInfo.account_type,
      expiresAt: tokenExpiresAt,
      lastSynced: new Date(),
    }, { merge: true })
    
    // Redirect back to connections page with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/connections?success=instagram_connected`
    )
  } catch (error) {
    console.error('Error in Instagram OAuth callback:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/connections?error=oauth_failed`
    )
  }
}
