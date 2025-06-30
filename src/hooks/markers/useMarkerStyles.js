import { useCallback } from 'react';
import { Style, Circle, Fill, Stroke, Text, Icon } from 'ol/style';
import { createMarkerSVG } from '../../utils/markers/svgGenerator';

/**
 * Hook para gerenciar estilos de marcadores
 * @param {Object} options - Opções de estilo
 * @param {boolean} options.showNomesEscolas - Se deve mostrar nomes das escolas
 */
export const useMarkerStyles = ({ showNomesEscolas }) => {
  
  // Função para criar estilo dos marcadores individuais
  const createMarkerStyle = useCallback((feature) => {
    try {
      const schoolData = feature.get('schoolData');
      if (!schoolData) return null;

      const baseColor = '#3B82F6';
      const borderColor = '#1E40AF';

      // Verificar se é parte de um par próximo
      const isNearbyPair = feature.get('isNearbyPair');

      // Usar a função createMarkerSVG para criar o marcador
      const svg = createMarkerSVG(baseColor, 24, {
        borderColor: borderColor,
        showShadow: true,
        showGradient: true,
        showGlow: false,
        isNearbyPair: isNearbyPair
      });

      // Criar URL de dados para o SVG
      const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

      // Criar estilo base com ícone
      const style = new Style({
        image: new Icon({
          src: svgUrl,
          scale: isNearbyPair ? 1.1 : 1.0,
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction'
        })
      });

      // Adicionar texto apenas se showNomesEscolas for true
      if (showNomesEscolas) {
        style.setText(new Text({
          text: schoolData.titulo || 'Escola',
          font: 'bold 10px Arial',
          fill: new Fill({
            color: '#FFFFFF'
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 2
          }),
          offsetY: isNearbyPair ? -35 : -30,
          textAlign: 'center',
          textBaseline: 'middle'
        }));
      }

      return style;
    } catch (error) {
      return null;
    }
  }, [showNomesEscolas]);

  // Função para criar estilo dos clusters
  const createClusterStyle = useCallback((feature) => {
    try {
      const features = feature.get('features');
      if (!features || features.length === 0) {
        return null;
      }
      
      const size = features.length;

      // Se for apenas um marcador, retorna estilo individual
      if (size === 1) {
        const singleFeature = features[0];
        if (!singleFeature) return null;
        return createMarkerStyle(singleFeature);
      }

      // Determinar cor e tamanho base baseado na quantidade de escolas
      let baseColor = '#3B82F6';
      let baseSize = 32;
      
      if (size > 100) {
        baseColor = '#1E40AF';
        baseSize = 40;
      } else if (size > 50) {
        baseColor = '#2563EB';
        baseSize = 36;
      } else if (size > 20) {
        baseColor = '#3B82F6';
        baseSize = 34;
      } else if (size > 10) {
        baseColor = '#60A5FA';
        baseSize = 33;
      }

      // Calcular escala proporcional
      const scale = Math.min(1.0 + (size * 0.015), 1.8);
      const finalSize = Math.round(baseSize * scale);

      // Usar a função createMarkerSVG para criar o cluster
      const svg = createMarkerSVG(baseColor, finalSize, {
        borderColor: baseColor,
        showShadow: true,
        showGradient: true,
        showGlow: size > 20,
        isNearbyPair: false
      });

      // Criar URL de dados para o SVG
      const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

      // Determinar tamanho da fonte baseado no tamanho do cluster
      let fontSize = '12px';
      let fontWeight = 'bold';
      
      if (size > 100) {
        fontSize = '14px';
      } else if (size > 50) {
        fontSize = '13px';
      } else if (size > 20) {
        fontSize = '12px';
      }

      return new Style({
        image: new Icon({
          src: svgUrl,
          scale: 1,
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction'
        }),
        text: new Text({
          text: size.toString(),
          font: `${fontWeight} ${fontSize} Arial`,
          fill: new Fill({
            color: '#FFFFFF'
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 2
          }),
          offsetY: finalSize * 0.6
        })
      });
    } catch (error) {
      return null;
    }
  }, [createMarkerStyle]);

  return {
    createMarkerStyle,
    createClusterStyle
  };
}; 