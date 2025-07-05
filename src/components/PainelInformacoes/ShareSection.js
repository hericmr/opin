import React, { memo } from 'react';
import ShareButton from '../ShareButton';

const ShareSection = memo(({ copiarLink, compartilhar, painelInfo }) => {
  // Gerar URL customizada para compartilhamento
  const gerarLinkCustomizado = () => {
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
  };

  return (
    <ShareButton 
      onClick={compartilhar}
      url={gerarLinkCustomizado()}
      title={painelInfo?.titulo || 'Painel de Escola Indígena'}
      description={painelInfo?.descricao || 'Confira informações sobre esta escola indígena no Observatório de Professores Indígenas.'}
    />
  );
});

export default ShareSection; 