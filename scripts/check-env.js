import { config } from 'dotenv';
config({ path: '.env.local' });

console.log('App URL:', process.env.NEXT_PUBLIC_APP_URL);
console.log('Client ID present:', !!process.env.YOUTUBE_CLIENT_ID);
console.log('Client Secret present:', !!process.env.YOUTUBE_CLIENT_SECRET);
