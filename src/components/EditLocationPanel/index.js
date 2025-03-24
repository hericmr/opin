import React, { useState } from "react";
import PropTypes from "prop-types";
import { supabase } from '../../supabaseClient';
import MapSection from "../AddLocationPanel/components/MapSection";
import InputField from "../AddLocationPanel/components/InputField";
import RichTextEditor from "../AddLocationPanel/components/RichTextEditor";
import { opcoes } from "../AddLocationPanel/constants";

const EditLocationPanel = ({ location, onClose, onSave }) => {
  const [editedLocation, setEditedLocation] = useState({
    ...location,
    latitude: location.localizacao ? location.localizacao.split(',')[0] : '',
    longitude: location.localizacao ? location.localizacao.split(',')[1] : '',
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!editedLocation.titulo) newErrors.titulo = "Título é obrigatório.";
    if (!editedLocation.latitude || !editedLocation.longitude) newErrors.localizacao = "Localização é obrigatória.";
    if (!editedLocation.descricao_detalhada) newErrors.descricao_detalhada = "Descrição detalhada é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave();
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    }
  };

  const handleTipoChange = (tipo) => {
    setEditedLocation((prev) => ({
      ...prev,
      tipo: tipo,
    }));
    setDropdownOpen(false);
  };

  return (
    <div
      className="fixed top-16 right-0 sm:w-3/4 lg:w-[49%] bg-white rounded-xl shadow-lg z-[9999] text-gray-800"
      style={{
        height: 'calc(100vh - 4rem)',
        maxHeight: 'calc(100vh - 4rem)',
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Editar Local</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 text-lg"
              aria-label="Fechar painel"
            >
              ✖
            </button>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Título"
              id="titulo"
              type="text"
              value={editedLocation.titulo || ""}
              onChange={(e) =>
                setEditedLocation((prev) => ({
                  ...prev,
                  titulo: e.target.value,
                }))
              }
              placeholder="Digite o título do local"
              error={errors.titulo}
            />
            <div>
              <label className="block font-medium text-gray-800">
                Tipo de Marcador <span className="text-red-500">*</span>
              </label>
              <div className="relative" style={{ zIndex: 99999999 }}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full border rounded p-2 flex items-center justify-between text-gray-800 bg-white hover:bg-gray-50"
                >
                  <span>
                    {editedLocation.tipo || "Selecione o tipo de marcador"}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-600"
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
                  <div
                    className="absolute w-full bg-white border rounded shadow-lg"
                    style={{
                      top: '100%',
                      left: 0,
                      zIndex: 99999999,
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}
                  >
                    {opcoes.map((opcao, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleTipoChange(opcao.value)}
                        className={`w-full text-left p-2 hover:bg-gray-50 flex items-center ${opcao.cor} text-gray-800`}
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
            <MapSection
              newLocation={editedLocation}
              setNewLocation={setEditedLocation}
              error={errors.localizacao}
            />
            <RichTextEditor
              value={editedLocation.descricao_detalhada || ""}
              onChange={(content) =>
                setEditedLocation((prev) => ({
                  ...prev,
                  descricao_detalhada: content,
                }))
              }
              error={errors.descricao_detalhada}
            />
            <InputField
              label="Links"
              id="links"
              type="url"
              value={editedLocation.links || ""}
              onChange={(e) => setEditedLocation(prev => ({...prev, links: e.target.value}))}
              placeholder="Cole um link aqui (http://...)"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar"}
              </button>
            </div>
            {/* Mensagem de erro geral */}
            {errors.submit && (
              <p className="text-red-500 text-sm mt-2">{errors.submit}</p>
            )}
            {/* Mensagem de confirmação */}
            {showConfirmation && (
              <div className="text-green-600 text-sm mt-2 animate-fade-in">✔ Local atualizado com sucesso!</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

EditLocationPanel.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.number.isRequired,
    titulo: PropTypes.string,
    tipo: PropTypes.string,
    descricao_detalhada: PropTypes.string,
    localizacao: PropTypes.string,
    links: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditLocationPanel;