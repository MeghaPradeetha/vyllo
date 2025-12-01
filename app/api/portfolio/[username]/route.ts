import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

/**
 * Get portfolio data by username
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params
    console.log('[Portfolio API] Looking up username:', username)
    
    if (!adminDb) {
      console.error('[Portfolio API] Firebase Admin not initialized')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Look up userId from username
    const usernamesSnapshot = await adminDb
      .collection('usernames')
      .where('username', '==', username.toLowerCase())
      .limit(1)
      .get()
    
    console.log('[Portfolio API] Username query results:', usernamesSnapshot.size, 'docs')
    
    if (usernamesSnapshot.empty) {
      console.log('[Portfolio API] Username not found in usernames collection')
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }
    
    const userId = usernamesSnapshot.docs[0].data().userId
    console.log('[Portfolio API] Found userId:', userId)
    
    // Fetch profile
    const profileDoc = await adminDb
      .collection('users')
      .doc(userId)
      .collection('profile')
      .doc('public')
      .get()
    
    console.log('[Portfolio API] Profile exists?', profileDoc.exists)
    
    if (!profileDoc.exists) {
      console.log('[Portfolio API] Profile not found for userId:', userId)
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }
    
    const profileData = profileDoc.data()!
    console.log('[Portfolio API] Profile data keys:', Object.keys(profileData))
    const profile = {
      ...profileData,
      createdAt: profileData.createdAt?.toDate().toISOString() || new Date().toISOString(),
    }
    
    // Fetch content
    const contentSnapshot = await adminDb
      .collection('public')
      .doc('data')
      .collection('contentCache')
      .where('creatorId', '==', userId)
      .get()
    
    console.log('[Portfolio API] Found', contentSnapshot.size, 'content items')
    
    const content: any[] = []
    contentSnapshot.forEach((doc: any) => {
      const data = doc.data()
      content.push({
        ...data,
        id: doc.id,
        publishedAt: data.publishedAt?.toDate().toISOString() || new Date().toISOString(),
      })
    })
    
    // Sort by published date
    content.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    
    console.log('[Portfolio API] Returning profile and', content.length, 'content items')
    
    return NextResponse.json({
      profile,
      content,
    })
  } catch (error) {
    console.error('[Portfolio API] Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}
