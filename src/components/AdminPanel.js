import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ImageUploadSection, ProfessorImageUploadSection } from './EditEscolaPanel';
import VideoSection from './EditEscolaPanel/VideoSection';
import DocumentViewer from './PainelInformacoes/components/DocumentViewer';
import { useRefresh } from '../contexts/RefreshContext';
import { Menu } from 'lucide-react';

const AdminPanel = () => {
  const { triggerRefresh } = useRefresh();
  const [escolas, setEscolas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [editingLocation, setEditingLocation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [newDocument, setNewDocument] = useState({
    titulo: '',
    autoria: '',
    tipo: '',
    link_pdf: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detectar se é mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Configuração das abas
  const tabs = [
    { id: 'dados-basicos', label: 'Dados Básicos' },
    { id: 'povos-linguas', label: 'Povos' },
    { id: 'ensino', label: 'Ensino' },
    { id: 'infraestrutura', label: 'Infraestrutura' },
    { id: 'gestao-professores', label: 'Gestores' },
    { id: 'material-pedagogico', label: 'Material Pedagógico' },
    { id: 'projetos-parcerias', label: 'Projetos e Parcerias' },
    { id: 'redes-sociais', label: 'Redes Sociais' },
    { id: 'video', label: 'Vídeo' },
    { id: 'historias', label: 'Histórias' },
    { id: 'coordenadas', label: 'Coordenadas' },
    { id: 'imagens-escola', label: 'Imagens da Escola' },
    { id: 'imagens-professores', label: 'Imagens dos Professores' },
    { id: 'documentos', label: 'Documentos' }
  ];

  // Buscar todos os locais
  useEffect(() => {
    const fetchEscolas = async () => {
      try {
        const { data, error } = await supabase
          .from('escolas_completa')
          .select('*')
          .order('Escola', { ascending: true });

        if (error) throw error;
        setEscolas(data);
      } catch (err) {
        console.error('Erro ao buscar escolas:', err);
      }
    };

    fetchEscolas();
  }, []);

  // Buscar documentos da escola selecionada
  const fetchDocumentos = async (escolaId) => {
    try {
      setLoadingDocumentos(true);
      const { data, error } = await supabase
        .from('documentos_escola')
        .select('*')
        .eq('escola_id', escolaId)
        .order('titulo', { ascending: true });

      if (error) throw error;
      setDocumentos(data || []);
    } catch (err) {
      console.error('Erro ao buscar documentos:', err);
      setDocumentos([]);
    } finally {
      setLoadingDocumentos(false);
    }
  };

  // Buscar documentos quando uma escola for selecionada para edição
  useEffect(() => {
    if (editingLocation?.id) {
      fetchDocumentos(editingLocation.id);
    }
  }, [editingLocation?.id]);

  // Funções para gerenciar documentos
  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!editingLocation?.id) return;

    try {
      const { data, error } = await supabase
        .from('documentos_escola')
        .insert([{
          ...newDocument,
          escola_id: editingLocation.id
        }])
        .select();

      if (error) throw error;

      setDocumentos([...documentos, data[0]]);
      setNewDocument({ titulo: '', autoria: '', tipo: '', link_pdf: '' });
      setShowAddDocument(false);
    } catch (err) {
      console.error('Erro ao adicionar documento:', err);
      alert('Erro ao adicionar documento. Tente novamente.');
    }
  };

  const handleUpdateDocument = async (e) => {
    e.preventDefault();
    if (!editingDocument?.id) return;

    try {
      const { error } = await supabase
        .from('documentos_escola')
        .update(editingDocument)
        .eq('id', editingDocument.id);

      if (error) throw error;

      setDocumentos(documentos.map(doc => 
        doc.id === editingDocument.id ? editingDocument : doc
      ));
      setEditingDocument(null);
    } catch (err) {
      console.error('Erro ao atualizar documento:', err);
      alert('Erro ao atualizar documento. Tente novamente.');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      const { error } = await supabase
        .from('documentos_escola')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocumentos(documentos.filter(doc => doc.id !== documentId));
    } catch (err) {
      console.error('Erro ao excluir documento:', err);
      alert('Erro ao excluir documento. Tente novamente.');
    }
  };

  // Função de validação
  const validateForm = (data) => {
    const errors = [];
    if (!data.Escola || data.Escola.trim() === '') {
      errors.push('Nome da escola é obrigatório');
    }
    return errors;
  };

  // Função para salvar com validação e feedback
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validar formulário
    const validationErrors = validateForm(editingLocation);
    if (validationErrors.length > 0) {
      setSaveError(validationErrors.join(', '));
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Preparar dados para atualização - organizados por seções
      const updateData = {
        // Dados básicos
        'Escola': editingLocation.Escola,
        'Município': editingLocation.Município,
        'Endereço': editingLocation.Endereço,
        'Terra Indigena (TI)': editingLocation['Terra Indigena (TI)'],
        'Parcerias com o município': editingLocation['Parcerias com o município'],
        'Diretoria de Ensino': editingLocation['Diretoria de Ensino'],
        'Ano de criação da escola': editingLocation['Ano de criação da escola'],
        
        // Povos e Línguas
        'Povos indigenas': editingLocation['Povos indigenas'],
        'Linguas faladas': editingLocation['Linguas faladas'],
        
        // Ensino
        'Modalidade de Ensino/turnos de funcionamento': editingLocation['Modalidade de Ensino/turnos de funcionamento'],
        'Numero de alunos': editingLocation['Numero de alunos'],
        
        // Infraestrutura
        'Espaço escolar e estrutura': editingLocation['Espaço escolar e estrutura'],
        'Acesso à água': editingLocation['Acesso à água'],
        'Tem coleta de lixo?': editingLocation['Tem coleta de lixo?'],
        'Acesso à internet': editingLocation['Acesso à internet'],
        'Equipamentos Tecnológicos (Computadores, tablets e impressoras)': editingLocation['Equipamentos Tecnológicos (Computadores, tablets e impressoras)'],
        'Modo de acesso à escola': editingLocation['Modo de acesso à escola'],
        
        // Gestores
        'Gestão/Nome': editingLocation['Gestão/Nome'],
        'Outros funcionários': editingLocation['Outros funcionários'],
        'Quantidade de professores indígenas': editingLocation['Quantidade de professores indígenas'],
        'Quantidade de professores não indígenas': editingLocation['Quantidade de professores não indígenas'],
        'Professores falam a língua indígena?': editingLocation['Professores falam a língua indígena?'],
        'Formação dos professores': editingLocation['Formação dos professores'],
        'Formação continuada oferecida': editingLocation['Formação continuada oferecida'],
        
        // Projeto Pedagógico
        'A escola possui PPP próprio?': editingLocation['A escola possui PPP próprio?'],
        'PPP elaborado com a comunidade?': editingLocation['PPP elaborado com a comunidade?'],
        'Linguas faladas': editingLocation['Linguas faladas'],
        
        // Projetos e Parcerias
        'Projetos em andamento': editingLocation['Projetos em andamento'],
        'Parcerias com universidades?': editingLocation['Parcerias com universidades?'],
        'Ações com ONGs ou coletivos?': editingLocation['Ações com ONGs ou coletivos?'],
        'Desejos da comunidade para a escola': editingLocation['Desejos da comunidade para a escola'],
        
        // Redes Sociais e Links
        'Escola utiliza redes sociais?': editingLocation['Escola utiliza redes sociais?'],
        'Links das redes sociais': editingLocation['Links das redes sociais'],
        'links': editingLocation['links'],
        'link_para_videos': editingLocation['link_para_videos'],
        
        // Histórias
        'historia_da_escola': editingLocation['historia_da_escola'],
        'historia_do_prof': editingLocation['historia_do_prof'],
        
        // Coordenadas
        'latitude': editingLocation['latitude'],
        'longitude': editingLocation['longitude']
      };

      // Atualizar no Supabase
      const { error } = await supabase
        .from('escolas_completa')
        .update(updateData)
        .eq('id', editingLocation.id);

      if (error) {
        throw error;
      }

      // Atualizar lista local
      setEscolas(escolas.map(escola => escola.id === editingLocation.id ? { ...escola, ...editingLocation } : escola));
      
      // Feedback de sucesso - manter o painel aberto
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Erro ao salvar:', error);
      setSaveError(`Erro ao salvar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Abrir edição inline
  const openEditModal = (escola) => {
    setEditingLocation({ ...escola, activeTab: 'dados-basicos' });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Botão de menu para mobile */}
      {isMobile && !sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-white rounded-full shadow-lg p-2 border border-gray-200"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}
      {/* Menu lateral */}
      {(!isMobile || sidebarOpen) && (
        <aside
          className={`bg-white border-r p-4 overflow-y-auto h-screen sticky top-0 z-40 transition-transform duration-300 ${
            isMobile ? 'fixed left-0 top-0 w-64 max-w-[80vw] shadow-2xl' : 'w-64'
          }`}
          style={{
            transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          }}
        >
          {/* Botão de fechar para mobile */}
          {isMobile && (
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu lateral"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <h2 className="text-lg font-bold mb-4 sticky top-0 bg-white pb-2">Escolas</h2>
          {/* Busca no menu lateral */}
          <div className="mb-4 sticky top-12 bg-white pb-2">
            <input
              type="text"
              placeholder="Buscar escola..."
              className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="space-y-1">
            {escolas
              .filter(escola => 
                escola.Escola?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(escola => (
              <li key={escola.id}>
                <button
                  className={`block w-full text-left px-2 py-1 rounded hover:bg-blue-100 text-sm ${editingLocation?.id === escola.id ? 'bg-blue-200 font-bold' : ''}`}
                  onClick={() => {
                    setEditingLocation({ ...escola, activeTab: 'dados-basicos' });
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  {escola.Escola}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      )}
      {/* Conteúdo principal */}
      <main className="flex-1 p-6 overflow-y-auto h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Painel de Administração</h1>
        {/* Barra de ferramentas */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Campo de busca */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por título ou descrição..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Filtro por tipo */}
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="todos">Todos</option>
              </select>
            </div>
          </div>
        </div>
        {/* Painel de Edição */}
        {editingLocation && typeof editingLocation === 'object' && editingLocation.id && editingLocation.Escola && (
          <div className="bg-white rounded-lg shadow-lg p-6 max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h2 className="text-lg font-semibold">Editar Escola</h2>
              <button
                onClick={() => setEditingLocation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Fechar
              </button>
            </div>
            {/* Navegação por abas */}
            <div className="border-b border-gray-200 mb-6 flex-shrink-0">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEditingLocation({ ...editingLocation, activeTab: tab.id })}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                      (editingLocation.activeTab || 'dados-basicos') === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
              {/* Conteúdo das abas */}
              <div className="flex-1 overflow-y-auto">
                {/* Aba: Dados Básicos */}
                {(editingLocation.activeTab || 'dados-basicos') === 'dados-basicos' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Nome da Escola *</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation.Escola || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, Escola: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Município</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation.Município || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, Município: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Endereço</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation.Endereço || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, Endereço: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Terra Indígena (TI)</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Terra Indigena (TI)'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Terra Indigena (TI)': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Diretoria de Ensino</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Diretoria de Ensino'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Diretoria de Ensino': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Ano de Criação</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Ano de criação da escola'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Ano de criação da escola': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Povos */}
                {editingLocation.activeTab === 'povos-linguas' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Povos</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Povos indigenas'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Povos indigenas': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Línguas Faladas</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Linguas faladas'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Linguas faladas': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Ensino */}
                {editingLocation.activeTab === 'ensino' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Modalidade de Ensino/Turnos</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Modalidade de Ensino/turnos de funcionamento'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Modalidade de Ensino/turnos de funcionamento': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Número de Alunos</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Numero de alunos'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Numero de alunos': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Línguas Faladas</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Linguas faladas'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Linguas faladas': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Infraestrutura */}
                {editingLocation.activeTab === 'infraestrutura' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Espaço Escolar e Estrutura</label>
                      <textarea
                        className="w-full border rounded px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Espaço escolar e estrutura'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Espaço escolar e estrutura': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Acesso à Água</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Acesso à água'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Acesso à água': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Coleta de Lixo</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Tem coleta de lixo?'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Tem coleta de lixo?': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Acesso à Internet</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Acesso à internet'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Acesso à internet': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Equipamentos Tecnológicos</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Equipamentos Tecnológicos (Computadores, tablets e impressoras)'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Equipamentos Tecnológicos (Computadores, tablets e impressoras)': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Modo de Acesso à Escola</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Modo de acesso à escola'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Modo de acesso à escola': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Gestores */}
                {editingLocation.activeTab === 'gestao-professores' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Gestão/Nome</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Gestão/Nome'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Gestão/Nome': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Professores Indígenas</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Quantidade de professores indígenas'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Quantidade de professores indígenas': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Professores Não Indígenas</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Quantidade de professores não indígenas'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Quantidade de professores não indígenas': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Outros Funcionários</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Outros funcionários'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Outros funcionários': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Professores Falantes da Língua Indígena</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Professores falam a língua indígena?'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Professores falam a língua indígena?': e.target.value })}
                        placeholder="Ex: 3 professores"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Informe o número de professores que falam a língua indígena
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Identificação dos Professores</label>
                      <textarea
                        className="w-full border rounded px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Formação dos professores'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Formação dos professores': e.target.value })}
                        placeholder="Ex: Karai Poty (Abilio Fernandes) – LINDI"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Formação Continuada</label>
                      <textarea
                        className="w-full border rounded px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Formação continuada oferecida'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Formação continuada oferecida': e.target.value })}
                        placeholder="Descreva as visitas de supervisores, formações oferecidas, etc."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Descreva as visitas de supervisores, formações continuadas e acompanhamento pedagógico
                      </p>
                    </div>
                  </div>
                )}

                {/* Aba: Material Pedagógico */}
                {editingLocation.activeTab === 'material-pedagogico' && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Materiais Pedagógicos</h4>
                      <p className="text-sm text-blue-700">
                        Materiais diferenciados e não diferenciados, produzidos dentro e fora da comunidade.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-base">
                          Material Pedagógico Não Indígena
                        </label>
                        <textarea
                          className="w-full border rounded px-3 py-2 h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                          value={editingLocation['Material pedagógico não indígena'] || ''}
                          onChange={e => setEditingLocation({ ...editingLocation, 'Material pedagógico não indígena': e.target.value })}
                          placeholder="Descreva os materiais pedagógicos produzidos fora da comunidade indígena"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Materiais produzidos fora da comunidade indígena
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-base">
                          Material Pedagógico Indígena
                        </label>
                        <textarea
                          className="w-full border rounded px-3 py-2 h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                          value={editingLocation['Material pedagógico indígena'] || ''}
                          onChange={e => setEditingLocation({ ...editingLocation, 'Material pedagógico indígena': e.target.value })}
                          placeholder="Descreva os materiais pedagógicos produzidos dentro da comunidade indígena"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Materiais produzidos dentro da comunidade indígena
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Aba: Projetos e Parcerias */}
                {editingLocation.activeTab === 'projetos-parcerias' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Projetos em Andamento</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Projetos em andamento'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Projetos em andamento': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Parcerias com Universidades</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Parcerias com universidades?'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Parcerias com universidades?': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Ações com ONGs ou Coletivos</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Ações com ONGs ou coletivos?'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Ações com ONGs ou coletivos?': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Desejos da Comunidade</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Desejos da comunidade para a escola'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Desejos da comunidade para a escola': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Redes Sociais */}
                {editingLocation.activeTab === 'redes-sociais' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Utiliza Redes Sociais</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Escola utiliza redes sociais?'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Escola utiliza redes sociais?': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Links das Redes Sociais</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['Links das redes sociais'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Links das redes sociais': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Links Gerais</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['links'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'links': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Vídeo */}
                {editingLocation.activeTab === 'video' && (
                  <VideoSection 
                    escolaId={editingLocation.id}
                    videoUrl={editingLocation['link_para_videos'] || ''}
                    onVideoUrlChange={(value) => setEditingLocation({ ...editingLocation, 'link_para_videos': value })}
                    onTitulosUpdate={() => {
                      // Atualizar o PainelInformacoes se necessário
                      console.log('Títulos de vídeo atualizados');
                    }}
                  />
                )}

                {/* Aba: Histórias */}
                {editingLocation.activeTab === 'historias' && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">História da Escola</label>
                      <textarea
                        className="w-full border rounded px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['historia_da_escola'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'historia_da_escola': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">História do Professor</label>
                      <textarea
                        className="w-full border rounded px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['historia_do_prof'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'historia_do_prof': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Coordenadas */}
                {editingLocation.activeTab === 'coordenadas' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['latitude'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'latitude': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                        value={editingLocation['longitude'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'longitude': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Imagens da Escola */}
                {editingLocation.activeTab === 'imagens-escola' && (
                  <div className="space-y-4 md:space-y-6">
                    <ImageUploadSection 
                      escolaId={editingLocation.id} 
                      onImagesUpdate={() => {
                        // Atualizar o PainelInformacoes se necessário
                        console.log('Imagens da escola atualizadas');
                        triggerRefresh();
                      }}
                    />
                  </div>
                )}

                {/* Aba: Imagens dos Professores */}
                {editingLocation.activeTab === 'imagens-professores' && (
                  <div className="space-y-4 md:space-y-6">
                    <ProfessorImageUploadSection 
                      escolaId={editingLocation.id} 
                      onImagesUpdate={() => {
                        // Atualizar o PainelInformacoes se necessário
                        console.log('Imagens dos professores atualizadas');
                        triggerRefresh();
                      }}
                    />
                  </div>
                )}

                {/* Aba: Documentos */}
                {editingLocation.activeTab === 'documentos' && (
                  <div className="space-y-4 md:space-y-6">
                    {/* Status de carregamento */}
                    {loadingDocumentos && (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-gray-600">Carregando documentos...</span>
                      </div>
                    )}

                    {/* DocumentViewer */}
                    {!loadingDocumentos && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-800">
                            Documentos da Escola ({documentos.length})
                          </h4>
                          <button
                            type="button"
                            onClick={() => setShowAddDocument(true)}
                            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] text-base"
                          >
                            + Adicionar Documento
                          </button>
                        </div>
                        
                        {documentos.length === 0 && !showAddDocument && (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 mb-4">Nenhum documento cadastrado para esta escola.</p>
                            <button
                              type="button"
                              onClick={() => setShowAddDocument(true)}
                              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] text-base"
                            >
                              Adicionar Primeiro Documento
                            </button>
                          </div>
                        )}
                        
                        {documentos.length > 0 && (
                          <DocumentViewer 
                            documentos={documentos} 
                            title="Documentos da Escola"
                          />
                        )}
                      </div>
                    )}

                    {/* Formulário para adicionar documento */}
                    {showAddDocument && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h5 className="font-medium text-blue-800 mb-4">Adicionar Novo Documento</h5>
                        <form onSubmit={handleAddDocument} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Título *</label>
                              <input
                                type="text"
                                required
                                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                                value={newDocument.titulo}
                                onChange={e => setNewDocument({ ...newDocument, titulo: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Autor</label>
                              <input
                                type="text"
                                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                                value={newDocument.autoria}
                                onChange={e => setNewDocument({ ...newDocument, autoria: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Tipo</label>
                              <input
                                type="text"
                                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                                value={newDocument.tipo}
                                onChange={e => setNewDocument({ ...newDocument, tipo: e.target.value })}
                                placeholder="Ex: PDF, Relatório, Plano de Aula"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Link do PDF *</label>
                              <input
                                type="url"
                                required
                                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                                value={newDocument.link_pdf}
                                onChange={e => setNewDocument({ ...newDocument, link_pdf: e.target.value })}
                                placeholder="https://drive.google.com/file/d/..."
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Recomendado: Link do Google Drive com permissão pública
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] text-base"
                              disabled={isSaving}
                            >
                              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                            <button
                              type="button"
                              className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors min-h-[44px] text-base"
                              onClick={() => {
                                setShowAddDocument(false);
                                setNewDocument({ titulo: '', autoria: '', tipo: '', link_pdf: '' });
                              }}
                              disabled={isSaving}
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Lista de documentos com ações */}
                    {!loadingDocumentos && documentos.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-800 mb-4">Gerenciar Documentos</h5>
                        <div className="space-y-3">
                          {documentos.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h6 className="font-medium text-gray-800">{doc.titulo}</h6>
                                {doc.autoria && (
                                  <p className="text-sm text-gray-600">Por: {doc.autoria}</p>
                                )}
                                {doc.tipo && (
                                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    {doc.tipo}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingDocument(doc)}
                                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                  Excluir
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Formulário para editar documento */}
                    {editingDocument && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h5 className="font-medium text-yellow-800 mb-4">Editar Documento</h5>
                        <form onSubmit={handleUpdateDocument} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Título *</label>
                              <input
                                type="text"
                                required
                                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                                value={editingDocument.titulo}
                                onChange={e => setEditingDocument({ ...editingDocument, titulo: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Autor</label>
                              <input
                                type="text"
                                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                                value={editingDocument.autoria || ''}
                                onChange={e => setEditingDocument({ ...editingDocument, autoria: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Tipo</label>
                              <input
                                type="text"
                                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                                value={editingDocument.tipo || ''}
                                onChange={e => setEditingDocument({ ...editingDocument, tipo: e.target.value })}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2 text-base">Link do PDF *</label>
                              <input
                                type="url"
                                required
                                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 min-h-[44px] text-base"
                                value={editingDocument.link_pdf}
                                onChange={e => setEditingDocument({ ...editingDocument, link_pdf: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] text-base"
                            >
                              Atualizar Documento
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingDocument(null)}
                              className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors min-h-[44px] text-base"
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Informações sobre documentos */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-medium text-blue-800 mb-2">Sobre os Documentos</h5>
                      <p className="text-sm text-blue-700 mb-3">
                        Os documentos são armazenados na tabela <code>documentos_escola</code> no Supabase.
                        Você pode adicionar, editar e remover documentos diretamente neste painel.
                      </p>
                      <div className="text-xs text-blue-600">
                        <p><strong>Estrutura da tabela:</strong></p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li><code>id</code> - ID único do documento</li>
                          <li><code>escola_id</code> - ID da escola (preenchido automaticamente)</li>
                          <li><code>titulo</code> - Título do documento</li>
                          <li><code>autoria</code> - Autor do documento (opcional)</li>
                          <li><code>tipo</code> - Tipo do documento (opcional)</li>
                          <li><code>link_pdf</code> - URL do documento (Google Drive ou outro)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Feedback de erro */}
            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex-shrink-0">
                {saveError}
              </div>
            )}
            
            {/* Feedback de sucesso */}
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex-shrink-0">
                Escola salva com sucesso!
              </div>
            )}
            
            <div className="flex gap-2 mt-6 pt-6 border-t border-gray-200 flex-shrink-0">
              <button 
                type="submit"
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] text-base"
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <button 
                type="button"
                className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors min-h-[44px] text-base"
                onClick={() => setEditingLocation(null)}
                disabled={isSaving}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Função utilitária para embed de vídeo
function getVideoEmbedUrl(url) {
  if (!url) return '';
  // YouTube
  const ytMatch = url.match(/(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  // Outros: retorna o próprio link
  return url;
}

export default React.memo(AdminPanel); 