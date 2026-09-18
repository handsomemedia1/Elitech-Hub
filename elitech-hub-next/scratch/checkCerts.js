const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCertificates() {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .limit(10);
    
  console.log('Error:', error);
  console.log('Data:', data);
  
  // Get count to figure out total
  const { count, error: countError } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true });
    
  console.log('Total Certificates:', count);
}

checkCertificates();
