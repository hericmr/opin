import React from 'react';
import PropTypes from 'prop-types';
import { Save, Settings, ChevronUp } from 'lucide-react';
import LegendFields from './LegendFields';
import AutocompleteInput from './AutocompleteInput';
import { useFieldMemory } from '../hooks/useFieldMemory';

/**
 * Complete legend form component
 * @param {Object} props
 * @param {Object} props.image - Image object
 * @param {Object} props.legendData - Legend data object
 * @param {Function} props.onChange - Change handler (field: string, value: any) => void
 * @param {Function} props.onSave - Save handler
 * @param {boolean} props.expanded - Whether detailed fields are expanded
 * @param {Function} props.onToggleExpand - Toggle expand handler
 */
const LegendForm = ({ image, legendData, onChange, onSave, expanded, onToggleExpand }) => {
  const { getSuggestions, saveToMemory } = useFieldMemory();

  // Handle save and store values in memory
  const handleSave = () => {
    // Save all fields to memory before calling onSave
    if (legendData?.legenda) {
      saveToMemory('legenda', legendData.legenda);
    }
    if (legendData?.autor_foto) {
      saveToMemory('autor_foto', legendData.autor_foto);
    }
    if (legendData?.data_foto) {
      saveToMemory('data_foto', legendData.data_foto);
    }
    if (legendData?.descricao_detalhada) {
      saveToMemory('descricao_detalhada', legendData.descricao_detalhada);
    }
    if (legendData?.categoria) {
      saveToMemory('categoria', legendData.categoria);
    }
    onSave();
  };

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-300">
          Legenda
        </label>
        <button
          onClick={onToggleExpand}
          className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
          title={expanded ? 'Ocultar campos detalhados' : 'Mostrar campos detalhados'}
          type="button"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <Settings className="w-4 h-4" />
          )}
        </button>
      </div>
      
      <AutocompleteInput
        value={legendData?.legenda || ''}
        onChange={(value) => onChange('legenda', value)}
        onSave={() => {
          if (legendData?.legenda) {
            saveToMemory('legenda', legendData.legenda);
          }
        }}
        suggestions={getSuggestions('legenda', legendData?.legenda)}
        placeholder="Digite a legenda da imagem..."
      />
      
      {/* Detailed fields - Appear only when expanded */}
      {expanded && (
        <LegendFields 
          legendData={legendData} 
          onChange={onChange}
          getSuggestions={getSuggestions}
          saveToMemory={saveToMemory}
        />
      )}
      
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          type="button"
        >
          <Save className="w-4 h-4" /> Salvar
        </button>
      </div>
    </div>
  );
};

LegendForm.propTypes = {
  image: PropTypes.object.isRequired,
  legendData: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
};

export default LegendForm;

