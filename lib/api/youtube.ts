import axios from 'axios'
import { YouTubeVideo } from '@/types/database'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

interface YouTubeTokens {
  access_token: string
  refresh_token?: string
  expires_in: number
}

interface YouTubeChannel {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: { url: string }
      medium: { url: string }
      high: { url: string }
    }
  }
  statistics: {
    subscriberCount: string
    videoCount: string
    viewCount: string
  }
}

/**
 * Exchange authorization code for access tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<YouTubeTokens> {
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: process.env.YOUTUBE_CLIENT_ID,
    client_secret: process.env.YOUTUBE_CLIENT_SECRET,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`,
    grant_type: 'authorization_code',
  })
  
  return response.data
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<YouTubeTokens> {
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    refresh_token: refreshToken,
    client_id: process.env.YOUTUBE_CLIENT_ID,
    client_secret: process.env.YOUTUBE_CLIENT_SECRET,
    grant_type: 'refresh_token',
  })
  
  return response.data
}

/**
 * Get channel information
 */
export async function getChannelInfo(accessToken: string): Promise<YouTubeChannel> {
  const response = await axios.get(`${YOUTUBE_API_BASE}/channels`, {
    params: {
      part: 'snippet,statistics',
      mine: true,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
  if (!response.data.items || response.data.items.length === 0) {
    throw new Error('No channel found for this account')
  }
  
  return response.data.items[0]
}

/**
 * Get channel uploads playlist ID
 */
async function getUploadsPlaylistId(accessToken: string, channelId: string): Promise<string> {
  const response = await axios.get(`${YOUTUBE_API_BASE}/channels`, {
    params: {
      part: 'contentDetails',
      id: channelId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
  return response.data.items[0].contentDetails.relatedPlaylists.uploads
}

/**
 * Get videos from uploads playlist
 */
export async function getChannelVideos(
  accessToken: string,
  channelId: string,
  maxResults: number = 50,
  pageToken?: string
): Promise<{ videos: YouTubeVideo[], nextPageToken?: string }> {
  // Get uploads playlist ID
  const uploadsPlaylistId = await getUploadsPlaylistId(accessToken, channelId)
  
  // Get video IDs from playlist
  const playlistResponse = await axios.get(`${YOUTUBE_API_BASE}/playlistItems`, {
    params: {
      part: 'contentDetails',
      playlistId: uploadsPlaylistId,
      maxResults,
      pageToken,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
  const videoIds = playlistResponse.data.items
    .map((item: any) => item.contentDetails.videoId)
    .join(',')
  
  if (!videoIds) {
    return { videos: [] }
  }
  
  // Get video details
  const videosResponse = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
    params: {
      part: 'snippet,statistics,contentDetails',
      id: videoIds,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
  return {
    videos: videosResponse.data.items,
    nextPageToken: playlistResponse.data.nextPageToken,
  }
}

/**
 * Revoke access token (for disconnection)
 */
export async function revokeToken(accessToken: string): Promise<void> {
  await axios.post(`https://oauth2.googleapis.com/revoke?token=${accessToken}`)
}
