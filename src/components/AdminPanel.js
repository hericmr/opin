import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Search, Filter, Edit2, Trash2, X, MapPin, Star } from 'lucide-react';
import EditEscolaPanel from './EditEscolaPanel/EditEscolaPanel';
import DocumentViewer from './PainelInformacoes/components/DocumentViewer';
console.log('DEBUG: EditEscolaPanel', EditEscolaPanel);
console.log('DEBUG: DocumentViewer', DocumentViewer);

const AdminPanel = () => {
  const [escolas, setEscolas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [editingLocation, setEditingLocation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('dados-basicos');
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

  // Configuração das abas
  const tabs = [
    { id: 'dados-basicos', label: 'Dados Básicos' },
    { id: 'povos-linguas', label: 'Povos e Línguas' },
    { id: 'ensino', label: 'Ensino' },
    { id: 'infraestrutura', label: 'Infraestrutura' },
    { id: 'gestao-professores', label: 'Gestão e Professores' },
    { id: 'material-pedagogico', label: 'Material Pedagógico' },
    { id: 'projetos-parcerias', label: 'Projetos e Parcerias' },
    { id: 'redes-sociais', label: 'Redes Sociais' },
    { id: 'video', label: 'Vídeo' },
    { id: 'historias', label: 'Histórias' },
    { id: 'coordenadas', label: 'Coordenadas' },
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
        // Dados Básicos
        'Escola': editingLocation.Escola,
        'Município': editingLocation['Município'],
        'Endereço': editingLocation['Endereço'],
        'Terra Indigena (TI)': editingLocation['Terra Indigena (TI)'],
        'Escola Estadual ou Municipal': editingLocation['Escola Estadual ou Municipal'],
        'Diretoria de Ensino': editingLocation['Diretoria de Ensino'],
        'Ano de criação da escola': editingLocation['Ano de criação da escola'],
        
        // Povos e Línguas
        'Povos indigenas': editingLocation['Povos indigenas'],
        'Linguas faladas': editingLocation['Linguas faladas'],
        
        // Ensino
        'Modalidade de Ensino/turnos de funcionamento': editingLocation['Modalidade de Ensino/turnos de funcionamento'],
        'Numero de alunos': editingLocation['Numero de alunos'],
        'disciplinas_bilingues': editingLocation['disciplinas_bilingues'],
        'formas_avaliacao': editingLocation['formas_avaliacao'],
        
        // Infraestrutura
        'espaco_escolar': editingLocation['espaco_escolar'],
        'cozinha_merenda': editingLocation['cozinha_merenda'],
        'acesso_agua': editingLocation['acesso_agua'],
        'coleta_lixo': editingLocation['coleta_lixo'],
        'acesso_internet': editingLocation['acesso_internet'],
        'equipamentos': editingLocation['equipamentos'],
        'modo_acesso': editingLocation['modo_acesso'],
        
        // Gestão e Professores
        'gestao': editingLocation['gestao'],
        'outros_funcionarios': editingLocation['outros_funcionarios'],
        'professores_indigenas': editingLocation['professores_indigenas'],
        'professores_nao_indigenas': editingLocation['professores_nao_indigenas'],
        'professores_falam_lingua': editingLocation['professores_falam_lingua'],
        'formacao_professores': editingLocation['formacao_professores'],
        'formacao_continuada': editingLocation['formacao_continuada'],
        
        // Material Pedagógico
        'material_nao_indigena': editingLocation['material_nao_indigena'],
        'material_indigena': editingLocation['material_indigena'],
        'praticas_pedagogicas': editingLocation['praticas_pedagogicas'],
        
        // Projetos e Parcerias
        'projetos_andamento': editingLocation['projetos_andamento'],
        'parcerias_universidades': editingLocation['parcerias_universidades'],
        'acoes_ongs': editingLocation['acoes_ongs'],
        'desejos_comunidade': editingLocation['desejos_comunidade'],
        
        // Redes Sociais e Links
        'usa_redes_sociais': editingLocation['usa_redes_sociais'],
        'links_redes_sociais': editingLocation['links_redes_sociais'],
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
      
      // Feedback de sucesso
      setSaveSuccess(true);
      setTimeout(() => {
        setEditingLocation(null);
        setSaveSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Erro ao salvar:', error);
      setSaveError(`Erro ao salvar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  console.log('DEBUG: editingLocation (antes do return)', editingLocation);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menu lateral */}
      <aside className="w-64 bg-white border-r p-4 overflow-y-auto max-h-screen">
        <h2 className="text-lg font-bold mb-4">Escolas</h2>
        
        {/* Busca no menu lateral */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar escola..."
            className="w-full px-3 py-2 border rounded text-sm"
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
                onClick={() => setEditingLocation(escola)}
              >
                {escola.Escola}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Painel de Administração</h1>
        
        {/* Barra de ferramentas */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Campo de busca */}
            <div className="relative flex-1">
              {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
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
              {/* <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Editar Escola</h2>
              <button
                onClick={() => setEditingLocation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Fechar
              </button>
            </div>

            {/* Navegação por abas */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <form onSubmit={handleSave}>
              {/* Conteúdo das abas */}
              <div className="min-h-[400px]">
                {/* Aba: Dados Básicos */}
                {activeTab === 'dados-basicos' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Escola *</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation.Escola || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, Escola: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Município</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['Município'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Município': e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['Endereço'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Endereço': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Terra Indígena (TI)</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['Terra Indigena (TI)'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Terra Indigena (TI)': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Escola</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['Escola Estadual ou Municipal'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Escola Estadual ou Municipal': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diretoria de Ensino</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['Diretoria de Ensino'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Diretoria de Ensino': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ano de Criação</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['Ano de criação da escola'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Ano de criação da escola': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Povos e Línguas */}
                {activeTab === 'povos-linguas' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Povos Indígenas</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['Povos indigenas'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Povos indigenas': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Línguas Faladas</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['Linguas faladas'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Linguas faladas': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Ensino */}
                {activeTab === 'ensino' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Modalidade de Ensino/Turnos</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['Modalidade de Ensino/turnos de funcionamento'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Modalidade de Ensino/turnos de funcionamento': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número de Alunos</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['Numero de alunos'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'Numero de alunos': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Disciplinas Bilíngues</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['disciplinas_bilingues'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'disciplinas_bilingues': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Formas de Avaliação</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['formas_avaliacao'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'formas_avaliacao': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Infraestrutura */}
                {activeTab === 'infraestrutura' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Espaço Escolar e Estrutura</label>
                      <textarea
                        className="w-full border rounded px-3 py-2 h-20"
                        value={editingLocation['espaco_escolar'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'espaco_escolar': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cozinha/Merenda Escolar</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['cozinha_merenda'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'cozinha_merenda': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Acesso à Água</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['acesso_agua'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'acesso_agua': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Coleta de Lixo</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['coleta_lixo'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'coleta_lixo': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Acesso à Internet</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['acesso_internet'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'acesso_internet': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Equipamentos Tecnológicos</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['equipamentos'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'equipamentos': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Modo de Acesso à Escola</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['modo_acesso'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'modo_acesso': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Gestão e Professores */}
                {activeTab === 'gestao-professores' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gestão/Nome</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['gestao'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'gestao': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Outros Funcionários</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['outros_funcionarios'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'outros_funcionarios': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professores Indígenas</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['professores_indigenas'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'professores_indigenas': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professores Não Indígenas</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['professores_nao_indigenas'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'professores_nao_indigenas': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professores Falam a Língua Indígena</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['professores_falam_lingua'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'professores_falam_lingua': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Formação dos Professores</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['formacao_professores'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'formacao_professores': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Formação Continuada</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['formacao_continuada'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'formacao_continuada': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Material Pedagógico */}
                {activeTab === 'material-pedagogico' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Material Pedagógico Não Indígena</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['material_nao_indigena'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'material_nao_indigena': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Material Pedagógico Indígena</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['material_indigena'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'material_indigena': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Práticas Pedagógicas Indígenas</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['praticas_pedagogicas'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'praticas_pedagogicas': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Projetos e Parcerias */}
                {activeTab === 'projetos-parcerias' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Projetos em Andamento</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['projetos_andamento'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'projetos_andamento': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parcerias com Universidades</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['parcerias_universidades'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'parcerias_universidades': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ações com ONGs ou Coletivos</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['acoes_ongs'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'acoes_ongs': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Desejos da Comunidade</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['desejos_comunidade'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'desejos_comunidade': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Redes Sociais */}
                {activeTab === 'redes-sociais' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Utiliza Redes Sociais</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['usa_redes_sociais'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'usa_redes_sociais': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Links das Redes Sociais</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['links_redes_sociais'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'links_redes_sociais': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Links Gerais</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['links'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'links': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Vídeo */}
                {activeTab === 'video' && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link para Vídeo</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['link_para_videos'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'link_para_videos': e.target.value })}
                        placeholder="Cole aqui o link do vídeo (YouTube, Vimeo, etc)"
                      />
                      <p className="text-xs text-gray-500 mt-1">Exemplo: https://www.youtube.com/watch?v=...</p>
                    </div>
                    {editingLocation['link_para_videos'] && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pré-visualização</label>
                        <div className="aspect-w-16 aspect-h-9 bg-black rounded overflow-hidden">
                          <iframe
                            src={getVideoEmbedUrl(editingLocation['link_para_videos'])}
                            title="Pré-visualização do vídeo"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Aba: Histórias */}
                {activeTab === 'historias' && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">História da Escola</label>
                      <textarea
                        className="w-full border rounded px-3 py-2 h-32"
                        value={editingLocation['historia_da_escola'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'historia_da_escola': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">História do Professor</label>
                      <textarea
                        className="w-full border rounded px-3 py-2 h-32"
                        value={editingLocation['historia_do_prof'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'historia_do_prof': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Coordenadas */}
                {activeTab === 'coordenadas' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['latitude'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'latitude': e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        className="w-full border rounded px-3 py-2"
                        value={editingLocation['longitude'] || ''}
                        onChange={e => setEditingLocation({ ...editingLocation, 'longitude': e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Aba: Documentos */}
                {activeTab === 'documentos' && (
                  <div className="space-y-6">
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
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                              <input
                                type="text"
                                required
                                className="w-full border rounded px-3 py-2"
                                value={newDocument.titulo}
                                onChange={e => setNewDocument({ ...newDocument, titulo: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                              <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                value={newDocument.autoria}
                                onChange={e => setNewDocument({ ...newDocument, autoria: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                              <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                value={newDocument.tipo}
                                onChange={e => setNewDocument({ ...newDocument, tipo: e.target.value })}
                                placeholder="Ex: PDF, Relatório, Plano de Aula"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link do PDF *</label>
                              <input
                                type="url"
                                required
                                className="w-full border rounded px-3 py-2"
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
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Adicionar Documento
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddDocument(false);
                                setNewDocument({ titulo: '', autoria: '', tipo: '', link_pdf: '' });
                              }}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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
                              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                              <input
                                type="text"
                                required
                                className="w-full border rounded px-3 py-2"
                                value={editingDocument.titulo}
                                onChange={e => setEditingDocument({ ...editingDocument, titulo: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                              <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                value={editingDocument.autoria || ''}
                                onChange={e => setEditingDocument({ ...editingDocument, autoria: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                              <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                value={editingDocument.tipo || ''}
                                onChange={e => setEditingDocument({ ...editingDocument, tipo: e.target.value })}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link do PDF *</label>
                              <input
                                type="url"
                                required
                                className="w-full border rounded px-3 py-2"
                                value={editingDocument.link_pdf}
                                onChange={e => setEditingDocument({ ...editingDocument, link_pdf: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                              Atualizar Documento
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingDocument(null)}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {saveError}
              </div>
            )}
            
            {/* Feedback de sucesso */}
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                Escola salva com sucesso!
              </div>
            )}
            
            <div className="flex gap-2 mt-6">
              <button 
                onClick={handleSave}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  isSaving 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
              <button 
                type="button" 
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400" 
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