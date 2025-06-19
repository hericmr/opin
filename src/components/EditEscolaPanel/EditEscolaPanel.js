import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Image as ImageIcon, User, BookOpen, MapPin, Users, Settings } from 'lucide-react';
import ImageUploadSection from './ImageUploadSection';
import ProfessorImageUploadSection from './ProfessorImageUploadSection';

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

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Editar Escola: {escola?.Escola || 'Nova Escola'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie as informações e imagens da escola
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                title={tab.description}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          {/* Conteúdo da aba ativa */}
          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>

          {/* Mensagens de erro */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
          </div>
        </form>
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