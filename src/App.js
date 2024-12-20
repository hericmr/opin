import React from "react";
import MapaSantos from "./components/MapaSantos";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar"; // Importe o componente Navbar

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* Agora usamos o componente Navbar */}
      <main className="flex-grow">
        <MapaSantos />
      </main>
      <Footer /> {/* Agora usamos o componente Footer */}
    </div>
  );
};

export default App;
