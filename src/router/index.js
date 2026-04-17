/**
 * Router configuration for OPIN
 * Centralized route definitions following pauliceia pattern
 * 
 * This file exports route configurations that can be used in App.js
 */

import React from 'react';
import { Route } from 'react-router-dom';

// Lazy loading dos componentes de página
const Homepage = React.lazy(() => import("../views/pages/homepage"));
const MapaEscolasIndigenas = React.lazy(() => import("../views/pages/mapa"));
const MateriaisDidáticos = React.lazy(() => import("../views/pages/materiaisDidaticos"));
const Dashboard = React.lazy(() => import("../views/pages/dashboard"));
const SearchResults = React.lazy(() => import("../views/pages/search"));
const AdminPanel = React.lazy(() => import("../components/AdminPanel"));
const Lindiflix = React.lazy(() => import("../views/pages/lindiflix"));
const LindiflixContato = React.lazy(() => import("../views/pages/lindiflixContato"));
const EscolaPage = React.lazy(() => import("../views/pages/EscolaPage"));
const GaleriaPage = React.lazy(() => import("../views/pages/GaleriaPage"));

// Mapa para facilitar o prefetch manual se necessário
const lazyComponents = {
  homepage: () => import("../views/pages/homepage"),
  mapa: () => import("../views/pages/mapa"),
  conteudo: () => import("../views/pages/materiaisDidaticos"),
  dashboard: () => import("../views/pages/dashboard"),
  search: () => import("../views/pages/search"),
  admin: () => import("../components/AdminPanel"),
  lindiflix: () => import("../views/pages/lindiflix"),
  lindiflixContato: () => import("../views/pages/lindiflixContato"),
};

/**
 * Prefetch a specific page's chunk
 */
export const prefetchPage = (pageName) => {
  if (lazyComponents[pageName]) {
    lazyComponents[pageName]();
  }
};

/**
 * Generate route element wrapper
 */
const createRouteElement = (Component, props = {}) => {
  return (
    <main id="main-content" className="flex-grow" {...props.style ? { style: props.style } : {}}>
      <Component {...props.componentProps || {}} />
    </main>
  );
};

/**
 * Main routes configuration
 * Returns an array of Route components ready to be used in Routes
 */
export const createRoutes = (dataPoints, loading, onPainelOpen) => {
  return [
    {
      path: "/",
      element: createRouteElement(Homepage, { componentProps: { dataPoints } })
    },
    {
      path: "/mapa",
      element: createRouteElement(MapaEscolasIndigenas, {
        componentProps: {
          dataPoints,
          onPainelOpen,
          isLoading: loading
        }
      })
    },
    {
      path: "/conteudo",
      element: createRouteElement(MateriaisDidáticos, {
        componentProps: { locations: dataPoints }
      })
    },
    {
      path: "/search",
      element: createRouteElement(SearchResults, {
        componentProps: { dataPoints }
      })
    },
    {
      path: "/admin",
      element: createRouteElement(AdminPanel)
    },
    {
      path: "/algunsdados",
      element: createRouteElement(Dashboard)
    },
    {
      path: "/painel-dados",
      element: createRouteElement(Dashboard)
    },
    {
      path: "/dados-escolas-indigenas",
      element: createRouteElement(Dashboard)
    },
    {
      path: "/lindiflix",
      element: createRouteElement(Lindiflix)
    },
    {
      path: "/lindiflix/contato",
      element: createRouteElement(LindiflixContato)
    },
    {
      path: "/escola/:slug",
      element: createRouteElement(EscolaPage, { componentProps: { dataPoints } })
    },
    {
      path: "/galeria/:slug",
      element: createRouteElement(GaleriaPage)
    }
  ];
};

/**
 * Helper to render routes as Route components
 */
export const renderRoutes = (dataPoints, loading, onPainelOpen) => {
  return createRoutes(dataPoints, loading, onPainelOpen).map((route, index) => (
    <Route key={index} path={route.path} element={route.element} />
  ));
};

export default createRoutes;

