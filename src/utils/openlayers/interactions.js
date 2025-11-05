import { isMobile, hasTouchCapabilities } from '../mobileUtils';

/**
 * Classe para gerenciar interações e eventos do OpenLayers
 */
export class OpenLayersInteractions {
  constructor(map, options = {}) {
    this.map = map;
    this.options = {
      enableHover: options.enableHover !== false,
      enableClick: options.enableClick !== false,
      enableDoubleClick: options.enableDoubleClick !== false,
      enableTouch: options.enableTouch !== false,
      hoverDelay: options.hoverDelay || 200,
      clickDelay: options.clickDelay || 300,
      ...options
    };

    this.eventHandlers = new Map();
    this.hoveredFeature = null;
    this.clickedFeature = null;
    this.clickTimeout = null;
    this.hoverTimeout = null;
    this.tooltipElement = null;
    console.log('[OpenLayersInteractions] Interações inicializadas');

    this.initializeInteractions();
  }

  /**
   * Verifica se é dispositivo mobile (dinâmico e robusto)
   */
  isMobile() {
    const mobile = isMobile();
    const hasTouch = hasTouchCapabilities();
    
    console.log('[OpenLayersInteractions] Detecção de mobile:', {
      mobile,
      hasTouch,
      windowWidth: window.innerWidth,
      userAgent: navigator.userAgent
    });
    
    return mobile || hasTouch;
  }

  /**
   * Inicializa todas as interações
   */
  initializeInteractions() {
    if (this.options.enableHover) {
      this.setupHoverInteraction();
    }

    if (this.options.enableClick) {
      this.setupClickInteraction();
    }

    if (this.options.enableDoubleClick) {
      this.setupDoubleClickInteraction();
    }

    if (this.options.enableTouch && this.isMobile()) {
      this.setupTouchInteraction();
    }
  }

  /**
   * Configura interação de hover
   */
  setupHoverInteraction() {
    this.map.on('pointermove', (event) => {
      this.handlePointerMove(event);
    });

    this.map.on('pointerleave', () => {
      this.handlePointerLeave();
    });
  }

  /**
   * Configura interação de clique
   */
  setupClickInteraction() {
    this.map.on('click', (event) => {
      this.handleClick(event);
    });
  }

  /**
   * Configura interação de duplo clique
   */
  setupDoubleClickInteraction() {
    this.map.on('dblclick', (event) => {
      this.handleDoubleClick(event);
    });
  }

  /**
   * Configura interação touch para mobile
   */
  setupTouchInteraction() {
    // Em mobile, usar o sistema de clique com tooltip
    // O handleClick já trata mobile vs desktop
    console.log('[OpenLayersInteractions] Touch interaction configurada para mobile');
  }

  /**
   * Handler para movimento do ponteiro (hover)
   * @param {Object} event - Evento do OpenLayers
   */
  handlePointerMove(event) {
    if (this.isMobile()) return; // Desabilitar hover em mobile

    const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
    
    // Debug: verificar se está detectando features
    if (feature && !this.hoveredFeature) {
      console.log('[OpenLayersInteractions] Feature detectado:', {
        type: feature.get('type'),
        schoolData: feature.get('schoolData'),
        terraIndigenaInfo: feature.get('terraIndigenaInfo')
      });
    }
    
    if (feature !== this.hoveredFeature) {
      // Limpar hover anterior
      if (this.hoveredFeature) {
        this.clearHover();
      }

      // Aplicar novo hover
      if (feature) {
        this.applyHover(feature, event);
      }
    }
  }

  /**
   * Handler para saída do ponteiro
   */
  handlePointerLeave() {
    this.clearHover();
  }

  /**
   * Handler para clique
   * @param {Object} event - Evento do OpenLayers
   */
  handleClick(event) {
    const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
    
    if (!feature) return;

    // Em mobile, primeiro clique mostra tooltip, segundo abre painel
    if (this.isMobile()) {
      this.handleMobileClick(feature, event);
      return;
    }

    // Verificar se é o mesmo feature clicado anteriormente
    if (this.clickedFeature === feature) {
      // Segundo clique no mesmo feature
      this.handleDoubleClick(event);
      return;
    }

    // Primeiro clique
    this.clickedFeature = feature;
    
    // Configurar timeout para resetar o clique
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }
    
    this.clickTimeout = setTimeout(() => {
      this.clickedFeature = null;
    }, this.options.clickDelay);

    // Executar handler de clique único
    this.executeClickHandler(feature, event);
  }

  /**
   * Handler para duplo clique
   * @param {Object} event - Evento do OpenLayers
   */
  handleDoubleClick(event) {
    const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
    
    if (!feature) return;

    // Limpar timeout de clique único
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }

    // Resetar feature clicado
    this.clickedFeature = null;

    // Executar handler de duplo clique
    this.executeDoubleClickHandler(feature, event);
  }

  /**
   * Handler para fim de toque (mobile)
   * @param {Object} event - Evento do OpenLayers
   */
  handleTouchEnd(event) {
    const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
    
    if (!feature) return;

    // Em mobile, toque único executa ação de clique
    this.executeClickHandler(feature, event);
  }

  /**
   * Handler para clique em mobile (primeiro mostra tooltip, segundo abre painel)
   * @param {Object} feature - Feature clicado
   * @param {Object} event - Evento do OpenLayers
   */
  handleMobileClick(feature, event) {
    // Verificar se é o mesmo feature clicado anteriormente
    if (this.clickedFeature === feature) {
      // Segundo clique: abrir painel
      console.log('[OpenLayersInteractions] Segundo clique em mobile - abrindo painel');
      this.forceHideTooltip(); // Esconder tooltip e resetar estado
      this.executeClickHandler(feature, event); // Abrir painel
      return;
    }

    // Primeiro clique: mostrar tooltip
    console.log('[OpenLayersInteractions] Primeiro clique em mobile - mostrando tooltip');
    this.clickedFeature = feature;
    
    // Mostrar tooltip
    if (this.options.showTooltip) {
      this.showTooltip(feature, event);
    }

    // Configurar timeout para esconder tooltip e resetar clique
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }
    
    this.clickTimeout = setTimeout(() => {
      console.log('[OpenLayersInteractions] Timeout mobile - escondendo tooltip e resetando');
      this.forceHideTooltip();
    }, 3000); // 3 segundos de timeout

    // Executar handler de hover para aplicar estilo visual
    this.executeHoverHandler(feature, event);
  }

  /**
   * Aplica efeito de hover a um feature
   * @param {Object} feature - Feature do OpenLayers
   * @param {Object} event - Evento do OpenLayers
   */
  applyHover(feature, event) {
    this.hoveredFeature = feature;
    
    // Aplicar estilo de hover
    this.applyHoverStyle(feature);
    
    // Mostrar tooltip se configurado (apenas em desktop)
    if (this.options.showTooltip && !this.isMobile()) {
      this.showTooltip(feature, event);
    }

    // Executar handler de hover
    this.executeHoverHandler(feature, event);
  }

  /**
   * Remove efeito de hover
   */
  clearHover() {
    if (this.hoveredFeature) {
      // Remover estilo de hover
      this.clearHoverStyle(this.hoveredFeature);
      
      // Em mobile, não esconder tooltip automaticamente
      // O tooltip é controlado pelo sistema de clique
      if (!this.isMobile()) {
        this.hideTooltip();
      }
      
      // Executar handler de hover out
      this.executeHoverOutHandler(this.hoveredFeature);
      
      this.hoveredFeature = null;
    }
  }

  /**
   * Aplica estilo de hover a um feature
   * @param {Object} feature - Feature do OpenLayers
   */
  applyHoverStyle(feature) {
    // Implementar lógica de estilo de hover
    // Esta função deve ser sobrescrita ou configurada
    if (this.options.hoverStyleFunction) {
      this.options.hoverStyleFunction(feature, true);
    }
  }

  /**
   * Remove estilo de hover de um feature
   * @param {Object} feature - Feature do OpenLayers
   */
  clearHoverStyle(feature) {
    // Implementar lógica de remoção de estilo de hover
    if (this.options.hoverStyleFunction) {
      this.options.hoverStyleFunction(feature, false);
    }
  }

  /**
   * Mostra tooltip para um feature
   * @param {Object} feature - Feature do OpenLayers
   * @param {Object} event - Evento do OpenLayers
   */
  showTooltip(feature, event) {
    if (this.tooltipElement) {
      this.hideTooltip();
    }

    const tooltipContent = this.getTooltipContent(feature);
    console.log('[OpenLayersInteractions] Conteúdo do tooltip:', tooltipContent);
    
    if (!tooltipContent) {
      console.log('[OpenLayersInteractions] Sem conteúdo para tooltip');
      return;
    }

    this.tooltipElement = this.createTooltipElement(tooltipContent, event);
    this.map.getTargetElement().appendChild(this.tooltipElement);
    console.log('[OpenLayersInteractions] Tooltip criado e adicionado ao DOM');
  }

  /**
   * Esconde tooltip
   */
  hideTooltip() {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
      console.log('[OpenLayersInteractions] Tooltip escondido');
    }
  }

  /**
   * Força limpeza do tooltip (útil para mobile)
   */
  forceHideTooltip() {
    this.hideTooltip();
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    this.clickedFeature = null;
    console.log('[OpenLayersInteractions] Tooltip forçadamente escondido e estado resetado');
  }

  /**
   * Cria elemento de tooltip
   * @param {string} content - Conteúdo do tooltip
   * @param {Object} event - Evento do OpenLayers
   * @returns {HTMLElement} Elemento do tooltip
   */
  createTooltipElement(content, event) {
    const element = document.createElement('div');
    element.className = 'ol-tooltip';
    
    // Detectar se é terra indígena baseado no conteúdo
    const isTerraIndigena = content.includes('Terra Indígena');
    
    // Em mobile, tornar o nome clicável
    if (this.isMobile()) {
      // Criar tooltip clicável para mobile
      const clickableContent = `<span class="tooltip-clickable">${content}</span>`;
      element.innerHTML = clickableContent;
      
      // Configurar estilos para mobile - design minimalista e claro
      const tooltipStyles = isTerraIndigena ? {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(239, 68, 68, 0.15)' // Borda vermelha mais sutil para terras indígenas
      } : {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(5, 150, 105, 0.15)' // Borda verde mais sutil para escolas
      };
      
      Object.assign(element.style, {
        position: 'absolute',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '13px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: '400', // Peso mais leve, não bold
        color: '#4B5563', // Texto mais claro, não preto
        pointerEvents: 'auto', // IMPORTANTE: Permitir eventos de clique no mobile
        zIndex: '1000',
        maxWidth: '250px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        border: `1px solid ${tooltipStyles.borderColor}`,
        cursor: 'default',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(8px)',
        ...tooltipStyles
      });
      
      // Configurar o span clicável
      const clickableSpan = element.querySelector('.tooltip-clickable');
      if (clickableSpan) {
        Object.assign(clickableSpan.style, {
          cursor: 'pointer',
          textDecoration: 'underline',
          textDecorationColor: '#3B82F6',
          textDecorationThickness: '2px',
          transition: 'all 0.2s ease',
          display: 'inline-block',
          padding: '2px 4px',
          borderRadius: '4px',
          fontWeight: '800'
        });
        
        // Adicionar evento de clique para abrir o painel
        clickableSpan.addEventListener('click', () => {
          console.log('[OpenLayersInteractions] Nome clicado no tooltip mobile');
          // Emitir evento para abrir o painel
          const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
          if (feature) {
            this.executeClickHandler(feature, event);
          }
        });
        
        // Adicionar efeitos de hover
        clickableSpan.addEventListener('mouseenter', () => {
          clickableSpan.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          clickableSpan.style.textDecorationColor = '#1D4ED8';
          clickableSpan.style.transform = 'scale(1.05)';
        });
        
        clickableSpan.addEventListener('mouseleave', () => {
          clickableSpan.style.backgroundColor = 'transparent';
          clickableSpan.style.textDecorationColor = '#3B82F6';
          clickableSpan.style.transform = 'scale(1)';
        });
      }
    } else {
      // Desktop: tooltip normal (não clicável)
      element.innerHTML = content;
      
      // Estilos do tooltip para desktop - design minimalista e claro
      const tooltipStyles = isTerraIndigena ? {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(239, 68, 68, 0.15)' // Borda vermelha mais sutil para terras indígenas
      } : {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(5, 150, 105, 0.15)' // Borda verde mais sutil para escolas
      };
      
      Object.assign(element.style, {
        position: 'absolute',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: '400', // Peso mais leve, não bold
        color: '#4B5563', // Texto mais claro, não preto
        pointerEvents: 'none',
        zIndex: '1000',
        maxWidth: '250px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        border: `1px solid ${tooltipStyles.borderColor}`,
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(8px)',
        ...tooltipStyles
      });
    }

    // Posicionar tooltip
    const coordinate = event.coordinate;
    const pixel = this.map.getPixelFromCoordinate(coordinate);
    
    element.style.left = (pixel[0] + 10) + 'px';
    element.style.top = (pixel[1] - 10) + 'px';

    return element;
  }

  /**
   * Obtém conteúdo do tooltip para um feature
   * @param {Object} feature - Feature do OpenLayers
   * @returns {string} Conteúdo do tooltip
   */
  getTooltipContent(feature) {
    console.log('[OpenLayersInteractions] Obtendo conteúdo do tooltip para feature:', {
      type: feature.get('type'),
      schoolData: feature.get('schoolData'),
      terraIndigenaInfo: feature.get('terraIndigenaInfo')
    });

    // Implementar lógica para obter conteúdo do tooltip
    // Esta função deve ser sobrescrita ou configurada
    if (this.options.tooltipContentFunction) {
      const content = this.options.tooltipContentFunction(feature);
      console.log('[OpenLayersInteractions] Conteúdo do tooltip (função customizada):', content);
      return content;
    }

    // Conteúdo padrão baseado no tipo de feature
    const schoolData = feature.get('schoolData');
    if (schoolData) {
      // FORÇAR apenas o título da escola, SEM município ou outras informações
      const titulo = schoolData.titulo || 'Escola Indígena';
      console.log('[OpenLayersInteractions] Título extraído (padrão):', titulo);
      console.log('[OpenLayersInteractions] Conteúdo do tooltip (padrão escola - FORÇADO apenas título):', titulo);
      return titulo; // Retorna APENAS o título
    }

    const terraIndigenaInfo = feature.get('terraIndigenaInfo');
    if (terraIndigenaInfo) {
      const content = `Terra Indígena ${terraIndigenaInfo.titulo || 'Indígena'}`;
      console.log('[OpenLayersInteractions] Conteúdo do tooltip (padrão terra indígena):', content);
      return content;
    }

    console.log('[OpenLayersInteractions] Nenhum conteúdo encontrado para tooltip');
    return null;
  }

  /**
   * Executa handler de clique
   * @param {Object} feature - Feature clicado
   * @param {Object} event - Evento do OpenLayers
   */
  executeClickHandler(feature, event) {
    const handler = this.eventHandlers.get('click');
    if (handler && typeof handler === 'function') {
      handler(feature, event);
    }
  }

  /**
   * Executa handler de duplo clique
   * @param {Object} feature - Feature clicado
   * @param {Object} event - Evento do OpenLayers
   */
  executeDoubleClickHandler(feature, event) {
    const handler = this.eventHandlers.get('doubleClick');
    if (handler && typeof handler === 'function') {
      handler(feature, event);
    }
  }

  /**
   * Executa handler de hover
   * @param {Object} feature - Feature em hover
   * @param {Object} event - Evento do OpenLayers
   */
  executeHoverHandler(feature, event) {
    const handler = this.eventHandlers.get('hover');
    if (handler && typeof handler === 'function') {
      handler(feature, event);
    }
  }

  /**
   * Executa handler de hover out
   * @param {Object} feature - Feature que saiu do hover
   */
  executeHoverOutHandler(feature) {
    const handler = this.eventHandlers.get('hoverOut');
    if (handler && typeof handler === 'function') {
      handler(feature);
    }
  }

  /**
   * Registra handler para um tipo de evento
   * @param {string} eventType - Tipo do evento
   * @param {Function} handler - Função handler
   */
  on(eventType, handler) {
    this.eventHandlers.set(eventType, handler);
  }

  /**
   * Remove handler para um tipo de evento
   * @param {string} eventType - Tipo do evento
   */
  off(eventType) {
    this.eventHandlers.delete(eventType);
  }

  /**
   * Remove todos os handlers
   */
  clearHandlers() {
    this.eventHandlers.clear();
  }

  /**
   * Atualiza opções de interação
   * @param {Object} newOptions - Novas opções
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    
    // Reconfigurar interações se necessário
    if (newOptions.enableHover !== undefined) {
      // Implementar lógica para habilitar/desabilitar hover
    }
    
    if (newOptions.enableClick !== undefined) {
      // Implementar lógica para habilitar/desabilitar clique
    }
  }

  /**
   * Limpa todas as interações e handlers
   */
  destroy() {
    // Limpar timeouts
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Esconder tooltip
    this.hideTooltip();

    // Limpar hover
    this.clearHover();

    // Limpar handlers
    this.clearHandlers();

    // Remover event listeners do mapa
    // Nota: OpenLayers não tem método un() para remover listeners específicos
    // Seria necessário recriar o mapa ou implementar controle manual
  }
}

/**
 * Função utilitária para criar interações padrão
 * @param {Object} map - Mapa OpenLayers
 * @param {Object} options - Opções de configuração
 * @returns {OpenLayersInteractions} Instância de interações
 */
export function createDefaultInteractions(map, options = {}) {
  const defaultOptions = {
    enableHover: true,
    enableClick: true,
    enableDoubleClick: true,
    enableTouch: true,
    showTooltip: true,
    hoverDelay: 200,
    clickDelay: 300
  };

  return new OpenLayersInteractions(map, { ...defaultOptions, ...options });
}

/**
 * Função utilitária para configurar interações específicas para marcadores
 * @param {Object} map - Mapa OpenLayers
 * @param {Function} onMarkerClick - Handler para clique em marcador (opcional)
 * @param {Function} onMarkerHover - Handler para hover em marcador
 * @returns {OpenLayersInteractions} Instância de interações configurada
 */
export function createMarkerInteractions(map, onMarkerClick, onMarkerHover) {
  console.log('[createMarkerInteractions] Criando interações para marcadores...');
  
  const interactions = createDefaultInteractions(map, {
    showTooltip: true,
    tooltipContentFunction: (feature) => {
      console.log('[createMarkerInteractions] Função de conteúdo do tooltip chamada para:', feature);
      const schoolData = feature.get('schoolData');
      if (schoolData) {
        // FORÇAR apenas o título da escola, SEM município
        const titulo = schoolData.titulo || 'Escola Indígena';
        console.log('[createMarkerInteractions] Título extraído:', titulo);
        console.log('[createMarkerInteractions] Conteúdo do tooltip gerado (FORÇADO apenas título):', titulo);
        return titulo; // Retorna APENAS o título
      }
      console.log('[createMarkerInteractions] Sem dados de escola para tooltip');
      return null;
    }
  });

  // Configurar handler de clique se fornecido
  if (onMarkerClick) {
    console.log('[createMarkerInteractions] Configurando handler de clique personalizado');
    interactions.on('click', onMarkerClick);
  }

  if (onMarkerHover) {
    interactions.on('hover', onMarkerHover);
  }

  console.log('[createMarkerInteractions] Interações criadas com sucesso');
  return interactions;
}

/**
 * Função utilitária para configurar interações específicas para camadas GeoJSON
 * @param {Object} map - Mapa OpenLayers
 * @param {Function} onFeatureClick - Handler para clique em feature
 * @param {Function} onFeatureHover - Handler para hover em feature
 * @returns {OpenLayersInteractions} Instância de interações configurada
 */
export function createGeoJSONInteractions(map, onFeatureClick, onFeatureHover) {
  const interactions = createDefaultInteractions(map, {
    showTooltip: true,
    tooltipContentFunction: (feature) => {
      const terraIndigenaInfo = feature.get('terraIndigenaInfo');
      if (terraIndigenaInfo) {
        return `Terra Indígena ${terraIndigenaInfo.titulo || 'Indígena'}`;
      }
      return null;
    }
  });

  if (onFeatureClick) {
    interactions.on('click', onFeatureClick);
  }

  if (onFeatureHover) {
    interactions.on('hover', onFeatureHover);
  }

  return interactions;
}
