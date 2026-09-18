const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');

const getEnv = (key) => {
  const match = env.match(new RegExp(^=(.*)$, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('testimonials')
    .insert({
      source: 'first_party',
      author_name: 'Test',
      email: 'test@example.com',
      author_role: 'Role',
      organization: 'Org',
      quote: 'This is a long enough quote to pass validation.',
      rating: 5,
      relationship_type: 'Student',
      status: 'pending',
      collection_token: 'dummy-token',
      consent_to_publish: true
    })
    .select()
    .single();
    
  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('SUCCESS:', data);
  }
}

check();
