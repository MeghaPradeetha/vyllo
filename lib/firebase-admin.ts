import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY
      console.log('[Firebase Admin] Raw private key length:', rawPrivateKey?.length)
  console.log('[Firebase Admin] First 60 chars:', rawPrivateKey?.substring(0, 60))
    
    const processedPrivateKey = rawPrivateKey
      ? rawPrivateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n')
      : undefined
    
  console.log('[Firebase Admin] Processed private key length:', processedPrivateKey?.length)
  console.log('[Firebase Admin] First 60 chars processed:', processedPrivateKey?.substring(0, 60))
  console.log('[Firebase Admin] Has newlines:', processedPrivateKey?.includes('\n'))
  
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle various private key formats (escaped newlines, quoted strings)
          privateKey: processedPrivateKey,
        }

  console.log('[Firebase Admin] Service Account Config:')
  console.log('  - projectId:', serviceAccount.projectId)
  console.log('  - clientEmail:', serviceAccount.clientEmail)
  console.log('  - privateKey length:', serviceAccount.privateKey?.length)
  console.log('  - privateKey starts with BEGIN:', serviceAccount.privateKey?.startsWith('-----BEGIN'))
  console.log('  - privateKey ends with END:', serviceAccount.privateKey?.endsWith('-----'))

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      })
}

export const adminDb = admin.firestore()
export const adminAuth = admin.auth()

export default admin
