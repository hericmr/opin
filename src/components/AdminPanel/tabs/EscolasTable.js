import React, { useState } from 'react';
import { Download, Eye, RefreshCw, Database, AlertCircle } from 'lucide-react';
import { supabase } from '../../../dbClient';
import logger from '../../../utils/logger';

const EscolasTable = ({ tabelas, loading }) => {
  const [selectedTabela, setSelectedTabela] = useState(null);
  const [dadosTabela, setDadosTabela] = useState([]);
  const [loadingDados, setLoadingDados] = useState(false);
  const [error, setError] = useState(null);

  const carregarDadosTabela = async (tabelaId) => {
    try {
      setLoadingDados(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from(tabelaId)
        .select('*')
        .order('id', { ascending: true });

      if (queryError) throw queryError;

      setDadosTabela(data || []);
      setSelectedTabela(tabelaId);
    } catch (err) {
      logger.error(`Erro ao carregar dados da tabela ${tabelaId}:`, err);
      setError(`Erro ao carregar dados: ${err.message}`);
    } finally {
      setLoadingDados(false);
    }
  };

  const downloadCSV = (tabelaId, dados) => {
    if (!dados || dados.length === 0) {
      alert('Nenhum dado para baixar');
      return;
    }

    const headers = Object.keys(dados[0]);
    const csvContent = [
      headers.join(','),
      ...dados.map(row =>
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${tabelaId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = (tabelaId, dados) => {
    if (!dados || dados.length === 0) {
      alert('Nenhum dado para baixar');
      return;
    }

    const jsonContent = JSON.stringify(dados, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${tabelaId}_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-lg">Carregando tabelas...</div>
      </div>
    );
  }

  return (
    <>
      {/* Lista de Tabelas */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
        <h4 className="text-lg font-semibold text-gray-100 mb-6 flex items-center gap-2">
          <Database className="w-5 h-5 text-gray-400" />
          Tabelas do Sistema
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabelas.map((tabela) => {
            const Icone = tabela.icone;
            const isSelected = selectedTabela === tabela.id;

            return (
              <div
                key={tabela.id}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? 'border-green-500/50 bg-green-600/20'
                    : 'border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-700/30'
                }`}
                onClick={() => carregarDadosTabela(tabela.id)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`${tabela.cor} p-3 rounded-lg mr-3 shadow-lg`}>
                      <Icone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-100">{tabela.nome}</h4>
                      <p className="text-sm text-gray-400">{tabela.registros} registros</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">{tabela.descricao}</p>

                  <div className="flex space-x-2">
                    <button
                      className="flex items-center px-3 py-2 text-xs bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-500/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        carregarDadosTabela(tabela.id);
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Visualizar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visualização dos Dados */}
      {selectedTabela && (
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-100">
                Dados da Tabela: {tabelas.find(t => t.id === selectedTabela)?.nome}
              </h4>
              <p className="text-sm text-gray-400">
                {dadosTabela.length} registros encontrados
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => carregarDadosTabela(selectedTabela)}
                disabled={loadingDados}
                className="flex items-center px-4 py-2 text-sm bg-gray-700/50 text-gray-200 rounded-lg hover:bg-gray-600/50 transition-colors disabled:opacity-50 border border-gray-600/50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </button>

              <button
                onClick={() => downloadCSV(selectedTabela, dadosTabela)}
                disabled={loadingDados || dadosTabela.length === 0}
                className="flex items-center px-4 py-2 text-sm bg-green-600/20 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors disabled:opacity-50 border border-green-500/30"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </button>

              <button
                onClick={() => downloadJSON(selectedTabela, dadosTabela)}
                disabled={loadingDados || dadosTabela.length === 0}
                className="flex items-center px-4 py-2 text-sm bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors disabled:opacity-50 border border-purple-500/30"
              >
                <Download className="w-4 h-4 mr-2" />
                JSON
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 text-red-200 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {loadingDados ? (
            <div className="flex items-center justify-center h-32">
              <span className="ml-3 text-gray-400">Carregando dados...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {dadosTabela.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/30">
                    <tr>
                      {Object.keys(dadosTabela[0]).map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/20 divide-y divide-gray-700">
                    {dadosTabela.slice(0, 100).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 max-w-xs truncate"
                            title={typeof value === 'string' && value.length > 50 ? value : ''}
                          >
                            {typeof value === 'string' && value.length > 50
                              ? `${value.substring(0, 50)}...`
                              : value || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-gray-500" />
                  </div>
                  <p>Nenhum dado encontrado nesta tabela</p>
                </div>
              )}

              {dadosTabela.length > 100 && (
                <div className="mt-6 text-center text-sm text-gray-400 bg-gray-700/20 p-4 rounded-lg">
                  Mostrando os primeiros 100 registros de {dadosTabela.length} total.
                  Use os botões de download para acessar todos os dados.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EscolasTable;
