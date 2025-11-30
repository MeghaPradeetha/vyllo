import axios from 'axios'

const INSTAGRAM_API_BASE = 'https://graph.instagram.com'
const INSTAGRAM_AUTH_BASE = 'https://api.instagram.com'

interface InstagramTokenResponse {
  access_token: string
  user_id: string
}

interface InstagramLongLivedTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface InstagramUserInfo {
  id: string
  username: string
  account_type: string
  media_count: number
}

interface InstagramMedia {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  thumbnail_url?: string
  timestamp: string
  username: string
}

interface InstagramMediaResponse {
  data: InstagramMedia[]
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next: string
  }
}

/**
 * Exchange authorization code for short-lived access token
 */
export async function exchangeCodeForTokens(code: string): Promise<InstagramTokenResponse> {
  const params = new URLSearchParams()
  params.append('client_id', process.env.INSTAGRAM_APP_ID!)
  params.append('client_secret', process.env.INSTAGRAM_APP_SECRET!)
  params.append('grant_type', 'authorization_code')
  params.append('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`)
  params.append('code', code)

  const response = await axios.post(
    `${INSTAGRAM_AUTH_BASE}/oauth/access_token`,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  return response.data
}

/**
 * Exchange short-lived token for long-lived token (60 days)
 */
export async function getLongLivedToken(shortLivedToken: string): Promise<InstagramLongLivedTokenResponse> {
  const response = await axios.get(
    `${INSTAGRAM_API_BASE}/access_token`,
    {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        access_token: shortLivedToken,
      },
    }
  )

  return response.data
}

/**
 * Refresh a long-lived access token
 */
export async function refreshAccessToken(accessToken: string): Promise<InstagramLongLivedTokenResponse> {
  const response = await axios.get(
    `${INSTAGRAM_API_BASE}/refresh_access_token`,
    {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: accessToken,
      },
    }
  )

  return response.data
}

/**
 * Get user information
 */
export async function getUserInfo(accessToken: string): Promise<InstagramUserInfo> {
  const response = await axios.get(
    `${INSTAGRAM_API_BASE}/me`,
    {
      params: {
        fields: 'id,username,account_type,media_count',
        access_token: accessToken,
      },
    }
  )

  return response.data
}

/**
 * Get user's media
 */
export async function getUserMedia(
  accessToken: string,
  limit: number = 20,
  after?: string
): Promise<{ media: InstagramMedia[]; paging?: any }> {
  const response = await axios.get<InstagramMediaResponse>(
    `${INSTAGRAM_API_BASE}/me/media`,
    {
      params: {
        fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username',
        limit: limit,
        after: after,
        access_token: accessToken,
      },
    }
  )

  return {
    media: response.data.data || [],
    paging: response.data.paging,
  }
}
