import React, { useState } from "react";
import AddLocationPanel from './AddLocationPanel';
import { supabase } from '../supabaseClient';

const AddLocationButton = () => {
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    latitude: "",
    longitude: "",
    tipo: "",
    titulo: "",
    descricao_detalhada: "",
    links: "",
    audio: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveLocation = async () => {
    if (!newLocation.latitude || !newLocation.longitude || !newLocation.tipo || !newLocation.titulo || !newLocation.descricao_detalhada) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    setIsLoading(true);
    try {
      // Preparar os dados para inserção
      const locationData = {
        titulo: newLocation.titulo,
        tipo: newLocation.tipo,
        descricao_detalhada: newLocation.descricao_detalhada,
        localizacao: `${newLocation.latitude},${newLocation.longitude}`,
        links: newLocation.links || null,
        audio: newLocation.audio || null,
      };

      // Inserir no Supabase
      const { data, error: supabaseError } = await supabase
        .from('locations3')
        .insert([locationData])
        .select();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      console.log("Novo local salvo com sucesso:", data);
      setIsAddingLocation(false);
      setError("");
      
      // Limpar o formulário
      setNewLocation({
        latitude: "",
        longitude: "",
        tipo: "",
        titulo: "",
        descricao_detalhada: "",
        links: "",
        audio: "",
      });

      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (err) {
      console.error("Erro ao salvar local:", err);
      setError("Erro ao salvar o local. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePanel = () => {
    setIsAddingLocation(false);
    setNewLocation({
      latitude: "",
      longitude: "",
      tipo: "",
      titulo: "",
      descricao_detalhada: "",
      links: "",
      audio: "",
    });
    setError("");
  };

  return (
    <>
      <button
        className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-1"
        onClick={() => {
          console.log("Botão Adicionar clicado");
          setIsAddingLocation(true);
        }}
        aria-label="Adicionar Local"
        disabled={isLoading}
      >
        {isLoading ? "Salvando..." : "➕ Adicionar"}
      </button>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {isAddingLocation && (
        <div className="relative">
          <AddLocationPanel
            newLocation={newLocation}
            setNewLocation={setNewLocation}
            onSave={handleSaveLocation}
            onClose={handleClosePanel}
            isLoading={isLoading}
          />
        </div>
      )}
    </>
  );
};

export default AddLocationButton;