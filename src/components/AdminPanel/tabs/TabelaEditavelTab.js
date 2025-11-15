import React, { useState, useMemo, useEffect } from 'react';
import EditableTable from '../components/EditableTable';
import { useEscolas } from '../hooks/useEscolas';
import { Download, Search, X, ArrowLeft } from 'lucide-react';
import logger from '../../../utils/logger';

const TabelaEditavelTab = ({ setEditingLocation, onShowMetadadosModal }) => {
  const { 
    escolas, 
    loading: escolasLoading, 
    error: escolasError,
    saveEscola
  } = useEscolas();

  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Controle de tamanho do texto (reutilizando lógica do MapSelector)
  const [textScale, setTextScale] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('opin:textScale') : null;
    return stored ? parseFloat(stored) : 1;
  });

  useEffect(() => {
    const clamped = Math.min(1.3, Math.max(0.9, textScale));
    if (clamped !== textScale) {
      setTextScale(clamped);
      return;
    }
    const base = 16;
    document.documentElement.style.fontSize = `${base * clamped}px`;
    try {
      localStorage.setItem('opin:textScale', String(clamped));
    } catch {}
  }, [textScale]);

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


  // Função para salvar alterações na tabela
  const handleTableSave = async (updatedData, campoAlterado) => {
    try {
      setTableLoading(true);
      setTableError(null);
      
      // Salvar escola sem metadados (metadados serão salvos depois no modal)
      const result = await saveEscola(updatedData, null);
      
      if (result.success) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
        
        // Preparar dados para o modal de metadados
        if (onShowMetadadosModal && campoAlterado) {
          const camposAlterados = [{
            campo: campoAlterado.campo,
            valorAntigo: campoAlterado.valorAntigo || '',
            valorNovo: campoAlterado.valorNovo || '',
            label: campoAlterado.label || campoAlterado.campo
          }];
          
          onShowMetadadosModal(
            updatedData.id || result.data.id,
            updatedData.Escola || 'Escola',
            camposAlterados
          );
        }
      } else {
        setTableError(result.error || 'Erro ao salvar escola');
      }
      
    } catch (error) {
      logger.error('Erro ao salvar escola:', error);
      setTableError(error.message);
    } finally {
      setTableLoading(false);
    }
  };

  // Filtrar escolas baseado na busca
  const filteredEscolas = useMemo(() => {
    if (!searchTerm.trim()) return escolas;
    
    const term = searchTerm.toLowerCase();
    return escolas.filter(escola => 
      escola.Escola?.toLowerCase().includes(term) ||
      escola['Município']?.toLowerCase().includes(term) ||
      escola['Endereço']?.toLowerCase().includes(term) ||
      escola['Terra Indigena (TI)']?.toLowerCase().includes(term)
    );
  }, [escolas, searchTerm]);

  if (escolasLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <span className="text-gray-400">Carregando escolas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Cabeçalho Simplificado - Tudo em uma linha */}
      <div className="flex-shrink-0 bg-gray-800 border-b-2 border-gray-600">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Botão Voltar */}
            <button
              onClick={() => setEditingLocation(null)}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
              title="Voltar ao painel principal"
            >
              <ArrowLeft size={16} />
              <span>Voltar</span>
            </button>

            {/* Título */}
            <div className="flex-shrink-0">
              <h2 className="text-lg font-semibold text-white leading-normal">
                Edição em Tabela
              </h2>
              <p className="text-xs text-gray-400 leading-normal mt-0.5">
                Clique em qualquer célula para editar
              </p>
            </div>

            {/* Barra de Busca - Compacta */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar escola, município..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-8 py-2.5 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Contador de resultados (se houver busca) */}
            {searchTerm && (
              <div className="text-xs text-gray-400 whitespace-nowrap">
                {filteredEscolas.length} de {escolas.length}
              </div>
            )}

            {/* Status de sucesso */}
            {updateSuccess && (
              <div className="flex items-center gap-1.5 px-2.5 py-2.5 bg-green-900/30 border border-green-700/50 rounded-lg text-green-400 text-xs whitespace-nowrap">
                <span>✓</span>
                <span>Salvo</span>
              </div>
            )}

            {/* Botão Ajuste de Texto */}
            <button
              type="button"
              onClick={() => setTextScale((v) => (v >= 1.3 ? 1.0 : Math.round((v + 0.15) * 100) / 100))}
              className="flex items-center gap-1.5 px-2.5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Ajustar tamanho do texto"
              title={`Tamanho do texto: ${Math.round(textScale * 100)}%`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.6117 5.00684C6.86862 5.02589 7.11696 5.11134 7.3324 5.25488C7.57862 5.41908 7.77125 5.65263 7.88514 5.92578L11.9232 15.6162C12.1352 16.1258 11.8947 16.7115 11.3851 16.9238C10.8755 17.1362 10.2901 16.8942 10.0775 16.3848L9.08338 14H3.91736L2.92322 16.3857C2.71049 16.8948 2.12502 17.1359 1.6156 16.9238C1.10605 16.7114 0.865522 16.1258 1.07752 15.6162L5.11658 5.92578L5.16248 5.8252C5.27895 5.59518 5.45376 5.39859 5.66932 5.25488L5.76307 5.19727C5.98766 5.07035 6.24213 5.00195 6.50135 5.00195L6.6117 5.00684ZM4.75135 12H8.25037L6.50037 7.80176L4.75135 12Z" fill="#CDE8CF"></path>
                <path d="M18.0209 6.00098C18.0385 6.00133 18.0561 6.00165 18.0736 6.00293C18.0913 6.00421 18.1089 6.00562 18.1263 6.00781C18.1434 6.00996 18.1602 6.01358 18.1771 6.0166C18.1869 6.01835 18.1968 6.01946 18.2064 6.02148C18.234 6.02726 18.2614 6.03388 18.2885 6.04199C18.2921 6.04309 18.2956 6.04476 18.2992 6.0459C18.317 6.05145 18.3344 6.05789 18.3519 6.06445C18.368 6.07049 18.3841 6.07618 18.3998 6.08301C18.5114 6.13159 18.6161 6.20168 18.7074 6.29297L22.7074 10.293C23.0977 10.6835 23.0979 11.3166 22.7074 11.707C22.3169 12.0975 21.6839 12.0973 21.2933 11.707L19.0004 9.41406V16C19.0004 16.5522 18.5526 16.9999 18.0004 17C17.4481 17 17.0004 16.5523 17.0004 16V9.41406L14.7074 11.707C14.3169 12.0975 13.6839 12.0973 13.2933 11.707C12.9028 11.3165 12.9028 10.6835 13.2933 10.293L17.2933 6.29297C17.3386 6.2477 17.3876 6.20587 17.4408 6.16992C17.4934 6.13439 17.5488 6.10452 17.6058 6.08008C17.6512 6.06059 17.6989 6.04587 17.7474 6.0332C17.7614 6.02955 17.7753 6.0255 17.7894 6.02246C17.8033 6.01948 17.8173 6.01704 17.8314 6.01465C17.847 6.01199 17.8626 6.00973 17.8783 6.00781C17.8961 6.00565 17.914 6.00415 17.932 6.00293C17.948 6.00184 17.9639 6.00131 17.9799 6.00098C17.9866 6.00084 17.9936 6 18.0004 6C18.0072 6 18.0141 6.00084 18.0209 6.00098Z" fill="#CDE8CF"></path>
              </svg>
              <span className="text-xs text-gray-300 hidden sm:inline">{Math.round(textScale * 100)}%</span>
            </button>

            {/* Botão Exportar CSV */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Exportar CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabela Editável */}
      <div className="flex-1 overflow-hidden">
        {escolasError ? (
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 m-4">
            <div className="flex items-center gap-2 text-red-400">
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
