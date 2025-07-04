import { useEffect, useRef } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { createTerrasIndigenasStyle, createEstadoSPStyle } from '../utils/mapStyles';
import { PROJECTION_CONFIG } from '../utils/mapConfig';

export const useMapLayers = (map, terrasIndigenasData, estadoSPData, showTerrasIndigenas, showEstadoSP, onPainelOpen) => {
  const terrasIndigenasLayerRef = useRef(null);
  const estadoSPLayerRef = useRef(null);

  // Gerenciar camadas GeoJSON
  useEffect(() => {
    if (!map) return;

    console.log('useMapLayers: Gerenciando camadas GeoJSON:', {
      showTerrasIndigenas,
      showEstadoSP,
      terrasIndigenasData: !!terrasIndigenasData,
      estadoSPData: !!estadoSPData,
      terrasFeatures: terrasIndigenasData?.features?.length || 0,
      estadoFeatures: estadoSPData?.features?.length || 0,
      mapLayers: map.getLayers().getLength()
    });

    // Remover camadas existentes primeiro
    if (terrasIndigenasLayerRef.current) {
      map.removeLayer(terrasIndigenasLayerRef.current);
      terrasIndigenasLayerRef.current = null;
    }
    if (estadoSPLayerRef.current) {
      map.removeLayer(estadoSPLayerRef.current);
      estadoSPLayerRef.current = null;
    }

    // Adicionar camada Terras Indígenas
    if (showTerrasIndigenas && terrasIndigenasData) {
      console.log('useMapLayers: Adicionando camada Terras Indígenas');
      
      // Verificar se os dados têm a estrutura correta
      if (!terrasIndigenasData.features || terrasIndigenasData.features.length === 0) {
        console.error('useMapLayers: Dados Terras Indígenas não têm features válidas');
        return;
      }

      try {
        const geoJSONFormat = new GeoJSON({
          dataProjection: PROJECTION_CONFIG.dataProjection,
          featureProjection: PROJECTION_CONFIG.featureProjection
        });
        const features = geoJSONFormat.readFeatures(terrasIndigenasData);
        console.log('useMapLayers: Features lidas do GeoJSON:', features.length);

        const terrasIndigenasLayer = new VectorLayer({
          source: new VectorSource({
            features: features
          }),
          style: createTerrasIndigenasStyle,
          zIndex: 20,
          interactive: true,
          name: 'terras-indigenas'
        });

        // Adicionar interatividade
        terrasIndigenasLayer.getSource().getFeatures().forEach(feature => {
          const properties = feature.getProperties();
          console.log('useMapLayers: Processando feature terra indígena:', properties.terrai_nom);
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

        map.addLayer(terrasIndigenasLayer);
        terrasIndigenasLayerRef.current = terrasIndigenasLayer;
        console.log('useMapLayers: Camada Terras Indígenas adicionada com sucesso. Total de camadas:', map.getLayers().getLength());
      } catch (error) {
        console.error('useMapLayers: Erro ao processar Terras Indígenas:', error);
      }
    }

    // Adicionar camada Estado SP
    if (showEstadoSP && estadoSPData) {
      console.log('useMapLayers: Adicionando camada Estado SP');
      
      // Verificar se os dados têm a estrutura correta
      if (!estadoSPData.features || estadoSPData.features.length === 0) {
        console.error('useMapLayers: Dados Estado SP não têm features válidas');
        return;
      }

      try {
        const geoJSONFormat = new GeoJSON({
          dataProjection: PROJECTION_CONFIG.dataProjection,
          featureProjection: PROJECTION_CONFIG.featureProjection
        });
        const features = geoJSONFormat.readFeatures(estadoSPData);
        console.log('useMapLayers: Features Estado SP lidas do GeoJSON:', features.length);

        const estadoSPLayer = new VectorLayer({
          source: new VectorSource({
            features: features
          }),
          style: createEstadoSPStyle,
          zIndex: 5,
          interactive: false
        });

        map.addLayer(estadoSPLayer);
        estadoSPLayerRef.current = estadoSPLayer;
        console.log('useMapLayers: Camada Estado SP adicionada com sucesso. Total de camadas:', map.getLayers().getLength());
      } catch (error) {
        console.error('useMapLayers: Erro ao processar Estado SP:', error);
      }
    }

    console.log('useMapLayers: Finalização - Total de camadas no mapa:', map.getLayers().getLength());
  }, [map, showTerrasIndigenas, showEstadoSP, terrasIndigenasData, estadoSPData]);

  // Adicionar event listeners para camadas GeoJSON
  useEffect(() => {
    if (!map) return;

    const handleClick = (event) => {
      console.log('useMapLayers: Evento de clique detectado:', event.type, 'pixel:', event.pixel);
      
      // Tentar detectar features em diferentes camadas
      let feature = null;
      let layer = null;
      
      map.forEachFeatureAtPixel(event.pixel, (f, l) => {
        if (f && !feature) {
          feature = f;
          layer = l;
          console.log('useMapLayers: Feature encontrada na camada:', l.get('name') || 'sem nome');
        }
      });
      
      if (feature) {
        const terraIndigenaInfo = feature.get('terraIndigenaInfo');
        if (terraIndigenaInfo && onPainelOpen) {
          console.log('useMapLayers: Terra indígena clicada:', terraIndigenaInfo.titulo);
          onPainelOpen(terraIndigenaInfo);
        } else {
          console.log('useMapLayers: Feature encontrada mas sem terraIndigenaInfo ou onPainelOpen');
        }
      } else {
        console.log('useMapLayers: Nenhuma feature encontrada no pixel clicado');
      }
    };

    // Adicionar listeners para clique e toque
    map.on('click', handleClick);
    map.on('singleclick', handleClick); // OpenLayers specific

    return () => {
      if (map) {
        map.un('click', handleClick);
        map.un('singleclick', handleClick);
      }
    };
  }, [map, onPainelOpen]);

  return {
    terrasIndigenasLayer: terrasIndigenasLayerRef.current,
    estadoSPLayer: estadoSPLayerRef.current
  };
}; 