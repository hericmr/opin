// components/Navbar.js
import React from "react";

const Navbar = () => {
  return (
    <header className="bg-green-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-white">
            Cartografia Social de Santos
          </h1>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTYwtB55I-IDYaOH-GGz0ctldEZqCHa_N7aA&s"
            alt="Logo Unifesp"
            className="h-10 w-auto object-contain"
          />
          <p className="text-xs tracking-wide text-white text-center w-full font-serif">
            Serviço Social
          </p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
