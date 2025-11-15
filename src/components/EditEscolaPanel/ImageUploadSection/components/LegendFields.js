import React from 'react';
import PropTypes from 'prop-types';
import BrazilianDateInput from '../../../AdminPanel/components/BrazilianDateInput';

/**
 * Detailed legend fields (expanded section)
 * @param {Object} props
 * @param {Object} props.legendData - Legend data object
 * @param {Function} props.onChange - Change handler (field: string, value: any) => void
 */
const LegendFields = ({ legendData, onChange }) => {
  return (
    <div className="space-y-2 pt-2 border-t border-gray-600">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Descrição Detalhada
      </label>
      <textarea
        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-100"
        value={legendData?.descricao_detalhada || ''}
        onChange={e => onChange('descricao_detalhada', e.target.value)}
        placeholder="Descrição detalhada da imagem..."
        rows={3}
      />
      
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Autor da Foto
      </label>
      <input
        type="text"
        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-100"
        value={legendData?.autor_foto || ''}
        onChange={e => onChange('autor_foto', e.target.value)}
        placeholder="Nome do fotógrafo"
      />
      
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Data da Foto
      </label>
      <BrazilianDateInput
        value={legendData?.data_foto || ''}
        onChange={e => onChange('data_foto', e.target.value)}
        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-100"
        placeholder="DD/MM/AAAA"
      />
      
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Categoria
      </label>
      <input
        type="text"
        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-100"
        value={legendData?.categoria || ''}
        onChange={e => onChange('categoria', e.target.value)}
        placeholder="Digite a categoria da imagem..."
      />
    </div>
  );
};

LegendFields.propTypes = {
  legendData: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default LegendFields;

