/**
 * Setup blog-images bucket in Supabase Storage
 * Run: node --env-file=.env scripts/setup-blog-images-bucket.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function setupBucket() {
    console.log('🗂️  Setting up blog-images bucket...\n');

    // 1. Create the bucket
    const { data, error } = await supabase.storage.createBucket('blog-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
        fileSizeLimit: 5 * 1024 * 1024 // 5MB max
    });

    if (error) {
        if (error.message?.includes('already exists')) {
            console.log('✅ Bucket "blog-images" already exists!');
        } else {
            console.error('❌ Error creating bucket:', error.message);
            return;
        }
    } else {
        console.log('✅ Bucket "blog-images" created successfully!');
    }

    // 2. Verify it exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const blogBucket = buckets?.find(b => b.name === 'blog-images');
    if (blogBucket) {
        console.log(`✅ Verified: blog-images bucket exists (public: ${blogBucket.public})`);
    }

    console.log('\n🎉 Done! Blog image uploads are ready.');
    console.log(`📁 Images will be stored at: ${process.env.SUPABASE_URL}/storage/v1/object/public/blog-images/`);
}

setupBucket().catch(console.error);
