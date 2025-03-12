import React, { useState } from "react";
import PropTypes from "prop-types";
import MapSection from "./components/MapSection";
import MediaSection from "./components/MediaSection";
import InputField from "./components/InputField";
import RichTextEditor from "./components/RichTextEditor";
import { opcoes } from "./constants";

const AddLocationPanel = ({ newLocation, setNewLocation, onSave, onClose, isLoading }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setVideoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => setImagePreview(null);
  const handleRemoveVideo = () => setVideoPreview(null);

  const validateForm = () => {
    const newErrors = {};
    if (!newLocation.titulo) newErrors.titulo = "Título é obrigatório.";
    if (!newLocation.latitude || !newLocation.longitude) newErrors.localizacao = "Localização é obrigatória.";
    if (!newLocation.descricao_detalhada) newErrors.descricao_detalhada = "Descrição detalhada é obrigatória.";
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
    setNewLocation((prev) => ({
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
            <h2 className="text-xl font-semibold text-gray-900">Adicionar um Novo Local</h2>
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
              value={newLocation.titulo || ""}
              onChange={(e) =>
                setNewLocation((prev) => ({
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
                    {newLocation.tipo || "Selecione o tipo de marcador"}
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
              newLocation={newLocation}
              setNewLocation={setNewLocation}
              error={errors.localizacao}
            />

            <RichTextEditor
              value={newLocation.descricao_detalhada || ""}
              onChange={(content) =>
                setNewLocation((prev) => ({
                  ...prev,
                  descricao_detalhada: content,
                }))
              }
              error={errors.descricao_detalhada}
            />

            <MediaSection
              type="image"
              preview={imagePreview}
              onUpload={handleImageUpload}
              onRemove={handleRemoveImage}
            />
            <MediaSection
              type="video"
              preview={videoPreview}
              onUpload={handleVideoUpload}
              onRemove={handleRemoveVideo}
            />

            <InputField
              label="Links"
              id="links"
              type="url"
              value={newLocation.links || ""}
              onChange={(e) => setNewLocation(prev => ({...prev, links: e.target.value}))}
              placeholder="Cole um link aqui (http://...)"
            />
            <InputField
              label="Áudio"
              id="audio"
              type="url"
              value={newLocation.audio || ""}
              onChange={(e) => setNewLocation(prev => ({...prev, audio: e.target.value}))}
              placeholder="http://"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>

            {showConfirmation && (
              <div className="text-green-600 text-sm mt-2 animate-fade-in">✔ Local salvo com sucesso!</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

AddLocationPanel.propTypes = {
  newLocation: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tipo: PropTypes.string,
    titulo: PropTypes.string,
    descricao_detalhada: PropTypes.string,
    links: PropTypes.string,
    audio: PropTypes.string,
  }).isRequired,
  setNewLocation: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

AddLocationPanel.defaultProps = {
  isLoading: false,
};

export default AddLocationPanel;