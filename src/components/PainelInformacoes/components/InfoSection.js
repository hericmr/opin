import React, { memo, useState } from 'react';

// Componente InfoCard para informações individuais
const InfoCard = memo(({ label, value, icon: Icon, type = 'text', className = '' }) => {
  if (!value && value !== 0) return null;

  const renderValue = () => {
    switch (type) {
      case 'number':
        return (
          <div className="text-center">
            <div className="text-3xl font-medium text-gray-900 mb-1">
              {value.toLocaleString('pt-BR')}
            </div>
          </div>
        );
      case 'boolean':
        return (
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-gray-100 text-gray-900' : 'bg-gray-100 text-gray-600'
          }`}>
            {value ? 'Sim' : 'Não'}
          </div>
        );
      case 'badge':
        return (
          <div className="flex flex-wrap gap-1">
            {Array.isArray(value) ? value.map((item, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-900 text-xs rounded-full">
                {item}
              </span>
            )) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-900 text-xs rounded-full">
                {value}
              </span>
            )}
          </div>
        );
      case 'link':
        return (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-900 hover:text-gray-700 underline text-sm"
          >
            {value}
          </a>
        );
      default:
        return (
          <div className="text-sm text-gray-700 leading-relaxed">
            {value}
          </div>
        );
    }
  };

  return (
    <div className={`rounded-lg p-4 transition-all duration-200 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-5 h-5 text-gray-700" />}
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </span>
      </div>
      {renderValue()}
    </div>
  );
});

// Componente InfoGrid para layout em grid
const InfoGrid = memo(({ children, columns = 'auto-fit', gap = 4, className = '' }) => {
  const gridClasses = {
    'auto-fit': 'grid-cols-2 lg:grid-cols-3',
    '2': 'grid-cols-2',
    '3': 'grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-${gap} ${className} [&>*]:bg-gray-50`}>
      {children}
    </div>
  );
});

// Componente InfoTable para dados tabulares
const InfoTable = memo(({ data, className = '' }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className={`bg-gray-50 rounded-lg overflow-hidden ${className}`}>
      <table className="w-full">
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                {row.label}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

// Componente InfoStats para estatísticas com ícones
const InfoStats = memo(({ stats, className = '' }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className} [&>*]:border-b [&>*]:border-gray-200 [&>*]:pb-2 [&>*]:mb-2`}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center rounded-lg p-4">
          <div className="flex justify-center mb-2">
            {stat.icon && <stat.icon className="w-6 h-6 text-gray-700" />}
          </div>
          <div className="text-3xl font-medium text-gray-900 mb-1">
            {stat.value}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
});

// Componente InfoSection refatorado
const InfoSection = memo(({ 
  title, 
  icon: Icon, 
  children, 
  description,
  defaultCollapsed = false,
  className = '',
  layout = 'default', // 'default', 'grid', 'table', 'stats'
  layoutProps = {}
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const renderContent = () => {
    if (!children) return null;

    switch (layout) {
      case 'grid':
        return (
          <InfoGrid {...layoutProps}>
            {children}
          </InfoGrid>
        );
      case 'table':
        return (
          <InfoTable data={layoutProps.data} className={layoutProps.className} />
        );
      case 'stats':
        return (
          <InfoStats stats={layoutProps.stats} className={layoutProps.className} />
        );
      default:
        return (
          <div className="space-y-4">
            {children}
          </div>
        );
    }
  };

  // Se não há título, não mostrar botão de collapse - conteúdo sempre visível
  const hasTitle = title && title.trim() !== '';

  return (
    <section 
      className={`
        bg-white rounded-2xl p-5
        shadow-sm transition-all duration-200
        ${className}
      `}
    >
      {hasTitle && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="
            w-full flex items-center justify-between 
            text-base sm:text-lg font-semibold
            mb-4 sm:mb-5 text-gray-900 hover:text-gray-700 
            transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-1 -m-1
          "
          aria-expanded={!isCollapsed}
          aria-controls={`${title}-content`}
          id={`${title}-button`}
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            {Icon && <Icon className="w-5 h-5 text-gray-700 flex-shrink-0" />}
            <span className="tracking-tight leading-tight">{title}</span>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isCollapsed ? '' : 'rotate-180'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      
      {(!hasTitle || !isCollapsed) && (
        <div 
          id={hasTitle ? `${title}-content` : undefined}
          className="space-y-4 sm:space-y-5 overflow-visible"
          role={hasTitle ? "region" : undefined}
          aria-labelledby={hasTitle ? `${title}-button` : undefined}
        >
          {description && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 text-sm leading-relaxed" style={{ lineHeight: '1.7' }}>
                {description}
              </p>
            </div>
          )}
          {renderContent()}
        </div>
      )}
    </section>
  );
});

// Exportar todos os componentes
export { InfoCard, InfoGrid, InfoTable, InfoStats };
export default InfoSection; 