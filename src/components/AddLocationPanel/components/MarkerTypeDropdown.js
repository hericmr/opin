import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { opcoes } from "../constants";

const MarkerTypeDropdown = ({ newLocation, setNewLocation }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div>
      <label className="block font-medium">
        Tipo de Marcador <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full border rounded p-2 flex items-center justify-between text-black"
        >
          <span>
            {newLocation.tipo || "Selecione o tipo de marcador"}
          </span>
          <svg
            className="w-4 h-4 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute mt-1 w-full bg-white border rounded shadow-lg z-10">
            {opcoes.map((opcao, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setNewLocation((prev) => ({
                    ...prev,
                    tipo: opcao.value,
                    titulo: opcao.label,
                  }));
                  setDropdownOpen(false);
                }}
                className={`w-full text-left p-2 hover:bg-gray-100 flex items-center ${opcao.cor} text-black`}
              >
                {opcao.icone.startsWith("http") ? (
                  <img
                    src={opcao.icone}
                    alt={opcao.label}
                    className="w-6 h-6 mr-2"
                  />
                ) : (
                  <span className="mr-2">{opcao.icone}</span>
                )}
                <span>{opcao.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

MarkerTypeDropdown.propTypes = {
  newLocation: PropTypes.shape({
    tipo: PropTypes.string,
  }).isRequired,
  setNewLocation: PropTypes.func.isRequired,
};

export default MarkerTypeDropdown; 