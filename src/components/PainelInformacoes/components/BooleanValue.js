import React, { memo } from 'react';

const BooleanValue = memo(({ value }) => {
  if (value === undefined || value === null) return null;

  return (
    <span className={`font-medium text-center w-full block ${value ? 'text-green-600' : 'text-neutral-400'}`}>
      {value ? 'Sim' : 'Não'}
    </span>
  );
});

export default BooleanValue; 