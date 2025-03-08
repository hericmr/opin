// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // ex.: "https://xyzcompany.supabase.co"
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY; // chave anônima do projeto

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
