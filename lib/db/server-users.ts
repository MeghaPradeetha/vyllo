import { adminDb } from '../firebase-admin'
import { UserProfile } from '@/types/database'

/**
 * Get user profile by username (Server-side using Admin SDK)
 */
export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  // Look up the userId from the username mapping
  const usernamesSnapshot = await adminDb
    .collection('usernames')
    .where('username', '==', username.toLowerCase())
    .limit(1)
    .get()
  
  if (usernamesSnapshot.empty) {
    return null
  }
  
  const userId = usernamesSnapshot.docs[0].data().userId
  
  // Fetch the full profile
  const profileDoc = await adminDb
    .collection('users')
    .doc(userId)
    .collection('profile')
    .doc('public')
    .get()
  
  if (!profileDoc.exists) {
    return null
  }
  
  const data = profileDoc.data()!
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as UserProfile
}

/**
 * Get content by user (Server-side using Admin SDK)
 */
export async function getContentByUser(userId: string) {
  const contentSnapshot = await adminDb
    .collection('public')
    .doc('data')
    .collection('contentCache')
    .where('creatorId', '==', userId)
    .get()
  
  const content: any[] = []
  
  contentSnapshot.forEach((doc) => {
    const data = doc.data()
    content.push({
      ...data,
      id: doc.id,
      publishedAt: data.publishedAt?.toDate() || new Date(),
    })
  })
  
  // Sort by published date (newest first)
  return content.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}
