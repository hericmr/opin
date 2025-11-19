import React, { memo } from 'react';
import { Check, X } from 'lucide-react';

const BooleanValue = memo(({ value }) => {
  if (value === undefined || value === null) return null;

  return (
    <span className={`font-medium text-center w-full block flex items-center justify-center gap-1.5 ${value ? 'text-gray-900' : 'text-black'}`}>
      {value ? (
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