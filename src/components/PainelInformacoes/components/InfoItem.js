import React, { memo } from 'react';

const InfoItem = memo(({ label, value, className = '', isTextArea = false }) => {
  if (!value) return null;

  const isFlexLayout = className.includes('flex flex-col');
  const baseClasses = isFlexLayout 
    ? 'flex flex-col gap-1 text-sm py-0.5'
    : 'grid grid-cols-[auto,1fr] gap-x-2 text-sm py-0.5';

  return (
    <div className={`${baseClasses} ${className}`}>
      <span className="font-medium text-neutral-800">{label}:</span>
      {isTextArea ? (
        <div className="text-neutral-600">
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {value}
          </div>
        </div>
      ) : (
        <span className="text-neutral-600 break-words">{value}</span>
      )}
    </div>
  );
});

export default InfoItem; 