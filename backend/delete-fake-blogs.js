import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanFakeBlogs() {
  console.log("Fetching all blogs...");
  const { data: posts, error: fetchErr } = await supabase
    .from('blog_posts')
    .select('id, title, slug');

  if (fetchErr) {
    console.error("Error fetching posts:", fetchErr);
    return;
  }

  console.log(`Found ${posts.length} total posts.`);

  const fakeKeywords = ["the-complete-", "cyberoutreach-agent"];
  
  const postsToDelete = posts.filter(post => {
      const isTemplate = post.title.toLowerCase().includes("the complete") || 
                         post.slug.includes("the-complete-") ||
                         post.slug.includes("cyberoutreach-agent");
      return isTemplate;
  });

  console.log(`Found ${postsToDelete.length} matching auto-generated posts to delete...`);

  let count = 0;
  for (const post of postsToDelete) {
      console.log(`Deleting: ${post.title}`);
      const { error: delErr } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', post.id);
          
      if (delErr) {
          console.error(`Failed to delete ${post.id}:`, delErr);
      } else {
          count++;
      }
  }

  console.log(`Cleanup finished! Successfully deleted ${count} fake posts from the database.`);
}

cleanFakeBlogs();
