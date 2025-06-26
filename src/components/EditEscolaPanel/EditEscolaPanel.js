import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Image as ImageIcon, User, BookOpen, MapPin, Users, Settings, FileText, Video } from 'lucide-react';
import ImageUploadSection from './ImageUploadSection';
import ProfessorImageUploadSection from './ProfessorImageUploadSection';
import VideoSection from './VideoSection';

const EditEscolaPanel = ({ escola, onClose, onSave }) => {
  const [nomeEscola, setNomeEscola] = useState(escola?.Escola || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dados-basicos');

  // Configuração das abas
  const tabs = [
    { 
      id: 'dados-basicos', 
      label: 'Dados Básicos', 
      icon: BookOpen,
      description: 'Informações principais da escola'
    },
    { 
      id: 'imagens-escola', 
      label: 'Imagens da Escola', 
      icon: ImageIcon,
      description: 'Upload e gerenciamento de imagens da escola (máx. 10)'
    },
    { 
      id: 'imagens-professores', 
      label: 'Imagens dos Professores', 
      icon: User,
      description: 'Upload e gerenciamento de imagens dos professores (máx. 5)'
    },
    { 
      id: 'video', 
      label: 'Vídeo', 
      icon: Video,
      description: 'Link do vídeo e gerenciamento de títulos'
    },
    { 
      id: 'localizacao', 
      label: 'Localização', 
      icon: MapPin,
      description: 'Coordenadas e endereço da escola'
    },
    { 
      id: 'gestao', 
      label: 'Gestão', 
      icon: Users,
      description: 'Informações sobre gestão e funcionários'
    },
    { 
      id: 'configuracoes', 
      label: 'Configurações', 
      icon: Settings,
      description: 'Configurações avançadas da escola'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeEscola.trim()) {
      setError('O nome da escola é obrigatório.');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      await onSave({ ...escola, Escola: nomeEscola });
      onClose();
    } catch (err) {
      setError('Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler para atualização de imagens
  const handleImagesUpdate = () => {
    // Aqui você pode adicionar lógica para atualizar o PainelInformacoes
    // Por exemplo, disparar um evento ou callback para refresh
    console.log('Imagens atualizadas - PainelInformacoes deve ser atualizado');
  };

  // Handler para atualização de títulos
  const handleTitulosUpdate = () => {
    console.log('Títulos atualizados - PainelInformacoes deve ser atualizado');
  };

  // Renderizar conteúdo da aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dados-basicos':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Escola *
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={nomeEscola}
                onChange={e => setNomeEscola(e.target.value)}
                disabled={isSaving}
                placeholder="Digite o nome da escola"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Município
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={escola?.['Município'] || ''}
                  onChange={e => onSave({ ...escola, 'Município': e.target.value })}
                  placeholder="Nome do município"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terra Indígena (TI)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={escola?.['Terra Indigena (TI)'] || ''}
                  onChange={e => onSave({ ...escola, 'Terra Indigena (TI)': e.target.value })}
                  placeholder="Nome da terra indígena"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                value={escola?.['Endereço'] || ''}
                onChange={e => onSave({ ...escola, 'Endereço': e.target.value })}
                placeholder="Endereço completo da escola"
              />
            </div>
          </div>
        );

      case 'imagens-escola':
        return (
          <ImageUploadSection 
            escolaId={escola?.id} 
            onImagesUpdate={handleImagesUpdate}
          />
        );

      case 'imagens-professores':
        return (
          <ProfessorImageUploadSection 
            escolaId={escola?.id} 
            onImagesUpdate={handleImagesUpdate}
          />
        );

      case 'video':
        return (
          <VideoSection 
            escolaId={escola?.id}
            videoUrl={escola?.['link_para_videos'] || ''}
            onVideoUrlChange={(value) => onSave({ ...escola, 'link_para_videos': value })}
            onTitulosUpdate={handleTitulosUpdate}
          />
        );

      case 'localizacao':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={escola?.latitude || ''}
                  onChange={e => onSave({ ...escola, latitude: parseFloat(e.target.value) || null })}
                  placeholder="Ex: -23.5505"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={escola?.longitude || ''}
                  onChange={e => onSave({ ...escola, longitude: parseFloat(e.target.value) || null })}
                  placeholder="Ex: -46.6333"
                />
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Dica:</strong> Use o Google Maps para encontrar as coordenadas exatas da escola.
                Clique com o botão direito no local da escola e selecione as coordenadas.
              </p>
            </div>
          </div>
        );

      case 'gestao':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gestão/Nome
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={escola?.gestao || ''}
                onChange={e => onSave({ ...escola, gestao: e.target.value })}
                placeholder="Nome da gestão atual"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professores Indígenas
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={escola?.professores_indigenas || ''}
                  onChange={e => onSave({ ...escola, professores_indigenas: e.target.value })}
                  placeholder="Quantidade ou nomes"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professores Não Indígenas
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={escola?.professores_nao_indigenas || ''}
                  onChange={e => onSave({ ...escola, professores_nao_indigenas: e.target.value })}
                  placeholder="Quantidade ou nomes"
                />
              </div>
            </div>
          </div>
        );

      case 'infraestrutura':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merenda diferenciada
              </label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                value={escola?.merenda_diferenciada || ''}
                onChange={e => onSave({ ...escola, merenda_diferenciada: e.target.value })}
                placeholder="Descreva a situação do fornecimento de merenda (ex: se a escola recebe, se há interrupções, etc.)"
              />
            </div>
          </div>
        );

      case 'configuracoes':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Configurações Avançadas:</strong> Esta seção será implementada em breve.
                Aqui você poderá configurar permissões, notificações e outras opções avançadas.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Detectar se é mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${isMobile ? 'p-0' : ''}`}
      style={{
        padding: isMobile ? 0 : undefined,
      }}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col ${isMobile ? 'rounded-none h-screen max-w-full' : ''}`}
        style={{
          width: isMobile ? '100vw' : 'min(100vw, 640px)',
          height: isMobile ? '100vh' : 'min(90vh, 900px)',
          maxWidth: isMobile ? '100vw' : '96vw',
          maxHeight: isMobile ? '100vh' : '90vh',
          overflow: 'hidden',
        }}
      >
      {/* Header */}
        <div className={`flex items-center justify-between ${isMobile ? 'p-4' : 'p-6'} border-b`}>
            <h2 className={`text-xl font-semibold text-gray-900 ${isMobile ? 'text-lg' : ''}`}>
              Editar Escola: {escola?.Escola || 'Nova Escola'}
            </h2>
          <button
            onClick={onClose}
            className={`text-gray-400 hover:text-gray-600 ${isMobile ? 'w-8 h-8' : ''}`}
            style={isMobile ? { fontSize: 24 } : {}}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
      </div>

        {/* Tabs */}
        <nav
          className={`flex border-b bg-gray-50 ${isMobile ? 'overflow-x-auto no-scrollbar' : ''}`}
          style={isMobile ? { WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' } : {}}
          role="tablist"
          aria-label="Abas de edição da escola"
        >
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? 'text-blue-700 border-b-4 border-blue-600 bg-white shadow-sm' // feedback visual forte
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                } ${isMobile ? 'px-2 py-2 text-xs' : ''}`}
                title={tab.description}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                <span className={`${isMobile ? 'hidden xs:inline' : ''}`}>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-6'}`} style={isMobile ? { fontSize: '1rem' } : {}}>
        <form onSubmit={handleSubmit}>
          {/* Conteúdo da aba ativa */}
          <div className="min-h-[300px] md:min-h-[400px]" id={`tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}> 
            {renderTabContent()}
          </div>

          {/* Mensagens de erro */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Botões de ação */}
          <div className={`flex gap-3 mt-6 pt-6 border-t border-gray-200 ${isMobile ? 'flex-col' : ''}`}
            style={isMobile ? { gap: 8 } : {}}>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${isMobile ? 'w-full text-base' : ''}`}
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors ${isMobile ? 'w-full text-base' : ''}`}
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

EditEscolaPanel.propTypes = {
  escola: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditEscolaPanel;