import { useState, useCallback, useRef } from 'react';

const useSearch = (dataPoints) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const lastSearchTerm = useRef('');

  const performSearch = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      lastSearchTerm.current = '';
      return [];
    }

    // Evitar busca duplicada
    if (lastSearchTerm.current === searchTerm) {
      return searchResults;
    }

    lastSearchTerm.current = searchTerm;
    setIsSearching(true);

    try {
      // Simular delay de busca apenas se necessário
      const startTime = Date.now();

      const term = searchTerm.toLowerCase();
      const results = [];

      // Buscar nas escolas
      if (dataPoints && dataPoints.length > 0) {
        dataPoints.forEach(school => {
          const matches = [];

          // === INFORMAÇÕES BÁSICAS ===
          if (school.titulo && school.titulo.toLowerCase().includes(term)) {
            matches.push('nome');
          }
          if (school.municipio && school.municipio.toLowerCase().includes(term)) {
            matches.push('município');
          }
          if (school.endereco && school.endereco.toLowerCase().includes(term)) {
            matches.push('endereço');
          }
          if (school.terra_indigena && school.terra_indigena.toLowerCase().includes(term)) {
            matches.push('terra indígena');
          }
          if (school.parcerias_municipio && school.parcerias_municipio.toLowerCase().includes(term)) {
            matches.push('parcerias município');
          }
          if (school.diretoria_ensino && school.diretoria_ensino.toLowerCase().includes(term)) {
            matches.push('diretoria');
          }
          if (school.ano_criacao && school.ano_criacao.toString().includes(term)) {
            matches.push('ano criação');
          }

          // === ENDEREÇO DETALHADO ===
          if (school.logradouro && school.logradouro.toLowerCase().includes(term)) {
            matches.push('logradouro');
          }
          if (school.numero && school.numero.toString().includes(term)) {
            matches.push('número');
          }
          if (school.complemento && school.complemento.toLowerCase().includes(term)) {
            matches.push('complemento');
          }
          if (school.bairro && school.bairro.toLowerCase().includes(term)) {
            matches.push('bairro');
          }
          if (school.cep && school.cep.toString().includes(term)) {
            matches.push('cep');
          }
          if (school.estado && school.estado.toLowerCase().includes(term)) {
            matches.push('estado');
          }

          // === POVOS E LÍNGUAS ===
          if (school.povos_indigenas && school.povos_indigenas.toLowerCase().includes(term)) {
            matches.push('povos');
          }


          // === ENSINO ===
          if (school.modalidade_ensino && school.modalidade_ensino.toLowerCase().includes(term)) {
            matches.push('modalidade');
          }
          if (school.numero_alunos && school.numero_alunos.toString().includes(term)) {
            matches.push('alunos');
          }
          if (school.turnos_funcionamento && school.turnos_funcionamento.toLowerCase().includes(term)) {
            matches.push('turnos');
          }

          // === INFRAESTRUTURA ===
          if (school.espaco_escolar && school.espaco_escolar.toLowerCase().includes(term)) {
            matches.push('espaço escolar');
          }


          if (school.acesso_internet && school.acesso_internet.toLowerCase().includes(term)) {
            matches.push('internet');
          }
          if (school.equipamentos && school.equipamentos.toLowerCase().includes(term)) {
            matches.push('equipamentos');
          }


          // === GESTÃO E PROFESSORES ===
          if (school.gestao && school.gestao.toLowerCase().includes(term)) {
            matches.push('gestão');
          }
          if (school.outros_funcionarios && school.outros_funcionarios.toString().includes(term)) {
            matches.push('funcionários');
          }
          if (school.professores_indigenas && school.professores_indigenas.toString().includes(term)) {
            matches.push('professores indígenas');
          }
          if (school.professores_nao_indigenas && school.professores_nao_indigenas.toString().includes(term)) {
            matches.push('professores não indígenas');
          }
          if (school.professores_falam_lingua && school.professores_falam_lingua.toLowerCase().includes(term)) {
            matches.push('professores língua');
          }
          if (school.formacao_professores && school.formacao_professores.toLowerCase().includes(term)) {
            matches.push('formação professores');
          }


          // === PROJETO PEDAGÓGICO ===
          if (school.ppp_comunidade && school.ppp_comunidade.toLowerCase().includes(term)) {
            matches.push('ppp comunidade');
          }
          if (school.material_nao_indigena && school.material_nao_indigena.toLowerCase().includes(term)) {
            matches.push('material não indígena');
          }
          if (school.material_indigena && school.material_indigena.toLowerCase().includes(term)) {
            matches.push('material indígena');
          }

          // === PROJETOS E PARCERIAS ===


          // === REDES SOCIAIS E MÍDIA ===
          if (school.usa_redes_sociais && school.usa_redes_sociais.toLowerCase().includes(term)) {
            matches.push('redes sociais');
          }
          if (school.links_redes_sociais && school.links_redes_sociais.toLowerCase().includes(term)) {
            matches.push('links redes');
          }
          if (school.historia_da_escola && school.historia_da_escola.toLowerCase().includes(term)) {
            matches.push('história escola');
          }
          if (school.historia_terra_indigena && school.historia_terra_indigena.toLowerCase().includes(term)) {
            matches.push('história terra indígena');
          }

          // === MÍDIA ===
          if (school.imagens && school.imagens.toLowerCase().includes(term)) {
            matches.push('imagens');
          }
          if (school.audio && school.audio.toLowerCase().includes(term)) {
            matches.push('áudio');
          }
          if (school.video && school.video.toLowerCase().includes(term)) {
            matches.push('vídeo');
          }

          // === LINKS ===
          if (school.links && school.links.toLowerCase().includes(term)) {
            matches.push('links');
          }
          if (school.link_para_documentos && school.link_para_documentos.toLowerCase().includes(term)) {
            matches.push('documentos');
          }
          if (school.link_para_videos && school.link_para_videos.toLowerCase().includes(term)) {
            matches.push('vídeos');
          }

          // === NOME DO PROFESSOR PRINCIPAL ===
          if (school.nome_professor && school.nome_professor.toLowerCase().includes(term)) {
            matches.push('nome do professor');
          }

          if (matches.length > 0) {
            results.push({
              id: school.id,
              title: school.titulo,
              type: 'school',
              category: 'educação',
              matches: matches,
              data: school,
              subtitle: school.municipio,
              coordinates: {
                lat: school.Latitude,
                lng: school.Longitude
              }
            });
          }
        });
      }

      // Ordenar resultados por relevância
      const sortedResults = results.sort((a, b) => {
        // Priorizar matches no nome
        const aNameMatch = a.matches.includes('nome') ? 1 : 0;
        const bNameMatch = b.matches.includes('nome') ? 1 : 0;

        if (aNameMatch !== bNameMatch) {
          return bNameMatch - aNameMatch;
        }

        // Depois por número de matches
        return b.matches.length - a.matches.length;
      });

      // Adicionar delay mínimo apenas se a busca foi muito rápida
      const elapsed = Date.now() - startTime;
      if (elapsed < 200) {
        await new Promise(resolve => setTimeout(resolve, 200 - elapsed));
      }

      setSearchResults(sortedResults);
      return sortedResults;
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [dataPoints, searchResults]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    lastSearchTerm.current = '';
  }, []);

  const getSearchSuggestions = useCallback((term) => {
    if (!term || term.length < 2) return [];

    const suggestions = new Set();
    const searchTerm = term.toLowerCase();

    if (dataPoints && dataPoints.length > 0) {
      dataPoints.forEach(school => {
        // Sugestões de municípios
        if (school.municipio && school.municipio.toLowerCase().includes(searchTerm)) {
          suggestions.add(school.municipio);
        }

        // Sugestões de terras indígenas
        if (school.terra_indigena && school.terra_indigena.toLowerCase().includes(searchTerm)) {
          suggestions.add(school.terra_indigena);
        }

        // Sugestões de povos
        if (school.povos_indigenas && school.povos_indigenas.toLowerCase().includes(searchTerm)) {
          const povos = school.povos_indigenas.split(',').map(p => p.trim());
          povos.forEach(povo => {
            if (povo.toLowerCase().includes(searchTerm)) {
              suggestions.add(povo);
            }
          });
        }



        // Sugestões de modalidades
        if (school.modalidade_ensino && school.modalidade_ensino.toLowerCase().includes(searchTerm)) {
          suggestions.add(school.modalidade_ensino);
        }

        // Sugestões de gestão
        if (school.gestao && school.gestao.toLowerCase().includes(searchTerm)) {
          suggestions.add(school.gestao);
        }


      });
    }

    return Array.from(suggestions).slice(0, 8);
  }, [dataPoints]);

  return {
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
    getSearchSuggestions
  };
};

export default useSearch; 