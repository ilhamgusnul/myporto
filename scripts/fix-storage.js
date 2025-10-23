// Script to fix Supabase Storage bucket
// Run this with: node scripts/fix-storage.js

const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

async function fixStorage() {
  const supabaseUrl = envVars.SUPABASE_URL;
  const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    return;
  }

  console.log('🔧 Fixing Supabase Storage...');
  console.log('📍 URL:', supabaseUrl);

  try {
    // 1. Check if bucket exists
    console.log('\n1️⃣ Checking bucket...');
    const checkResponse = await fetch(`${supabaseUrl}/storage/v1/bucket/assets`, {
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey
      }
    });

    if (checkResponse.status === 404) {
      console.log('❌ Bucket "assets" not found. Creating...');
      
      // Create bucket
      const createResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: 'assets',
          name: 'assets',
          public: true,
          file_size_limit: 5242880, // 5MB
          allowed_mime_types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        })
      });

      if (createResponse.ok) {
        console.log('✅ Bucket created successfully!');
      } else {
        const error = await createResponse.text();
        console.error('❌ Failed to create bucket:', error);
      }
    } else if (checkResponse.ok) {
      console.log('✅ Bucket exists');
      
      // Update to make it public
      console.log('\n2️⃣ Making bucket public...');
      const updateResponse = await fetch(`${supabaseUrl}/storage/v1/bucket/assets`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          public: true,
          file_size_limit: 5242880,
          allowed_mime_types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        })
      });

      if (updateResponse.ok) {
        console.log('✅ Bucket is now public!');
      } else {
        const error = await updateResponse.text();
        console.error('⚠️  Failed to update bucket:', error);
      }
    }

    console.log('\n✨ Done! You can now upload images.');
    console.log('\n📝 Note: You may need to set RLS policies in Supabase Dashboard:');
    console.log('   Storage → assets → Policies');
    console.log('   Add policy: "Public Access" for SELECT');
    console.log('   Add policy: "Authenticated Upload" for INSERT');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixStorage();
