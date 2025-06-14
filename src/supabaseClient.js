// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

console.log('=== DEBUG: Inicialização do Supabase Client ===');

// Usando variáveis de ambiente
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('=== DEBUG: Valores das variáveis ===');
console.log('supabaseUrl está definido:', !!supabaseUrl);
console.log('supabaseAnonKey está definido:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('=== ERRO: Credenciais do Supabase ausentes ===');
  console.error('supabaseUrl está ausente:', !supabaseUrl);
  console.error('supabaseAnonKey está ausente:', !supabaseAnonKey);
  console.error('Ambiente atual:', process.env.NODE_ENV);
  console.error('Todas as variáveis de ambiente REACT_APP_ disponíveis:', 
    Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
}

console.log('=== DEBUG: Criando cliente Supabase ===');
const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('Cliente Supabase criado com sucesso');

// Teste inicial de conexão com mais detalhes
console.log('=== DEBUG: Testando conexão com Supabase ===');
console.log('Tentando acessar a tabela escolas_completa...');

// Primeiro, vamos verificar se podemos listar as tabelas
supabase.from('escolas_completa').select('count').single()
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro ao acessar a tabela:', error);
      console.error('Detalhes do erro:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Se for erro de permissão, dar dica específica
      if (error.code === '42501') {
        console.error('ERRO DE PERMISSÃO: A tabela existe mas você não tem permissão para acessá-la.');
        console.error('Por favor, verifique as políticas de segurança (RLS) no painel do Supabase.');
      }
    } else {
      console.log('Conexão com a tabela estabelecida. Contagem de registros:', data);
      
      // Se conseguimos contar, vamos tentar buscar alguns dados
      return supabase.from('escolas_completa').select('*').limit(1);
    }
  })
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro ao buscar dados:', error);
    } else if (data) {
      console.log('Dados encontrados:', data);
      console.log('Estrutura da tabela:', data.length > 0 ? Object.keys(data[0]) : 'Tabela vazia');
      
      if (data.length === 0) {
        console.log('A tabela existe mas está vazia. Você precisa inserir dados nela.');
      }
    }
  })
  .catch(err => {
    console.error('Erro inesperado:', err);
  });

export { supabase };
