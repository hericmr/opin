import { createClient } from "@supabase/supabase-js";

const rawUrl = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim())
  || import.meta.env.REACT_APP_API_URL
  || '';

let supabaseUrl = rawUrl;
if (supabaseUrl && supabaseUrl.startsWith('/') && typeof window !== 'undefined') {
  supabaseUrl = `${window.location.origin}${supabaseUrl}`;
}
if (!supabaseUrl && typeof window !== 'undefined') {
  supabaseUrl = window.location.origin;
}

// A API é pública (somente leitura). Interceptamos o fetch para remover os
// headers Authorization e apikey que o SDK injeta automaticamente, evitando
// que o PostgREST tente verificar JWT e retorne 401.
const supabase = createClient(supabaseUrl, 'public', {
  global: {
    fetch: (url, options = {}) => {
      const { Authorization, apikey, ...headers } = options.headers || {};
      return fetch(url, { ...options, headers });
    },
  },
  auth: { persistSession: false, autoRefreshToken: false },
});

export { supabase };
