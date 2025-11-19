import React from 'react';
import PropTypes from 'prop-types';
import BrazilianDateInput from '../../../AdminPanel/components/BrazilianDateInput';
import AutocompleteInput from '../../ImageUploadSection/components/AutocompleteInput';

/**
 * Detailed legend fields (expanded section)
 * @param {Object} props
 * @param {Object} props.legendData - Legend data object
 * @param {Function} props.onChange - Change handler (field: string, value: any) => void
 * @param {Function} props.getSuggestions - Function to get suggestions for a field
 * @param {Function} props.saveToMemory - Function to save value to memory
 */
const LegendFields = ({ legendData, onChange, getSuggestions, saveToMemory }) => {
  return (
    <div className="space-y-2 pt-2 border-t border-gray-600">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Descrição Detalhada
      </label>
      <AutocompleteInput
        value={legendData?.descricao_detalhada || ''}
        onChange={(value) => onChange('descricao_detalhada', value)}
        onSave={() => {
          if (legendData?.descricao_detalhada) {
            saveToMemory('descricao_detalhada', legendData.descricao_detalhada);
          }
        }}
        suggestions={getSuggestions('descricao_detalhada', legendData?.descricao_detalhada)}
        placeholder="Descrição detalhada da imagem..."
        rows={3}
      />
      
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Autor da Foto (Fotógrafo)
      </label>
      <AutocompleteInput
        value={legendData?.autor_foto || ''}
        onChange={(value) => onChange('autor_foto', value)}
        onSave={() => {
          if (legendData?.autor_foto) {
            saveToMemory('autor_foto', legendData.autor_foto);
          }
        }}
        suggestions={getSuggestions('autor_foto', legendData?.autor_foto)}
        placeholder="Nome do fotógrafo"
      />
      
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Data da Foto
      </label>
      <BrazilianDateInput
        value={legendData?.data_foto || ''}
        onChange={e => {
          onChange('data_foto', e.target.value);
          // Save date to memory when changed
          if (e.target.value) {
            saveToMemory('data_foto', e.target.value);
          }
        }}
        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-100"
        placeholder="DD/MM/AAAA"
      />
      
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Categoria
      </label>
      <AutocompleteInput
        value={legendData?.categoria || ''}
        onChange={(value) => onChange('categoria', value)}
        onSave={() => {
          if (legendData?.categoria) {
            saveToMemory('categoria', legendData.categoria);
          }
        }}
        suggestions={getSuggestions('categoria', legendData?.categoria)}
        placeholder="Digite a categoria da imagem..."
      />
    </div>
  );
};

LegendFields.propTypes = {
  legendData: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  saveToMemory: PropTypes.func.isRequired,
};

export default LegendFields;

