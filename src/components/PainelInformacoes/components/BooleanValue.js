import React, { memo } from 'react';
import { Check, X } from 'lucide-react';

const BooleanValue = memo(({ value }) => {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) return null;

  const isSim = typeof value === 'string'
    ? value.trim().toLowerCase() === 'sim'
    : Boolean(value);

  return (
    <span className={`font-medium text-center w-full block flex items-center justify-center gap-1.5 ${isSim ? 'text-gray-900' : 'text-black'}`}>
      {isSim ? (
        <>
          <Check className="w-4 h-4" />
          Sim
        </>
      ) : (
        <>
          <X className="w-4 h-4" />
          Não
        </>
      )}
    </span>
  );
});

export default BooleanValue; 