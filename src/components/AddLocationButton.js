import React, { useState } from "react";
import AddLocationPanel from './AddLocationPanel';
import { supabase } from '../supabaseClient';
import { PlusCircle, Loader2 } from 'lucide-react';

const AddLocationButton = () => {
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    latitude: "",
    longitude: "",
    tipo: "",
    titulo: "",
    descricao_detalhada: "",
    links: "",
    imagens: "",
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
        imagens: newLocation.imagens || null,
        audio: newLocation.audio || null,
      };

      // Inserir no Supabase
      const { data, error: supabaseError } = await supabase
        .from('escolas_completa')
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
        imagens: "",
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
      imagens: "",
      audio: "",
    });
    setError("");
  };

  return (
    <>
      <button
        className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm group"
        onClick={() => {
          console.log("Botão Adicionar clicado");
          setIsAddingLocation(true);
        }}
        aria-label="Adicionar Local"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <PlusCircle className="w-4 h-4 text-green-600 group-hover:text-green-700" />
        )}
        <span className="flex-1 text-left">
          {isLoading ? "Salvando..." : "Adicionar Local"}
        </span>
      </button>

      {error && (
        <div className="px-4 py-2 text-sm text-red-600 bg-red-50">
          {error}
        </div>
      )}

      {isAddingLocation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
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