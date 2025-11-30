import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY
    
    // Only log in development or if explicitly debug enabled
    if (process.env.NODE_ENV === 'development') {
      console.log('[Firebase Admin] Raw private key length:', rawPrivateKey?.length)
    }
    
    const processedPrivateKey = rawPrivateKey
      ? rawPrivateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n')
      : undefined
    
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: processedPrivateKey,
        }

    // Check if we have necessary credentials
    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      })
    } else {
      console.warn('[Firebase Admin] Missing credentials, skipping initialization. This is fine during build.')
      // Initialize with a mock app or throw specific error if needed, 
      // but for build time usually we just want to avoid crashing if it's just type checking.
      // However, if code tries to USE adminDb, it will fail.
      
      // If we are in a build environment (often CI=true or similar), we might want to mock it.
      // But better to just let it be uninitialized if keys are missing, and handle access safely.
    }
  } catch (error) {
    console.error('[Firebase Admin] Initialization error:', error)
  }
}

// Export a safe accessor or just the instance. 
// If initialization failed, accessing firestore() might throw.
// We can wrap these exports to be safer.

export const adminDb = admin.apps.length ? admin.firestore() : {} as admin.firestore.Firestore
export const adminAuth = admin.apps.length ? admin.auth() : {} as admin.auth.Auth

export default admin
