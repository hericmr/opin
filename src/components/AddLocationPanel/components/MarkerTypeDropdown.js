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
                <div className="mr-3 w-6 h-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full">
                    <path
                      fill="currentColor"
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    />
                    <circle cx="12" cy="9" r="3" fill="white"/>
                  </svg>
                </div>
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