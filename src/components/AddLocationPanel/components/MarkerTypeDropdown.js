import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { opcoes } from "../constants";

const MarkerTypeDropdown = ({ newLocation, setNewLocation }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-full text-gray-800">
      <label className="block font-medium mb-1">
        Tipo de Marcador <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full border border-gray-300 rounded-md p-2.5 flex items-center justify-between bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
        >
          <span className="text-gray-700">
            {newLocation.tipo || "Selecione o tipo de marcador"}
          </span>
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`}
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
          <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
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
                className={`w-full text-left p-2.5 flex items-center hover:bg-gray-50 transition-colors ${idx !== opcoes.length - 1 ? 'border-b border-gray-100' : ''} ${opcao.cor} text-gray-700`}
              >
                {opcao.icone.startsWith("http") ? (
                  <img
                    src={opcao.icone}
                    alt={opcao.label}
                    className="w-6 h-6 mr-3"
                  />
                ) : (
                  <span className="mr-3">{opcao.icone}</span>
                )}
                <span className="font-medium">{opcao.label}</span>
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