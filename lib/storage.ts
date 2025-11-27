import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

/**
 * Upload a user avatar to Firebase Storage
 * Returns the download URL
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  if (!storage) throw new Error('Firebase Storage not configured')

  // Create a reference to 'avatars/{userId}'
  // We overwrite the existing avatar for simplicity
  const fileExtension = file.name.split('.').pop() || 'jpg'
  const storageRef = ref(storage, `avatars/${userId}/avatar.${fileExtension}`)

  // Upload the file
  const snapshot = await uploadBytes(storageRef, file)

  // Get the download URL
  const downloadURL = await getDownloadURL(snapshot.ref)
  
  return downloadURL
}
