import React, { memo } from 'react';

const InfoItem = memo(({ label, value, className = '' }) => {
  if (!value) return null;

  return (
    <div className={`grid grid-cols-[auto,1fr] gap-x-2 text-sm py-0.5 ${className}`}>
      <span className="font-medium text-neutral-800">{label}:</span>
      <span className="text-neutral-600">{value}</span>
    </div>
  );
});

export default InfoItem; 