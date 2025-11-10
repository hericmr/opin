import React, { useState, Suspense } from 'react';
import { useEscolas } from './hooks/useEscolas';
import { useModalidades } from './hooks/useModalidades';
import { ADMIN_TABS, UI_CONFIG, FORM_CONFIG } from './constants/adminConstants';
import AdminSidebar from './AdminSidebar';
import AdminToolbar from './AdminToolbar';
import ProtectedRoute from '../Auth/ProtectedRoute';
import { supabase } from '../../supabaseClient';
import './AdminPanel.css';
// Imports de tabs movidos para tabRenderer.js
import TabelaEditavelTab from './tabs/TabelaEditavelTab';
import GlobalCardVisibilitySettings from './components/GlobalCardVisibilitySettings';
import MetadadosModal from './components/MetadadosModal';
import BackupModal from './components/BackupModal';
import DeleteEscolaModal from './components/DeleteEscolaModal';
import logger from '../../utils/logger';
import { renderActiveTab } from './utils/tabRenderer';
import { useAdminSave } from './hooks/useAdminSave';
import { useAdminFilters } from './hooks/useAdminFilters';

// Lazy loading do CompletenessDashboard - só é carregado quando necessário
const CompletenessDashboard = React.lazy(() => import('./components/CompletenessDashboard'));

const AdminPanelContent = () => {
  // Estados principais
  const [editingLocation, setEditingLocation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [escolaToDelete, setEscolaToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCompletenessDashboard, setShowCompletenessDashboard] = useState(false);
  const [showGlobalCardVisibility, setShowGlobalCardVisibility] = useState(false);
  const [showMetadadosModal, setShowMetadadosModal] = useState(false);
  const [escolaSalvaId, setEscolaSalvaId] = useState(null);
  const [escolaSalvaNome, setEscolaSalvaNome] = useState(null);
  const [camposAlterados, setCamposAlterados] = useState([]);
  const [dadosOriginais, setDadosOriginais] = useState(null);

  // Detectar se é mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= UI_CONFIG.MOBILE_BREAKPOINT;

  // Hooks customizados
  const { 
    escolas,
    loading: escolasLoading, 
    error: escolasError,
    searchTerm, 
    setSearchTerm, 
    selectedType, 
    setSelectedType,
    saveEscola,
    deleteEscola
  } = useEscolas();

  // Hook para filtros
  const { filteredEscolas } = useAdminFilters(escolas, searchTerm, selectedType);

  const {
    loadExistingModalidades,
    clearModalidades
  } = useModalidades();

  // Hook para gerenciar salvamento de escolas
  const {
    isSaving,
    saveError,
    saveSuccess,
    handleSaveEscola
  } = useAdminSave({
    saveEscola,
    editingLocation,
    setEditingLocation,
    setEscolaSalvaId,
    setEscolaSalvaNome,
    setCamposAlterados,
    setShowMetadadosModal,
    dadosOriginais,
    setDadosOriginais
  });

  // Função para abrir edição de escola
  const openEditModal = (escola) => {
    // Carregar modalidades existentes
    loadExistingModalidades(escola['Modalidade de Ensino/turnos de funcionamento']);
    
    // Garantir que apenas os campos originais do banco sejam usados
    const escolaOriginal = {
      id: escola.id,
      Escola: escola.Escola,
      'Município': escola['Município'],
      'Endereço': escola['Endereço'],
      'Terra Indigena (TI)': escola['Terra Indigena (TI)'],
      'Parcerias com o município': escola['Parcerias com o município'],
      'Diretoria de Ensino': escola['Diretoria de Ensino'],
      'Ano de criação da escola': escola['Ano de criação da escola'],
      'Povos indigenas': escola['Povos indigenas'],
      'Linguas faladas': escola['Linguas faladas'],
      'Modalidade de Ensino/turnos de funcionamento': escola['Modalidade de Ensino/turnos de funcionamento'],
      'Numero de alunos': escola['Numero de alunos'],
      'turnos_funcionamento': escola['turnos_funcionamento'] || '',
      'Espaço escolar e estrutura': escola['Espaço escolar e estrutura'],
      'Acesso à água': escola['Acesso à água'],
      'Tem coleta de lixo?': escola['Tem coleta de lixo?'],
      'Acesso à internet': escola['Acesso à internet'],
      'Equipamentos Tecs': escola['Equipamentos Tecs'],
      'Modo de acesso à escola': escola['Modo de acesso à escola'],
      'Gestão/Nome': escola['Gestão/Nome'],
      'Outros funcionários': escola['Outros funcionários'],
      'Quantidade de professores indígenas': escola['Quantidade de professores indígenas'],
      'Quantidade de professores não indígenas': escola['Quantidade de professores não indígenas'],
      'Professores falam a língua indígena?': escola['Professores falam a língua indígena?'],
      'Formação dos professores': escola['Formação dos professores'],
      'Formação continuada oferecida': escola['Formação continuada oferecida'],
      'A escola possui PPP próprio?': escola['A escola possui PPP próprio?'],
      'PPP elaborado com a comunidade?': escola['PPP elaborado com a comunidade?'],
      'Projetos em andamento': escola['Projetos em andamento'],
      'Parcerias com universidades?': escola['Parcerias com universidades?'],
      'Ações com ONGs ou coletivos?': escola['Ações com ONGs ou coletivos?'],
      'Desejos da comunidade para a escola': escola['Desejos da comunidade para a escola'],
      'Escola utiliza redes sociais?': escola['Escola utiliza redes sociais?'],
      'Links das redes sociais': escola['Links das redes sociais'],
      'historia_da_escola': escola['historia_da_escola'],
      'Latitude': escola['Latitude'],
      'Longitude': escola['Longitude'],
      'links': escola['links'],
      'link_para_videos': escola['link_para_videos'],
      'logradouro': escola['logradouro'],
      'numero': escola['numero'],
      'complemento': escola['complemento'],
      'bairro': escola['bairro'],
      'cep': escola['cep'],
      'estado': escola['estado'],
      'nome_professor': escola['nome_professor'],
      'professores_indigenas': escola['professores_indigenas'],
      'professores_nao_indigenas': escola['professores_nao_indigenas'],
      'professores_falam_lingua_indigena': escola['professores_falam_lingua_indigena'],
      'formacao_professores': escola['formacao_professores'],
      'visitas_supervisores_formacao': escola['visitas_supervisores_formacao'],
      'outros_funcionarios': escola['outros_funcionarios'],
      'gestao': escola['gestao'],
      'merenda_diferenciada': escola['merenda_diferenciada'],
      cozinha: escola.cozinha,
      merenda_escolar: escola.merenda_escolar,
      diferenciada: escola.diferenciada,
      activeTab: FORM_CONFIG.DEFAULT_ACTIVE_TAB
    };
    
    // Salvar dados originais para comparação posterior
    setDadosOriginais({ ...escolaOriginal });
    setEditingLocation(escolaOriginal);
  };

  // Função para abrir tabela editável
  const abrirTabelaEditavel = () => {
    setEditingLocation({
      id: 'tabela-editavel',
      Escola: 'Tabela Editável',
      activeTab: 'tabela-editavel'
    });
  };

  // Função para criar nova escola vazia
  const criarNovaEscolaVazia = () => {
    // Limpar modalidades
    clearModalidades();
    
    return {
      Escola: '',
      'Município': '',
      'Endereço': '',
      'Terra Indigena (TI)': '',
      'Parcerias com o município': '',
      'Diretoria de Ensino': '',
      'Ano de criação da escola': null,
      'Povos indigenas': '',
      'Linguas faladas': '',
      'Modalidade de Ensino/turnos de funcionamento': '',
      'Numero de alunos': null,
      'turnos_funcionamento': '',
      'Espaço escolar e estrutura': '',
      'Acesso à água': '',
      'Tem coleta de lixo?': '',
      'Acesso à internet': '',
      'Equipamentos Tecs': '',
      'Modo de acesso à escola': '',
      'Gestão/Nome': '',
      'Outros funcionários': '',
      'Quantidade de professores indígenas': null,
      'Quantidade de professores não indígenas': null,
      'Professores falam a língua indígena?': '',
      'Formação dos professores': '',
      'Formação continuada oferecida': '',
      'A escola possui PPP próprio?': '',
      'PPP elaborado com a comunidade?': '',
      'Projetos em andamento': '',
      'Parcerias com universidades?': '',
      'Ações com ONGs ou coletivos?': '',
      'Desejos da comunidade para a escola': '',
      'Escola utiliza redes sociais?': '',
      'Links das redes sociais': '',
      'historia_da_escola': '',
      'Latitude': null,
      'Longitude': null,
      'links': '',
      'link_para_videos': '',
      'logradouro': '',
      'numero': '',
      'complemento': '',
      'bairro': '',
      'cep': '',
      'estado': 'SP',
      'nome_professor': '',
      'professores_indigenas': '',
      'professores_nao_indigenas': '',
      'professores_falam_lingua_indigena': '',
      'formacao_professores': '',
      'visitas_supervisores_formacao': '',
      'outros_funcionarios': '',
      'gestao': '',
      'merenda_diferenciada': '',
      cozinha: '',
      merenda_escolar: '',
      diferenciada: '',
      activeTab: FORM_CONFIG.DEFAULT_ACTIVE_TAB
    };
  };

  // Função para criar nova escola
  const handleNovaEscola = () => {
    setEditingLocation(criarNovaEscolaVazia());
  };

  // Função para abrir modal de remoção - REMOVIDO: não utilizado
  // const handleRemoverEscola = (escola) => {
  //   setEscolaToDelete(escola);
  //   setShowDeleteModal(true);
  // };

  // Função para verificar se uma aba tem informações faltando
  const hasMissingInfo = (tabId, escola) => {
    if (!escola) return false;

    const fieldMappings = {
      'dados-basicos': ['Escola', 'Município', 'Endereço', 'Terra Indigena (TI)', 'Diretoria de Ensino'],
      'povos-linguas': ['Povos indigenas', 'Linguas faladas'],
      'modalidades': ['Modalidade de Ensino/turnos de funcionamento', 'Numero de alunos'],
      'infraestrutura': ['Espaço escolar e estrutura', 'Acesso à água', 'Acesso à internet'],
      'gestao-professores': ['Gestão/Nome', 'Quantidade de professores indígenas', 'Quantidade de professores não indígenas'],
      'material-pedagogico': ['A escola possui PPP próprio?', 'Material pedagógico indígena'],
      'projetos-parcerias': ['Projetos em andamento', 'Parcerias com universidades?'],
      'redes-sociais': ['Escola utiliza redes sociais?', 'Links das redes sociais'],
      'video': ['link_para_videos'],
      'historias': ['historia_da_escola'],
      'historia-professores': ['nome_professor'],
      'coordenadas': ['Latitude', 'Longitude'],
      'imagens-escola': ['imagem_header'],
      'imagens-professores': [],
      'documentos': []
    };

    const fields = fieldMappings[tabId] || [];
    
    return fields.some(field => {
      const value = escola[field];
      return value === null || value === undefined || value === '' || value === 'null';
    });
  };

  // Função para fazer download de todas as imagens
  const handleDownloadImages = async () => {
    try {
      // Criar um arquivo ZIP com todas as imagens
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Buscar todas as imagens do bucket 'imagens'
      const { data: imagens, error } = await supabase
        .storage
        .from('imagens')
        .list('', {
          limit: 1000,
          offset: 0
        });

      if (error) {
        logger.error('Erro ao buscar imagens:', error);
        alert('Erro ao buscar imagens: ' + error.message);
        return;
      }

      if (!imagens || imagens.length === 0) {
        alert('Nenhuma imagem encontrada no bucket.');
        return;
      }

      // Mostrar loading
      const loadingMessage = document.createElement('div');
      loadingMessage.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px; 
                    z-index: 9999; text-align: center;">
          <div style="margin-bottom: 10px;">Preparando download...</div>
          <div style="font-size: 12px;">Encontradas ${imagens.length} imagens</div>
        </div>
      `;
      document.body.appendChild(loadingMessage);

      // Baixar cada imagem e adicionar ao ZIP
      for (let i = 0; i < imagens.length; i++) {
        const imagem = imagens[i];
        
        try {
          const { data: imageData, error: downloadError } = await supabase
            .storage
            .from('imagens')
            .download(imagem.name);

          if (downloadError) {
            logger.error(`Erro ao baixar ${imagem.name}:`, downloadError);
            continue;
          }

          // Adicionar ao ZIP
          zip.file(imagem.name, imageData);
          
          // Atualizar progresso
          loadingMessage.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px; 
                        z-index: 9999; text-align: center;">
              <div style="margin-bottom: 10px;">Preparando download...</div>
              <div style="font-size: 12px;">${i + 1} de ${imagens.length} imagens processadas</div>
            </div>
          `;
        } catch (err) {
          logger.error(`Erro ao processar ${imagem.name}:`, err);
        }
      }

      // Gerar e baixar o ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Criar link de download
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-imagens-escolas-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Remover loading
      document.body.removeChild(loadingMessage);
      
      alert(`Download concluído! ${imagens.length} imagens foram baixadas em um arquivo ZIP.`);
      
    } catch (error) {
      logger.error('Erro ao fazer download das imagens:', error);
      alert('Erro ao fazer download das imagens: ' + error.message);
    }
  };

  // Função para confirmar remoção
  const handleConfirmarRemocao = async () => {
    if (!escolaToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteEscola(escolaToDelete.id);
      
      if (result.success) {
        setShowDeleteModal(false);
        setEscolaToDelete(null);
        // Limpar edição se a escola removida estava sendo editada
        if (editingLocation?.id === escolaToDelete.id) {
          setEditingLocation(null);
        }
      } else {
        logger.error('Erro ao remover escola:', result.error);
      }
    } catch (error) {
      logger.error('Erro ao remover escola:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Função para salvar escola (lógica extraída para useAdminSave.js)

  // Callback quando metadados são salvos
  const handleMetadadosSaved = (metadadosData) => {
    logger.debug('Metadados salvos com sucesso:', metadadosData);
    // Opcional: mostrar mensagem de sucesso adicional
  };

  // Renderizar aba ativa (lógica extraída para tabRenderer.js)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Sidebar */}
      <AdminSidebar
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        editingLocation={editingLocation}
        onEscolaSelect={openEditModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredEscolas={filteredEscolas}
      />

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-2">
            Painel de Administração
          </h1>
        </div>
        
        {/* Toolbar */}
        <AdminToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onNovaEscola={handleNovaEscola}
        />

        {/* Loading state */}
        {escolasLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-gray-400 text-lg">Carregando escolas...</div>
            </div>
          </div>
        )}

        {/* Error state */}
        {escolasError && (
          <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold">Erro ao carregar escolas</h3>
                <p className="text-red-300">{escolasError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabela Editável em Tela Cheia */}
        {editingLocation && editingLocation.activeTab === 'tabela-editavel' && (
          <div className="fixed inset-0 bg-gray-900 z-40 overflow-hidden" style={{ top: '72px' }}>
            <TabelaEditavelTab 
              setEditingLocation={setEditingLocation}
              onShowMetadadosModal={(escolaId, escolaNome, camposAlterados) => {
                setEscolaSalvaId(escolaId);
                setEscolaSalvaNome(escolaNome);
                setCamposAlterados(camposAlterados);
                setShowMetadadosModal(true);
              }}
            />
          </div>
        )}

        {/* Painel de Edição - Estilo WhatsApp */}
        {editingLocation && typeof editingLocation === 'object' && (editingLocation.Escola !== undefined) && editingLocation.activeTab !== 'tabela-editavel' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            {/* Header do painel - Estilo WhatsApp */}
            <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] px-6 py-4 flex justify-between items-center flex-shrink-0 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-semibold text-white">
                    {editingLocation.id ? 'Editar Escola' : 'Nova Escola'}
                  </h2>
                  {editingLocation.Escola && (
                    <p className="text-white/80 text-sm">{editingLocation.Escola}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Botão Salvar - Estilo WhatsApp */}
                <button
                  onClick={handleSaveEscola}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium backdrop-blur-sm"
                >
                  {isSaving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Salvar
                    </>
                  )}
                </button>
                
                {/* Botão Fechar - Estilo WhatsApp */}
                <button
                  onClick={() => setEditingLocation(null)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Fechar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mensagens de feedback - Estilo WhatsApp */}
            <div className="px-6 pt-4 flex-shrink-0">
              {saveSuccess && (
                <div className="mb-4 p-3 bg-[#DCF8C6] rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#075E54]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium text-[#075E54] text-sm">Escola salva com sucesso!</span>
                  </div>
                </div>
              )}
              
              {saveError && (
                <div className="mb-4 p-3 bg-[#FFE5E5] rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="font-medium text-[#D32F2F] text-sm">Erro ao salvar:</span>
                      <p className="text-[#B71C1C] text-xs mt-1">{saveError}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navegação por abas - Estilo WhatsApp */}
            <div className="bg-[#F0F2F5] border-b border-gray-200 flex-shrink-0 relative">
              <nav className="flex space-x-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent tabs-container px-4">
                {ADMIN_TABS.map((tab) => {
                  const isActive = (editingLocation.activeTab || FORM_CONFIG.DEFAULT_ACTIVE_TAB) === tab.id;
                  const hasMissing = hasMissingInfo(tab.id, editingLocation);
                  
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setEditingLocation({ ...editingLocation, activeTab: tab.id })}
                      className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 flex-shrink-0 min-w-fit relative ${
                        isActive
                          ? 'border-[#075E54] text-[#075E54] bg-white'
                          : hasMissing
                          ? 'border-orange-400 text-orange-600 hover:text-orange-700 hover:bg-white/50'
                          : 'border-transparent text-gray-600 hover:text-[#075E54] hover:bg-white/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tab.label}
                        {hasMissing && !isActive && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Conteúdo da aba ativa - Estilo WhatsApp */}
            <div className="flex-grow overflow-y-auto bg-[#F0F2F5] p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="max-w-4xl mx-auto">
                {renderActiveTab(editingLocation, setEditingLocation)}
              </div>
            </div>
          </div>
        )}

        {/* Modal de Metadados - Aparece após salvar com sucesso */}
        <MetadadosModal
          isOpen={showMetadadosModal}
          onClose={() => {
            setShowMetadadosModal(false);
            setEscolaSalvaId(null);
            setEscolaSalvaNome(null);
            setCamposAlterados([]);
            setDadosOriginais(null);
          }}
          onSave={handleMetadadosSaved}
          escolaId={escolaSalvaId}
          escolaNome={escolaSalvaNome}
          camposAlterados={camposAlterados}
        />

        {/* Dashboard de Completude quando nenhuma escola está selecionada */}
        {!editingLocation && !escolasLoading && (
          <div className="space-y-8">
            {/* Dashboard de Completude - só aparece quando solicitado */}
            {showCompletenessDashboard && (
              <Suspense fallback={
                <div className="flex items-center justify-center p-8 bg-gray-900/80 backdrop-blur-sm rounded-2xl">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-300">Carregando dashboard de completude...</p>
                  </div>
                </div>
              }>
                <CompletenessDashboard />
              </Suspense>
            )}
            
            {/* Configuração Global de Visibilidade de Cards */}
            {showGlobalCardVisibility && (
              <GlobalCardVisibilitySettings />
            )}
            
            {/* Ações do Painel */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 p-6">
              <div className="text-center mb-8">
                <img 
                  src={`${process.env.PUBLIC_URL || ''}/logo_index.png`}
                  alt="OPIN - Observatório dos Professores Indígenas"
                  className="w-32 h-32 mx-auto mb-6 object-contain"
                />
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                  Painel de Administração
                </h3>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto text-sm">
                  Gerencie escolas indígenas, dados e configurações do sistema.
                </p>
              </div>
              {/* Grid de Ações */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Ações Principais */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Ações Principais
                  </h4>
                  
                  <button
                    onClick={handleNovaEscola}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Criar Nova Escola
                    </div>
                  </button>

                  <button
                    onClick={abrirTabelaEditavel}
                    className="w-full px-4 py-3 bg-gray-800 text-gray-100 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border border-gray-600 text-sm"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Editar em Tabela
                    </div>
                  </button>

                  <button
                    onClick={() => setShowCompletenessDashboard(!showCompletenessDashboard)}
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border text-sm ${
                      showCompletenessDashboard 
                        ? 'bg-green-800 text-green-100 border-green-600 hover:bg-green-700' 
                        : 'bg-gray-800 text-gray-100 border-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Ver Dashboard
                    </div>
                  </button>
                </div>

                {/* Mídia e Backup */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Mídia e Backup
                  </h4>
                  
                  <button
                    onClick={handleDownloadImages}
                    className="w-full px-4 py-3 bg-gray-800 text-gray-100 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border border-gray-600 text-sm"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Download de Imagens
                    </div>
                  </button>

                  <button
                    onClick={() => setShowBackupModal(true)}
                    className="w-full px-4 py-3 bg-gray-800 text-gray-100 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border border-gray-600 text-sm"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Backup dos Dados
                    </div>
                  </button>
                </div>

                {/* Administração */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Administração
                  </h4>
                  
                  <button
                    onClick={() => setShowGlobalCardVisibility(!showGlobalCardVisibility)}
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border text-sm ${
                      showGlobalCardVisibility 
                        ? 'bg-blue-800 text-blue-100 border-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-800 text-gray-100 border-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Visibilidade dos Cards
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full px-4 py-3 bg-red-800 text-red-100 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border border-red-600 text-sm"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remover Escola
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Backup */}
        <BackupModal
          isOpen={showBackupModal}
          onClose={() => setShowBackupModal(false)}
        />

        {/* Modal de Remoção de Escola */}
        <DeleteEscolaModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setEscolaToDelete(null);
          }}
          escolas={filteredEscolas}
          escolaToDelete={escolaToDelete}
          setEscolaToDelete={setEscolaToDelete}
          onConfirmDelete={handleConfirmarRemocao}
          isDeleting={isDeleting}
        />
      </main>
    </div>
  );
};

const AdminPanel = () => {
  return (
    <ProtectedRoute>
      <AdminPanelContent />
    </ProtectedRoute>
  );
};

export default AdminPanel; 