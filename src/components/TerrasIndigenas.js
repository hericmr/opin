import React, { useCallback, useMemo, useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

const TerrasIndigenas = ({ data, onClick }) => {
  const map = useMap();

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

  // Estilo padrão das terras indígenas
  const defaultStyle = useMemo(
    () => ({
      color: '#8B4513', // Marrom escuro para a borda
      weight: 2,
      fillOpacity: 0.2,
      fillColor: '#D2691E', // Marrom avermelhado
      dashArray: '3',
      zIndex: 2 // Acima do estado, abaixo dos marcadores
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
        fillColor: isRegularizada ? '#D2691E' : '#CD853F', // Marrom mais claro para não regularizadas
        fillOpacity: isRegularizada ? 0.2 : 0.15
      };
    },
    [defaultStyle]
  );

  // Estilo quando o mouse passa por cima
  const hoverStyle = {
    weight: 3,
    color: '#A0522D',
    fillOpacity: 0.4,
    dashArray: '1'
  };

  const onEachFeature = useCallback(
    (feature, layer) => {
      if (!feature || !feature.properties) {
        console.warn("Feature sem propriedades no onEachFeature:", feature);
        return;
      }

      // Adiciona tooltip com informações básicas
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

      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle(hoverStyle);
          layer.bringToFront();
        },
        mouseout: (e) => {
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

          if (onClick) {
            onClick(terraIndigenaInfo);
          }
        }
      });
    },
    [map, style, onClick]
  );

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