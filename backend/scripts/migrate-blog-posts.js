/**
 * Blog Posts Migration Script
 * Imports blog posts from data/blog-posts.json to Supabase
 * 
 * Run this ONCE to populate your database
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

async function importBlogPosts() {
    try {
        console.log('📚 Starting blog posts migration...\n');

        // Read JSON file (from project root data/ folder)
        const jsonPath = path.join(__dirname, '../../data/blog-posts.json');
        const jsonData = await fs.readFile(jsonPath, 'utf-8');
        const data = JSON.parse(jsonData);

        const articles = data.articles || [];
        console.log(`Found ${articles.length} articles in JSON file\n`);

        if (articles.length === 0) {
            console.warn('⚠️  No articles found in JSON file');
            return;
        }

        // Transform and insert each article
        let successCount = 0;
        let errorCount = 0;

        for (const article of articles) {
            try {
                // Map JSON structure to database schema (only use columns that exist)
                const post = {
                    title: article.title,
                    slug: article.slug || generateSlug(article.title),
                    excerpt: article.excerpt,
                    content: article.content,
                    category: article.category || 'security',
                    author: article.author || 'Elijah Adeyeye',
                    thumbnail: article.image || `images/blog/${generateSlug(article.title).substring(0, 50)}.jpg`,
                    published: true, // Mark all as published
                    published_at: article.publishedAt || article.date || new Date().toISOString(),
                    views: article.views || 0
                };

                // Check if post already exists
                const { data: existing } = await supabase
                    .from('blog_posts')
                    .select('id')
                    .eq('slug', post.slug)
                    .single();

                if (existing) {
                    console.log(`⏭️  Skipping "${post.title}" (already exists)`);
                    continue;
                }

                // Insert post
                const { data: inserted, error } = await supabase
                    .from('blog_posts')
                    .insert(post)
                    .select()
                    .single();

                if (error) throw error;

                console.log(`✅ Imported: "${post.title}"`);
                successCount++;

            } catch (err) {
                console.error(`❌ Failed to import "${article.title}":`, err.message);
                errorCount++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`✅ Successfully imported: ${successCount} posts`);
        if (errorCount > 0) {
            console.log(`❌ Failed: ${errorCount} posts`);
        }
        console.log('='.repeat(50) + '\n');

        // Verify import
        const { count } = await supabase
            .from('blog_posts')
            .select('*', { count: 'exact', head: true })
            .eq('published', true);

        console.log(`📊 Total published posts in database: ${count}`);
        console.log('\n✨ Migration complete!');

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
importBlogPosts();
