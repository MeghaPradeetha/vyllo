import { db } from '../firebase'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { UserProfile } from '@/types/database'

/**
 * Create a new user profile
 */
export async function createUserProfile(
  userId: string,
  data: Omit<UserProfile, 'userId' | 'createdAt' | 'portfolioUrl'>
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized')
  const userRef = doc(db, 'users', userId, 'profile', 'public')
  
  const profileData: UserProfile = {
    userId,
    ...data,
    portfolioUrl: `/portfolio/${data.username}`,
    createdAt: new Date(),
  }
  
  await setDoc(userRef, {
    ...profileData,
    createdAt: serverTimestamp(),
  })
}

/**
 * Get user profile by userId
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!db) throw new Error('Firestore not initialized')
  const userRef = doc(db, 'users', userId, 'profile', 'public')
  const userSnap = await getDoc(userRef)
  
  if (!userSnap.exists()) {
    return null
  }
  
  const data = userSnap.data()
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as UserProfile
}

/**
 * Get user profile by username
 */
export async function getUserProfileByUsername(username: string): Promise<UserProfile | null> {
  // Note: This requires a Firestore index on username
  // For now, we'll use a simple query
  // In production, consider using a separate username -> userId mapping collection
  const { collection, query, where, getDocs } = await import('firebase/firestore')
  
  if (!db) throw new Error('Firestore not initialized')
  const usersRef = collection(db, 'users')
  const q = query(
    collection(db, 'users'),
    where('profile.public.username', '==', username)
  )
  
  // This is a workaround - in production, use a dedicated username index collection
  // For now, we'll return null and handle this in the portfolio page
  return null
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<Omit<UserProfile, 'userId' | 'createdAt' | 'portfolioUrl'>>
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized')
  const userRef = doc(db, 'users', userId, 'profile', 'public')
  await updateDoc(userRef, data)
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  // This would require a separate collection for username lookups
  // For MVP, we'll assume it's available
  return true
}
