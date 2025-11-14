import React from 'react';
import { FORM_CONFIG } from '../constants/adminConstants';
import DadosBasicosTab from '../tabs/DadosBasicosTab';
import PovosLinguasTab from '../tabs/PovosLinguasTab';
import ModalidadesTab from '../tabs/ModalidadesTab';
import InfraestruturaTab from '../tabs/InfraestruturaTab';
import GestaoProfessoresTab from '../tabs/GestaoProfessoresTab';
import MaterialPedagogicoTab from '../tabs/MaterialPedagogicoTab';
import ProjetosParceriasTab from '../tabs/ProjetosParceriasTab';
import RedesSociaisTab from '../tabs/RedesSociaisTab';
import VideoTab from '../tabs/VideoTab';
import HistoriasTab from '../tabs/HistoriasTab';
import HistoriaProfessoresTab from '../tabs/HistoriaProfessoresTab';
import CoordenadasTab from '../tabs/CoordenadasTab';
import ImagensEscolaTab from '../tabs/ImagensEscolaTab';
import ImagensProfessoresTab from '../tabs/ImagensProfessoresTab';
import DocumentosTab from '../tabs/DocumentosTab';

/**
 * Renderiza a aba ativa do painel de administração
 * @param {Object} editingLocation - Objeto com dados da escola sendo editada
 * @param {Function} setEditingLocation - Função para atualizar o estado de edição
 * @returns {JSX.Element} Componente da aba ativa
 */
export const renderActiveTab = (editingLocation, setEditingLocation) => {
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
          setEditingLocation={setEditingLocation}
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
      return (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              Tabela de Histórias dos Professores
            </h3>
            <p className="text-gray-400 mb-8">
              Funcionalidade em desenvolvimento...
            </p>
          </div>
        </div>
      );
    
    case 'documentos-escola':
      return (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              Tabela de Documentos das Escolas
            </h3>
            <p className="text-gray-400 mb-8">
              Funcionalidade em desenvolvimento...
            </p>
          </div>
        </div>
      );
    
    case 'imagens-escola':
      return (
        <ImagensEscolaTab 
          editingLocation={editingLocation} 
          setEditingLocation={setEditingLocation} 
        />
      );
    
    case 'imagens-professores':
      return (
        <ImagensProfessoresTab 
          editingLocation={editingLocation} 
          setEditingLocation={setEditingLocation} 
        />
      );
    
    case 'documentos':
      return (
        <DocumentosTab 
          editingLocation={editingLocation} 
          setEditingLocation={setEditingLocation} 
        />
      );
    
    default:
      return (
        <div className="text-gray-400 text-center py-8">
          Aba "{activeTab}" em desenvolvimento...
        </div>
      );
  }
};







