
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load .env then .env.local
const env = dotenv.parse(fs.readFileSync('.env'));
const envLocal = fs.existsSync('.env.local') ? dotenv.parse(fs.readFileSync('.env.local')) : {};
const config = { ...env, ...envLocal };

const supabaseUrl = config.VITE_SUPABASE_URL.startsWith('http') 
  ? config.VITE_SUPABASE_URL 
  : 'http://localhost:8080/opin'; // Fallback for local dev if relative
const supabaseKey = config.VITE_SUPABASE_ANON_KEY;

console.log('Using URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImages() {
  const { data, error } = await supabase
    .from('legendas_fotos')
    .select('id, escola_id, imagem_url, categoria, tipo_foto')
    .limit(10);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Sample Legendas:');
  console.table(data);
}

checkImages();
