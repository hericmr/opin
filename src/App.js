import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MapaSantos from './components/MapaSantos';
import AdminPanel from './components/AdminPanel';
import EditLocationPanel from './components/EditLocationPanel';
import PainelInformacoes from './components/PainelInformacoes';
import TerrasIndigenas from './components/TerrasIndigenas';
import Marcadores from './components/Marcadores';
import { useShare } from './components/hooks/useShare';
import './App.css';

function App() {
  const { isShared, sharedLocation } = useShare();

  return (
    <Router basename="/escolasindigenas">
      <div className="App">
        <Routes>
          <Route path="/" element={<MapaSantos />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/edit/:id" element={<EditLocationPanel />} />
          <Route path="/info/:id" element={<PainelInformacoes />} />
          <Route path="/terras" element={<TerrasIndigenas />} />
          <Route path="/marcadores" element={<Marcadores />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;