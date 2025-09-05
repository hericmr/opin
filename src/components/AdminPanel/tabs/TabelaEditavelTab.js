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
      ...escolas.map(escola => [
        `"${escola.nome_escola || ''}"`,
        `"${escola.municipio || ''}"`,
        `"${escola.endereco || ''}"`,
        `"${escola.terra_indigena || ''}"`,
        `"${escola.parcerias || ''}"`,
        `"${escola.diretoria_ensino || ''}"`,
        `"${escola.ano_criacao || ''}"`,
        `"${escola.povos || ''}"`,
        `"${escola.linguas || ''}"`,
        `"${escola.modalidade || ''}"`,
        `"${escola.numero_alunos || ''}"`,
        `"${escola.turnos || ''}"`,
        `"${escola.estrutura || ''}"`,
        `"${escola.agua || ''}"`,
        `"${escola.coleta_lixo || ''}"`,
        `"${escola.internet || ''}"`,
        `"${escola.equipamentos || ''}"`,
        `"${escola.acesso || ''}"`,
        `"${escola.gestao || ''}"`,
        `"${escola.funcionarios || ''}"`,
        `"${escola.professores_indigenas || ''}"`,
        `"${escola.professores_nao_indigenas || ''}"`,
        `"${escola.falam_lingua_indigena || ''}"`,
        `"${escola.formacao_professores || ''}"`,
        `"${escola.formacao_continuada || ''}"`,
        `"${escola.ppp_proprio || ''}"`,
        `"${escola.ppp_comunidade || ''}"`,
        `"${escola.projetos || ''}"`,
        `"${escola.parcerias_universidades || ''}"`,
        `"${escola.parcerias_ongs || ''}"`,
        `"${escola.desejos_comunidade || ''}"`,
        `"${escola.redes_sociais || ''}"`,
        `"${escola.links_redes_sociais || ''}"`,
        `"${escola.historia_escola || ''}"`,
        `"${escola.latitude || ''}"`,
        `"${escola.longitude || ''}"`,
        `"${escola.links_uteis || ''}"`,
        `"${escola.link_para_videos || ''}"`,
        `"${escola.logradouro || ''}"`,
        `"${escola.numero || ''}"`,
        `"${escola.complemento || ''}"`,
        `"${escola.bairro || ''}"`,
        `"${escola.cep || ''}"`,
        `"${escola.estado || ''}"`,
        `"${escola.nome_professor || ''}"`,
        `"${escola.professores_indigenas_detalhado || ''}"`,
        `"${escola.professores_nao_indigenas_detalhado || ''}"`,
        `"${escola.falam_lingua_indigena_detalhado || ''}"`,
        `"${escola.formacao_professores_detalhado || ''}"`,
        `"${escola.visitas_supervisores || ''}"`,
        `"${escola.outros_funcionarios_detalhado || ''}"`,
        `"${escola.gestao_detalhado || ''}"`,
        `"${escola.merenda_diferenciada || ''}"`,
        `"${escola.cozinha || ''}"`,
        `"${escola.merenda_escolar || ''}"`,
        `"${escola.merenda_diferenciada_detalhado || ''}"`
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

  // Filtrar escolas baseado no termo de busca
  const filteredEscolas = escolas.filter(escola => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      escola.nome_escola?.toLowerCase().includes(term) ||
      escola.municipio?.toLowerCase().includes(term) ||
      escola.terra_indigena?.toLowerCase().includes(term) ||
      escola.povos?.toLowerCase().includes(term) ||
      escola.linguas?.toLowerCase().includes(term)
    );
  });

  // Função para salvar alterações na tabela
  const handleTableSave = async (escolaId, updatedData) => {
    try {
      setTableLoading(true);
      setTableError(null);
      
      await saveEscola(escolaId, updatedData);
      
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      
    } catch (error) {
      console.error('Erro ao salvar escola:', error);
      setTableError(error.message);
    } finally {
      setTableLoading(false);
    }
  };

  if (escolasLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-400">Carregando escolas...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-800">
      {/* Cabeçalho */}
      <div className="flex-shrink-0 p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Tabela Editável
            </h2>
            <p className="text-gray-400">
              Edite os dados das escolas diretamente na tabela
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {updateSuccess && (
              <div className="text-green-400 text-sm">
                ✓ Dados salvos com sucesso!
              </div>
            )}
            
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download size={16} />
              <span>Exportar CSV</span>
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
