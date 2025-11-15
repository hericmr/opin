import React, { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de breadcrumbs para o Dashboard
 * Otimizado com React.memo para evitar re-renders desnecessários
 */
const DashboardBreadcrumbs = memo(({ breadcrumbs }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-center space-x-2 text-base sm:text-lg text-white/90" style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      letterSpacing: '0.01em'
    }}>
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 mx-2" />
          )}
          {crumb.path ? (
            <button
              onClick={() => navigate(crumb.path)}
              className="hover:text-white transition-colors font-normal"
            >
              {crumb.label}
            </button>
          ) : (
            <span className="font-medium text-white">
              {crumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
});

DashboardBreadcrumbs.displayName = 'DashboardBreadcrumbs';

export default DashboardBreadcrumbs;

