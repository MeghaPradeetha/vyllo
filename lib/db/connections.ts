import { db } from '../firebase'
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore'
import { PlatformConnection, Platform } from '@/types/database'

/**
 * Save or update a platform connection
 */
export async function saveConnection(
  userId: string,
  platform: Platform,
  data: Omit<PlatformConnection, 'platform'>
): Promise<void> {
  const connectionRef = doc(db, 'users', userId, 'connections', platform)
  
  await setDoc(connectionRef, {
    platform,
    ...data,
    lastSynced: data.lastSynced || null,
  }, { merge: true })
}

/**
 * Get a specific platform connection
 */
export async function getConnection(
  userId: string,
  platform: Platform
): Promise<PlatformConnection | null> {
  const connectionRef = doc(db, 'users', userId, 'connections', platform)
  const connectionSnap = await getDoc(connectionRef)
  
  if (!connectionSnap.exists()) {
    return null
  }
  
  const data = connectionSnap.data()
  return {
    ...data,
    lastSynced: data.lastSynced?.toDate() || undefined,
    expiresAt: data.expiresAt?.toDate() || undefined,
  } as PlatformConnection
}

/**
 * Get all connections for a user
 */
export async function getConnections(userId: string): Promise<Record<Platform, PlatformConnection | null>> {
  const connectionsRef = collection(db, 'users', userId, 'connections')
  const snapshot = await getDocs(connectionsRef)
  
  const connections: Record<string, PlatformConnection | null> = {
    youtube: null,
    tiktok: null,
    instagram: null,
  }
  
  snapshot.forEach((doc) => {
    const data = doc.data()
    connections[doc.id] = {
      ...data,
      lastSynced: data.lastSynced?.toDate() || undefined,
      expiresAt: data.expiresAt?.toDate() || undefined,
    } as PlatformConnection
  })
  
  return connections as Record<Platform, PlatformConnection | null>
}

/**
 * Delete a platform connection
 */
export async function deleteConnection(
  userId: string,
  platform: Platform
): Promise<void> {
  const connectionRef = doc(db, 'users', userId, 'connections', platform)
  await deleteDoc(connectionRef)
}

/**
 * Update last synced timestamp
 */
export async function updateLastSynced(
  userId: string,
  platform: Platform
): Promise<void> {
  const connectionRef = doc(db, 'users', userId, 'connections', platform)
  await setDoc(connectionRef, {
    lastSynced: new Date(),
  }, { merge: true })
}
