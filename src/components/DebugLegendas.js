import React, { useState } from 'react';
import { testLegendasTable, getLegendaByImageUrl, addLegendaFoto, updateLegendaFoto } from '../services/legendasService';
import { supabase } from '../supabaseClient';

const DebugLegendas = ({ escolaId }) => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [testImageUrl, setTestImageUrl] = useState('');
  const [testLegenda, setTestLegenda] = useState('');

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Teste 1: Verificar se a tabela existe
      console.log('🔍 Testando se a tabela legendas_fotos existe...');
      const tableExists = await testLegendasTable();
      results.tableExists = tableExists;
      console.log('✅ Tabela existe:', tableExists);

      // Teste 2: Verificar estrutura da tabela
      if (tableExists) {
        console.log('🔍 Verificando estrutura da tabela...');
        const { data: structure, error: structureError } = await supabase // structure não usado
          .from('legendas_fotos')
          .select('*')
          .limit(1);
        
        if (structureError) {
          results.structureError = structureError.message;
          console.error('❌ Erro na estrutura:', structureError);
        } else {
          results.structureOk = true;
          console.log('✅ Estrutura OK');
        }
      }

      // Teste 3: Tentar buscar uma legenda existente
      if (escolaId && testImageUrl) {
        console.log('🔍 Testando busca de legenda...');
        const legenda = await getLegendaByImageUrl(testImageUrl, escolaId, 'escola');
        results.legendaFound = legenda;
        console.log('✅ Legenda encontrada:', legenda);
      }

      // Teste 4: Tentar criar uma legenda de teste
      if (escolaId && testImageUrl && testLegenda) {
        console.log('🔍 Testando criação de legenda...');
        const novaLegenda = await addLegendaFoto({
          escola_id: escolaId,
          imagem_url: testImageUrl,
          legenda: testLegenda,
          categoria: 'teste',
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tipo_foto: 'escola'
        });
        results.legendaCreated = novaLegenda;
        console.log('✅ Legenda criada:', novaLegenda);

        // Teste 5: Tentar atualizar a legenda criada
        if (novaLegenda && novaLegenda.id) {
          console.log('🔍 Testando atualização de legenda...');
          const legendaAtualizada = await updateLegendaFoto(novaLegenda.id, {
            legenda: testLegenda + ' - Atualizada',
            updated_at: new Date().toISOString()
          });
          results.legendaUpdated = legendaAtualizada;
          console.log('✅ Legenda atualizada:', legendaAtualizada);
        }
      }

    } catch (error) {
      console.error('❌ Erro nos testes:', error);
      results.error = error.message;
      results.errorDetails = {
        name: error.name,
        code: error.code,
        details: error.details,
        hint: error.hint
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">🔧 Debug do Sistema de Legendas</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Escola ID:
          </label>
          <input
            type="text"
            value={escolaId || ''}
            readOnly
            className="w-full p-2 border rounded bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            URL da Imagem para Teste:
          </label>
          <input
            type="text"
            value={testImageUrl}
            onChange={(e) => setTestImageUrl(e.target.value)}
            placeholder="Ex: 123/imagem.jpg"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Legenda para Teste:
          </label>
          <input
            type="text"
            value={testLegenda}
            onChange={(e) => setTestLegenda(e.target.value)}
            placeholder="Ex: Imagem de teste"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={runTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Executar Testes'}
        </button>

        {Object.keys(testResults).length > 0 && (
          <div className="mt-4 p-4 bg-white rounded border">
            <h4 className="font-semibold mb-2">Resultados dos Testes:</h4>
            <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugLegendas;
