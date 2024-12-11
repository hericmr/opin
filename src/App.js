import React from "react";
import MapaSantos from "./components/MapaSantos";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gradient-to-r from-blue-800 via-gray-900 to-green-700 shadow-lg">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-green-400 animate-pulse">
            Onde está o héric?
          </h1>
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 w-4 h-4 rounded-full animate-ping"></div>
            <p className="text-lg font-semibold tracking-widest text-gray-200">Rastreando...</p>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <MapaSantos />
      </main>

    </div>
  );
};

export default App;
