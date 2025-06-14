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
    <section className={`bg-green-50 border-l-4 border-green-700 rounded-2xl p-5 mb-6 shadow-md ${className}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between text-base font-semibold border-b border-green-300 pb-2 mb-3 text-green-900 hover:text-green-800 transition-colors"
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
        <div className="space-y-2 text-green-950 text-sm leading-relaxed">
          {children}
        </div>
      )}
    </section>
  );
});

export default InfoSection; 