import axios from 'axios'

const TIKTOK_API_BASE = 'https://open.tiktokapis.com'
const TIKTOK_AUTH_BASE = 'https://www.tiktok.com'

interface TikTokTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  refresh_expires_in: number
  token_type: string
  scope: string
  open_id: string
}

interface TikTokUserInfo {
  open_id: string
  union_id: string
  avatar_url: string
  display_name: string
  bio_description: string
  profile_deep_link: string
  is_verified: boolean
  follower_count: number
  following_count: number
  likes_count: number
  video_count: number
}

interface TikTokVideo {
  id: string
  create_time: number
  cover_image_url: string
  share_url: string
  video_description: string
  duration: number
  height: number
  width: number
  title: string
  embed_html: string
  embed_link: string
  like_count: number
  comment_count: number
  share_count: number
  view_count: number
}

interface TikTokVideosResponse {
  data: {
    videos: TikTokVideo[]
    cursor: number
    has_more: boolean
  }
  error: {
    code: string
    message: string
    log_id: string
  }
}

/**
 * Exchange authorization code for access and refresh tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<TikTokTokenResponse> {
  const response = await axios.post(
    `${TIKTOK_API_BASE}/v2/oauth/token/`,
    {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  return response.data
}

/**
 * Refresh an expired access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TikTokTokenResponse> {
  const response = await axios.post(
    `${TIKTOK_API_BASE}/v2/oauth/token/`,
    {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  return response.data
}

/**
 * Get user information
 */
export async function getUserInfo(accessToken: string): Promise<TikTokUserInfo> {
  const response = await axios.get(
    `${TIKTOK_API_BASE}/v2/user/info/`,
    {
      params: {
        fields: 'open_id,union_id,avatar_url,display_name,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  return response.data.data.user
}

/**
 * Get user's videos with pagination
 */
export async function getUserVideos(
  accessToken: string,
  maxResults: number = 20,
  cursor?: number
): Promise<{ videos: TikTokVideo[]; cursor?: number; hasMore: boolean }> {
  const response = await axios.post<TikTokVideosResponse>(
    `${TIKTOK_API_BASE}/v2/video/list/`,
    {
      max_count: maxResults,
      cursor: cursor || 0,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (response.data.error) {
    throw new Error(response.data.error.message)
  }

  return {
    videos: response.data.data.videos || [],
    cursor: response.data.data.cursor,
    hasMore: response.data.data.has_more,
  }
}

/**
 * Revoke access token (TikTok may not support this, include for consistency)
 */
export async function revokeToken(accessToken: string): Promise<void> {
  try {
    // TikTok doesn't have a documented revoke endpoint
    // This is a placeholder for future implementation
    console.log('TikTok token revocation not implemented')
  } catch (error) {
    console.error('Error revoking TikTok token:', error)
  }
}
