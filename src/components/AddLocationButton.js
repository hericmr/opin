import React, { useState } from "react";
import AddLocationPanel from './AddLocationPanel';

const ADMIN_PASSWORD = "Política Social"; // Defina a senha para administradores

const AddLocationButton = () => {
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    latitude: "",
    longitude: "",
    description: "",
    links: "",
    audio: "",
  });
  const [error, setError] = useState("");

  const handleSaveLocation = () => {
    if (!newLocation.latitude || !newLocation.longitude || !newLocation.description) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }
    console.log("Novo local salvo:", newLocation);
    setIsAddingLocation(false);
    setError("");
  };

  const handleAddLocationClick = () => {
    const enteredPassword = prompt("Esse recurso é permitido apenas a administradores do site. Digite a senha de administrador:");
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsAddingLocation(true);
      setError("");
    } else {
      setError("Senha incorreta! Ação não permitida.");
    }
  };

  const handleClosePanel = () => {
    setIsAddingLocation(false);
    setNewLocation({
      latitude: "",
      longitude: "",
      description: "",
      links: "",
      audio: "",
    });
    setError("");
  };

  return (
    <>
      <div className="absolute bottom-4 right-4">
        <button
          className="bg-green-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 focus:outline-none transition duration-300 ease-in-out"
          onClick={handleAddLocationClick}
          aria-label="Adicionar Local"
        >
          + Adicionar Local
        </button>
      </div>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {isAddingLocation && (
        <AddLocationPanel
          newLocation={newLocation}
          setNewLocation={setNewLocation}
          onSave={handleSaveLocation}
          onClose={handleClosePanel}
        />
      )}
    </>
  );
};

export default AddLocationButton;