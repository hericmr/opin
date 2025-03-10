import React, { useState } from "react";
import AddLocationButton from './AddLocationButton';
import EditLocationButton from './EditLocationButton';

const ADMIN_PASSWORD = "Política Social";

const Navbar = ({ onTitleClick = () => {} }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleAdminClick = () => {
    const enteredPassword = prompt("Digite a senha de administrador:");
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminPanel(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-green-900/80 backdrop-blur-md text-white">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo e Título */}
        <div className="flex items-center space-x-2 flex-1">
          <img
            src="/cartografiasocial/favicon.ico"
            alt="Ícone do mapa"
            className="h-6 sm:h-8 w-auto"
            aria-label="Ícone do mapa"
          />
          <h1
            onClick={() => {
              window.location.href = "/cartografiasocial?panel=sobre-o-site";
            }}
            className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold tracking-wide cursor-pointer truncate hover:text-green-100 transition-colors"
          >
            Cartografia Social de Santos
          </h1>
        </div>

        {/* Área de Administração e Logo Unifesp */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Botão Admin discreto */}
          {!isAdmin ? (
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="opacity-30 hover:opacity-100 transition-opacity text-xs sm:text-sm p-1"
              aria-label="Menu Administrador"
            >
              ⚙️
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-green-800/50 px-2 py-1 rounded-lg">
                <AddLocationButton />
                <span className="text-white/30">|</span>
                <EditLocationButton />
              </div>
              <button
                onClick={() => setIsAdmin(false)}
                className="text-white/50 hover:text-white/80 transition-colors text-sm"
                aria-label="Sair do modo administrador"
              >
                ❌
              </button>
            </div>
          )}

          {/* Logo da Unifesp */}
          <a 
            href="https://www.unifesp.br/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center ml-2"
          >
            <img
              src="/cartografiasocial/logo.png"
              alt="Logo da Unifesp"
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <span className="text-[10px] sm:text-xs tracking-wide font-serif mt-0.5">
              Serviço Social
            </span>
          </a>
        </div>
      </nav>

      {/* Painel Admin Mobile */}
      {showAdminPanel && !isAdmin && (
        <div className="absolute top-16 right-0 bg-green-900/95 p-4 rounded-bl-lg shadow-lg">
          <button
            onClick={handleAdminClick}
            className="text-white/70 hover:text-white text-sm flex items-center gap-2"
          >
            <span>👤</span>
            <span>Acessar como administrador</span>
          </button>
        </div>
      )}

      {/* Menu Admin Mobile */}
      {isAdmin && (
        <div className="sm:hidden bg-green-800/50 p-2 flex justify-center gap-4">
          <AddLocationButton />
          <span className="text-white/30">|</span>
          <EditLocationButton />
        </div>
      )}
    </header>
  );
};

export default Navbar;