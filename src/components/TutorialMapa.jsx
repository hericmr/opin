import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';

/**
 * Componente TutorialMapa - Tutorial guiado para uso do mapa e camadas
 * 
 * Este componente gerencia um tutorial interativo usando react-joyride,
 * ensinando os usuários a usar o mapa, controles de zoom, camadas e outras ferramentas.
 */
const TutorialMapa = ({ isRunning, onComplete, onSkip }) => {
  const [steps, setSteps] = useState([]);
  const [run, setRun] = useState(false);

  // (Removido) Estado isMobile não utilizado

  // Configurar os passos do tutorial baseado no dispositivo
  useEffect(() => {
    const isMobileDevice = window.innerWidth <= 768;
    
    const tutorialSteps = [
      {
        target: '.ol-zoom',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Controles de Zoom</h3>
            <p className="text-sm text-gray-700">
              Use os botões <strong>+</strong> e <strong>-</strong> para aproximar e afastar o mapa.
              Você também pode usar a roda do mouse ou gestos de pinça (no mobile) para fazer zoom.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Dica:</strong> Arraste o mapa clicando e arrastando para movê-lo.
            </p>
          </div>
        ),
        placement: 'left',
        disableBeacon: true,
        disableOverlayClose: false,
      },
      {
        target: isMobileDevice 
          ? '[class*="fixed"][class*="bottom-0"]' // Menu mobile no bottom - selector mais flexível
          : '[class*="fixed"][class*="top-24"][class*="right-4"]', // Menu desktop no topo direito
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Controles de Camadas</h3>
            <p className="text-sm text-gray-700">
              Aqui você pode ativar e desativar diferentes camadas do mapa:
            </p>
            <ul className="text-sm text-gray-700 mt-2 list-disc list-inside space-y-1">
              <li><strong>Estado de São Paulo</strong> - Limites do estado</li>
              <li><strong>Escolas Indígenas</strong> - Marcadores das escolas</li>
              <li><strong>Terras Indígenas</strong> - Áreas demarcadas (Regularizadas e Declaradas)</li>
            </ul>
            <p className="text-sm text-gray-700 mt-2">
              Clique em cada camada para ativá-la ou desativá-la. Use o botão de minimizar para economizar espaço.
            </p>
          </div>
        ),
        placement: isMobileDevice ? 'top' : 'left',
        disableBeacon: true,
        disableOverlayClose: false,
      },
      {
        target: 'header[role="banner"]',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Barra de Busca</h3>
            <p className="text-sm text-gray-700">
              Use a barra de busca no topo para encontrar escolas específicas por nome, 
              município, terra indígena ou outros critérios. 
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Você também pode pressionar <strong>Ctrl+K</strong> (ou <strong>Cmd+K</strong> no Mac) para focar na busca.
            </p>
          </div>
        ),
        placement: 'bottom',
        disableBeacon: true,
        disableOverlayClose: false,
      },
      {
        target: 'body',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Interagindo com o Mapa</h3>
            <p className="text-sm text-gray-700">
              <strong>Clique em qualquer marcador de escola</strong> (ícone azul) ou em uma área de terra indígena 
              para ver mais informações. Um painel lateral será aberto com detalhes sobre o item selecionado.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Mova o mapa</strong> clicando e arrastando. Em dispositivos móveis, use gestos de toque.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Dica:</strong> Em clusters (grupos de escolas), clique para fazer zoom e ver escolas individuais.
            </p>
          </div>
        ),
        placement: 'center',
        disableBeacon: true,
        spotlightPadding: 20,
        disableOverlayClose: false,
      },
      {
        target: 'header[role="banner"]',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Navegação e Ferramentas</h3>
            <p className="text-sm text-gray-700">
              Use os botões na barra de navegação para acessar outras seções:
            </p>
            <ul className="text-sm text-gray-700 mt-2 list-disc list-inside space-y-1">
              <li><strong>Mapa</strong> - Voltar para o mapa principal</li>
              <li><strong>Materiais</strong> - Ver materiais didáticos</li>
              <li><strong>Alguns dados</strong> - Visualizar dados e estatísticas</li>
              <li><strong>Tutorial</strong> - Reabrir este tutorial a qualquer momento</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3 font-medium">
              Você pode encontrar o botão "Tutorial" na barra de navegação para revisar estas informações quando quiser!
            </p>
          </div>
        ),
        placement: 'bottom',
        disableBeacon: true,
        disableOverlayClose: false,
      },
    ];

    setSteps(tutorialSteps);
  }, []);

  // Iniciar tutorial quando isRunning mudar
  useEffect(() => {
    if (isRunning) {
      // Pequeno delay para garantir que os elementos estejam renderizados
      setTimeout(() => {
        setRun(true);
      }, 300);
    } else {
      setRun(false);
    }
  }, [isRunning]);

  const handleJoyrideCallback = (data) => {
    const { status, type, index, action } = data;

    // Se o tutorial foi completado ou pulado
    if (status === 'finished' || status === 'skipped') {
      setRun(false);
      
      if (status === 'finished') {
        // Marcar tutorial como completo no localStorage
        localStorage.setItem('tutorialMapaCompleto', 'true');
        if (onComplete) onComplete();
      } else {
        if (onSkip) onSkip();
      }
    }

    // Log para debug
    if (type === 'step:after' || type === 'step:before') {
      console.log('Tutorial:', type, { index, action, status });
    }

    // Se não encontrou o elemento, pular para o próximo
    if (type === 'error:target_not_found') {
      console.warn('Tutorial: Elemento não encontrado, tentando próximo passo');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#215A36', // Cor verde do tema
          zIndex: 10000, // Z-index alto para aparecer sobre outros elementos
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#215A36',
          fontSize: '14px',
          fontWeight: '600',
          padding: '10px 20px',
          borderRadius: '8px',
        },
        buttonBack: {
          color: '#215A36',
          fontSize: '14px',
          marginRight: '10px',
        },
        buttonSkip: {
          color: '#6B7280',
          fontSize: '14px',
        },
      }}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        open: 'Abrir o diálogo',
        skip: 'Pular tutorial',
      }}
    />
  );
};

export default TutorialMapa;

