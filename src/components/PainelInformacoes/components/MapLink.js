import React, { memo } from 'react';
import { MapPin } from 'lucide-react';

const MapLink = memo(({ latitude, longitude, label = 'Ver no mapa' }) => {
  if (!latitude || !longitude) return null;

  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
    >
      <MapPin className="w-5 h-5" />
      {label}
    </a>
  );
});

export default MapLink; 