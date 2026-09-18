const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');

const getEnv = (key) => {
  const match = env.match(new RegExp(^=(.*)$, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('testimonial_collection_requests')
    .insert([{
      recipient_name: 'Test',
      recipient_email: 'test@example.com',
      relationship_type: 'Student',
      context: 'Test Context',
      status: 'active'
    }])
    .select()
    .single();
    
  if (error) {
    console.error('CLIENT ERROR:', error);
  } else {
    console.log('CLIENT SUCCESS:', data);
  }
}

check();
