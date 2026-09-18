const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
let supabaseUrl = '';
let supabaseKey = '';
env.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) supabaseKey = line.split('=')[1].trim();
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('testimonials').select('*').limit(1);
  if (error) console.error(error);
  else console.log(Object.keys(data[0] || {}));
}
run();
