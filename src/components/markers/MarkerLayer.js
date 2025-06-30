import React, { useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { useMarkerInteractions } from './hooks/markers/useMarkerInteractions';

const MarkerLayer = ({ schools, onPainelOpen }) => {
  const [source] = useState(new VectorSource());
  const [layer] = useState(new VectorLayer({ source }));
  const map = useMap();
  const isMobileDevice = isMobile();

  const { handleMarkerClick } = useMarkerInteractions({
    onPainelOpen,
    map,
    isMobileDevice
  });

  useEffect(() => {
    // Limpar marcadores antigos
    source.clear();

    // Adicionar novos marcadores
    schools.forEach(school => {
      const feature = new Feature({
        geometry: new Point([school.longitude, school.latitude]),
        schoolData: school
      });

      // Adicionar estilo ao marcador
      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: '#ff0000' }),
          stroke: new Stroke({ color: '#fff', width: 2 })
        })
      }));

      source.addFeature(feature);
    });

    // Adicionar layer ao mapa
    if (map) {
      map.addLayer(layer);
    }

    return () => {
      if (map) {
        map.removeLayer(layer);
      }
    };
  }, [schools, source, layer, map, onPainelOpen, isMobileDevice]);

  return null;
};

export default MarkerLayer; 