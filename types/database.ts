// Database Types for Vyllo Platform

export type Platform = 'youtube' | 'tiktok' | 'instagram'
export type ContentType = 'video' | 'short' | 'post'
export type AspectRatio = '16/9' | '9/16' | '1/1' | '4/5'

// User Profile (Public)
export interface UserProfile {
  userId: string
  username: string
  displayName: string
  bio?: string
  avatar?: string
  portfolioUrl: string
  createdAt: Date
  socialLinks?: {
    youtube?: string
    tiktok?: string
    instagram?: string
  }
}

// Platform Connection (Private - user only)
export interface PlatformConnection {
  platform: Platform
  isConnected: boolean
  accessToken?: string
  refreshToken?: string
  channelId?: string
  username?: string
  lastSynced?: Date
  expiresAt?: Date
}

// Content Item (Public Cache)
export interface ContentItem {
  id: string
  creatorId: string
  platform: Platform
  type: ContentType
  title: string
  description?: string
  views: number
  likes?: number
  comments?: number
  mediaUrl: string
  thumbnailUrl: string
  aspectRatio: AspectRatio
  publishedAt: Date
  externalId: string
  externalUrl: string
}

// API Response Types
export interface YouTubeVideo {
  id: string
  snippet: {
    title: string
    description: string
    publishedAt: string
    thumbnails: {
      high: { url: string }
      maxres?: { url: string }
    }
    channelId: string
  }
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
  contentDetails: {
    duration: string
  }
}

export interface TikTokVideo {
  id: string
  title: string
  create_time: number
  cover_image_url: string
  share_url: string
  video_description: string
  duration: number
  height: number
  width: number
  like_count: number
  comment_count: number
  share_count: number
  view_count: number
}

export interface InstagramMedia {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  caption: string
  timestamp: string
  like_count: number
  comments_count: number
  username: string
}

// Normalized Content for Aggregator
export interface NormalizedContent {
  platform: Platform
  type: ContentType
  title: string
  description?: string
  views: number
  likes?: number
  comments?: number
  mediaUrl: string
  thumbnailUrl: string
  aspectRatio: AspectRatio
  publishedAt: Date
  externalId: string
  externalUrl: string
}

// Sync Status
export interface SyncStatus {
  userId: string
  platform: Platform
  status: 'pending' | 'syncing' | 'success' | 'error'
  itemsAdded: number
  lastSync?: Date
  error?: string
}
