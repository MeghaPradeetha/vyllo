
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Mock the Next.js environment variables if needed
// But we need to import the firebase-admin.ts file which expects them
// We might need to manually set them if dotenv doesn't override process.env for imports?
// Actually, dotenv loads into process.env, so it should be fine.

async function testAdmin() {
  console.log('Testing Firebase Admin SDK...');
  
  try {
    // Import the admin instance
    // We use dynamic import to ensure env vars are loaded first
    const { default: admin } = await import('../lib/firebase-admin');
    
    console.log('Firebase Admin initialized.');
    
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    console.log(`Attempting to access bucket: ${bucketName}`);
    
    if (!bucketName) {
      throw new Error('Bucket name not found in environment variables');
    }

    const bucket = admin.storage().bucket(bucketName);
    
    console.log(`\nAttempting to access configured bucket: ${bucketName}`);
    try {
        const [files] = await bucket.getFiles({ maxResults: 1 });
        console.log('Successfully accessed bucket!');
        console.log(`Found ${files.length} files.`);
    } catch (err: any) {
        console.error('Failed to access specific bucket:', err.message);
    }
    
  } catch (error: any) {
    console.error('FAILED to authenticate or access storage.');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.message.includes('Invalid JWT Signature')) {
        console.error('\nPossible Cause: The private key in .env.local is malformed.');
    }
    process.exit(1);
  }
}

testAdmin();
