import React, { useState } from 'react';
import { addLegendaFoto, updateLegendaFoto, getLegendaByImageUrl, testLegendasTable } from '../services/legendasService';

const TestLegendas = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { timestamp, message, type }]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addLog('=== INICIANDO TESTES DE LEGENDAS ===', 'header');
      
      // Teste 1: Verificar estrutura da tabela
      addLog('Teste 1: Verificando estrutura da tabela...');
      await testLegendasTable();
      addLog('✅ Teste da estrutura da tabela concluído');
      
      // Teste 2: Tentar criar uma legenda de teste
      addLog('Teste 2: Criando legenda de teste...');
      const testLegenda = {
        escola_id: 1,
        imagem_url: 'test/test-image.jpg',
        legenda: 'Legenda de teste',
        descricao_detalhada: 'Descrição detalhada de teste',
        autor_foto: 'Teste Autor',
        data_foto: '2024-01-01',
        categoria: 'teste',
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const novaLegenda = await addLegendaFoto(testLegenda);
      addLog(`✅ Legenda criada com ID: ${novaLegenda.id}`);
      
      // Teste 3: Buscar a legenda criada
      addLog('Teste 3: Buscando legenda criada...');
      const legendaEncontrada = await getLegendaByImageUrl('test/test-image.jpg', 1);
      if (legendaEncontrada) {
        addLog(`✅ Legenda encontrada: ${legendaEncontrada.legenda}`);
      } else {
        addLog('❌ Legenda não encontrada', 'error');
      }
      
      // Teste 4: Atualizar a legenda
      addLog('Teste 4: Atualizando legenda...');
      const updateData = {
        legenda: 'Legenda atualizada',
        updated_at: new Date().toISOString()
      };
      
      const legendaAtualizada = await updateLegendaFoto(novaLegenda.id, updateData);
      addLog(`✅ Legenda atualizada: ${legendaAtualizada.legenda}`);
      
      // Teste 5: Verificar se a atualização foi salva
      addLog('Teste 5: Verificando se a atualização foi salva...');
      const legendaVerificada = await getLegendaByImageUrl('test/test-image.jpg', 1);
      if (legendaVerificada && legendaVerificada.legenda === 'Legenda atualizada') {
        addLog('✅ Atualização salva corretamente');
      } else {
        addLog('❌ Atualização não foi salva corretamente', 'error');
      }
      
      addLog('=== TESTES CONCLUÍDOS COM SUCESSO ===', 'success');
      
    } catch (error) {
      addLog(`❌ ERRO NOS TESTES: ${error.message}`, 'error');
      console.error('Erro nos testes:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Teste de Funcionalidade de Legendas</h2>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mr-4"
        >
          {loading ? 'Executando Testes...' : 'Executar Testes'}
        </button>
        
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Limpar Logs
        </button>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
        <h3 className="font-semibold mb-2">Logs dos Testes:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500">Nenhum teste executado ainda.</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className={`text-sm font-mono ${
                result.type === 'error' ? 'text-red-600' :
                result.type === 'success' ? 'text-green-600' :
                result.type === 'header' ? 'text-blue-600 font-bold' :
                'text-gray-800'
              }`}>
                [{result.timestamp}] {result.message}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Instruções:</h4>
        <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
          <li>Clique em "Executar Testes" para verificar se a funcionalidade de legendas está funcionando</li>
          <li>Verifique os logs para identificar possíveis problemas</li>
          <li>Se houver erros, execute o script SQL no Supabase para corrigir a estrutura da tabela</li>
          <li>Teste novamente após corrigir problemas no banco de dados</li>
        </ol>
      </div>
    </div>
  );
};

export default TestLegendas; 