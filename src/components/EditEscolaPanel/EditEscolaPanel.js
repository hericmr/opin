import React, { useState } from 'react';
import PropTypes from 'prop-types';

const EditEscolaPanel = ({ escola, onClose, onSave }) => {
  const [nomeEscola, setNomeEscola] = useState(escola?.Escola || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeEscola.trim()) {
      setError('O nome da escola é obrigatório.');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      await onSave({ ...escola, Escola: nomeEscola });
      onClose();
    } catch (err) {
      setError('Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Escola</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={nomeEscola}
          onChange={e => setNomeEscola(e.target.value)}
          disabled={isSaving}
        />
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSaving}>Salvar</button>
        <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={onClose} disabled={isSaving}>Cancelar</button>
      </div>
    </form>
  );
};

EditEscolaPanel.propTypes = {
  escola: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditEscolaPanel;