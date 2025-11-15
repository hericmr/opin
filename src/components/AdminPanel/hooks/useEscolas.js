import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../supabaseClient';
import { VersionamentoService } from '../../../services/versionamentoService';
import logger from '../../../utils/logger';

export const useEscolas = () => {
  const [escolas, setEscolas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');

  // Buscar todas as escolas
  const fetchEscolas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('escolas_completa')
        .select('*')
        .order('Escola', { ascending: true });

      if (error) throw error;
      
      // Mapear os dados para usar os nomes originais das colunas
      const escolasMapeadas = data.map(escola => ({
        ...escola,
        // Garantir que os novos campos de endereço existam
        logradouro: escola.logradouro || '',
        numero: escola.numero || '',
        complemento: escola.complemento || '',
        bairro: escola.bairro || '',
        cep: escola.cep || '',
        estado: escola.estado || 'SP'
      }));
      
      setEscolas(escolasMapeadas);
    } catch (err) {
      logger.error('Erro ao buscar escolas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Nota: Lógica de filtros movida para useAdminFilters.js

  // Atualizar escola na lista local
  const updateEscolaInList = useCallback((escolaId, updatedData) => {
    setEscolas(prev => prev.map(escola => 
      escola.id === escolaId ? { ...escola, ...updatedData } : escola
    ));
  }, []);

  // Adicionar nova escola à lista
  const addEscolaToList = useCallback((novaEscola) => {
    setEscolas(prev => [...prev, novaEscola]);
  }, []);

  // Remover escola da lista
  const removeEscolaFromList = useCallback((escolaId) => {
    setEscolas(prev => prev.filter(escola => escola.id !== escolaId));
  }, []);

  // Buscar escola por ID
  const getEscolaById = useCallback((escolaId) => {
    return escolas.find(escola => escola.id === escolaId);
  }, [escolas]);

  // Buscar escola por nome
  const getEscolaByName = useCallback((nome) => {
    return escolas.find(escola => 
      escola.Escola?.toLowerCase() === nome.toLowerCase()
    );
  }, [escolas]);

  // Salvar escola no Supabase
  const saveEscola = useCallback(async (escolaData, metadados = null) => {
    try {
      setError(null);
      
      if (escolaData.id) {
        // Atualizar escola existente
        const { data, error } = await supabase
          .from('escolas_completa')
          .update({
            'Escola': escolaData.Escola,
            'Município': escolaData['Município'],
            'Endereço': escolaData['Endereço'],
            'Terra Indigena (TI)': escolaData['Terra Indigena (TI)'],
            'Escola Estadual ou Municipal': escolaData['Escola Estadual ou Municipal'],
            'Parcerias com o município': escolaData['Parcerias com o município'],
            'Diretoria de Ensino': escolaData['Diretoria de Ensino'],
            'Ano de criação da escola': escolaData['Ano de criação da escola'],
            'Povos indigenas': escolaData['Povos indigenas'],
            'Linguas faladas': escolaData['Linguas faladas'],
            'Modalidade de Ensino/turnos de funcionamento': escolaData['Modalidade de Ensino/turnos de funcionamento'],
            'Numero de alunos': escolaData['Numero de alunos'],
            'turnos_funcionamento': escolaData['turnos_funcionamento'],
            'Espaço escolar e estrutura': escolaData['Espaço escolar e estrutura'],
            'Acesso à água': escolaData['Acesso à água'],
            'Tem coleta de lixo?': escolaData['Tem coleta de lixo?'],
            'Acesso à internet': escolaData['Acesso à internet'],
            'Equipamentos Tecs': escolaData['Equipamentos Tecs'],
            'Modo de acesso à escola': escolaData['Modo de acesso à escola'],
            'Gestão/Nome': escolaData['Gestão/Nome'],
            'Outros funcionários': escolaData['Outros funcionários'],
            'Quantidade de professores indígenas': escolaData['Quantidade de professores indígenas'],
            'Quantidade de professores não indígenas': escolaData['Quantidade de professores não indígenas'],
            'Professores falam a língua indígena?': escolaData['Professores falam a língua indígena?'],
            'Formação dos professores': escolaData['Formação dos professores'],
            'Formação continuada oferecida': escolaData['Formação continuada oferecida'],
            'A escola possui PPP próprio?': escolaData['A escola possui PPP próprio?'],
            'PPP elaborado com a comunidade?': escolaData['PPP elaborado com a comunidade?'],
            'Material pedagógico não indígena': escolaData['Material pedagógico não indígena'],
            'Material pedagógico indígena': escolaData['Material pedagógico indígena'],
            'Práticas pedagógicas indígenas': escolaData['Práticas pedagógicas indígenas'],
            'Formas de avaliação': escolaData['Formas de avaliação'],
            'Projetos em andamento': escolaData['Projetos em andamento'],
            'Parcerias com universidades?': escolaData['Parcerias com universidades?'],
            'Ações com ONGs ou coletivos?': escolaData['Ações com ONGs ou coletivos?'],
            'Desejos da comunidade para a escola': escolaData['Desejos da comunidade para a escola'],
            'Escola utiliza redes sociais?': escolaData['Escola utiliza redes sociais?'],
            'Links das redes sociais': escolaData['Links das redes sociais'],
            'historia_da_escola': escolaData['historia_da_escola'],
            'Latitude': escolaData['Latitude'],
            'Longitude': escolaData['Longitude'],
            'link_para_videos': escolaData['link_para_videos'],
            'logradouro': escolaData['logradouro'],
            'numero': escolaData['numero'],
            'complemento': escolaData['complemento'],
            'bairro': escolaData['bairro'],
            'cep': escolaData['cep'],
            'estado': escolaData['estado'],
            'Cozinha': escolaData['cozinha'],
            'Merenda_escolar': escolaData['merenda_escolar'],
            'diferenciada': escolaData['diferenciada'],
            'imagem_header': escolaData['imagem_header'],
            'cards_visibilidade': escolaData['cards_visibilidade'] || null
          })
          .eq('id', escolaData.id)
          .select();

        if (error) throw error;
        
        // Atualizar na lista local
        updateEscolaInList(escolaData.id, data[0]);
        
        // Registrar versão de dados apenas se metadados foram fornecidos
        // Se metadados for null, o modal será responsável por registrar depois
        if (metadados !== null) {
          try {
            await VersionamentoService.registrarVersaoDados({
              nomeTabela: 'escolas_completa',
              chaveLinha: escolaData.id.toString(),
              fonteId: metadados?.fonte_id || null,
              autor: metadados?.autor || null,
              observacoes: metadados?.observacoes || null
            });
          } catch (versionError) {
            // Log do erro mas não falha a operação principal
            logger.warn('Erro ao registrar versão de dados (não crítico):', versionError);
          }
        }
        
        return { success: true, data: data[0] };
      } else {
        // Criar nova escola
        const { data, error } = await supabase
          .from('escolas_completa')
          .insert({
            'Escola': escolaData.Escola,
            'Município': escolaData['Município'],
            'Endereço': escolaData['Endereço'],
            'Terra Indigena (TI)': escolaData['Terra Indigena (TI)'],
            'Escola Estadual ou Municipal': escolaData['Escola Estadual ou Municipal'],
            'Parcerias com o município': escolaData['Parcerias com o município'],
            'Diretoria de Ensino': escolaData['Diretoria de Ensino'],
            'Ano de criação da escola': escolaData['Ano de criação da escola'],
            'Povos indigenas': escolaData['Povos indigenas'],
            'Linguas faladas': escolaData['Linguas faladas'],
            'Modalidade de Ensino/turnos de funcionamento': escolaData['Modalidade de Ensino/turnos de funcionamento'],
            'Numero de alunos': escolaData['Numero de alunos'],
            'turnos_funcionamento': escolaData['turnos_funcionamento'],
            'Espaço escolar e estrutura': escolaData['Espaço escolar e estrutura'],
            'Acesso à água': escolaData['Acesso à água'],
            'Tem coleta de lixo?': escolaData['Tem coleta de lixo?'],
            'Acesso à internet': escolaData['Acesso à internet'],
            'Equipamentos Tecs': escolaData['Equipamentos Tecs'],
            'Modo de acesso à escola': escolaData['Modo de acesso à escola'],
            'Gestão/Nome': escolaData['Gestão/Nome'],
            'Outros funcionários': escolaData['Outros funcionários'],
            'Quantidade de professores indígenas': escolaData['Quantidade de professores indígenas'],
            'Quantidade de professores não indígenas': escolaData['Quantidade de professores não indígenas'],
            'Professores falam a língua indígena?': escolaData['Professores falam a língua indígena?'],
            'Formação dos professores': escolaData['Formação dos professores'],
            'Formação continuada oferecida': escolaData['Formação continuada oferecida'],
            'A escola possui PPP próprio?': escolaData['A escola possui PPP próprio?'],
            'PPP elaborado com a comunidade?': escolaData['PPP elaborado com a comunidade?'],
            'Material pedagógico não indígena': escolaData['Material pedagógico não indígena'],
            'Material pedagógico indígena': escolaData['Material pedagógico indígena'],
            'Práticas pedagógicas indígenas': escolaData['Práticas pedagógicas indígenas'],
            'Formas de avaliação': escolaData['Formas de avaliação'],
            'Projetos em andamento': escolaData['Projetos em andamento'],
            'Parcerias com universidades?': escolaData['Parcerias com universidades?'],
            'Ações com ONGs ou coletivos?': escolaData['Ações com ONGs ou coletivos?'],
            'Desejos da comunidade para a escola': escolaData['Desejos da comunidade para a escola'],
            'Escola utiliza redes sociais?': escolaData['Escola utiliza redes sociais?'],
            'Links das redes sociais': escolaData['Links das redes sociais'],
            'historia_da_escola': escolaData['historia_da_escola'],
            'Latitude': escolaData['Latitude'],
            'Longitude': escolaData['Longitude'],
            'link_para_videos': escolaData['link_para_videos'],
            'logradouro': escolaData['logradouro'],
            'numero': escolaData['numero'],
            'complemento': escolaData['complemento'],
            'bairro': escolaData['bairro'],
            'cep': escolaData['cep'],
            'estado': escolaData['estado'],
            'Cozinha': escolaData['cozinha'],
            'Merenda_escolar': escolaData['merenda_escolar'],
            'diferenciada': escolaData['diferenciada'],
            'imagem_header': escolaData['imagem_header'],
            'cards_visibilidade': escolaData['cards_visibilidade'] || null
          })
          .select();

        if (error) throw error;
        
        // Adicionar à lista local
        addEscolaToList(data[0]);
        
        // Registrar versão de dados apenas se metadados foram fornecidos
        // Se metadados for null, o modal será responsável por registrar depois
        if (metadados !== null) {
          try {
            await VersionamentoService.registrarVersaoDados({
              nomeTabela: 'escolas_completa',
              chaveLinha: data[0].id.toString(),
              fonteId: metadados?.fonte_id || null,
              autor: metadados?.autor || null,
              observacoes: metadados?.observacoes || null
            });
          } catch (versionError) {
            // Log do erro mas não falha a operação principal
            logger.warn('Erro ao registrar versão de dados (não crítico):', versionError);
          }
        }
        
        return { success: true, data: data[0] };
      }
    } catch (err) {
      logger.error('Erro ao salvar escola:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [updateEscolaInList, addEscolaToList]);

  // Deletar escola do banco de dados
  const deleteEscola = useCallback(async (escolaId) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('escolas_completa')
        .delete()
        .eq('id', escolaId);

      if (error) throw error;
      
      // Remover da lista local
      removeEscolaFromList(escolaId);
      return { success: true };
    } catch (err) {
      logger.error('Erro ao deletar escola:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [removeEscolaFromList]);

  // Carregar escolas na inicialização
  useEffect(() => {
    fetchEscolas();
  }, [fetchEscolas]);

  return {
    // Estado
    escolas,
    loading,
    error,
    searchTerm,
    selectedType,
    
    // Ações
    setSearchTerm,
    setSelectedType,
    fetchEscolas,
    updateEscolaInList,
    addEscolaToList,
    removeEscolaFromList,
    saveEscola,
    deleteEscola,
    
    // Utilitários
    getEscolaById,
    getEscolaByName,
  };
}; 