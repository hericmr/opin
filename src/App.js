import React from "react";
import MapaSantos from "./components/MapaSantos";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <header className="bg-gradient-to-r from-green-900 via-green-800 to-green-600 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-white">
              Cartografia Social de Santos
            </h1>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://portal.unifesp.br/web_imagens/institucional/logoUnifesp.png"
              alt="Logo Unifesp"
              className="h-12 w-auto object-contain"
            />
<p className="text-sm  tracking-wide text-white text-center w-full font-serif">
  Serviço Social
</p>

          </div>
        </div>
      </header>
      <main className="flex-grow">
        <MapaSantos />
      </main>
      <footer className="bg-gray-800 py-4">
        <div className="container mx-auto text-center text-white">
          <p className="text-xs">
            Desenvolvido para destacar as territorialidades e as lutas sociais, e a força dos movimentos de Santos.
          </p>
          <p className="text-xs mt-1">&copy; 2024 Cartografia Social. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
