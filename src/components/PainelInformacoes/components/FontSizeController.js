import React, { useState, useEffect } from 'react';
import { Type, Plus, Minus, RotateCcw } from 'lucide-react';

const FontSizeController = ({ onFontSizeChange }) => {
  const [fontSize, setFontSize] = useState(1); // 1 = tamanho normal (100%)
  const [isVisible, setIsVisible] = useState(false);

  const fontSizeOptions = [
    { value: 0.8, label: '80%', description: 'Muito pequeno' },
    { value: 0.9, label: '90%', description: 'Pequeno' },
    { value: 1, label: '100%', description: 'Normal' },
    { value: 1.1, label: '110%', description: 'Grande' },
    { value: 1.2, label: '120%', description: 'Muito grande' },
    { value: 1.3, label: '130%', description: 'Extra grande' },
    { value: 1.4, label: '140%', description: 'Máximo' },
  ];

  const currentOption = fontSizeOptions.find(opt => opt.value === fontSize);

  const handleFontSizeChange = (newSize) => {
    console.log('FontSizeController: Changing font size to:', newSize);
    setFontSize(newSize);
    onFontSizeChange(newSize);
  };

  const increaseFontSize = () => {
    const currentIndex = fontSizeOptions.findIndex(opt => opt.value === fontSize);
    if (currentIndex < fontSizeOptions.length - 1) {
      const newSize = fontSizeOptions[currentIndex + 1].value;
      handleFontSizeChange(newSize);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = fontSizeOptions.findIndex(opt => opt.value === fontSize);
    if (currentIndex > 0) {
      const newSize = fontSizeOptions[currentIndex - 1].value;
      handleFontSizeChange(newSize);
    }
  };

  const resetFontSize = () => {
    handleFontSizeChange(1);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Botão principal */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 min-w-[80px]"
        title="Controle de tamanho da fonte"
      >
        <Type className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{currentOption?.label}</span>
      </button>

      {/* Painel de controles */}
      {isVisible && (
        <div className="absolute top-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Tamanho da Fonte</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Controles de tamanho */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={decreaseFontSize}
              disabled={fontSize <= 0.8}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-bold"
              title="Diminuir fonte"
            >
              −
            </button>
            
            <div className="flex-1 text-center">
              <div className="text-lg font-semibold text-green-600">
                {currentOption?.label}
              </div>
              <div className="text-xs text-gray-500">
                {currentOption?.description}
              </div>
            </div>
            
            <button
              onClick={increaseFontSize}
              disabled={fontSize >= 1.4}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-bold"
              title="Aumentar fonte"
            >
              +
            </button>
          </div>

          {/* Opções rápidas */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {fontSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFontSizeChange(option.value)}
                className={`p-2 text-xs rounded transition-colors ${
                  fontSize === option.value
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-75">{option.description}</div>
              </button>
            ))}
          </div>

          {/* Botão de reset */}
          <button
            onClick={resetFontSize}
            className="w-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Resetar para Normal
          </button>

          {/* Informação sobre o teste */}
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
            <strong>Modo Experimental:</strong> Use este controle para testar diferentes tamanhos de fonte e encontrar o ideal para o site.
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSizeController;
