import React, { useState, Suspense } from 'react';
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  DatabaseBackup,
  Download,
  Eye,
  Loader2,
  Menu,
  Plus,
  Table2,
  Trash2,
  X
} from 'lucide-react';
import { useEscolas } from './hooks/useEscolas';
import { useAdminForm } from './hooks/useAdminForm';
import { ADMIN_TABS, ADMIN_TAB_GROUPS, UI_CONFIG, FORM_CONFIG } from './constants/adminConstants';
import AdminSidebar from './AdminSidebar';
import AdminToolbar from './AdminToolbar';
import ProtectedRoute from '../Auth/ProtectedRoute';
import './AdminPanel.css';
import TabelaEditavelTab from './tabs/TabelaEditavelTab';
import GlobalCardVisibilitySettings from './components/GlobalCardVisibilitySettings';
import MetadadosModal from './components/MetadadosModal';
import BackupModal from './components/BackupModal';
import DeleteEscolaModal from './components/DeleteEscolaModal';
import logger from '../../utils/logger';
import { renderActiveTab } from './utils/tabRenderer';
import GlobalSpinner from '../GlobalSpinner';
import { useAdminSave } from './hooks/useAdminSave';
import { useAdminFilters } from './hooks/useAdminFilters';
import { useNavbarHeight } from './hooks/useNavbarHeight';
import { downloadAllImages } from './utils/downloadImagesService';

// Lazy loading do CompletenessDashboard - só é carregado quando necessário
const CompletenessDashboard = React.lazy(() => import('./components/CompletenessDashboard'));

// Cartão de ação da tela inicial do painel
const ActionCard = ({ icon: Icon, title, description, onClick, active = false }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active || undefined}
    className={`group flex items-start gap-3 w-full p-4 text-left rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${active
      ? 'bg-emerald-500/10 border-emerald-500/40'
      : 'bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800/60'
      }`}
  >
    <span className={`flex-shrink-0 p-2 rounded-lg ${active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-300 group-hover:text-gray-100'}`}>
      <Icon className="w-5 h-5" />
    </span>
    <span className="min-w-0">
      <span className="block text-sm font-medium text-gray-100">{title}</span>
      <span className="block text-xs text-gray-400 mt-0.5">{description}</span>
    </span>
  </button>
);

// Navegação entre as abas do editor: lista agrupada no desktop, faixa rolável no mobile
const EditorTabsNav = ({ editingLocation, setEditingLocation, hasMissingInfo }) => {
  const activeTab = editingLocation.activeTab || FORM_CONFIG.DEFAULT_ACTIVE_TAB;

  const renderTab = (tab, compact) => {
    const isActive = activeTab === tab.id;
    const hasMissing = hasMissingInfo(tab.id, editingLocation);

    return (
      <button
        key={tab.id}
        type="button"
        aria-current={isActive ? 'page' : undefined}
        onClick={() => setEditingLocation({ ...editingLocation, activeTab: tab.id })}
        className={`flex items-center justify-between gap-2 text-sm rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${compact ? 'flex-shrink-0 whitespace-nowrap px-3 py-1.5' : 'w-full text-left px-3 py-1.5'
          } ${isActive
            ? 'bg-emerald-500/15 text-emerald-200 font-medium'
            : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
          }`}
      >
        <span className="truncate">{tab.label}</span>
        {hasMissing && (
          <span className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-amber-400" title="Há informações faltando">
            <span className="sr-only">(há informações faltando)</span>
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile / tablet: uma linha rolável */}
      <nav className="lg:hidden tabs-container flex gap-1 px-3 py-2 border-b border-gray-800">
        {ADMIN_TABS.map(tab => renderTab(tab, true))}
      </nav>

      {/* Desktop: lista agrupada */}
      <nav className="hidden lg:block w-56 flex-shrink-0 border-r border-gray-800 p-3">
        <div className="sticky top-20 space-y-4">
          {ADMIN_TAB_GROUPS.map(group => (
            <div key={group.id}>
              <h3 className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                {group.label}
              </h3>
              <div className="space-y-0.5">
                {ADMIN_TABS.filter(tab => tab.group === group.id).map(tab => renderTab(tab, false))}
              </div>
            </div>
          ))}
          <p className="px-3 pt-2 flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            Informações faltando
          </p>
        </div>
      </nav>
    </>
  );
};

const AdminPanelContent = () => {
  // UI state
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

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= UI_CONFIG.MOBILE_BREAKPOINT;
  const navbarHeight = useNavbarHeight();

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

  const { filteredEscolas } = useAdminFilters(escolas, searchTerm, selectedType);

  const {
    editingLocation,
    setEditingLocation,
    dadosOriginais,
    setDadosOriginais,
    openEditModal,
    handleNovaEscola,
    abrirTabelaEditavel,
    hasMissingInfo,
  } = useAdminForm();

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

  const isEditing = editingLocation && typeof editingLocation === 'object' && (editingLocation.Escola !== undefined) && editingLocation.activeTab !== 'tabela-editavel';

  return (
    <div className="admin-panel flex h-screen bg-gray-950 text-gray-100" style={{ paddingTop: navbarHeight }}>
      {/* Sidebar */}
      <AdminSidebar
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        topOffset={navbarHeight}
        editingLocation={editingLocation}
        onEscolaSelect={openEditModal}
        onNovaEscola={handleNovaEscola}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredEscolas={filteredEscolas}
      />

      {/* Conteúdo principal */}
      <main className="flex-1 min-w-0 overflow-y-auto scrollbar-thin">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {/* Botão para abrir a lista de escolas no mobile */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="mb-4 inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-200 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800"
            >
              <Menu className="w-4 h-4" />
              Escolas
              <span className="text-xs text-gray-500 tabular-nums">{filteredEscolas.length}</span>
            </button>
          )}

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
            <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Carregando escolas...
            </div>
          )}

          {/* Error state */}
          {escolasError && (
            <div className="flex items-start gap-3 bg-red-950/50 border border-red-900 text-red-200 px-4 py-3 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm">Erro ao carregar escolas</h3>
                <p className="text-red-300 text-sm">{escolasError}</p>
              </div>
            </div>
          )}

          {/* Tabela Editável em Tela Cheia */}
          {editingLocation && editingLocation.activeTab === 'tabela-editavel' && (
            <div className="fixed inset-0 bg-gray-900 z-40 overflow-hidden" style={{ top: navbarHeight }}>
              <TabelaEditavelTab
                setEditingLocation={setEditingLocation}
                onOpenEscola={openEditModal}
                onShowMetadadosModal={(escolaId, escolaNome, camposAlterados) => {
                  setEscolaSalvaId(escolaId);
                  setEscolaSalvaNome(escolaNome);
                  setCamposAlterados(camposAlterados);
                  setShowMetadadosModal(true);
                }}
              />
            </div>
          )}

          {/* Editor da escola */}
          {isEditing && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl">
              {/* Cabeçalho fixo com as ações */}
              <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 py-3 lg:px-5 bg-gray-900/95 backdrop-blur border-b border-gray-800 rounded-t-xl">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">
                    {editingLocation.id ? 'Editando escola' : 'Nova escola'}
                    {editingLocation['Município'] && <> · {editingLocation['Município']}</>}
                  </p>
                  <h2 className="text-base lg:text-lg font-semibold text-gray-100 truncate">
                    {editingLocation.Escola || 'Escola sem nome'}
                  </h2>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingLocation(null)}
                    className="px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-800 hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                  >
                    <span className="hidden sm:inline">Fechar</span>
                    <X className="w-4 h-4 sm:hidden" aria-label="Fechar" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEscola}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Salvar
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Mensagens de feedback */}
              {(saveSuccess || saveError) && (
                <div className="px-4 pt-4 lg:px-5" role="status">
                  {saveSuccess && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Escola salva com sucesso!
                    </div>
                  )}
                  {saveError && (
                    <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-sm">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-red-300">Erro ao salvar</span>
                        <p className="text-gray-300 text-xs mt-0.5">{saveError}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="lg:flex">
                <EditorTabsNav
                  editingLocation={editingLocation}
                  setEditingLocation={setEditingLocation}
                  hasMissingInfo={hasMissingInfo}
                />

                {/* Conteúdo da aba ativa */}
                <div className="admin-form flex-1 min-w-0 p-4 lg:p-6">
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

          {/* Tela inicial quando nenhuma escola está selecionada */}
          {!editingLocation && !escolasLoading && (
            <div className="space-y-8">
              <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-semibold text-gray-50">
                    Painel de Administração
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">
                    {escolas.length} escolas cadastradas. Escolha uma escola na lista para editar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleNovaEscola}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nova escola
                </button>
              </header>

              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Dados</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ActionCard
                    icon={Table2}
                    title="Editar em tabela"
                    description="Várias escolas de uma vez, como numa planilha"
                    onClick={abrirTabelaEditavel}
                  />
                  <ActionCard
                    icon={BarChart3}
                    title="Completude dos dados"
                    description="O que falta preencher em cada escola"
                    onClick={() => setShowCompletenessDashboard(!showCompletenessDashboard)}
                    active={showCompletenessDashboard}
                  />
                  <ActionCard
                    icon={Eye}
                    title="Visibilidade dos cards"
                    description="Quais seções aparecem no site público"
                    onClick={() => setShowGlobalCardVisibility(!showGlobalCardVisibility)}
                    active={showGlobalCardVisibility}
                  />
                </div>
              </section>

              {/* Painéis abertos pelos cartões acima */}
              {showCompletenessDashboard && (
                <Suspense fallback={
                  <div className="flex items-center justify-center p-8 bg-gray-900 border border-gray-800 rounded-xl">
                    <GlobalSpinner message="Carregando dashboard de completude..." lightText={true} />
                  </div>
                }>
                  <CompletenessDashboard />
                </Suspense>
              )}

              {showGlobalCardVisibility && (
                <GlobalCardVisibilitySettings />
              )}

              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Mídia e backup</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ActionCard
                    icon={Download}
                    title="Download de imagens"
                    description="Baixar todas as imagens das escolas em .zip"
                    onClick={downloadAllImages}
                  />
                  <ActionCard
                    icon={DatabaseBackup}
                    title="Backup dos dados"
                    description="Exportar as tabelas do site (CSV e JSON)"
                    onClick={() => setShowBackupModal(true)}
                  />
                </div>
              </section>

              <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-red-900/60 bg-red-950/20">
                <div>
                  <h2 className="text-sm font-medium text-red-200">Remover escola</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Apaga a escola e seus dados do observatório. Não pode ser desfeito.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-200 border border-red-800 rounded-lg hover:bg-red-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                  Remover escola...
                </button>
              </section>
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
        </div>
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