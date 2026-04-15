import { useState } from 'react';
import { useModalidades } from './useModalidades';
import { FORM_CONFIG } from '../constants/adminConstants';

/**
 * Gerencia o estado do formulário de edição de escola:
 * qual escola está sendo editada, dados originais para comparação,
 * e as ações de abrir/criar/fechar edição.
 */
export const useAdminForm = () => {
  const [editingLocation, setEditingLocation] = useState(null);
  const [dadosOriginais, setDadosOriginais] = useState(null);
  const { loadExistingModalidades, clearModalidades } = useModalidades();

  const openEditModal = (escola) => {
    loadExistingModalidades(escola['Modalidade de Ensino/turnos de funcionamento']);

    const escolaOriginal = {
      id: escola.id,
      Escola: escola.Escola,
      'Município': escola['Município'],
      'Endereço': escola['Endereço'],
      'Terra Indigena (TI)': escola['Terra Indigena (TI)'],
      'Parcerias com o município': escola['Parcerias com o município'],
      'Diretoria de Ensino': escola['Diretoria de Ensino'],
      'Ano de criação da escola': escola['Ano de criação da escola'],
      'Modalidade de Ensino/turnos de funcionamento': escola['Modalidade de Ensino/turnos de funcionamento'],
      'Numero de alunos': escola['Numero de alunos'],
      'turnos_funcionamento': escola['turnos_funcionamento'] || '',
      'salas_vinculadas': escola['salas_vinculadas'] || '',
      'Espaço escolar e estrutura': escola['Espaço escolar e estrutura'],
      'Acesso à internet': escola['Acesso à internet'],
      'Gestão/Nome': escola['Gestão/Nome'],
      'Outros funcionários': escola['Outros funcionários'],
      'Quantidade de professores indígenas': escola['Quantidade de professores indígenas'],
      'Quantidade de professores não indígenas': escola['Quantidade de professores não indígenas'],
      'Formação dos professores': escola['Formação dos professores'],
      'PPP elaborado com a comunidade?': escola['PPP elaborado com a comunidade?'],
      'outras_informacoes': escola['outras_informacoes'] || '',
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
      'formacao_professores': escola['formacao_professores'],
      'outros_funcionarios': escola['outros_funcionarios'],
      'gestao': escola['gestao'],
      'Povos indigenas': escola['Povos indigenas'],
      activeTab: FORM_CONFIG.DEFAULT_ACTIVE_TAB,
    };

    setDadosOriginais({ ...escolaOriginal });
    setEditingLocation(escolaOriginal);
  };

  const abrirTabelaEditavel = () => {
    setEditingLocation({
      id: 'tabela-editavel',
      Escola: 'Tabela Editável',
      activeTab: 'tabela-editavel',
    });
  };

  const criarNovaEscolaVazia = () => {
    clearModalidades();
    return {
      Escola: '',
      'Município': '',
      'Endereço': '',
      'Terra Indigena (TI)': '',
      'Parcerias com o município': '',
      'Diretoria de Ensino': '',
      'Ano de criação da escola': null,
      'Modalidade de Ensino/turnos de funcionamento': '',
      'Numero de alunos': null,
      'turnos_funcionamento': '',
      'salas_vinculadas': '',
      'Espaço escolar e estrutura': '',
      'Acesso à internet': '',
      'Gestão/Nome': '',
      'Outros funcionários': '',
      'Quantidade de professores indígenas': null,
      'Quantidade de professores não indígenas': null,
      'Formação dos professores': '',
      'PPP elaborado com a comunidade?': '',
      'outras_informacoes': '',
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
      'formacao_professores': '',
      'outros_funcionarios': '',
      'gestao': '',
      activeTab: FORM_CONFIG.DEFAULT_ACTIVE_TAB,
    };
  };

  const handleNovaEscola = () => {
    setEditingLocation(criarNovaEscolaVazia());
  };

  const hasMissingInfo = (tabId, escola) => {
    if (!escola) return false;

    const fieldMappings = {
      'dados-basicos': ['Escola', 'Município', 'Endereço', 'Terra Indigena (TI)', 'Diretoria de Ensino'],
      'povos-linguas': ['Povos indigenas'],
      'modalidades': ['Modalidade de Ensino/turnos de funcionamento', 'Numero de alunos'],
      'infraestrutura': ['Espaço escolar e estrutura', 'Acesso à internet'],
      'gestao-professores': ['Gestão/Nome', 'Quantidade de professores indígenas', 'Quantidade de professores não indígenas'],
      'funcionarios': ['Outros funcionários'],
      'material-pedagogico': ['Material pedagógico indígena'],
      'projetos-parcerias': ['outras_informacoes'],
      'video': ['link_para_videos'],
      'historia-professores': ['nome_professor'],
      'coordenadas': ['Latitude', 'Longitude'],
      'imagens-escola': ['imagem_header'],
      'imagens-professores': [],
      'documentos': [],
    };

    const fields = fieldMappings[tabId] || [];
    return fields.some(field => {
      const value = escola[field];
      return value === null || value === undefined || value === '' || value === 'null';
    });
  };

  return {
    editingLocation,
    setEditingLocation,
    dadosOriginais,
    setDadosOriginais,
    openEditModal,
    handleNovaEscola,
    abrirTabelaEditavel,
    hasMissingInfo,
  };
};
