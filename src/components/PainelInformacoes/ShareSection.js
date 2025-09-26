import React, { memo, useMemo } from 'react';
import ShareButton from '../ShareButton';
import { gerarUrlEscola, gerarTituloEscola, gerarDescricaoEscola } from '../../utils/metaTags';

const ShareSection = memo(({ copiarLink, compartilhar, painelInfo }) => {
  // Gerar URL customizada para compartilhamento usando utilitário centralizado
  const gerarLinkCustomizado = useMemo(() => {
    return gerarUrlEscola(painelInfo);
  }, [painelInfo]);

  // Gerar descrição otimizada para compartilhamento usando utilitário centralizado
  const gerarDescricao = useMemo(() => {
    return gerarDescricaoEscola(painelInfo);
  }, [painelInfo]);

  // Gerar título otimizado para compartilhamento usando utilitário centralizado
  const gerarTitulo = useMemo(() => {
    return gerarTituloEscola(painelInfo);
  }, [painelInfo]);

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