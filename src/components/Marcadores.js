import React, { useEffect, useRef } from "react";
import { Marker, Tooltip, useMap } from "react-leaflet";
import { violetIcon } from "./CustomIcon";
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Constante para definir a proximidade entre marcadores (em graus)
const PROXIMITY_THRESHOLD = 0.00005;

// Função para criar o conector entre marcadores
const createConnector = (map, centerLat, centerLng, markerLat, markerLng) => {
  return L.polyline([[centerLat, centerLng], [markerLat, markerLng]], {
    color: '#A0522D',
    weight: 1.2,
    dashArray: '3,3',
    opacity: 0.6,
    className: 'marker-connector'
  }).addTo(map);
};

// Função para encontrar pares de marcadores próximos
const findNearbyPairs = (pontos) => {
  const pairs = [];
  const used = new Set();

  for (let i = 0; i < pontos.length; i++) {
    if (used.has(i)) continue;

    for (let j = i + 1; j < pontos.length; j++) {
      if (used.has(j)) continue;

      const p1 = pontos[i];
      const p2 = pontos[j];

      const latDiff = Math.abs(parseFloat(p1.latitude) - parseFloat(p2.latitude));
      const lngDiff = Math.abs(parseFloat(p1.longitude) - parseFloat(p2.longitude));

      if (latDiff < PROXIMITY_THRESHOLD && lngDiff < PROXIMITY_THRESHOLD) {
        pairs.push([i, j]);
        used.add(i);
        used.add(j);
        break;
      }
    }
  }

  return pairs;
};

const Marcadores = ({ dataPoints, visibility, onClick }) => {
  const map = useMap();
  const clusterGroupRef = useRef(null);
  const connectorsRef = useRef([]);

  // Filtra os pontos válidos
  const pontosValidos = React.useMemo(() => {
    if (!Array.isArray(dataPoints) || dataPoints.length === 0) {
      return [];
    }

    return dataPoints.filter(ponto => {
      if (!ponto.titulo || !ponto.latitude || !ponto.longitude) {
        return false;
      }

      const lat = parseFloat(ponto.latitude);
      const lng = parseFloat(ponto.longitude);
      
      return !(
        isNaN(lat) || isNaN(lng) ||
        lat < -90 || lat > 90 ||
        lng < -180 || lng > 180
      );
    });
  }, [dataPoints]);

  // Configuração do ícone para escolas indígenas
  const escolaIcon = violetIcon;

  useEffect(() => {
    if (!Array.isArray(dataPoints) || dataPoints.length === 0) {
      console.warn("Marcadores: Nenhum ponto de dados válido recebido");
      return;
    }

    if (!map || !pontosValidos.length || !visibility.educacao) return;

    // Remove o grupo de clusters anterior e conectores
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }
    connectorsRef.current.forEach(connector => map.removeLayer(connector));
    connectorsRef.current = [];

    // Encontra pares de marcadores próximos
    const nearbyPairs = findNearbyPairs(pontosValidos);
    const usedIndices = new Set(nearbyPairs.flat());

    // Cria um novo grupo de clusters
    const clusterGroup = new L.MarkerClusterGroup({
      // Configurações básicas
      chunkedLoading: true,
      maxClusterRadius: 4,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      animate: true,
      
      // Configurações de zoom
      disableClusteringAtZoom: 12,
      minZoom: 4,
      maxZoom: 18,
      
      // Configurações de ícones com estética indígena
      iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        let size = 'small';
        let background = '#A0522D';
        let textColor = '#fff';

        if (count > 100) {
          size = 'large';
          background = '#4B2E14';
        } else if (count > 20) {
          size = 'medium';
          background = '#8B5A2B';
        }

        const iconUrl = violetIcon.options.iconUrl;
        const iconSize = violetIcon.options.iconSize || [30, 30];

        return L.divIcon({
          html: `
            <div style="
              background: radial-gradient(circle at 30% 30%, ${background}, #3b2e2a);
              color: ${textColor};
              border-radius: 50%;
              width: ${iconSize[0] + 10}px;
              height: ${iconSize[1] + 10}px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              border: 2px solid #f5f5dc;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
              transition: transform 0.3s ease;
              padding: 2px;
            ">
              <img src="${iconUrl}" width="${iconSize[0] * 0.6}" height="${iconSize[1] * 0.6}" style="margin-bottom: 2px;" />
              <span style="
                font-size: ${size === 'large' ? '16px' : size === 'medium' ? '14px' : '12px'};
              ">${count}</span>
            </div>`,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: L.point(iconSize[0] + 10, iconSize[1] + 10)
        });
      },
      
      // Configurações de animação suaves
      animateAddingMarkers: true,
      spiderLegPolylineOptions: { 
        weight: 1.3,
        color: '#5C4033',
        opacity: 0.5,
        dashArray: '2,4'
      },
      
      // Configurações de performance
      chunkInterval: 200,
      chunkDelay: 50,
      
      // Configurações de interatividade
      singleMarkerMode: false,
      spiderfyDistanceMultiplier: 1.5,
      
      // Configurações de estilo orgânico
      polygonOptions: {
        fillColor: '#A0522D',
        color: '#5C4033',
        weight: 1.2,
        opacity: 0.6,
        fillOpacity: 0.2
      }
    });

    // Adiciona os marcadores ao grupo
    pontosValidos.forEach((ponto, index) => {
      const lat = parseFloat(ponto.latitude);
      const lng = parseFloat(ponto.longitude);
      
      const marker = L.marker([lat, lng], { 
        icon: escolaIcon,
        zIndexOffset: 1000
      });

      // Adiciona o tooltip
      marker.bindTooltip(ponto.titulo, {
        className: "bg-white/95 text-gray-800 text-sm font-medium px-3 py-1.5 rounded shadow-sm border border-gray-100",
        direction: "top",
        offset: [0, -10],
        opacity: 1,
        permanent: false
      });

      // Adiciona o evento de clique
      marker.on('click', () => onClick?.(ponto));

      // Verifica se este marcador faz parte de um par próximo
      const pairIndex = nearbyPairs.findIndex(pair => pair.includes(index));
      if (pairIndex !== -1) {
        const [first, second] = nearbyPairs[pairIndex];
        const isFirst = index === first;
        const otherIndex = isFirst ? second : first;
        const otherPonto = pontosValidos[otherIndex];

        // Aplica o efeito de fan-out aprimorado
        marker.on('add', function() {
          const transform = isFirst 
            ? 'perspective(500px) rotateY(-20deg) translateX(-20px) rotate(-25deg) scale(0.9)'
            : 'perspective(500px) rotateY(20deg) translateX(20px) rotate(25deg) scale(0.9)';
          
          this._icon.style.transform = transform;
          this._icon.style.transition = 'transform 0.5s ease-out, filter 0.3s ease-in';
          this._icon.style.filter = 'drop-shadow(0 4px 12px rgba(160, 82, 45, 0.35))';
          this._icon.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.35)';
        });

        // Cria o conector entre os marcadores
        const connector = createConnector(
          map,
          lat,
          lng,
          parseFloat(otherPonto.latitude),
          parseFloat(otherPonto.longitude)
        );
        connectorsRef.current.push(connector);
      }

      clusterGroup.addLayer(marker);
    });

    // Adiciona o grupo ao mapa
    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    // Limpa o grupo e conectores quando o componente for desmontado
    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
      }
      connectorsRef.current.forEach(connector => map.removeLayer(connector));
      connectorsRef.current = [];
    };
  }, [map, pontosValidos, onClick, escolaIcon, visibility.educacao, dataPoints]);

  return null;
};

export default Marcadores; 