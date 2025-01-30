import React from "react";

const Navbar = ({ onTitleClick = () => {} }) => {
  return (
    <header className="bg-green-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo e título */}
        <div className="flex items-center">
          <img
            src="/gps/favicon.ico"
            alt="Ícone do mapa"
            className="h-8 w-auto mr-2"
            aria-label="Ícone do mapa"
          />
          <h1
            className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide cursor-pointer"
            onClick={() => {
              console.log("título clicado! Atualizando abrindo detalhes intro"); //aqui precisa ter o codigo pra abertura do painel de detalhes
              onTitleClick();
            }}
          >
            Cartografia Social de Santos
          </h1>
        </div>


        <div className="flex flex-col items-center text-center">
          <img
            src="/cartografiasocial/logo.png"
            alt="Logo da Unifesp"
            className="h-10 w-auto object-contain"
            aria-label="Logo da Unifesp"
          />
          <p className="text-xs tracking-wide font-serif mt-1">Serviço Social</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
