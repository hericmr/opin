import React, { memo } from 'react';

const InfoItem = memo(({ label, value, className = '', isTextArea = false }) => {
  if (!value && value !== 0) return null;

  const isFlexLayout = className.includes('flex flex-col');
  const baseClasses = isFlexLayout 
    ? 'flex flex-col gap-1.5 text-sm py-1'
    : 'grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm py-1';

  return (
    <div className={`${baseClasses} ${className}`}>
      <span className="font-semibold text-gray-800 leading-tight">{label}:</span>
      {isTextArea ? (
        <div className="text-gray-700">
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed" style={{ lineHeight: '1.7' }}>
            {value}
          </div>
        </div>
      ) : (
        <span className="text-gray-700 break-words leading-relaxed" style={{ lineHeight: '1.6' }}>{value}</span>
      )}
    </div>
  );
});

export default InfoItem; 