import React, { memo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const InfoSection = memo(({ 
  title, 
  icon: Icon, 
  children, 
  defaultCollapsed = false,
  className = '' 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <section 
      className={`
        bg-green-50 border-l-4 border-green-700 rounded-2xl p-5 
        shadow-md hover:shadow-lg transition-all duration-200
        h-full flex flex-col
        ${className}
      `}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="
          w-full flex items-center justify-between 
          text-base font-semibold border-b border-green-100 
          pb-2 mb-3 text-green-900 hover:text-green-800 
          transition-colors focus:outline-none focus:ring-2 
          focus:ring-green-500 focus:ring-offset-2 rounded-lg
        "
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-green-800" />}
          <span className="tracking-wide">{title}</span>
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-green-700" />
        ) : (
          <ChevronUp className="w-5 h-5 text-green-700" />
        )}
      </button>
      
      {!isCollapsed && (
        <div className="space-y-2 text-green-950 text-sm leading-relaxed flex-grow">
          {children}
        </div>
      )}
    </section>
  );
});

export default InfoSection; 