import React from "react";
import MapaSantos from "./components/MapaSantos";
import Navbar from "./components/Navbar"; 

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> 
      <main className="flex-grow">
        <MapaSantos />
      </main>
    </div>
  );
};

export default App;
