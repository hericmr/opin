import React from 'react';

const MapWrapper = React.forwardRef((props, ref) => {
  return <div id="map" className="w-full h-full" ref={ref} {...props} />;
});

export default MapWrapper; 