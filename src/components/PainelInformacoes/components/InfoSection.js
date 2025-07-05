import React, { memo, useState } from 'react';

// Componente InfoCard para informações individuais
const InfoCard = memo(({ label, value, icon: Icon, type = 'text', className = '' }) => {
  if (!value && value !== 0) return null;

  const renderValue = () => {
    switch (type) {
      case 'number':
        return (
          <div className="text-2xl font-bold text-green-800">
            {value.toLocaleString('pt-BR')}
          </div>
        );
      case 'boolean':
        return (
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {value ? 'Sim' : 'Não'}
          </div>
        );
      case 'badge':
        return (
          <div className="flex flex-wrap gap-1">
            {Array.isArray(value) ? value.map((item, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {item}
              </span>
            )) : (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
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
            className="text-green-700 hover:text-green-800 underline text-sm"
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
        {Icon && <Icon className="w-4 h-4 text-green-600" />}
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
    'auto-fit': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-${gap} ${className} [&>*]:bg-green-100`}>
      {children}
    </div>
  );
});

// Componente InfoTable para dados tabulares
const InfoTable = memo(({ data, className = '' }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className={`bg-green-100 rounded-lg overflow-hidden ${className}`}>
      <table className="w-full">
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-green-200">
                {row.label}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
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
            {stat.icon && <stat.icon className="w-6 h-6 text-green-600" />}
          </div>
          <div className="text-2xl font-bold text-green-800">
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

  return (
    <section 
      className={`
        bg-white rounded-2xl p-5 
        shadow-sm transition-all duration-200
        ${className}
      `}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="
          w-full flex items-center justify-between 
          text-base font-semibold
          mb-4 text-gray-900 hover:text-gray-800 
          transition-colors focus:outline-none
        "
        aria-expanded={!isCollapsed}
        aria-controls={`${title}-content`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-green-600" />}
          <span className="tracking-wide">{title}</span>
        </div>
      </button>
      
      {!isCollapsed && (
        <div 
          id={`${title}-content`}
          className="space-y-4"
          role="region"
          aria-labelledby={`${title}-button`}
        >
          {description && (
            <div className="bg-green-100 rounded-lg p-4">
              <p className="text-gray-700 text-sm leading-relaxed">
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