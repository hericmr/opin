import React, { useState, useEffect } from 'react';
import { useRefresh } from '../../contexts/RefreshContext';
import { useEscolas } from './hooks/useEscolas';
import { useModalidades } from './hooks/useModalidades';
import { ADMIN_TABS, UI_CONFIG, FORM_CONFIG } from './constants/adminConstants';
import AdminSidebar from './AdminSidebar';
import AdminToolbar from './AdminToolbar';
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
    saveEscola
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
      
      case 'tabelas-integrais':
        return <TabelasIntegraisTab />;
      
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
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar */}
      <AdminSidebar
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        editingLocation={editingLocation}
        onEscolaSelect={openEditModal}
      />

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 overflow-y-auto h-screen bg-gray-950">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Painel de Administração</h1>
        
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
          <div className="text-center py-8">
            <div className="text-gray-400">Carregando escolas...</div>
          </div>
        )}

        {/* Error state */}
        {escolasError && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            Erro ao carregar escolas: {escolasError}
          </div>
        )}

        {/* Painel de Edição */}
        {editingLocation && typeof editingLocation === 'object' && (editingLocation.Escola !== undefined) && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 max-h-[calc(100vh-200px)] overflow-hidden flex flex-col border border-gray-800">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-100">
                {editingLocation.id ? 'Editar Escola' : 'Nova Escola'}
              </h2>
              <div className="flex items-center gap-3">
                {/* Botão Salvar */}
                <button
                  onClick={handleSaveEscola}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
                
                {/* Botão Fechar */}
                <button
                  onClick={() => setEditingLocation(null)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Mensagens de feedback */}
            {saveSuccess && (
              <div className="mb-4 p-3 bg-green-900 border border-green-700 text-green-200 rounded-lg">
                ✅ Escola salva com sucesso!
              </div>
            )}
            
            {saveError && (
              <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg">
                ❌ Erro ao salvar: {saveError}
              </div>
            )}

            {/* Navegação por abas */}
            <div className="border-b border-gray-800 mb-6 flex-shrink-0 bg-gray-800 rounded-t-lg">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {ADMIN_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEditingLocation({ ...editingLocation, activeTab: tab.id })}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      (editingLocation.activeTab || FORM_CONFIG.DEFAULT_ACTIVE_TAB) === tab.id
                        ? 'border-green-400 text-green-300 bg-gray-900'
                        : 'border-transparent text-gray-400 hover:text-green-200 hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Conteúdo da aba ativa */}
            <div className="flex-1 overflow-y-auto">
              {renderActiveTab()}
            </div>
          </div>
        )}

        {/* Mensagem quando nenhuma escola está selecionada */}
        {!editingLocation && !escolasLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              Selecione uma escola para editar ou crie uma nova
            </div>
            <button
              onClick={handleNovaEscola}
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
            >
              + Criar Nova Escola
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel; 