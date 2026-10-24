import React, { useState, useEffect, useCallback, useRef } from 'react';
import CardVisibilityToggle from '../components/CardVisibilityToggle';
import jogosService from '../../../services/jogosService';
import GlobalSpinner from '../../GlobalSpinner';
import logger from '../../../utils/logger';

const JogosTab = ({ editingLocation, setEditingLocation }) => {
  const escolaId = editingLocation?.id || editingLocation?.escola_id;

  const [todosOsJogos, setTodosOsJogos] = useState([]);
  const [jogosVinculados, setJogosVinculados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Id da última carga, para descartar respostas de uma escola anterior
  const requestIdRef = useRef(0);

  const carregarDados = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError(null);
      const [todos, vinculados] = await Promise.all([
        jogosService.getTodosOsJogos(),
        jogosService.getJogosPorEscola(escolaId)
      ]);
      if (requestId !== requestIdRef.current) return;
      setTodosOsJogos(todos);
      setJogosVinculados(vinculados.map(v => v.jogo_global_id));
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      logger.error('Erro ao carregar os dados dos jogos:', err);
      setError('Erro ao carregar os dados dos jogos.');
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [escolaId]);

  useEffect(() => {
    if (escolaId) {
      carregarDados();
    } else {
      setLoading(false);
    }
  }, [escolaId, carregarDados]);

  const handleToggleJogo = async (jogoGlobalId) => {
    try {
      const isVinculado = jogosVinculados.includes(jogoGlobalId);
      
      // Update otimista local
      const novosVinculados = isVinculado 
        ? jogosVinculados.filter(id => id !== jogoGlobalId)
        : [...jogosVinculados, jogoGlobalId];
      
      setJogosVinculados(novosVinculados);

      // Chamada para o backend
      if (isVinculado) {
        await jogosService.removerJogoEscola(escolaId, jogoGlobalId);
      } else {
        await jogosService.adicionarJogoEscola(escolaId, jogoGlobalId);
      }
    } catch (err) {
      logger.error('Erro ao vincular/desvincular jogo:', err);
      // Reverter em caso de erro
      carregarDados();
      setError('Erro ao salvar alteração. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      <CardVisibilityToggle
        cardId="jogos"
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        label="Visibilidade do Card: Jogos"
      />
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-100">
          Gerenciamento de Jogos
        </h3>
        <p className="text-gray-300 text-xs">
          Aqui você pode vincular os recortes de jogos que foram criados por professores desta escola.
          Eles ficarão visíveis no painel da escola para download em PDF.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-900/40 border border-red-500/50 rounded text-sm text-red-200">
          {error}
        </div>
      )}

      {!escolaId ? (
        <div className="text-center py-4">
          <p className="text-gray-300 text-sm">
            Selecione uma escola para gerenciar os jogos.
          </p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-8">
          <GlobalSpinner message="Carregando jogos..." lightText={true} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {todosOsJogos.map((jogo) => {
            const isVinculado = jogosVinculados.includes(jogo.global_id);
            return (
              <div 
                key={jogo.global_id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  isVinculado 
                    ? 'bg-green-900/30 border-green-500/50' 
                    : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => handleToggleJogo(jogo.global_id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-100 mb-1">
                      {jogo.title_primary}
                    </h4>
                    <p className="text-xs text-gray-400 mb-2">
                      {jogo.title_secondary}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      Volume {jogo.volume}
                      {jogo.autorEncontrado && ` • Autor: ${jogo.autorEncontrado}`}
                    </div>
                  </div>
                  
                  {/* Checkbox customizado */}
                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ml-3 ${
                    isVinculado 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-500 bg-gray-700'
                  }`}>
                    {isVinculado && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {todosOsJogos.length === 0 && (
            <div className="col-span-full text-center py-4 text-gray-400">
              Nenhum jogo encontrado no repositório.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JogosTab;
