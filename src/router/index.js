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
// AdminPanel permanece em components por ser um painel complexo
const AdminPanel = React.lazy(() => import("../components/AdminPanel"));

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
  const dashboardStyle = { height: 'calc(100vh - 64px)', overflow: 'hidden' };

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
      path: "/dashboard",
      element: createRouteElement(Dashboard, { style: dashboardStyle })
    },
    {
      path: "/painel-dados",
      element: createRouteElement(Dashboard, { style: dashboardStyle })
    },
    {
      path: "/dados-escolas-indigenas",
      element: createRouteElement(Dashboard, { style: dashboardStyle })
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

