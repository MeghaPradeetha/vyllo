'use server'

import { adminAuth, default as admin } from '@/lib/firebase-admin'

export async function uploadAvatarAction(formData: FormData, idToken: string) {
  try {
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId || !idToken) {
      console.error('Missing fields:', { file: !!file, userId: !!userId, idToken: !!idToken })
      return { error: 'Missing required fields' }
    }

    console.log('Starting upload for user:', userId)

    // Verify the ID token to ensure the user is authenticated
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      if (decodedToken.uid !== userId) {
        return { error: 'Unauthorized: User ID mismatch' }
      }
    } catch (error) {
      console.error('Error verifying ID token:', error)
      return { error: 'Unauthorized: Invalid token' }
    }

    // Get the storage bucket
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    if (!bucketName) {
      return { error: 'Server configuration error: Storage bucket not defined' }
    }

    const bucket = admin.storage().bucket(bucketName)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `avatars/${userId}/avatar.${fileExtension}`
    const fileRef = bucket.file(fileName)

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload the file
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    })

    // Make the file public (optional, or generate a signed URL)
    // For avatars, public read is usually fine if rules allow, but admin SDK bypasses rules.
    // We need a public URL.
    await fileRef.makePublic()

    // Construct the public URL
    // Format: https://storage.googleapis.com/BUCKET_NAME/FILE_PATH
    // Or Firebase format: https://firebasestorage.googleapis.com/v0/b/BUCKET_NAME/o/FILE_PATH?alt=media
    // Let's use the standard public URL from makePublic() which is usually:
    // https://storage.googleapis.com/BUCKET_NAME/avatars/USER_ID/avatar.jpg
    
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`
    console.log('Upload successful, public URL:', publicUrl)
    
    return { url: publicUrl }

  } catch (error: any) {
    console.error('Server upload error:', error)
    return { error: error.message || 'Failed to upload avatar' }
  }
}
