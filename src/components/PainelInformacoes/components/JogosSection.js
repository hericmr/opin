import React, { useState, useEffect } from 'react';
import jogosService from '../../../services/jogosService';
import GlobalSpinner from '../../GlobalSpinner';
import GameCard from '../../Jogos/GameCard';
import logger from '../../../utils/logger';

const JogosSection = ({ escolaId, title }) => {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadJogos() {
      if (!escolaId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await jogosService.getJogosCompletosPorEscola(escolaId);
        if (mounted) {
          setJogos(data);
        }
      } catch (err) {
        logger.error('Erro ao carregar jogos da escola:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadJogos();

    return () => {
      mounted = false;
    };
  }, [escolaId]);

  if (loading) {
    return (
      <div className="py-4 flex justify-center">
        <GlobalSpinner message="Carregando jogos..." lightText={false} />
      </div>
    );
  }

  if (jogos.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-6">
      {title !== null && (
        <h3 className="font-semibold text-green-800 mb-4" style={{ fontSize: '0.85em' }}>
          {title || 'Recortes de Jogos'}
        </h3>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {jogos.map((jogo) => (
          <GameCard key={jogo.global_id} game={jogo} />
        ))}
      </div>
    </div>
  );
};

export default JogosSection;
