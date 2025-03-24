import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { supabase } from '../../supabaseClient';
import MapSection from "../AddLocationPanel/components/MapSection";
import InputField from "../AddLocationPanel/components/InputField";
import RichTextEditor from "../AddLocationPanel/components/RichTextEditor";
import { opcoes } from "../AddLocationPanel/constants";
import { Upload, X } from 'lucide-react';

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
  const [mediaState, setMediaState] = useState({
    selectedImages: [],
    imageUrls: [],
    uploadingImages: false,
    uploadError: "",
  });

  // Inicializa as imagens existentes
  React.useEffect(() => {
    if (location.imagens) {
      const existingImages = location.imagens.split(',').filter(url => url);
      setMediaState(prev => ({
        ...prev,
        imageUrls: existingImages
      }));
    }
  }, [location.imagens]);

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
      onSave(editedLocation);
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

  const handleImageSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setMediaState(prev => ({
        ...prev,
        uploadError: "Alguns arquivos foram ignorados. Use apenas imagens JPG/PNG até 5MB."
      }));
    }

    setMediaState(prev => ({
      ...prev,
      selectedImages: [...prev.selectedImages, ...validFiles]
    }));

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaState(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUploadImages = async () => {
    if (mediaState.selectedImages.length === 0) return;

    setMediaState(prev => ({ ...prev, uploadingImages: true, uploadError: "" }));
    const uploadedUrls = [];

    try {
      for (const file of mediaState.selectedImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `locations/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // Combina as URLs existentes com as novas
      const existingUrls = editedLocation.imagens ? editedLocation.imagens.split(',').filter(url => url) : [];
      const allUrls = [...existingUrls, ...uploadedUrls];

      setEditedLocation(prev => ({
        ...prev,
        imagens: allUrls.join(',')
      }));

      setMediaState(prev => ({
        ...prev,
        selectedImages: [],
        imageUrls: allUrls
      }));
    } catch (error) {
      console.error('Erro no upload:', error);
      setMediaState(prev => ({
        ...prev,
        uploadError: "Erro ao fazer upload das imagens. Tente novamente."
      }));
    } finally {
      setMediaState(prev => ({ ...prev, uploadingImages: false }));
    }
  };

  const removeImage = (index) => {
    const newImageUrls = mediaState.imageUrls.filter((_, i) => i !== index);
    setMediaState(prev => ({
      ...prev,
      imageUrls: newImageUrls
    }));
    setEditedLocation(prev => ({
      ...prev,
      imagens: newImageUrls.join(',')
    }));
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

            {/* Seção de Upload de Imagens */}
            <div className="space-y-4">
              <label className="block font-medium text-gray-800">
                Imagens
              </label>
              <div className="space-y-4">
                {/* Grid de imagens existentes */}
                {mediaState.imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {mediaState.imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload de novas imagens */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Adicionar Imagens</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                  {mediaState.selectedImages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUploadImages}
                      disabled={mediaState.uploadingImages}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                    >
                      {mediaState.uploadingImages ? "Enviando..." : "Enviar Imagens"}
                    </button>
                  )}
                </div>
                {mediaState.uploadError && (
                  <p className="text-red-500 text-sm">{mediaState.uploadError}</p>
                )}
              </div>
            </div>

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
    imagens: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditLocationPanel;