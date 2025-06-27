import React, { useEffect, useRef, useCallback } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import { GeoJSON } from 'ol/format';
import { fromLonLat } from 'ol/proj';

const OpenLayersTerrasIndigenas = ({ data, onClick, visible = true }) => {
  const layerRef = useRef(null);
  const sourceRef = useRef(null);

  // Função para criar estilo baseado no status da terra indígena
  const createStyle = useCallback((feature) => {
    if (!feature || !feature.getProperties) return null;
    
    const properties = feature.getProperties();
    const isRegularizada = properties.fase_ti === 'Regularizada';
    
    return new Style({
      fill: new Fill({
        color: isRegularizada ? 'rgba(220, 20, 60, 0.3)' : 'rgba(139, 0, 0, 0.25)' // Regularizada vermelho vivo, não regularizada vermelho escuro
      }),
      stroke: new Stroke({
        color: '#B22222', // Vermelho escuro na borda
        width: 2,
        lineDash: [3, 3] // Linha tracejada
      })
    });
  }, []);

  // Função para criar estilo de hover
  const createHoverStyle = useCallback(() => {
    return new Style({
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.45)' // Vermelho puro com mais opacidade
      }),
      stroke: new Stroke({
        color: '#FF0000', // Vermelho puro na borda
        width: 3
      })
    });
  }, []);

  // Inicializar camada
  useEffect(() => {
    if (!data || !data.features || data.features.length === 0) {
      console.warn("OpenLayersTerrasIndigenas: Nenhum dado recebido");
      return;
    }

    // Criar fonte vetorial
    sourceRef.current = new VectorSource({
      features: new GeoJSON().readFeatures(data, {
        featureProjection: 'EPSG:3857'
      })
    });

    // Criar camada vetorial
    layerRef.current = new VectorLayer({
      source: sourceRef.current,
      style: createStyle,
      visible: visible,
      zIndex: 2
    });

    // Adicionar interatividade
    if (sourceRef.current) {
      sourceRef.current.getFeatures().forEach(feature => {
        const properties = feature.getProperties();
        
        // Adicionar tooltip
        feature.set('tooltip', `
          <div class="bg-white p-2 rounded shadow-md">
            <strong>${properties.terrai_nom || 'Nome não disponível'}</strong><br/>
            ${properties.etnia_nome || 'Etnia não disponível'}<br/>
            ${properties.fase_ti || 'Fase não disponível'}
          </div>
        `);

        // Adicionar dados para o painel
        feature.set('terraIndigenaInfo', {
          titulo: properties.terrai_nom,
          tipo: 'terra_indigena',
          etnia: properties.etnia_nome,
          municipio: properties.municipio_,
          uf: properties.uf_sigla,
          superficie: properties.superficie,
          fase: properties.fase_ti,
          modalidade: properties.modalidade,
          reestudo: properties.reestudo_t,
          cr: properties.cr,
          faixa_fron: properties.faixa_fron,
          undadm_nom: properties.undadm_nom,
          undadm_sig: properties.undadm_sig,
          dominio_un: properties.dominio_un,
          data_atual: properties.data_atual,
          terrai_cod: properties.terrai_cod,
          undadm_cod: properties.undadm_cod
        });
      });
    }

    return () => {
      if (layerRef.current) {
        layerRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current = null;
      }
    };
  }, [data, createStyle, visible]);

  // Expor a camada para o componente pai
  useEffect(() => {
    if (layerRef.current && typeof onClick === 'function') {
      // Adicionar listener para cliques
      const handleClick = (event) => {
        const feature = layerRef.current.getSource().forEachFeatureAtCoordinate(
          event.coordinate,
          (feature) => feature
        );
        
        if (feature) {
          const terraIndigenaInfo = feature.get('terraIndigenaInfo');
          if (terraIndigenaInfo && onClick) {
            onClick(terraIndigenaInfo);
          }
        }
      };

      // Adicionar listener para hover
      const handlePointerMove = (event) => {
        const feature = layerRef.current.getSource().forEachFeatureAtCoordinate(
          event.coordinate,
          (feature) => feature
        );
        
        if (feature) {
          layerRef.current.setStyle(createHoverStyle);
        } else {
          layerRef.current.setStyle(createStyle);
        }
      };

      // Adicionar listeners ao mapa (será feito pelo componente pai)
      layerRef.current.set('clickHandler', handleClick);
      layerRef.current.set('pointerMoveHandler', handlePointerMove);
    }
  }, [onClick, createStyle, createHoverStyle]);

  return null; // Este componente não renderiza nada, apenas gerencia a camada
};

export default OpenLayersTerrasIndigenas; 