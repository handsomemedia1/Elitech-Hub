const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if (parts.length > 1) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/['"]/g, '');
    acc[key] = val;
  }
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  console.log('Checking for site_settings table...');
  const { data, error } = await supabase.from('site_settings').select('*');
  console.log('Result:', data, error);
  if (error && error.code === '42P01') {
    console.log('Table site_settings does not exist.');
  }
}

run();
