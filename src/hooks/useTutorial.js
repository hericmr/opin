import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar o estado do tutorial do mapa
 * Controla quando o tutorial deve ser exibido e se já foi completado
 */
export const useTutorial = () => {
  const [isTutorialRunning, setIsTutorialRunning] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  // Verificar se o tutorial já foi completado
  useEffect(() => {
    const completed = localStorage.getItem('tutorialMapaCompleto') === 'true';
    setTutorialCompleted(completed);
  }, []);

  const startTutorial = () => {
    setIsTutorialRunning(true);
  };

  const stopTutorial = () => {
    setIsTutorialRunning(false);
  };

  const completeTutorial = () => {
    setTutorialCompleted(true);
    localStorage.setItem('tutorialMapaCompleto', 'true');
    setIsTutorialRunning(false);
  };

  const skipTutorial = () => {
    setIsTutorialRunning(false);
  };

  return {
    isTutorialRunning,
    tutorialCompleted,
    startTutorial,
    stopTutorial,
    completeTutorial,
    skipTutorial,
  };
};

