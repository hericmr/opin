import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://opin.unifesp.br';

// Rotas que mostram o mesmo painel apontam todas para o endereço principal
const ALIASES = {
  '/algunsdados': '/painel-dados',
  '/dados-escolas-indigenas': '/painel-dados',
};

// Páginas que não devem ser indexadas ficam sem canonical
const SEM_CANONICAL = ['/admin', '/search'];

/**
 * <link rel="canonical"> da rota atual, sem query nem hash (ex.: /mapa?panel=x → /mapa),
 * para o Google não tratar variações do mesmo endereço como páginas duplicadas.
 */
const CanonicalLink = () => {
  const { pathname } = useLocation();
  const caminho = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  if (SEM_CANONICAL.includes(caminho) || caminho.startsWith('/opin')) return null;

  const href = `${SITE_URL}${ALIASES[caminho] || caminho}`;
  return (
    <Helmet>
      <link rel="canonical" href={href} />
    </Helmet>
  );
};

export default CanonicalLink;
