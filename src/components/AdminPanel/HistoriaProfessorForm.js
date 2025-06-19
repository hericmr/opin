import React from 'react';
import PropTypes from 'prop-types';

const HistoriaProfessorForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editing,
  loading,
  onImageChange,
  onRemoveImage
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do(a) Professor(a)
          </label>
          <input
            type="text"
            value={formData.nome_professor}
            onChange={e => setFormData({ ...formData, nome_professor: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Nome do(a) professor(a)"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gênero
          </label>
          <select
            value={formData.genero}
            onChange={e => setFormData({ ...formData, genero: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            disabled={loading}
          >
            <option value="professor">Professor</option>
            <option value="professora">Professora</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título (opcional)
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Título da história"
            disabled={loading}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          História *
        </label>
        <textarea
          value={formData.historia}
          onChange={e => setFormData({ ...formData, historia: e.target.value })}
          rows={6}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Digite a história do professor..."
          required
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordem
          </label>
          <input
            type="number"
            min="1"
            value={formData.ordem}
            onChange={e => setFormData({ ...formData, ordem: parseInt(e.target.value) || 1 })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-4 mt-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.ativo}
              onChange={e => setFormData({ ...formData, ativo: e.target.checked })}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              disabled={loading}
            />
            <span className="text-sm text-gray-700">Ativa</span>
          </label>
        </div>
      </div>
      {/* Upload de imagem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Foto do(a) Professor(a)
        </label>
        {formData.imagem_url && (
          <div className="mb-2 flex items-center gap-4">
            <img src={formData.imagem_url} alt="Foto do professor(a)" className="w-20 h-20 object-cover rounded-lg border" />
            <button type="button" onClick={onRemoveImage} className="text-sm text-red-600 hover:text-red-700">Remover</button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          disabled={loading}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {editing ? 'Atualizar' : 'Criar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

HistoriaProfessorForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editing: PropTypes.bool,
  loading: PropTypes.bool,
  onImageChange: PropTypes.func,
  onRemoveImage: PropTypes.func
};

export default HistoriaProfessorForm; 