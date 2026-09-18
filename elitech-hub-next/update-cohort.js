const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

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

supabase.from('site_settings').update({ setting_value: { month: 'September', seats: '10', year: '2026' } }).eq('setting_key', 'elitechub_cohort').then(res => {
  console.log('Updated cohort to September');
});
