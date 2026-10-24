import React, { useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

const GameCard = ({ game }) => {
  const [imageError, setImageError] = useState(false);
  const rawBaseUrl = import.meta.env.BASE_URL || '/';
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
  
  const vol = game.volume || 1;
  const pdfUrl = `${baseUrl}/jogos_arquivos/vol${vol}/Jogo_${game.id}.pdf`;
  const coverUrl = `${baseUrl}/jogos_arquivos/vol${vol}/Jogo_${game.id}_cover.jpg`;

  const guaraniTitle = game.title_primary || `Jogo ${game.id}`;
  
  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col h-full border border-gray-100 group hover:shadow-lg transition-shadow duration-300">
      {/* Container da Capa */}
      <div className="relative bg-gray-100 rounded-t-md flex items-center justify-center min-h-[200px] overflow-hidden">
        {!imageError ? (
          <img
            src={coverUrl}
            alt={`Capa do jogo: ${guaraniTitle}`}
            className="w-full h-auto block scale-[1.06] origin-center"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-gray-400 w-full h-full min-h-[200px] bg-gray-50 border-b border-gray-100">
            <FileText className="w-12 h-12 mb-2 opacity-30" />
            <span className="text-sm font-medium opacity-60 text-purple-900">Jogo {game.id}</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden group-hover:flex bg-white text-purple-800 px-4 py-2 rounded shadow-md items-center gap-2 font-semibold text-sm transition-opacity duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>Ler PDF</span>
          </a>
        </div>
      </div>

      {/* Rodapé com Ações */}
      <div className="px-4 py-3 bg-white flex items-center justify-end text-gray-500">
        <div className="flex gap-2">
          <a
            href={pdfUrl}
            download
            className="p-1.5 hover:text-purple-700 transition-colors"
            title="Baixar PDF"
          >
            <Download className="w-4 h-4" />
          </a>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:text-purple-700 transition-colors"
            title="Abrir em nova aba"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
