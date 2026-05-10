import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials not found in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
    { email: 'chidimmanwafo@gmail.com', days: ['Thursday', 'Sunday'] },
    { email: 'esthertaiwo688@gmail.com', days: ['Monday', 'Friday'] },
    { email: 'jofemi100@gmail.com', days: ['Thursday', 'Friday'] },
    { email: 'fancyishaku22@gmail.com', days: ['Monday', 'Friday'] },
    { email: 'ololadeoyekanmi@gmail.com', days: ['Tuesday', 'Thursday'] },
    { email: 'chinwenmericourage@gmail.com', days: ['Friday', 'Sunday'] },
    { email: 'cedriconyedika@gmail.com', days: ['Wednesday', 'Saturday'] }
];

async function updateWriters() {
    for (const update of updates) {
        const { error } = await supabase
            .from('writers')
            .update({ posting_days: update.days })
            .eq('email', update.email);

        if (error) {
            console.error(`Error updating ${update.email}:`, error.message);
        } else {
            console.log(`Successfully updated ${update.email} -> ${update.days.join(', ')}`);
        }
    }
}

updateWriters();
