import React from 'react';

const MapWrapper = React.forwardRef((props, ref) => {
  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-transparent" 
      ref={ref} 
      style={{ minWidth: '100%', minHeight: '100%', display: 'block' }}
      {...props} 
    />
  );
});

export default MapWrapper; 