require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
  const { data: tables, error } = await supabase.from('information_schema.tables').select('table_name').eq('table_schema', 'public');
  if (error) {
    console.error("Error fetching tables", error);
  } else {
    console.log("Tables:", tables.map(t => t.table_name));
    
    for (const table of tables) {
      const { data } = await supabase.from(table.table_name).select('*').limit(1);
      console.log(`Table ${table.table_name} sample:`, data);
    }
  }
}

test();
