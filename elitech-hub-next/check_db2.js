const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
let supabaseUrl = '';
let supabaseKey = '';
env.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.substring(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '');
  }
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    supabaseKey = line.substring(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '');
  }
});

console.log('URL:', supabaseUrl);

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('testimonials').select('*').limit(1);
  if (error) console.error(error);
  else {
    console.log('COLUMNS:', data.length > 0 ? Object.keys(data[0]) : 'Empty table');
    
    // Now test the exact insert we are trying to do:
    const { error: insError } = await supabase.from('testimonials').insert({
        source: 'first_party',
        author_name: 'Test',
        email: 'test@test.com',
        author_role: 'Role',
        organization: 'Org',
        quote: 'This is a test quote that is longer than twenty characters.',
        rating: 5,
        relationship_type: 'Student',
        relationship_context: 'Context',
        status: 'pending',
        collection_token: 'cfd14c81-a4ae-434a-b560-64428e565bc8',
        consent_to_publish: true,
        consent_to_use_name: true,
        consent_to_use_photo: true,
        consent_to_use_organization: true,
        is_published: false
    }).select().single();
    
    if (insError) console.error('INSERT ERROR:', insError);
    else console.log('INSERT SUCCESS');
  }
}
run();
