import React, { useState } from "react";
import PropTypes from "prop-types";
import MapSection from "./components/MapSection";
import MediaSection from "./components/MediaSection";
import InputField from "./components/InputField";
import RichTextEditor from "./components/RichTextEditor";
import { opcoes } from "./constants";
import { uploadImage } from "../../services/uploadService";

const AddLocationPanel = ({ newLocation, setNewLocation, onSave, onClose, isLoading }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
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

  const handleImageUploadComplete = (url) => {
    setNewLocation(prev => ({
      ...prev,
      imagens: url
    }));
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAudioPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUploadComplete = (url) => {
    setNewLocation(prev => ({
      ...prev,
      audio: url
    }));
  };

  const handleVideoUpload = (event) => {
    const url = event.target.value;
    setVideoPreview(url);
    setNewLocation(prev => ({
      ...prev,
      video: url
    }));
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setNewLocation(prev => ({
      ...prev,
      imagens: null
    }));
  };

  const handleRemoveAudio = () => {
    setAudioPreview(null);
    setNewLocation(prev => ({
      ...prev,
      audio: null
    }));
  };

  const handleRemoveVideo = () => {
    setVideoPreview(null);
    setNewLocation(prev => ({
      ...prev,
      video: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newLocation.titulo) newErrors.titulo = "Título é obrigatório.";
    if (!newLocation.latitude || !newLocation.longitude) newErrors.localizacao = "Localização é obrigatória.";
    if (!newLocation.descricao_detalhada) newErrors.descricao_detalhada = "Descrição detalhada é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Se houver uma imagem sendo carregada, aguarda o upload
      if (imagePreview && !newLocation.imagens) {
        try {
          const file = imagePreview;
          const url = await uploadImage(file);
          setNewLocation(prev => ({
            ...prev,
            imagens: url
          }));
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          setErrors(prev => ({
            ...prev,
            image: 'Erro ao fazer upload da imagem. Tente novamente.'
          }));
          return;
        }
      }
      
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
                        className={`w-full text-left p-2 ${opcao.cor} text-gray-800`}
                      >
                        {opcao.label}
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
              onUploadComplete={handleImageUploadComplete}
            />
            <MediaSection
              type="audio"
              preview={audioPreview}
              onUpload={handleAudioUpload}
              onRemove={handleRemoveAudio}
              onUploadComplete={handleAudioUploadComplete}
            />
            <MediaSection
              type="video"
              preview={videoPreview}
              onUpload={handleVideoUpload}
              onRemove={handleRemoveVideo}
              onUploadComplete={handleVideoUpload}
            />

            <div className="mb-4">
              <label htmlFor="links" className="block text-sm font-medium text-gray-700">
                Links
              </label>
              <input
                type="text"
                id="links"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newLocation.links || ""}
                onChange={(e) => setNewLocation(prev => ({...prev, links: e.target.value}))}
                placeholder="Links separados por vírgula"
              />
            </div>

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
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  newLocation: PropTypes.shape({
    nome: PropTypes.string,
    tipo: PropTypes.string,
    descricao: PropTypes.string,
    descricao_detalhada: PropTypes.string,
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    imagens: PropTypes.string,
    video: PropTypes.string,
    links: PropTypes.string,
  }).isRequired,
  setNewLocation: PropTypes.func.isRequired,
  error: PropTypes.string,
};

AddLocationPanel.defaultProps = {
  isLoading: false,
};

export default AddLocationPanel;