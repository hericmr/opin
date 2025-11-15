// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

console.log('=== DEBUG: Inicialização do Supabase Client ===');

// Usando variáveis de ambiente (compatível com Vite e CRA)
// Prioriza VITE_*, mas faz fallback para REACT_APP_* se VITE_* estiver vazio ou não definido
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL.trim()) 
  || import.meta.env.REACT_APP_SUPABASE_URL 
  || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY.trim())
  || import.meta.env.REACT_APP_SUPABASE_ANON_KEY
  || '';

console.log('=== DEBUG: Valores das variáveis ===');
console.log('supabaseUrl está definido:', !!supabaseUrl);
console.log('supabaseAnonKey está definido:', !!supabaseAnonKey);

// Verificar se as credenciais são válidas (não são apenas placeholders)
const isUrlPlaceholder = supabaseUrl && (supabaseUrl.includes('seu-projeto') || supabaseUrl === 'https://seu-projeto.supabase.co');
const isKeyPlaceholder = supabaseAnonKey && supabaseAnonKey.includes('sua_chave_anonima');

if (!supabaseUrl || !supabaseAnonKey || isUrlPlaceholder || isKeyPlaceholder) {
  console.error('=== ERRO: Credenciais do Supabase ausentes ou inválidas ===');
  console.error('supabaseUrl está ausente:', !supabaseUrl);
  console.error('supabaseAnonKey está ausente:', !supabaseAnonKey);
  console.error('supabaseUrl é placeholder:', isUrlPlaceholder);
  console.error('supabaseAnonKey é placeholder:', isKeyPlaceholder);
  console.error('Ambiente atual:', import.meta.env.MODE || import.meta.env.NODE_ENV);
  console.error('\n=== INSTRUÇÕES PARA RESOLVER ===');
  console.error('1. Verifique se o arquivo .env.local existe na raiz do projeto');
  console.error('2. Preencha as seguintes variáveis com suas credenciais reais do Supabase:');
  console.error('   - REACT_APP_SUPABASE_URL (encontrada em Settings > API > Project URL)');
  console.error('   - REACT_APP_SUPABASE_ANON_KEY (encontrada em Settings > API > anon public)');
  console.error('3. Reinicie o servidor de desenvolvimento (npm start) após alterar o arquivo .env.local');
  console.error('\nTodas as variáveis de ambiente REACT_APP_ disponíveis:', 
    Object.keys(import.meta.env).filter(key => key.startsWith('REACT_APP_') || key.startsWith('VITE_')));
}

console.log('=== DEBUG: Criando cliente Supabase ===');
const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('Cliente Supabase criado com sucesso');

// Teste inicial de conexão com mais detalhes (não bloqueante)
// Executar de forma assíncrona e não bloquear a inicialização
setTimeout(() => {
  console.log('=== DEBUG: Testando conexão com Supabase ===');
  console.log('Tentando acessar a tabela escolas_completa...');

  // Primeiro, vamos verificar se podemos listar as tabelas
  supabase.from('escolas_completa').select('count').single()
    .then(({ data, error }) => {
      if (error) {
        // Não logar como erro crítico, apenas como aviso
        console.warn('Aviso ao testar conexão com a tabela:', error.message || error);
        
        // Se for erro de permissão, dar dica específica
        if (error.code === '42501') {
          console.warn('AVISO DE PERMISSÃO: A tabela existe mas você não tem permissão para acessá-la.');
          console.warn('Por favor, verifique as políticas de segurança (RLS) no painel do Supabase.');
        }
      } else {
        console.log('Conexão com a tabela estabelecida. Contagem de registros:', data);
        
        // Se conseguimos contar, vamos tentar buscar alguns dados
        return supabase.from('escolas_completa').select('*').limit(1);
      }
    })
    .then((result) => {
      if (result) {
        const { data, error } = result;
        if (error) {
          console.warn('Aviso ao buscar dados de teste:', error.message || error);
        } else if (data) {
          console.log('Dados de teste encontrados:', data.length > 0 ? 'OK' : 'Tabela vazia');
        }
      }
    })
    .catch(err => {
      // Não bloquear por erros de teste
      console.warn('Aviso no teste de conexão (não crítico):', err.message || err);
    });
}, 1000); // Aguardar 1 segundo antes de testar

export { supabase };
