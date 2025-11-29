import { adminDb } from '../lib/firebase-admin'

async function fixUsernameMapping() {
  const userId = 'wFxyyki0E6XiekkSyLQ6SnMOway2' // Your user ID
  const username = 'pradeetha1997' // Your username
  
  console.log(`Creating username mapping: ${username} -> ${userId}`)
  
  await adminDb.collection('usernames').doc(username.toLowerCase()).set({
    username: username.toLowerCase(),
    userId: userId
  })
  
  console.log('✅ Username mapping created successfully!')
  console.log(`Portfolio URL: http://localhost:3000/portfolio/${username}`)
}

fixUsernameMapping()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
