import React from 'react';
import PropTypes from 'prop-types';
import { Save, Settings, ChevronUp } from 'lucide-react';
import LegendFields from './LegendFields';

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
      
      <input
        type="text"
        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-100"
        value={legendData?.legenda || ''}
        onChange={e => onChange('legenda', e.target.value)}
        placeholder="Digite a legenda da imagem..."
      />
      
      {/* Detailed fields - Appear only when expanded */}
      {expanded && (
        <LegendFields legendData={legendData} onChange={onChange} />
      )}
      
      <div className="flex gap-2 pt-2">
        <button
          onClick={onSave}
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

