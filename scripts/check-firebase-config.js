const fs = require('fs');
const path = require('path');

// Simple dotenv parser to avoid dependencies if possible, or use simple logic
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.error('❌ .env.local file not found!');
      return {};
    }
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
    });
    return env;
  } catch (e) {
    console.error('Error reading .env.local:', e);
    return {};
  }
}

const env = loadEnv();
const privateKey = env.FIREBASE_PRIVATE_KEY;
const clientEmail = env.FIREBASE_CLIENT_EMAIL;
const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

console.log('--- Firebase Config Diagnostic ---');
console.log(`Project ID: ${projectId ? '✅ Found (' + projectId + ')' : '❌ Missing'}`);
console.log(`Client Email: ${clientEmail ? '✅ Found (' + clientEmail + ')' : '❌ Missing'}`);

if (!privateKey) {
  console.log('Private Key: ❌ Missing');
} else {
  console.log('Private Key: ✅ Found');
  console.log(`  Length: ${privateKey.length} chars`);
  
  const hasBegin = privateKey.includes('-----BEGIN PRIVATE KEY-----');
  const hasEnd = privateKey.includes('-----END PRIVATE KEY-----');
  const hasLiteralNewlines = privateKey.includes('\\n');
  const hasRealNewlines = privateKey.includes('\n');
  
  console.log(`  Has Header: ${hasBegin ? '✅' : '❌'}`);
  console.log(`  Has Footer: ${hasEnd ? '✅' : '❌'}`);
  console.log(`  Has Literal Newlines (\\n): ${hasLiteralNewlines ? 'Yes' : 'No'}`);
  console.log(`  Has Real Newlines: ${hasRealNewlines ? 'Yes' : 'No'}`);
  
  // Simulate the parsing logic
  let parsedKey = privateKey;
  if (hasLiteralNewlines) {
      parsedKey = parsedKey.replace(/\\n/g, '\n');
  }
  parsedKey = parsedKey.replace(/"/g, '');
  
  const parsedHasRealNewlines = parsedKey.includes('\n');
  console.log(`  Parsed Key has real newlines: ${parsedHasRealNewlines ? '✅' : '❌'}`);
  
  if (!hasBegin || !hasEnd) {
    console.error('  ❌ CRITICAL: Private key is missing header or footer.');
  } else if (!parsedHasRealNewlines) {
    console.error('  ❌ CRITICAL: Parsed private key has no newlines. It must be multiline.');
  } else {
    console.log('  ✅ Key format looks correct after parsing.');
  }
}
console.log('----------------------------------');
