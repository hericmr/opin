// dbClient.js
import { createClient } from "@supabase/supabase-js";

// Usando variáveis de ambiente (compatível com Vite e CRA)
const rawUrl = (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL.trim())
  || import.meta.env.REACT_APP_SUPABASE_URL
  || '';

const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY.trim())
  || import.meta.env.REACT_APP_SUPABASE_ANON_KEY
  || '';

// Tratamento para URLs relativas (comum em Docker/Nginx Proxy)
// O SDK do Supabase exige uma URL absoluta (http/https). 
// Se a URL começar com '/', anexamos o origin atual do navegador.
let supabaseUrl = rawUrl;
if (supabaseUrl && supabaseUrl.startsWith('/') && typeof window !== 'undefined') {
  supabaseUrl = `${window.location.origin}${supabaseUrl}`;
}

// Se não houver URL, tenta um fallback seguro para não quebrar a compilação
if (!supabaseUrl && typeof window !== 'undefined') {
    supabaseUrl = `${window.location.origin}/opin`;
}

console.log('=== Banco de Dados: Inicialização ===');
console.log('URL Base detectada:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
