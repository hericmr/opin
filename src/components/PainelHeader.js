import React from "react";
import { X, Maximize2, Minimize2, MapPin } from "lucide-react";
import { capitalizeWords } from "../utils/textFormatting";

// Função para formatar o título da escola
const formatarTituloEscola = (titulo) => {
  if (!titulo) return '';
  
  // Converter para minúsculas para facilitar a busca
  const tituloLower = titulo.toLowerCase();
  
  // Verificar se contém "escola estadual" e "aldeia"
  if (tituloLower.includes('escola estadual') && tituloLower.includes('aldeia')) {
    // Extrair o nome da aldeia (parte após "aldeia")
    const partes = titulo.split(' ');
    const indiceAldeia = partes.findIndex(parte => 
      parte.toLowerCase().includes('aldeia')
    );
    
    if (indiceAldeia !== -1 && indiceAldeia < partes.length - 1) {
      // Pegar a parte da aldeia (pode ter mais de uma palavra)
      const nomeAldeia = partes.slice(indiceAldeia + 1).join(' ');
      return `E.E.I ${capitalizeWords(nomeAldeia)}`;
    }
  }
  
  // Se não conseguir formatar, retorna o título original capitalizado
  return capitalizeWords(titulo);
};

const PainelHeader = ({ titulo, closePainel, toggleMaximize, isMaximized, imagemHeader }) => {
  const isMobile = window.innerWidth <= 768;
  const isMobileLandscape = isMobile && window.innerWidth > window.innerHeight;
  const isVerySmallLandscape = isMobileLandscape && window.innerWidth <= 850;

  const headerHalfClass = (!isMobile && isMaximized) ? 'mj-header-half-right' : '';

  return (
    <header className={`relative border-b border-green-100 ${isMobileLandscape ? 'min-h-[60px]' : ''}`}>
      <div className={`px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2 md:py-3 ${headerHalfClass}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pr-12">
          <div className="space-y-1">
            <h2 
              id="painel-titulo"
              className={`font-bold text-gray-900 leading-tight tracking-tight break-words ${
                isVerySmallLandscape
                  ? 'text-lg' // Aumentado de text-base
                  : isMobileLandscape 
                    ? 'text-xl sm:text-2xl' // Aumentado de text-lg sm:text-xl
                    : 'text-2xl sm:text-3xl md:text-4xl' // Aumentado de text-xl sm:text-2xl md:text-3xl
              }`}
              style={isVerySmallLandscape ? { fontSize: 'clamp(1.125rem, 4.5vw, 1.5rem)' } : {}}
            >
              {formatarTituloEscola(titulo)}
            </h2>
            
            {/* Subtítulo decorativo */}
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-3 h-3" /> {/* Diminuído de w-4 h-4 */}
              <span className="text-xs sm:text-sm font-medium"> {/* Diminuído de text-sm sm:text-base */}
                Escola Estadual Indígena
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2">
        {!isMobile && (
          <button
            onClick={toggleMaximize}
            className="p-2 text-green-700 hover:text-green-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={isMaximized ? "Restaurar painel" : "Maximizar painel"}
            title={isMaximized ? "Restaurar" : "Maximizar"}
          >
            {isMaximized ? (
              <Minimize2 size={18} className="stroke-2" aria-hidden="true" />
            ) : (
              <Maximize2 size={18} className="stroke-2" aria-hidden="true" />
            )}
          </button>
        )}

        <button
          onClick={closePainel}
          className={`text-gray-700 hover:text-gray-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            isMobileLandscape ? 'p-1.5' : 'p-2'
          }`}
          aria-label="Fechar painel"
        >
          <X 
            size={isMobileLandscape ? 18 : 20} 
            aria-hidden="true"
            className="stroke-2"
          />
        </button>
      </div>
    </header>
  );
};

export default PainelHeader;
