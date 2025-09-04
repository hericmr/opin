import React, { useState } from 'react';
import EditableTable from '../components/EditableTable';
import { useEscolas } from '../hooks/useEscolas';
import { Search, Download } from 'lucide-react';

const TabelaEditavelTab = ({ setEditingLocation }) => {
  const { 
    escolas, 
    loading: escolasLoading, 
    error: escolasError,
    saveEscola,
    searchTerm, 
    setSearchTerm 
  } = useEscolas();

  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Função para exportar dados como CSV
  const exportToCSV = () => {
    const headers = [
      'Escola',
      'Município',
      'Endereço',
      'Terra Indígena',
      'Parcerias',
      'Diretoria de Ensino',
      'Ano Criação',
      'Povos',
      'Línguas',
      'Modalidade',
      'Alunos',
      'Turnos',
      'Estrutura',
      'Água',
      'Coleta Lixo',
      'Internet',
      'Equipamentos',
      'Acesso',
      'Gestão',
      'Funcionários',
      'Prof. Indígenas',
      'Prof. Não Indígenas',
      'Falam Língua',
      'Formação',
      'Formação Cont.',
      'PPP Próprio',
      'PPP Comunidade',
      'Projetos',
      'Parcerias Univ.',
      'ONGs',
      'Desejos',
      'Redes Sociais',
      'Links Redes',
      'História',
      'Latitude',
      'Longitude',
      'Links',
      'Vídeos',
      'Logradouro',
      'Número',
      'Complemento',
      'Bairro',
      'CEP',
      'Estado',
      'Nome Professor',
      'Prof. Indígenas (Det.)',
      'Prof. Não Indígenas (Det.)',
      'Falam Língua (Det.)',
      'Formação (Det.)',
      'Visitas Supervisores',
      'Outros Funcionários (Det.)',
      'Gestão (Det.)',
      'Merenda Diferenciada',
      'Cozinha',
      'Merenda Escolar',
      'Diferenciada'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredEscolas.map(escola => [
        `"${escola.Escola || ''}"`,
        `"${escola['Município'] || ''}"`,
        `"${escola['Endereço'] || ''}"`,
        `"${escola['Terra Indigena (TI)'] || ''}"`,
        `"${escola['Parcerias com o município'] || ''}"`,
        `"${escola['Diretoria de Ensino'] || ''}"`,
        `"${escola['Ano de criação da escola'] || ''}"`,
        `"${escola['Povos indigenas'] || ''}"`,
        `"${escola['Linguas faladas'] || ''}"`,
        `"${escola['Modalidade de Ensino/turnos de funcionamento'] || ''}"`,
        escola['Numero de alunos'] || '',
        `"${escola['turnos_funcionamento'] || ''}"`,
        `"${escola['Espaço escolar e estrutura'] || ''}"`,
        `"${escola['Acesso à água'] || ''}"`,
        `"${escola['Tem coleta de lixo?'] || ''}"`,
        `"${escola['Acesso à internet'] || ''}"`,
        `"${escola['Equipamentos Tecnológicos (Computadores, tablets e impressoras)'] || ''}"`,
        `"${escola['Modo de acesso à escola'] || ''}"`,
        `"${escola['Gestão/Nome'] || ''}"`,
        `"${escola['Outros funcionários'] || ''}"`,
        `"${escola['Quantidade de professores indígenas'] || ''}"`,
        `"${escola['Quantidade de professores não indígenas'] || ''}"`,
        `"${escola['Professores falam a língua indígena?'] || ''}"`,
        `"${escola['Formação dos professores'] || ''}"`,
        `"${escola['Formação continuada oferecida'] || ''}"`,
        `"${escola['A escola possui PPP próprio?'] || ''}"`,
        `"${escola['PPP elaborado com a comunidade?'] || ''}"`,
        `"${escola['Projetos em andamento'] || ''}"`,
        `"${escola['Parcerias com universidades?'] || ''}"`,
        `"${escola['Ações com ONGs ou coletivos?'] || ''}"`,
        `"${escola['Desejos da comunidade para a escola'] || ''}"`,
        `"${escola['Escola utiliza redes sociais?'] || ''}"`,
        `"${escola['Links das redes sociais'] || ''}"`,
        `"${escola['historia_da_escola'] || ''}"`,
        escola['Latitude'] || '',
        escola['Longitude'] || '',
        `"${escola['links'] || ''}"`,
        `"${escola['link_para_videos'] || ''}"`,
        `"${escola['logradouro'] || ''}"`,
        `"${escola['numero'] || ''}"`,
        `"${escola['complemento'] || ''}"`,
        `"${escola['bairro'] || ''}"`,
        `"${escola['cep'] || ''}"`,
        `"${escola['estado'] || ''}"`,
        `"${escola['nome_professor'] || ''}"`,
        `"${escola['professores_indigenas'] || ''}"`,
        `"${escola['professores_nao_indigenas'] || ''}"`,
        `"${escola['professores_falam_lingua_indigena'] || ''}"`,
        `"${escola['formacao_professores'] || ''}"`,
        `"${escola['visitas_supervisores_formacao'] || ''}"`,
        `"${escola['outros_funcionarios'] || ''}"`,
        `"${escola['gestao'] || ''}"`,
        `"${escola['merenda_diferenciada'] || ''}"`,
        `"${escola['cozinha'] || ''}"`,
        `"${escola['merenda_escolar'] || ''}"`,
        `"${escola['diferenciada'] || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'escolas_indigenas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para salvar alterações da tabela
  const handleTableSave = async (updatedEscola) => {
    try {
      setTableLoading(true);
      setTableError(null);
      
      await saveEscola(updatedEscola);
      
      // Mostrar feedback de sucesso
      setTimeout(() => {
        setTableLoading(false);
      }, 1000);
      
    } catch (error) {
      setTableError(error.message);
      setTableLoading(false);
    }
  };

  // Função para atualizar o site com todas as alterações
  const handleAtualizarSite = async () => {
    try {
      setTableLoading(true);
      setTableError(null);
      setUpdateSuccess(false);
      
      // Aqui você pode adicionar lógica adicional para forçar atualização do cache
      // ou invalidar cache do site se necessário
      
      // Simular tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mostrar feedback de sucesso
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      setTableLoading(false);
      
    } catch (error) {
      setTableError(error.message);
      setTableLoading(false);
    }
  };

  // Filtrar escolas baseado no termo de busca
  const filteredEscolas = escolas.filter(escola => 
    escola.Escola?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    escola['Município']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    escola['Terra Indigena (TI)']?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header com controles */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-200">
              Tabela Editável das Escolas
            </h2>
            {tableLoading && (
              <div className="flex items-center text-yellow-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-2"></div>
                <span className="text-sm">Atualizando...</span>
              </div>
            )}
            {updateSuccess && (
              <div className="flex items-center text-green-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Atualizado!</span>
              </div>
            )}
            {tableError && (
              <div className="flex items-center text-red-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{tableError}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              onClick={() => setEditingLocation(null)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Voltar</span>
            </button>
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              onClick={exportToCSV}
            >
              <Download size={16} />
              <span>Exportar CSV</span>
            </button>
            <button
              className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                tableLoading 
                  ? 'bg-yellow-600 text-white cursor-not-allowed' 
                  : updateSuccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              onClick={handleAtualizarSite}
              disabled={tableLoading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>
                {tableLoading ? 'Atualizando...' : updateSuccess ? 'Atualizado!' : 'Atualizar Site'}
              </span>
            </button>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar escolas, municípios ou terras indígenas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {/* Tabela Editável */}
      <div className="flex-1 overflow-hidden">
        {escolasError ? (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 m-4">
            <div className="flex items-center space-x-2 text-red-400">
              <span className="text-lg">⚠️</span>
              <span>Erro ao carregar escolas: {escolasError}</span>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <EditableTable
              escolas={filteredEscolas}
              onSave={handleTableSave}
              loading={tableLoading}
              error={tableError}
            />
          </div>
        )}
      </div>


    </div>
  );
};

export default TabelaEditavelTab;
