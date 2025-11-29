import { db } from '../firebase'
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  writeBatch,
  orderBy,
  limit,
} from 'firebase/firestore'
import { ContentItem, NormalizedContent } from '@/types/database'

/**
 * Save a single content item
 */
export async function saveContent(
  userId: string,
  content: NormalizedContent
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized')
  const contentRef = collection(db, 'public', 'data', 'contentCache')
  
  // Generate unique ID from platform and external ID
  const docId = `${content.platform}_${content.externalId}`
  const docRef = doc(contentRef, docId)
  
  const contentItem: ContentItem = {
    id: docId,
    creatorId: userId,
    ...content,
  }
  
  await setDoc(docRef, contentItem, { merge: true })
}

/**
 * Save multiple content items to the public cache
 * Uses batch write for efficiency
 */
export async function saveContentBatch(contentItems: ContentItem[]): Promise<void> {
  if (!db) throw new Error('Firestore not initialized')
  const batch = writeBatch(db)
  const contentRef = collection(db, 'public', 'data', 'contentCache')
  
  contentItems.forEach((item) => {
    const docRef = doc(contentRef, item.id)
    batch.set(docRef, {
      ...item,
      publishedAt: item.publishedAt,
    }, { merge: true })
  })
  
  await batch.commit()
}

/**
 * Get all content for a specific user
 */
export async function getContentByUser(userId: string): Promise<ContentItem[]> {
  if (!db) throw new Error('Firestore not initialized')
  const contentRef = collection(db, 'public', 'data', 'contentCache')
  const q = query(
    contentRef,
    where('creatorId', '==', userId)
  )
  
  const snapshot = await getDocs(q)
  const content: ContentItem[] = []
  
  snapshot.forEach((doc) => {
    const data = doc.data()
    content.push({
      ...data,
      id: doc.id,
      publishedAt: data.publishedAt?.toDate() || new Date(),
    } as ContentItem)
  })
  
  // Client-side sorting as required
  return content.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

/**
 * Get content by user with type filter
 */
export async function getContentByUserAndType(
  userId: string,
  type: 'video' | 'short' | 'post'
): Promise<ContentItem[]> {
  if (!db) throw new Error('Firestore not initialized')
  const contentRef = collection(db, 'public', 'data', 'contentCache')
  const q = query(
    contentRef,
    where('creatorId', '==', userId),
    where('type', '==', type)
  )
  
  const snapshot = await getDocs(q)
  const content: ContentItem[] = []
  
  snapshot.forEach((doc) => {
    const data = doc.data()
    content.push({
      ...data,
      id: doc.id,
      publishedAt: data.publishedAt?.toDate() || new Date(),
    } as ContentItem)
  })
  
  return content.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

/**
 * Delete all content for a user
 */
export async function deleteUserContent(userId: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized')
  const contentRef = collection(db, 'public', 'data', 'contentCache')
  const q = query(contentRef, where('creatorId', '==', userId))
  
  const snapshot = await getDocs(q)
  const batch = writeBatch(db)
  
  snapshot.forEach((doc) => {
    batch.delete(doc.ref)
  })
  
  await batch.commit()
}

/**
 * Get recent content across all users (for homepage/discovery)
 */
export async function getRecentContent(limitCount: number = 20): Promise<ContentItem[]> {
  if (!db) throw new Error('Firestore not initialized')
  const contentRef = collection(db, 'public', 'data', 'contentCache')
  const q = query(
    contentRef,
    orderBy('publishedAt', 'desc'),
    limit(limitCount)
  )
  
  const snapshot = await getDocs(q)
  const content: ContentItem[] = []
  
  snapshot.forEach((doc) => {
    const data = doc.data()
    content.push({
      ...data,
      id: doc.id,
      publishedAt: data.publishedAt?.toDate() || new Date(),
    } as ContentItem)
  })
  
  return content
}
