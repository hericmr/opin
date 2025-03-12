import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddLocationButton from './AddLocationButton';
import EditLocationButton from './EditLocationButton';

const ADMIN_PASSWORD = "Política Social";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdminClick = () => {
    const enteredPassword = prompt("Digite a senha de administrador:");
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminPanel(false);
    }
  };

  const isConteudoPage = location.pathname === '/conteudo';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-green-900/80 backdrop-blur-md text-white">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo e Título */}
        <div className="flex items-center space-x-2">
          <img
            src="/cartografiasocial/favicon.ico"
            alt="Ícone do mapa"
            className="h-6 sm:h-8 w-auto"
            aria-label="Ícone do mapa"
          />
          <h1
            onClick={() => navigate('/')}
            className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold tracking-wide cursor-pointer truncate hover:text-green-100 transition-colors"
          >
            Cartografia Social de Santos
          </h1>
        </div>

        {/* Links de Navegação e Logos */}
        <div className="flex items-center">
          {/* Botão Ver Conteúdo/Voltar */}
          <button
            onClick={() => navigate(isConteudoPage ? '/' : '/conteudo')}
            className="px-4 py-2 text-sm font-medium text-white hover:text-green-100 transition-colors rounded-lg hover:bg-green-800"
          >
            {isConteudoPage ? 'Voltar ao Mapa' : 'Ver Todo Conteúdo'}
          </button>

          {/* Logo Unifesp */}
          <a 
            href="https://www.unifesp.br/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center mx-4"
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

          {/* Área de Administração */}
          {!isAdmin ? (
            <button
              onClick={handleAdminClick}
              className="text-sm font-medium text-white/50 hover:text-white transition-colors ml-2"
            >
              ⚙️
            </button>
          ) : (
            <div className="relative ml-2">
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="text-sm font-medium text-white hover:text-green-100 transition-colors"
              >
                Painel Admin
              </button>
              {showAdminPanel && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <AddLocationButton />
                  <EditLocationButton />
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;