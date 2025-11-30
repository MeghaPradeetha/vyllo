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
export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  if (!db) throw new Error('Firestore not initialized')
  
  // First, look up the userId from the username mapping
  const { collection, query, where, getDocs } = await import('firebase/firestore')
  const usernamesRef = collection(db, 'usernames')
  const q = query(usernamesRef, where('username', '==', username.toLowerCase()))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    return null
  }
  
  const userId = snapshot.docs[0].data().userId
  
  // Then fetch the full profile
  return getUserProfile(userId)
}

/**
 * Create username mapping (call this when creating a user)
 */
export async function createUsernameMapping(username: string, userId: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized')
  const usernameRef = doc(db, 'usernames', username.toLowerCase())
  await setDoc(usernameRef, { username: username.toLowerCase(), userId })
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
