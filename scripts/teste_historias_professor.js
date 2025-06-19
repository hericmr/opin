// Script de Teste para Histórias do Professor
// Execute este script no console do navegador para testar a funcionalidade

import { 
  getHistoriasProfessor, 
  createHistoriaProfessor, 
  updateHistoriaProfessor, 
  deleteHistoriaProfessor,
  migrarDadosExistentes,
  escolaTemHistoriasProfessor
} from '../src/services/historiaProfessorService.js';

// Função para testar todas as funcionalidades
async function testarHistoriasProfessor() {
  console.log('🧪 Iniciando testes das Histórias do Professor...');
  
  const escolaId = 1; // ID de uma escola existente para teste
  
  try {
    // Teste 1: Verificar se a escola tem histórias
    console.log('\n📋 Teste 1: Verificar se a escola tem histórias');
    const temHistorias = await escolaTemHistoriasProfessor(escolaId);
    console.log(`Escola ${escolaId} tem histórias:`, temHistorias);
    
    // Teste 2: Buscar histórias existentes
    console.log('\n📋 Teste 2: Buscar histórias existentes');
    const historias = await getHistoriasProfessor(escolaId);
    console.log('Histórias encontradas:', historias);
    
    // Teste 3: Criar nova história
    console.log('\n📋 Teste 3: Criar nova história');
    const novaHistoria = await createHistoriaProfessor({
      escola_id: escolaId,
      titulo: 'História de Teste',
      historia: 'Esta é uma história de teste criada automaticamente.',
      ordem: 1,
      ativo: true
    });
    console.log('Nova história criada:', novaHistoria);
    
    // Teste 4: Atualizar história
    console.log('\n📋 Teste 4: Atualizar história');
    const historiaAtualizada = await updateHistoriaProfessor(novaHistoria.id, {
      titulo: 'História de Teste Atualizada',
      historia: 'Esta história foi atualizada com sucesso!',
      ordem: 1,
      ativo: true
    });
    console.log('História atualizada:', historiaAtualizada);
    
    // Teste 5: Verificar histórias após criação
    console.log('\n📋 Teste 5: Verificar histórias após criação');
    const historiasAtualizadas = await getHistoriasProfessor(escolaId);
    console.log('Histórias após criação:', historiasAtualizadas);
    
    // Teste 6: Deletar história de teste
    console.log('\n📋 Teste 6: Deletar história de teste');
    await deleteHistoriaProfessor(novaHistoria.id);
    console.log('História de teste deletada com sucesso');
    
    // Teste 7: Verificar histórias após deleção
    console.log('\n📋 Teste 7: Verificar histórias após deleção');
    const historiasFinais = await getHistoriasProfessor(escolaId);
    console.log('Histórias após deleção:', historiasFinais);
    
    console.log('\n✅ Todos os testes concluídos com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Função para testar migração de dados
async function testarMigracao() {
  console.log('\n🔄 Testando migração de dados...');
  
  try {
    const resultado = await migrarDadosExistentes();
    console.log('Resultado da migração:', resultado);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  }
}

// Função para verificar estrutura da tabela
async function verificarEstrutura() {
  console.log('\n🔍 Verificando estrutura da tabela...');
  
  try {
    // Teste de conexão básica
    const { supabase } = await import('../src/supabaseClient.js');
    
    // Verificar se a tabela existe
    const { data, error } = await supabase
      .from('historias_professor')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro ao acessar tabela:', error);
      return;
    }
    
    console.log('✅ Tabela historias_professor acessível');
    console.log('Estrutura da tabela:', data.length > 0 ? Object.keys(data[0]) : 'Tabela vazia');
    
    // Verificar índices
    const { data: indices, error: indicesError } = await supabase
      .rpc('get_table_indices', { table_name: 'historias_professor' });
    
    if (!indicesError) {
      console.log('Índices da tabela:', indices);
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar estrutura:', error);
  }
}

// Função para testar bucket de imagens
async function testarBucket() {
  console.log('\n🖼️ Testando bucket de imagens...');
  
  try {
    const { supabase } = await import('../src/supabaseClient.js');
    
    // Verificar se o bucket existe
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Erro ao listar buckets:', error);
      return;
    }
    
    const bucketExiste = buckets.some(bucket => bucket.name === 'historia-professor-imagens');
    console.log('Bucket historia-professor-imagens existe:', bucketExiste);
    
    if (bucketExiste) {
      // Listar arquivos no bucket
      const { data: arquivos, error: arquivosError } = await supabase.storage
        .from('historia-professor-imagens')
        .list();
      
      if (arquivosError) {
        console.error('❌ Erro ao listar arquivos:', arquivosError);
      } else {
        console.log('Arquivos no bucket:', arquivos);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar bucket:', error);
  }
}

// Função principal para executar todos os testes
async function executarTodosOsTestes() {
  console.log('🚀 Iniciando suite completa de testes...');
  
  await verificarEstrutura();
  await testarBucket();
  await testarHistoriasProfessor();
  await testarMigracao();
  
  console.log('\n🎉 Suite de testes concluída!');
}

// Exportar funções para uso no console
window.testarHistoriasProfessor = testarHistoriasProfessor;
window.testarMigracao = testarMigracao;
window.verificarEstrutura = verificarEstrutura;
window.testarBucket = testarBucket;
window.executarTodosOsTestes = executarTodosOsTestes;

// Instruções de uso
console.log(`
📖 INSTRUÇÕES DE USO:

Para executar os testes, use uma das seguintes funções no console:

1. executarTodosOsTestes() - Executa todos os testes
2. verificarEstrutura() - Verifica se a tabela existe e está acessível
3. testarBucket() - Testa se o bucket de imagens existe
4. testarHistoriasProfessor() - Testa as operações CRUD
5. testarMigracao() - Testa a migração de dados existentes

Exemplo:
> executarTodosOsTestes()
`);

// Executar verificação básica automaticamente
verificarEstrutura(); 