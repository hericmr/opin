import { useRef, useEffect } from 'react';
import VectorSource from 'ol/source/Vector';
import ClusterSource from 'ol/source/Cluster';
import VectorLayer from 'ol/layer/Vector';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';

/**
 * Hook para gerenciar clustering de marcadores
 * @param {Object} options - Opções de clustering
 * @param {Array} options.dataPoints - Array de pontos de dados
 * @param {boolean} options.showMarcadores - Se deve mostrar marcadores
 * @param {boolean} options.showNomesEscolas - Se deve mostrar nomes das escolas
 * @param {Function} options.createStyle - Função para criar estilos
 * @param {Object} options.map - Referência do mapa
 */
export const useMarkerClustering = ({ 
  dataPoints, 
  showMarcadores, 
  showNomesEscolas,
  createStyle,
  map 
}) => {
  const vectorSource = useRef(null);
  const clusterSource = useRef(null);
  const vectorLayer = useRef(null);

  // Inicializar fontes e camada
  useEffect(() => {
    if (!map) return;

    // Criar fonte vetorial para marcadores
    vectorSource.current = new VectorSource();
    
    // Criar fonte de cluster
    clusterSource.current = new ClusterSource({
      distance: showNomesEscolas ? 15 : 10,
      source: vectorSource.current,
      geometryFunction: (feature) => {
        const geometry = feature.getGeometry();
        if (geometry.getType() === 'Point') {
          return geometry;
        }
        return null;
      }
    });
    
    // Criar camada vetorial para marcadores com clustering
    vectorLayer.current = new VectorLayer({
      source: clusterSource.current,
      style: createStyle,
      zIndex: 100
    });

    // Adicionar camada ao mapa
    map.addLayer(vectorLayer.current);

    // Cleanup
    return () => {
      if (vectorLayer.current && map) {
        map.removeLayer(vectorLayer.current);
        vectorLayer.current = null;
      }
    };
  }, [map, showNomesEscolas, createStyle]);

  // Atualizar marcadores quando dataPoints mudar
  useEffect(() => {
    if (!vectorSource.current || !dataPoints || !showMarcadores) return;

    // Limpar marcadores existentes
    vectorSource.current.clear();
    
    // Filtrar pontos válidos
    const pontosValidos = dataPoints.filter(point => {
      if (!point.latitude || !point.longitude) return false;
      const lat = parseFloat(point.latitude);
      const lng = parseFloat(point.longitude);
      return !isNaN(lat) && !isNaN(lng) && 
             lat >= -90 && lat <= 90 && 
             lng >= -180 && lng <= 180;
    });

    // Adicionar novos marcadores
    pontosValidos.forEach((point, index) => {
      if (point.latitude && point.longitude) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([point.longitude, point.latitude]))
        });
        feature.set('schoolData', point);
        feature.set('index', index);
        
        vectorSource.current.addFeature(feature);
      }
    });
  }, [dataPoints, showMarcadores]);

  // Recriar ClusterSource quando showNomesEscolas mudar
  useEffect(() => {
    if (!map || !vectorSource.current) return;
    
    // Remover camada antiga
    if (vectorLayer.current) {
      map.removeLayer(vectorLayer.current);
    }

    // Criar novo ClusterSource com distância apropriada
    clusterSource.current = new ClusterSource({
      distance: showNomesEscolas ? 15 : 10,
      source: vectorSource.current,
      geometryFunction: (feature) => {
        const geometry = feature.getGeometry();
        if (geometry.getType() === 'Point') {
          return geometry;
        }
        return null;
      }
    });

    // Criar nova camada
    vectorLayer.current = new VectorLayer({
      source: clusterSource.current,
      style: createStyle,
      zIndex: 15
    });

    // Adicionar nova camada ao mapa
    map.addLayer(vectorLayer.current);

  }, [showNomesEscolas, createStyle, map]);

  return {
    vectorSource: vectorSource.current,
    clusterSource: clusterSource.current,
    vectorLayer: vectorLayer.current
  };
}; 