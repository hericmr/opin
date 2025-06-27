import { useEffect, useRef } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { createMarkerFeatures, createConnectorFeatures, filterValidPoints, findNearbyPairs } from '../utils/mapUtils';
import { createMarkerStyle, createClusterStyle, createConnectorStyle } from '../utils/mapStyles';

export const useMapMarkers = (map, dataPoints, showMarcadores, showConectores) => {
  const connectorsLayerRef = useRef(null);

  // Criar camada de conectores
  useEffect(() => {
    if (!map) return;

    // Criar camada para conectores entre marcadores próximos
    connectorsLayerRef.current = new VectorLayer({
      source: new VectorSource(),
      style: createConnectorStyle,
      zIndex: 14
    });

    map.addLayer(connectorsLayerRef.current);

    return () => {
      if (connectorsLayerRef.current) {
        map.removeLayer(connectorsLayerRef.current);
        connectorsLayerRef.current = null;
      }
    };
  }, [map]);

  // Atualizar marcadores quando dataPoints mudar
  useEffect(() => {
    if (!map || !dataPoints || !showMarcadores) return;

    const vectorLayer = map.getLayers().getArray().find(layer => 
      layer.getSource() && layer.getSource().constructor.name === 'ClusterSource'
    );

    if (!vectorLayer) return;

    const vectorSource = vectorLayer.getSource().getSource(); // ClusterSource -> VectorSource
    const connectorsSource = connectorsLayerRef.current?.getSource();

    // Limpar marcadores existentes
    vectorSource.clear();
    
    // Limpar conectores existentes
    if (connectorsSource) {
      connectorsSource.clear();
    }

    // Filtrar pontos válidos
    const pontosValidos = filterValidPoints(dataPoints);

    // Encontrar pares de marcadores próximos
    const nearbyPairs = findNearbyPairs(pontosValidos);

    console.log(`useMapMarkers: Processando ${pontosValidos.length} marcadores válidos`);
    console.log(`useMapMarkers: Encontrados ${nearbyPairs.length} pares próximos`);

    // Adicionar novos marcadores
    const markerFeatures = createMarkerFeatures(pontosValidos, nearbyPairs);
    markerFeatures.forEach(feature => vectorSource.addFeature(feature));

    // Criar conectores para pares próximos
    if (showConectores && connectorsSource) {
      const connectorFeatures = createConnectorFeatures(nearbyPairs, pontosValidos);
      connectorFeatures.forEach(feature => connectorsSource.addFeature(feature));
    }

    console.log(`useMapMarkers: Adicionados ${pontosValidos.length} marcadores com clustering inteligente`);
    console.log(`useMapMarkers: Criados ${nearbyPairs.length} conectores`);
  }, [map, dataPoints, showMarcadores, showConectores]);

  // Atualizar estilo dos marcadores
  useEffect(() => {
    if (!map) return;

    const vectorLayer = map.getLayers().getArray().find(layer => 
      layer.getSource() && layer.getSource().constructor.name === 'ClusterSource'
    );

    if (vectorLayer) {
      vectorLayer.setStyle(createClusterStyle);
    }
  }, [map]);

  // Controlar visibilidade da camada de conectores
  useEffect(() => {
    if (connectorsLayerRef.current) {
      connectorsLayerRef.current.setVisible(showConectores && showMarcadores);
    }
  }, [showConectores, showMarcadores]);

  return {
    connectorsLayer: connectorsLayerRef.current
  };
}; 