import { useEffect } from 'react';
import { fromLonLat } from 'ol/proj';
import logger from '../utils/logger';

/**
 * Registra o handler de clique nos marcadores de escola.
 *
 * Os marcadores vivem numa camada de cluster (ver useMapMarkers). Ao clicar:
 * - Se a feature clicada é um cluster com várias escolas, aproxima o mapa para
 *   "abrir" o cluster, em vez de escolher uma escola arbitrária.
 * - Se resolve para uma única escola, chama onPainelOpen(schoolData) e
 *   centraliza o mapa nela.
 *
 * Usa 'singleclick' do OpenLayers (dispara após o delay de duplo clique, então
 * não conflita com o zoom por duplo clique) e forEachFeatureAtPixel com um
 * hitTolerance para facilitar o toque em telas pequenas.
 */
export const useMapClick = (map, onPainelOpen) => {
  useEffect(() => {
    if (!map) return;

    // Só considerar a camada de marcadores das escolas (ignora polígonos de
    // terras indígenas / estado, que não são clicáveis).
    const isMarkerLayer = (layer) => layer && layer.get('name') === 'escolas-marcadores';

    const handleClick = (event) => {
      let handled = false;

      map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => {
          // Features de cluster expõem as features agrupadas em 'features'.
          const clustered = feature.get('features');

          if (Array.isArray(clustered)) {
            if (clustered.length > 1) {
              // Cluster com várias escolas: aproximar para desagrupar.
              const view = map.getView();
              const geometry = feature.getGeometry();
              if (view && geometry) {
                view.animate({
                  center: geometry.getCoordinates(),
                  zoom: Math.min((view.getZoom() || 7) + 2, view.getMaxZoom?.() || 18),
                  duration: 400,
                });
              }
              handled = true;
              return true; // parar iteração
            }

            // Cluster de um único item: tratar como escola individual.
            const singleFeature = clustered[0];
            const schoolData = singleFeature && singleFeature.get('schoolData');
            if (schoolData) {
              openPainel(schoolData);
              handled = true;
              return true;
            }
            return false;
          }

          // Feature individual (sem clustering).
          const schoolData = feature.get('schoolData');
          if (schoolData) {
            openPainel(schoolData);
            handled = true;
            return true;
          }

          return false;
        },
        { hitTolerance: 5, layerFilter: isMarkerLayer }
      );

      return handled;
    };

    const openPainel = (schoolData) => {
      logger.debug('useMapClick: Abrindo painel da escola:', schoolData?.titulo);
      if (typeof onPainelOpen === 'function') {
        onPainelOpen(schoolData);
      }

      // Centralizar no marcador clicado (a partir de lon/lat da escola).
      const view = map.getView();
      if (view && schoolData?.longitude != null && schoolData?.latitude != null) {
        view.animate({
          center: fromLonLat([
            parseFloat(schoolData.longitude),
            parseFloat(schoolData.latitude),
          ]),
          zoom: Math.max(view.getZoom() || 15, 15),
          duration: 500,
        });
      }
    };

    map.on('singleclick', handleClick);

    // Cursor de ponteiro ao passar sobre um marcador clicável.
    const handlePointerMove = (event) => {
      if (event.dragging) return;
      const hit = map.hasFeatureAtPixel(event.pixel, { hitTolerance: 5, layerFilter: isMarkerLayer });
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    };
    map.on('pointermove', handlePointerMove);

    return () => {
      map.un('singleclick', handleClick);
      map.un('pointermove', handlePointerMove);
    };
  }, [map, onPainelOpen]);
};
