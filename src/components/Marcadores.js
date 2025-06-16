import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { Marker, Tooltip, useMap } from "react-leaflet";
import { violetIcon } from "./CustomIcon";
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { capitalizeWords } from "../utils/textFormatting";

// Constante para definir a proximidade entre marcadores (em graus)
const PROXIMITY_THRESHOLD = 0.00005;
// Tempo em ms para o tooltip fechar automaticamente em mobile
const TOOLTIP_TIMEOUT = 2000;

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
  const isMobile = useMemo(() => L.Browser.mobile, []);
  
  // Refs para controle de interação touch
  const lastTouchedMarker = useRef(null);
  const touchTimeout = useRef(null);

  // Função para limpar timeout do tooltip
  const clearTooltipTimeout = useCallback(() => {
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
      touchTimeout.current = null;
    }
  }, []);

  // Função para gerenciar interação touch em mobile
  const handleTouchInteraction = useCallback((marker, ponto, e) => {
    if (!isMobile) return;

    // Previne propagação do evento
    e.originalEvent.stopPropagation();

    // Se for o mesmo marcador do último toque
    if (lastTouchedMarker.current === marker) {
      clearTooltipTimeout();
      marker.closeTooltip();
      onClick?.(ponto);
      lastTouchedMarker.current = null;
    } else {
      // Se for um marcador diferente
      if (lastTouchedMarker.current) {
        lastTouchedMarker.current.closeTooltip();
      }
      
      // Atualiza referência e mostra tooltip
      lastTouchedMarker.current = marker;
      marker.openTooltip();
      
      // Configura timeout para fechar tooltip
      clearTooltipTimeout();
      touchTimeout.current = setTimeout(() => {
        marker.closeTooltip();
        lastTouchedMarker.current = null;
      }, TOOLTIP_TIMEOUT);
    }
  }, [isMobile, onClick, clearTooltipTimeout]);

  // Filtra os pontos válidos
  const pontosValidos = React.useMemo(() => {
    if (!Array.isArray(dataPoints) || dataPoints.length === 0) {
      console.warn("Marcadores: Nenhum ponto de dados recebido");
      return [];
    }

    // Log inicial com total de pontos
    console.log("Total de escolas recebidas:", dataPoints.length);

    // Array para armazenar escolas com coordenadas inválidas
    const escolasComProblemas = [];

    const pontosFiltrados = dataPoints.filter(ponto => {
      // Verifica se o ponto tem as propriedades básicas
      if (!ponto.titulo || !ponto.latitude || !ponto.longitude) {
        escolasComProblemas.push({
          escola: ponto.titulo || "Sem nome",
          problema: "Dados básicos ausentes",
          detalhes: {
            titulo: !!ponto.titulo,
            latitude: !!ponto.latitude,
            longitude: !!ponto.longitude
          }
        });
        return false;
      }

      const lat = parseFloat(ponto.latitude);
      const lng = parseFloat(ponto.longitude);
      
      // Verifica se as coordenadas são números válidos
      if (isNaN(lat) || isNaN(lng)) {
        escolasComProblemas.push({
          escola: ponto.titulo,
          problema: "Coordenadas não são números válidos",
          detalhes: {
            latitude: ponto.latitude,
            longitude: ponto.longitude
          }
        });
        return false;
      }

      // Verifica se as coordenadas estão dentro dos limites válidos
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        escolasComProblemas.push({
          escola: ponto.titulo,
          problema: "Coordenadas fora dos limites válidos",
          detalhes: {
            latitude: lat,
            longitude: lng,
            limites: {
              latMin: -90,
              latMax: 90,
              lngMin: -180,
              lngMax: 180
            }
          }
        });
        return false;
      }

      return true;
    });

    // Log detalhado das escolas com problemas
    if (escolasComProblemas.length > 0) {
      console.group("Escolas com coordenadas inválidas:");
      escolasComProblemas.forEach(escola => {
        console.group(escola.escola);
        console.log("Problema:", escola.problema);
        console.log("Detalhes:", escola.detalhes);
        console.groupEnd();
      });
      console.groupEnd();
      console.log(`Total de escolas com problemas: ${escolasComProblemas.length}`);
    }

    // Log do resultado final
    console.log(`Escolas válidas: ${pontosFiltrados.length} de ${dataPoints.length}`);

    return pontosFiltrados;
  }, [dataPoints]);

  // Configuração do ícone para escolas indígenas
  const escolaIcon = violetIcon;

  // Função para criar o conteúdo do tooltip com melhor acessibilidade
  const createTooltipContent = useCallback((ponto) => {
    return `
      <div class="bg-white/95 text-gray-800 text-sm font-medium px-3 py-1.5 rounded shadow-sm border border-gray-100 text-left w-full hover:text-violet-700 focus:text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-colors duration-200">
        <button 
          onclick="event.stopPropagation(); window.dispatchEvent(new CustomEvent('marker-click', { detail: ${JSON.stringify(ponto)} }));"
          aria-label="Ver detalhes da escola ${capitalizeWords(ponto.titulo)}"
          class="w-full text-left"
        >
          <strong>${capitalizeWords(ponto.titulo)}</strong>
          ${ponto.etnia ? `<div class="mt-1 text-xs text-gray-600">Etnia: ${ponto.etnia}</div>` : ''}
        </button>
      </div>
    `;
  }, []);

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

    // Limpa referências de touch
    lastTouchedMarker.current = null;
    clearTooltipTimeout();

    // Encontra pares de marcadores próximos
    const nearbyPairs = findNearbyPairs(pontosValidos);
    const usedIndices = new Set(nearbyPairs.flat());

    // Cria um novo grupo de clusters com configurações otimizadas
    const clusterGroup = new L.MarkerClusterGroup({
      // Configurações básicas
      chunkedLoading: true,
      maxClusterRadius: 4,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: !isMobile, // Desativa em mobile
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      animate: true,
      
      // Configurações de zoom otimizadas
      disableClusteringAtZoom: 12,
      minZoom: 4,
      maxZoom: 18,
      
      // Configurações de ícones com estética indígena e acessibilidade
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
        const iconSize = violetIcon.options.iconSize || [44, 44];

        // Adiciona tooltip ao cluster
        cluster.bindTooltip(`
          <div class="bg-white/95 text-gray-800 text-sm font-medium px-3 py-1.5 rounded shadow-sm border border-gray-100">
            <strong>${count} escola${count > 1 ? 's' : ''} indígena${count > 1 ? 's' : ''}</strong>
            <br/>
            <span class="text-xs text-gray-600">Clique para expandir</span>
          </div>
        `, {
          className: "cluster-tooltip",
          direction: "top",
          offset: [0, -10],
          opacity: 1,
          permanent: false,
          sticky: !isMobile
        });

        return L.divIcon({
          html: `
            <div 
              role="button"
              tabindex="0"
              aria-label="Grupo de ${count} escolas indígenas. Clique para expandir."
              style="
              background: radial-gradient(circle at 30% 30%, ${background}, #3b2e2a);
              color: ${textColor};
              border-radius: 50%;
                width: ${iconSize[0]}px;
                height: ${iconSize[1]}px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              border: 2px solid #f5f5dc;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              padding: 2px;
                cursor: pointer;
              "
            >
              <img 
                src="${iconUrl}" 
                width="${iconSize[0] * 0.6}" 
                height="${iconSize[1] * 0.6}" 
                style="margin-bottom: 2px;"
                alt=""
                aria-hidden="true"
              />
              <span 
                style="
                font-size: ${size === 'large' ? '16px' : size === 'medium' ? '14px' : '12px'};
                "
              >${count}</span>
            </div>`,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: L.point(iconSize[0], iconSize[1])
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
      chunkInterval: isMobile ? 100 : 200,
      chunkDelay: isMobile ? 25 : 50,
      
      // Configurações de interatividade
      singleMarkerMode: false,
      spiderfyDistanceMultiplier: isMobile ? 2 : 1.5,
      
      // Configurações de estilo orgânico
      polygonOptions: {
        fillColor: '#A0522D',
        color: '#5C4033',
        weight: 1.2,
        opacity: 0.6,
        fillOpacity: 0.2
      }
    });

    // Adiciona eventos de interação ao cluster
    clusterGroup.on('clusterclick', function(e) {
      const cluster = e.layer;
      const markers = cluster.getAllChildMarkers();
      
      // Se estiver no zoom máximo, mostra tooltip explicando a expansão
      if (map.getZoom() >= cluster.options.disableClusteringAtZoom) {
        const tooltip = L.tooltip({
          className: 'cluster-expand-tooltip',
          direction: 'center',
          permanent: true,
          opacity: 0.9
        })
        .setContent(`
          <div class="bg-white/95 text-gray-800 text-sm font-medium px-3 py-1.5 rounded shadow-sm border border-gray-100">
            <strong>Expandindo ${markers.length} escola${markers.length > 1 ? 's' : ''}</strong>
            <br/>
            <span class="text-xs text-gray-600">Toque em um marcador para ver detalhes</span>
          </div>
        `)
        .setLatLng(cluster.getLatLng());
        
        tooltip.addTo(map);
        setTimeout(() => tooltip.remove(), 2000);
      }
    });

    // Adiciona os marcadores ao grupo
    pontosValidos.forEach((ponto, index) => {
      const lat = parseFloat(ponto.latitude);
      const lng = parseFloat(ponto.longitude);
      
      const marker = L.marker([lat, lng], { 
        icon: escolaIcon,
        zIndexOffset: 1000,
        keyboard: true,
        alt: `Marcador para ${capitalizeWords(ponto.titulo)}`,
        riseOnHover: true,
        interactive: true,
        tooltip: null
      });

      // Remove qualquer tooltip existente antes de adicionar o novo
      marker.unbindTooltip();
      
      // Adiciona apenas o tooltip customizado
      marker.bindTooltip(createTooltipContent(ponto), {
        className: "custom-tooltip",
        direction: "top",
        offset: [0, -10],
        opacity: 1,
        permanent: false,
        sticky: !isMobile, // Tooltip só é sticky em desktop
        interactive: true, // Permite interação com o tooltip
        // Desabilita o tooltip padrão do Leaflet
        tooltip: null
      });

      // Adiciona eventos de interação
      if (isMobile) {
        // Em mobile, usa o gerenciador de touch
        marker.on('click', (e) => handleTouchInteraction(marker, ponto, e));
      } else {
        // Em desktop, mantém comportamento original
      marker.on('click', () => onClick?.(ponto));
      }

      // Verifica se este marcador faz parte de um par próximo
      const pairIndex = nearbyPairs.findIndex(pair => pair.includes(index));
      if (pairIndex !== -1) {
        const [first, second] = nearbyPairs[pairIndex];
        const isFirst = index === first;
        const otherIndex = isFirst ? second : first;
        const otherPonto = pontosValidos[otherIndex];

        // Aplica o efeito de fan-out aprimorado apenas em desktop
        if (!isMobile) {
        marker.on('add', function() {
          const transform = isFirst 
            ? 'perspective(500px) rotateY(-20deg) translateX(-20px) rotate(-25deg) scale(0.9)'
            : 'perspective(500px) rotateY(20deg) translateX(20px) rotate(25deg) scale(0.9)';
          
          this._icon.style.transform = transform;
          this._icon.style.transition = 'transform 0.5s ease-out, filter 0.3s ease-in';
          this._icon.style.filter = 'drop-shadow(0 4px 12px rgba(160, 82, 45, 0.35))';
          this._icon.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.35)';
        });
        }

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

    // Adiciona listener global para o evento de clique no tooltip
    const handleTooltipClick = (event) => {
      const ponto = event.detail;
      onClick?.(ponto);
    };

    window.addEventListener('marker-click', handleTooltipClick);

    // Limpa o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('marker-click', handleTooltipClick);
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
      }
      connectorsRef.current.forEach(connector => map.removeLayer(connector));
      connectorsRef.current = [];
      clearTooltipTimeout();
      lastTouchedMarker.current = null;
    };
  }, [
    map, 
    pontosValidos, 
    onClick, 
    escolaIcon, 
    visibility.educacao, 
    dataPoints, 
    isMobile, 
    createTooltipContent, 
    handleTouchInteraction, 
    clearTooltipTimeout
  ]);

  return null;
};

export default Marcadores; 