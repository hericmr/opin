import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

const TerrasIndigenas = ({ data, onClick }) => {
  const map = useMap();
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (data) {
      console.log("TerrasIndigenas: Dados recebidos:", {
        type: data.type,
        features: data.features ? data.features.length : 0,
        properties: data.features ? data.features[0].properties : null
      });
    } else {
      console.warn("TerrasIndigenas: Nenhum dado recebido");
    }
  }, [data]);

  // Função para mostrar tooltip temporário em mobile
  const showMobileTooltip = useCallback((event, content) => {
    if (!isMobile()) return;

    // Remove tooltip anterior
    if (tooltipRef.current) {
      tooltipRef.current.remove();
      tooltipRef.current = null;
    }

    const element = document.createElement('div');
    element.className = 'mobile-tooltip-terra';
    element.textContent = content;
    element.style.position = 'absolute';
    element.style.backgroundColor = 'rgba(139, 0, 0, 0.95)';
    element.style.color = 'white';
    element.style.padding = '8px 12px';
    element.style.borderRadius = '6px';
    element.style.fontSize = '14px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.fontWeight = '500';
    element.style.maxWidth = '250px';
    element.style.whiteSpace = 'nowrap';
    element.style.overflow = 'hidden';
    element.style.textOverflow = 'ellipsis';
    element.style.zIndex = '1000';
    element.style.pointerEvents = 'none';
    element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
    element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    
    const latlng = event.latlng;
    const point = map.latLngToLayerPoint(latlng);
    element.style.left = (point.x + 10) + 'px';
    element.style.top = (point.y - 10) + 'px';
    
    map.getContainer().appendChild(element);
    tooltipRef.current = element;

    // Auto-remove after 2 seconds
    setTimeout(() => {
      if (element.parentNode) {
        element.remove();
        tooltipRef.current = null;
      }
    }, 2000);
  }, [map]);

  // Estilo padrão das terras indígenas
  const defaultStyle = useMemo(
    () => ({
      color: '#B22222', // Vermelho escuro na borda
      weight: 2,
      fillOpacity: 0.3,
      fillColor: '#DC143C', // Vermelho vivo no preenchimento
      dashArray: '3',
      zIndex: 2
    }),
    []
  );

  // Função para determinar o estilo baseado no status da terra indígena
  const style = useCallback(
    (feature) => {
      if (!feature || !feature.properties) {
        console.warn("Feature sem propriedades:", feature);
        return defaultStyle;
      }

      const isRegularizada = feature.properties.fase_ti === 'Regularizada';
      console.log(`Terra indígena ${feature.properties.terrai_nom}: ${isRegularizada ? 'Regularizada' : 'Não Regularizada'}`);
      
      return {
        ...defaultStyle,
        fillColor: isRegularizada ? '#DC143C' : '#8B0000', // Regularizada vermelho vivo, não regularizada vermelho escuro
        fillOpacity: isRegularizada ? 0.3 : 0.25
      };
    },
    [defaultStyle]
  );

  // Estilo quando o mouse passa por cima
  const hoverStyle = {
    weight: 3,
    color: '#FF0000', // Vermelho puro na borda ao passar o mouse
    fillOpacity: 0.45,
    dashArray: ''
  };

  const onEachFeature = useCallback(
    (feature, layer) => {
      if (!feature || !feature.properties) {
        console.warn("Feature sem propriedades no onEachFeature:", feature);
        return;
      }

      // Adiciona tooltip com informações básicas (desktop only)
      if (!isMobile()) {
        const tooltipContent = `
          <div class="bg-white p-2 rounded shadow-md">
            <strong>${feature.properties.terrai_nom || 'Nome não disponível'}</strong><br/>
            ${feature.properties.etnia_nome || 'Etnia não disponível'}<br/>
            ${feature.properties.fase_ti || 'Fase não disponível'}
          </div>
        `;
        layer.bindTooltip(tooltipContent, {
          sticky: true,
          className: 'custom-tooltip'
        });
      }

      layer.on({
        mouseover: (e) => {
          if (isMobile()) return; // Skip hover on mobile
          const layer = e.target;
          layer.setStyle(hoverStyle);
          layer.bringToFront();
        },
        mouseout: (e) => {
          if (isMobile()) return; // Skip hover on mobile
          e.target.setStyle(style(feature));
        },
        click: (e) => {
          const layer = e.target;

          // Prepara os dados para o painel
          const terraIndigenaInfo = {
            titulo: feature.properties.terrai_nom,
            tipo: 'terra_indigena',
            etnia: feature.properties.etnia_nome,
            municipio: feature.properties.municipio_,
            uf: feature.properties.uf_sigla,
            superficie: feature.properties.superficie,
            fase: feature.properties.fase_ti,
            modalidade: feature.properties.modalidade,
            reestudo: feature.properties.reestudo_t,
            cr: feature.properties.cr,
            faixa_fron: feature.properties.faixa_fron,
            undadm_nom: feature.properties.undadm_nom,
            undadm_sig: feature.properties.undadm_sig,
            dominio_un: feature.properties.dominio_un,
            data_atual: feature.properties.data_atual,
            terrai_cod: feature.properties.terrai_cod,
            undadm_cod: feature.properties.undadm_cod
          };

          // Handle mobile two-click behavior
          onSecondClick(feature);
        }
      });
    },
    [map, style, onClick, showMobileTooltip]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
    };
  }, []);

  if (!data) {
    console.warn("TerrasIndigenas: Nenhum dado recebido");
    return null;
  }

  if (!data.type || data.type !== 'FeatureCollection') {
    console.error("TerrasIndigenas: Formato de GeoJSON inválido. Esperado FeatureCollection, recebido:", data.type);
    return null;
  }

  if (!data.features || !Array.isArray(data.features) || data.features.length === 0) {
    console.error("TerrasIndigenas: GeoJSON sem features válidas");
    return null;
  }

  return <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />;
};

export default TerrasIndigenas; 