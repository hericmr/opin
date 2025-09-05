import React, { useState, useEffect } from 'react';
import { useRefresh } from '../../contexts/RefreshContext';
import { useEscolas } from './hooks/useEscolas';
import { useModalidades } from './hooks/useModalidades';
import { ADMIN_TABS, UI_CONFIG, FORM_CONFIG } from './constants/adminConstants';
import AdminSidebar from './AdminSidebar';
import AdminToolbar from './AdminToolbar';
import './AdminPanel.css';
import ModalidadesTab from './tabs/ModalidadesTab';
import DadosBasicosTab from './tabs/DadosBasicosTab';
import PovosLinguasTab from './tabs/PovosLinguasTab';
import InfraestruturaTab from './tabs/InfraestruturaTab';
import GestaoProfessoresTab from './tabs/GestaoProfessoresTab';
import MaterialPedagogicoTab from './tabs/MaterialPedagogicoTab';
import ProjetosParceriasTab from './tabs/ProjetosParceriasTab';
import RedesSociaisTab from './tabs/RedesSociaisTab';
import VideoTab from './tabs/VideoTab';
import HistoriasTab from './tabs/HistoriasTab';
import HistoriaProfessoresTab from './tabs/HistoriaProfessoresTab';
import CoordenadasTab from './tabs/CoordenadasTab';
import TabelasIntegraisTab from './tabs/TabelasIntegraisTab';
import TabelaEditavelTab from './tabs/TabelaEditavelTab';

// Imports condicionais para evitar problemas de hot reload
let ImagensEscolaTab = null;
let ImagensProfessoresTab = null;
let DocumentosTab = null;

try {
  ImagensEscolaTab = require('./tabs/ImagensEscolaTab').default;
} catch (e) {
  console.warn('ImagensEscolaTab não encontrado:', e);
}

try {
  ImagensProfessoresTab = require('./tabs/ImagensProfessoresTab').default;
} catch (e) {
  console.warn('ImagensProfessoresTab não encontrado:', e);
}

try {
  DocumentosTab = require('./tabs/DocumentosTab').default;
} catch (e) {
  console.warn('DocumentosTab não encontrado:', e);
}

const AdminPanel = () => {
  const { triggerRefresh } = useRefresh();
  
  // Estados principais
  const [editingLocation, setEditingLocation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [escolaToDelete, setEscolaToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    filteredEscolas,
    saveEscola,
    deleteEscola
  } = useEscolas();

  const {
    loadExistingModalidades,
    clearModalidades
  } = useModalidades();

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
      'Equipamentos Tecnológicos (Computadores, tablets e impressoras)': escola['Equipamentos Tecnológicos (Computadores, tablets e impressoras)'],
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
      'Ano de criação da escola': '',
      'Povos indigenas': '',
      'Linguas faladas': '',
      'Modalidade de Ensino/turnos de funcionamento': '',
      'Numero de alunos': '',
      'turnos_funcionamento': '',
      'Espaço escolar e estrutura': '',
      'Acesso à água': '',
      'Tem coleta de lixo?': '',
      'Acesso à internet': '',
      'Equipamentos Tecnológicos (Computadores, tablets e impressoras)': '',
      'Modo de acesso à escola': '',
      'Gestão/Nome': '',
      'Outros funcionários': '',
      'Quantidade de professores indígenas': '',
      'Quantidade de professores não indígenas': '',
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
      'Latitude': '',
      'Longitude': '',
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

  // Função para abrir modal de remoção
  const handleRemoverEscola = (escola) => {
    setEscolaToDelete(escola);
    setShowDeleteModal(true);
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
        console.error('Erro ao remover escola:', result.error);
      }
    } catch (error) {
      console.error('Erro ao remover escola:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Função para salvar escola
  const handleSaveEscola = async () => {
    if (!editingLocation) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const result = await saveEscola(editingLocation);
      
      if (result.success) {
        setSaveSuccess(true);
        // Atualizar o editingLocation com os dados salvos
        setEditingLocation(result.data);
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setSaveError(result.error);
      }
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Renderizar aba ativa
  const renderActiveTab = () => {
    const activeTab = editingLocation?.activeTab || FORM_CONFIG.DEFAULT_ACTIVE_TAB;

    switch (activeTab) {
      case 'dados-basicos':
        return (
          <DadosBasicosTab 
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
          />
        );
      
      case 'povos-linguas':
        return (
          <PovosLinguasTab 
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
          />
        );
      
      case 'modalidades':
        return (
          <ModalidadesTab 
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
          />
        );
      
      case 'infraestrutura':
        return (
          <InfraestruturaTab 
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
          />
        );
      
      case 'gestao-professores':
        return (
          <GestaoProfessoresTab 
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
          />
        );
      
      case 'material-pedagogico':
        return (
          <MaterialPedagogicoTab 
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
          />
        );
      
      case 'projetos-parcerias':
        return (
          <ProjetosParceriasTab 
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
          />
        );
      
      case 'redes-sociais':
        return (
          <RedesSociaisTab 
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
          />
        );
      
      case 'video':
        return (
          <VideoTab 
            editingLocation={editingLocation}
          />
        );
      
      case 'historias':
        return (
          <HistoriasTab 
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
          />
        );
      
      case 'historia-professores':
        return (
          <HistoriaProfessoresTab 
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
          />
        );
      
      case 'coordenadas':
        return (
          <CoordenadasTab 
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
          />
        );
      
      case 'historias-professor':
        return <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              Tabela de Histórias dos Professores
            </h3>
            <p className="text-gray-400 mb-8">
              Funcionalidade em desenvolvimento...
            </p>
          </div>
        </div>;
      
      case 'documentos-escola':
        return <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              Tabela de Documentos das Escolas
            </h3>
            <p className="text-gray-400 mb-8">
              Funcionalidade em desenvolvimento...
            </p>
          </div>
        </div>;
      
      case 'imagens-escola':
        if (!ImagensEscolaTab) {
          return <div className="text-center py-8 text-gray-500">Componente em carregamento...</div>;
        }
        return <ImagensEscolaTab editingLocation={editingLocation} />;
      
      case 'imagens-professores':
        if (!ImagensProfessoresTab) {
          return <div className="text-center py-8 text-gray-500">Componente em carregamento...</div>;
        }
        return <ImagensProfessoresTab editingLocation={editingLocation} />;
      
      case 'documentos':
        if (!DocumentosTab) {
          return <div className="text-center py-8 text-gray-500">Componente em carregamento...</div>;
        }
        return <DocumentosTab editingLocation={editingLocation} />;
      
      // TODO: Implementar outras abas
      default:
        return (
          <div className="text-gray-400 text-center py-8">
            Aba "{activeTab}" em desenvolvimento...
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Sidebar */}
      <AdminSidebar
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        editingLocation={editingLocation}
        onEscolaSelect={openEditModal}
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
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
            <TabelaEditavelTab setEditingLocation={setEditingLocation} />
          </div>
        )}

        {/* Painel de Edição */}
        {editingLocation && typeof editingLocation === 'object' && (editingLocation.Escola !== undefined) && editingLocation.activeTab !== 'tabela-editavel' && (
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 p-6 max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
            {/* Header do painel */}
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <div>
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-100 mb-1">
                {editingLocation.id ? 'Editar Escola' : 'Nova Escola'}
              </h2>
                {editingLocation.Escola && (
                  <p className="text-gray-400 text-sm">{editingLocation.Escola}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Botão Salvar */}
                <button
                  onClick={handleSaveEscola}
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Salvando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Salvar
                    </div>
                  )}
                </button>
                
                {/* Botão Fechar */}
                <button
                  onClick={() => setEditingLocation(null)}
                  className="px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mensagens de feedback */}
            {saveSuccess && (
              <div className="mb-6 p-4 bg-green-900/50 border border-green-700/50 text-green-200 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">Escola salva com sucesso!</span>
                </div>
              </div>
            )}
            
            {saveError && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 text-red-200 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold">Erro ao salvar:</span>
                    <p className="text-red-300">{saveError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navegação por abas */}
            <div className="border-b border-gray-800 mb-6 flex-shrink-0 bg-gray-800/50 rounded-t-xl relative">
              <nav className="-mb-px flex space-x-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 tabs-container">
                {ADMIN_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEditingLocation({ ...editingLocation, activeTab: tab.id })}
                    className={`whitespace-nowrap py-3 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 rounded-t-lg flex-shrink-0 min-w-fit ${
                      (editingLocation.activeTab || FORM_CONFIG.DEFAULT_ACTIVE_TAB) === tab.id
                        ? 'border-green-400 text-green-300 bg-gray-900 shadow-lg'
                        : 'border-transparent text-gray-400 hover:text-green-200 hover:bg-gray-700/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Conteúdo da aba ativa */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
              {renderActiveTab()}
            </div>
          </div>
        )}

        {/* Mensagem quando nenhuma escola está selecionada */}
        {!editingLocation && !escolasLoading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
                             <h3 className="text-xl font-semibold text-gray-200 mb-2">
                 Painel de Administração
               </h3>
               <p className="text-gray-400 mb-8">
                 Escolha uma ação para gerenciar as escolas indígenas. Você pode criar novas escolas, editar dados em tabelas, fazer backup ou remover escolas.
               </p>
              <div className="space-y-4">
                                 <button
                   onClick={handleNovaEscola}
                   className="w-full px-8 py-4 bg-gray-800 text-gray-100 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border border-gray-600"
                 >
                  <div className="flex items-center gap-3 justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Criar Nova Escola
                  </div>
                </button>
                
                                 <button
                   onClick={() => setShowBackupModal(true)}
                   className="w-full px-8 py-4 bg-gray-800 text-gray-100 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border border-gray-600"
                 >
                  <div className="flex items-center gap-3 justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Backup dos Dados do Site
                  </div>
                </button>

                                 <button
                   onClick={() => setShowDeleteModal(true)}
                   className="w-full px-8 py-4 bg-gray-800 text-gray-100 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border border-gray-600"
                 >
                   <div className="flex items-center gap-3 justify-center">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                     Remover Escola
                   </div>
                 </button>

                 <button
                   onClick={abrirTabelaEditavel}
                   className="w-full px-8 py-4 bg-gray-800 text-gray-100 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border border-gray-600"
                 >
                   <div className="flex items-center gap-3 justify-center">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     Tabela de Escolas
                   </div>
                 </button>

                 <button
                   className="w-full px-8 py-4 bg-gray-700 text-gray-300 rounded-xl cursor-not-allowed opacity-50 transition-all duration-200"
                   disabled
                 >
                   <div className="flex items-center gap-3 justify-center">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                     </svg>
                     Histórias dos Professores
                     <span className="text-xs bg-gray-600 px-2 py-1 rounded">Em Construção</span>
                   </div>
                 </button>

                 <button
                   className="w-full px-8 py-4 bg-gray-700 text-gray-300 rounded-xl cursor-not-allowed opacity-50 transition-all duration-200"
                   disabled
                 >
                   <div className="flex items-center gap-3 justify-center">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     Documentos das Escolas
                     <span className="text-xs bg-gray-600 px-2 py-1 rounded">Em Construção</span>
                   </div>
                 </button>

                 <button
                   onClick={() => {
                     // Criar uma escola temporária para acessar a aba de imagens
                     const tempEscola = {
                       id: 'temp-imagens-escola',
                       Escola: 'Gerenciar Imagens das Escolas',
                       activeTab: 'imagens-escola'
                     };
                     setEditingLocation(tempEscola);
                   }}
                   className="w-full px-8 py-4 bg-gray-800 text-gray-100 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border border-gray-600"
                 >
                   <div className="flex items-center gap-3 justify-center">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                     Imagens das Escolas
                   </div>
                 </button>

                 <button
                   className="w-full px-8 py-4 bg-gray-700 text-gray-300 rounded-xl cursor-not-allowed opacity-50 transition-all duration-200"
                   disabled
                 >
                   <div className="flex items-center gap-3 justify-center">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                     </svg>
                     Imagens dos Professores
                     <span className="text-xs bg-gray-600 px-2 py-1 rounded">Em Construção</span>
                   </div>
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Backup */}
        {showBackupModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header da Modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-800/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-100">Backup dos Dados do Site</h2>
                    <p className="text-sm text-gray-400">Gerencie backups das tabelas e arquivos</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBackupModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Conteúdo da Modal */}
              <div className="flex-1 overflow-y-auto p-6">
                <TabelasIntegraisTab />
              </div>
            </div>
          </div>
        )}

        {/* Modal de Remoção de Escola */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 w-full max-w-md">
              {/* Header da Modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-100">Remover Escola</h2>
                    <p className="text-sm text-gray-400">Selecione uma escola para remover</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Conteúdo da Modal */}
              <div className="p-6">
                {!escolaToDelete ? (
                  <div className="space-y-4">
                    <p className="text-gray-300 mb-4">
                      Selecione uma escola da lista para remover:
                    </p>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {filteredEscolas.map(escola => (
                        <button
                          key={escola.id}
                          onClick={() => setEscolaToDelete(escola)}
                          className="w-full text-left p-4 rounded-xl hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-gray-700/50 text-gray-200 hover:text-white"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate text-gray-200">
                                {escola.Escola}
                              </h3>
                              {escola['Município'] && (
                                <p className="text-sm text-gray-400 truncate mt-1">
                                  {escola['Município']}
                                </p>
                              )}
                            </div>
                            <div className="ml-2 flex-shrink-0">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h3 className="font-semibold text-red-200">Confirmar Remoção</h3>
                      </div>
                      <p className="text-red-300 text-sm">
                        Você está prestes a remover a escola <strong>"{escolaToDelete.Escola}"</strong> de <strong>"{escolaToDelete['Município']}"</strong>.
                      </p>
                      <p className="text-red-400 text-sm mt-2">
                        ⚠️ Esta ação é irreversível e removerá todos os dados da escola do sistema.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setEscolaToDelete(null)}
                        className="flex-1 px-4 py-3 bg-gray-700 text-gray-200 rounded-xl hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
            <button
                        onClick={handleConfirmarRemocao}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isDeleting ? (
                          <div className="flex items-center gap-2 justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Removendo...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Confirmar Remoção
                          </div>
                        )}
            </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel; 