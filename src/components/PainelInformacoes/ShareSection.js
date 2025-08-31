import React, { memo, useMemo } from 'react';
import ShareButton from '../ShareButton';

const ShareSection = memo(({ copiarLink, compartilhar, painelInfo }) => {
  // Gerar URL customizada para compartilhamento
  const gerarLinkCustomizado = useMemo(() => {
    if (!painelInfo?.titulo) return window.location.href;
    
    const criarSlug = (texto) => {
      return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    return (
      window.location.origin +
      window.location.pathname +
      "?panel=" +
      criarSlug(painelInfo.titulo)
    );
  }, [painelInfo?.titulo]);

  // Gerar descrição otimizada para compartilhamento
  const gerarDescricao = useMemo(() => {
    if (!painelInfo) return 'Confira informações sobre esta escola indígena no Observatório de Professores Indígenas.';
    
    let descricao = `Escola Indígena: ${painelInfo.titulo}`;
    
    if (painelInfo['Município']) {
      descricao += ` - ${painelInfo['Município']}`;
    }
    
    if (painelInfo['Povos indigenas']) {
      descricao += ` | Povos: ${painelInfo['Povos indigenas']}`;
    }
    
    if (painelInfo['Linguas faladas']) {
      descricao += ` | Línguas: ${painelInfo['Linguas faladas']}`;
    }
    
    descricao += ' | Observatório de Professores Indígenas';
    
    return descricao;
  }, [painelInfo]);

  // Gerar título otimizado para compartilhamento
  const gerarTitulo = useMemo(() => {
    if (!painelInfo?.titulo) return 'Escola Indígena - Observatório de Professores Indígenas';
    
    return `${painelInfo.titulo} - Escola Indígena`;
  }, [painelInfo?.titulo]);

  return (
    <ShareButton 
      onClick={compartilhar}
      url={gerarLinkCustomizado}
      title={gerarTitulo}
      description={gerarDescricao}
    />
  );
});

export default ShareSection; 