import React, { useState } from "react";
import PropTypes from "prop-types";
import EditLocationPanel from "./EditLocationPanel";

const ADMIN_PASSWORD = "Política Social"; // Mesma senha do AddLocationButton

const EditLocationButton = ({ location, onLocationUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const handleEditClick = () => {
    const enteredPassword = prompt("Esse recurso é permitido apenas a administradores do site. Digite a senha de administrador:");
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsEditing(true);
      setError("");
    } else {
      setError("Senha incorreta! Ação não permitida.");
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setError("");
  };

  const handleSave = () => {
    onLocationUpdated();
  };

  return (
    <>
      <button
        onClick={handleEditClick}
        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none transition duration-300 ease-in-out text-sm"
        aria-label="Editar Local"
      >
        ✏️ Editar
      </button>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {isEditing && (
        <EditLocationPanel
          location={location}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </>
  );
};

EditLocationButton.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.number.isRequired,
    titulo: PropTypes.string,
    tipo: PropTypes.string,
    descricao_detalhada: PropTypes.string,
    localizacao: PropTypes.string,
    links: PropTypes.string,
    audio: PropTypes.string,
  }).isRequired,
  onLocationUpdated: PropTypes.func.isRequired,
};

export default EditLocationButton; 