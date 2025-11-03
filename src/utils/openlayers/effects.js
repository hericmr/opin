import Overlay from 'ol/Overlay';

/**
 * Mostra um pulso visual no mapa na coordenada clicada.
 * @param {import('ol/Map').default} map - Instância do mapa OpenLayers
 * @param {number[]} coordinate - Coordenada no projection do mapa (geralmente EPSG:3857)
 * @param {object} options - Opções (radiusPx, durationMs)
 */
export function showClickPulse(map, coordinate, options = {}) {
  if (!map || !coordinate) return;

  const radiusPx = options.radiusPx ?? 18;
  const durationMs = options.durationMs ?? 900;

  const element = document.createElement('div');
  element.className = 'ol-click-pulse';
  element.style.width = `${radiusPx * 2}px`;
  element.style.height = `${radiusPx * 2}px`;
  element.style.marginLeft = `${-radiusPx}px`;
  element.style.marginTop = `${-radiusPx}px`;

  const overlay = new Overlay({
    element,
    positioning: 'center-center',
    stopEvent: false,
  });

  map.addOverlay(overlay);
  overlay.setPosition(coordinate);

  // Remover após animação
  const cleanup = () => {
    try {
      map.removeOverlay(overlay);
    } catch {}
  };

  element.addEventListener('animationend', cleanup, { once: true });
  // Fallback por segurança
  setTimeout(cleanup, durationMs + 100);
}

/**
 * Anima suavemente a view até a coordenada (flyTo).
 * Mantém o zoom atual por padrão.
 * @param {import('ol/Map').default} map
 * @param {number[]} coordinate - Coordenada no projection do mapa (EPSG:3857)
 * @param {{ durationMs?: number, zoom?: number }} options
 */
export function flyTo(map, coordinate, options = {}) {
  if (!map || !coordinate) return;
  const durationMs = options.durationMs ?? 350;
  const view = map.getView();
  const animateParams = { center: coordinate, duration: durationMs };
  if (typeof options.zoom === 'number') {
    animateParams.zoom = options.zoom;
  }
  view.animate(animateParams);
}

/**
 * FlyTo que centraliza o ponto na área visível quando há um painel lateral.
 * Por padrão, considera um painel à direita com seletor '.mj-panel'.
 */
export function flyToConsideringPanel(map, coordinate, options = {}) {
  if (!map || !coordinate) return;
  const durationMs = options.durationMs ?? 350;
  const zoom = options.zoom;
  const side = options.panelSide ?? 'right';
  const panelSelector = options.panelSelector ?? '.mj-panel';
  const fractionWithinVisible = typeof options.fractionWithinVisible === 'number' ? options.fractionWithinVisible : 0.25; // 25% = metade da primeira metade

  const mapSize = map.getSize();
  if (!mapSize) return flyTo(map, coordinate, { durationMs, zoom });

  const [mapWidth, mapHeight] = mapSize;
  let panelWidth = 0;
  const panelEl = typeof document !== 'undefined' ? document.querySelector(panelSelector) : null;
  if (panelEl) {
    const rect = panelEl.getBoundingClientRect();
    // Considerar apenas se o painel estiver visível (largura relevante)
    if (rect.width > 0 && rect.height > 0) {
      panelWidth = Math.min(rect.width, mapWidth * 0.95);
    }
  }

  // Se não há painel, usa flyTo normal
  if (panelWidth <= 0) {
    return flyTo(map, coordinate, { durationMs, zoom });
  }

  // Posição alvo do ponto dentro da área visível
  const visibleWidth = Math.max(1, mapWidth - panelWidth);
  const desiredX = side === 'right'
    ? visibleWidth * fractionWithinVisible
    : panelWidth + visibleWidth * fractionWithinVisible; // painel à esquerda

  const pointPx = map.getPixelFromCoordinate(coordinate);
  if (!pointPx) {
    return flyTo(map, coordinate, { durationMs, zoom });
  }

  // Centro atual em pixel
  const currentCenterPx = [mapWidth / 2, mapHeight / 2];
  // Novo centro em pixel que posiciona o ponto em desiredX
  const newCenterPx = [
    pointPx[0] - desiredX + (mapWidth / 2),
    currentCenterPx[1]
  ];

  const newCenterCoord = map.getCoordinateFromPixel(newCenterPx);
  if (!newCenterCoord) {
    return flyTo(map, coordinate, { durationMs, zoom });
  }

  const view = map.getView();
  const animateParams = { center: newCenterCoord, duration: durationMs };
  if (typeof zoom === 'number') animateParams.zoom = zoom;
  view.animate(animateParams);
}

/**
 * FlyTo posicionando o ponto em uma fração fixa da largura do mapa (0..1).
 * Ex.: fractionX=0.25 posiciona o ponto a 25% da largura (metade da primeira metade).
 */
export function flyToAtFractionX(map, coordinate, options = {}) {
  if (!map || !coordinate) return;
  const durationMs = options.durationMs ?? 350;
  const zoom = options.zoom;
  const fractionX = typeof options.fractionX === 'number' ? options.fractionX : 0.25;
  const fractionY = typeof options.fractionY === 'number' ? options.fractionY : 0.5; // centralizado no eixo Y

  const mapSize = map.getSize();
  if (!mapSize) return flyTo(map, coordinate, { durationMs, zoom });

  const [mapWidth, mapHeight] = mapSize;
  const clampedFx = Math.max(0, Math.min(1, fractionX));
  const clampedFy = Math.max(0, Math.min(1, fractionY));
  const desiredX = clampedFx * mapWidth;
  const desiredY = clampedFy * mapHeight;

  const pointPx = map.getPixelFromCoordinate(coordinate);
  if (!pointPx) return flyTo(map, coordinate, { durationMs, zoom });

  const newCenterPx = [
    pointPx[0] - desiredX + (mapWidth / 2),
    pointPx[1] - desiredY + (mapHeight / 2)
  ];

  const newCenterCoord = map.getCoordinateFromPixel(newCenterPx);
  if (!newCenterCoord) return flyTo(map, coordinate, { durationMs, zoom });

  const view = map.getView();
  const animateParams = { center: newCenterCoord, duration: durationMs };
  if (typeof zoom === 'number') animateParams.zoom = zoom;
  view.animate(animateParams);
}


