import logger from "../../utils/logger";
import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import GlobalSpinner from '../GlobalSpinner';

const GameGallery = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const rawBaseUrl = import.meta.env.BASE_URL || '/';
        const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
        const response = await fetch(`${baseUrl}/jogos_arquivos/todos_os_jogos.json`);
        if (!response.ok) {
          throw new Error('Não foi possível carregar o catálogo de jogos.');
        }
        const data = await response.json();
        setGames(data || []);
      } catch (err) {
        logger.error('Erro ao carregar catálogo de jogos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const filteredGames = games.filter(game => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const t1 = (game.title_primary || '').toLowerCase();
    const t2 = (game.title_secondary || '').toLowerCase();
    
    if (t1.includes(query) || t2.includes(query)) return true;

    if (game.titulo_autores_cabecalho && Array.isArray(game.titulo_autores_cabecalho)) {
      return game.titulo_autores_cabecalho.some(text => 
        typeof text === 'string' && text.toLowerCase().includes(query)
      );
    }
    
    return false;
  });

  if (loading) {
    return (
      <div className="py-20">
        <GlobalSpinner message="Carregando jogos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl text-center">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Intro section */}
      <div className="max-w-3xl mx-auto text-center space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <img
            src={`${import.meta.env.BASE_URL}logo_saberes.webp`}
            alt="Logo"
            className="h-24 sm:h-32 w-auto mx-auto object-contain"
          />
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          Jogos e materiais didáticos para impressão, são produzidos no âmbito da ação Saberes Indígenas na Escola. 
          Acesse e faça o download dos jogos em formato PDF.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 sm:text-base shadow-sm transition-all duration-200"
            placeholder="Buscar jogos por título ou autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 w-full items-stretch">
        {[
          {
            title: "Palavras em Jogo: Língua Guarani Mbya",
            subtitle: "Brincando com Palavras, Números e Conhecimentos",
            volume: 1,
            color: "#C93F62",
            coverImage: "CAPA_Livro_R01.webp",
            games: filteredGames.filter(g => g.volume === 1 || !g.volume).sort((a, b) => (a.id || 0) - (b.id || 0))
          },
          {
            title: "Palavras em Jogo: Línguas Kaingang, Krenak, Terena e Tupi Guarani / Nhandewa",
            subtitle: "Brincando com Palavras, Números e Conhecimentos",
            volume: 2,
            color: "#A86FC0",
            coverImage: "CAPA_Livro_R02.webp",
            games: filteredGames.filter(g => g.volume === 2).sort((a, b) => (a.id || 0) - (b.id || 0))
          },
          {
            title: "Percursos de Numeramento, Corpo e Território",
            subtitle: "Brincando com Palavras, Números e Conhecimentos",
            volume: 3,
            color: "#6E87B5",
            coverImage: "CAPA_Livro_R03.webp",
            games: filteredGames.filter(g => g.volume === 3).sort((a, b) => (a.id || 0) - (b.id || 0))
          }
        ].map((col) => {
          const rawBaseUrl = import.meta.env.BASE_URL || '/';
          const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
          const coverUrl = `${baseUrl}/materiais/${col.coverImage}`;

          return (
          <div 
            key={`vol-${col.volume}`} 
            className="flex flex-col overflow-hidden"
            style={{ backgroundColor: col.color }}
          >
            <div className="flex flex-col text-white">
              <div className="w-full overflow-hidden bg-white/10" style={{ aspectRatio: '16/10' }}>
                <img 
                  src={coverUrl} 
                  alt={`Capa do Volume ${col.volume}`}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="px-5 pt-6 pb-6 text-center">
                <h3 className="font-semibold leading-tight mb-2 text-base md:text-lg lg:text-xl">{col.title}</h3>
                <p className="text-sm md:text-base lg:text-lg italic leading-snug opacity-90">{col.subtitle}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 px-4 pb-6 flex-1">
              {col.games.length > 0 ? (
                col.games.map((game, index) => (
                  <motion.div
                    key={game.global_id || game.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="max-w-[280px] sm:max-w-xs mx-auto w-full"
                  >
                    <GameCard game={game} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 bg-white/20 rounded-xl border border-dashed border-white/30 text-white">
                  <p className="text-sm">Nenhum jogo encontrado neste volume.</p>
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>

      {filteredGames.length === 0 && games.length > 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mx-4 sm:mx-6 lg:mx-8">
          <Search className="h-10 w-10 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Nenhum jogo encontrado para "{searchQuery}".</p>
          <p className="text-sm text-gray-400 mt-1">Tente buscar com outros termos.</p>
        </div>
      )}

      {games.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mx-4 sm:mx-6 lg:mx-8">
          <p className="text-gray-500 italic">Nenhum jogo cadastrado no momento.</p>
        </div>
      )}
    </div>
  );
};

export default GameGallery;
