/**
 * Cria o estilo de marcador individual para o OpenLayers.
 * @param {ol.Feature} feature - Feature do marcador.
 * @param {boolean} showNomesEscolas - Se deve mostrar o nome da escola.
 * @returns {ol.style.Style|null} Estilo do marcador ou null.
 */
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
import { createMarkerSVG } from './svgGenerator';

export function createMarkerStyle(feature, showNomesEscolas = false) {
  try {
    const schoolData = feature.get('schoolData');
    if (!schoolData) return null;

    const baseColor = '#3B82F6';
    const borderColor = '#1E40AF';
    const isNearbyPair = feature.get('isNearbyPair');

    // Gerar SVG dinamicamente
    const svg = createMarkerSVG(baseColor, 24, {
      borderColor: borderColor,
      showShadow: true,
      showGradient: true,
      showGlow: false,
      isNearbyPair: isNearbyPair
    });
    const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

    const style = new Style({
      image: new Icon({
        src: svgUrl,
        scale: isNearbyPair ? 1.1 : 1.0,
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction'
      })
    });

    if (showNomesEscolas) {
      style.setText(new Text({
        text: schoolData.titulo || 'Escola',
        font: 'bold 10px Arial',
        fill: new Fill({ color: '#FFFFFF' }),
        stroke: new Stroke({ color: '#000000', width: 2 }),
        offsetY: isNearbyPair ? -35 : -30,
        textAlign: 'center',
        textBaseline: 'middle'
      }));
    }

    return style;
  } catch (error) {
    return null;
  }
}

/**
 * Cria o estilo de cluster de marcadores para o OpenLayers.
 * @param {ol.Feature} feature - Feature do cluster.
 * @param {Function} createMarkerStyle - Função para criar estilo de marcador individual.
 * @returns {ol.style.Style|null} Estilo do cluster ou null.
 */
export function createClusterStyle(feature, createMarkerStyle) {
  try {
    const features = feature.get('features');
    if (!features || features.length === 0) return null;
    const size = features.length;

    if (size === 1) {
      const singleFeature = features[0];
      if (!singleFeature) return null;
      return createMarkerStyle(singleFeature);
    }

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
    const scale = Math.min(1.0 + (size * 0.015), 1.8);
    const finalSize = Math.round(baseSize * scale);

    // Gerar SVG dinamicamente
    const svg = createMarkerSVG(baseColor, finalSize, {
      borderColor: baseColor,
      showShadow: true,
      showGradient: true,
      showGlow: size > 20,
      isNearbyPair: false
    });
    const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

    let fontSize = '12px';
    let fontWeight = 'bold';
    if (size > 100) fontSize = '14px';
    else if (size > 50) fontSize = '13px';
    else if (size > 20) fontSize = '12px';

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
        fill: new Fill({ color: '#FFFFFF' }),
        stroke: new Stroke({ color: '#000000', width: 2 }),
        offsetY: finalSize * 0.6
      })
    });
  } catch (error) {
    return null;
  }
} 