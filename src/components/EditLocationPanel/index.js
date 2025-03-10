import React, { useState } from "react";
import PropTypes from "prop-types";
import { supabase } from '../../supabaseClient';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { greenIcon } from "../CustomIcon";
import MapClickHandler from "../MapClickHandler";
import { opcoes, crosshairColorMap } from "../AddLocationPanel/constants";

const EditLocationPanel = ({ location, onClose, onSave }) => {
  const [editedLocation, setEditedLocation] = useState({
    ...location,
    latitude: location.localizacao ? location.localizacao.split(',')[0] : '',
    longitude: location.localizacao ? location.localizacao.split(',')[1] : '',
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Handlers de mídia
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

  // Validação dos campos obrigatórios
  const validateForm = () => {
    const newErrors = {};
    if (!editedLocation.titulo) newErrors.titulo = "Título é obrigatório.";
    if (!editedLocation.latitude || !editedLocation.longitude) newErrors.localizacao = "Localização é obrigatória.";
    if (!editedLocation.descricao_detalhada) newErrors.descricao_detalhada = "Descrição detalhada é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const locationData = {
        titulo: editedLocation.titulo,
        tipo: editedLocation.tipo,
        descricao_detalhada: editedLocation.descricao_detalhada,
        localizacao: `${editedLocation.latitude},${editedLocation.longitude}`,
        links: editedLocation.links || null,
        audio: editedLocation.audio || null,
      };

      const { data, error: supabaseError } = await supabase
        .from('locations')
        .update(locationData)
        .eq('id', location.id)
        .select();

      if (supabaseError) throw new Error(supabaseError.message);

      console.log("Local atualizado com sucesso:", data);
      setShowConfirmation(true);
      setTimeout(() => {
        onSave();
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Erro ao atualizar local:", err);
      setErrors({ submit: "Erro ao atualizar o local. Por favor, tente novamente." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 top-[46px] z-50 p-4 text-black bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full md:max-w-lg mx-auto my-4 p-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Editar Local</h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-700 text-lg"
            aria-label="Fechar painel"
          >
            ✖
          </button>
        </div>

        {/* Formulário principal */}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {/* Campo Título */}
          <div>
            <label className="block font-medium" htmlFor="titulo">
              Título <span className="text-red-500">*</span>
            </label>
            {errors.titulo && (
              <p className="text-red-500 text-sm">{errors.titulo}</p>
            )}
            <input
              id="titulo"
              type="text"
              className="w-full border rounded p-2 text-black"
              placeholder="Digite o título do local"
              value={editedLocation.titulo || ""}
              onChange={(e) =>
                setEditedLocation((prev) => ({
                  ...prev,
                  titulo: e.target.value,
                }))
              }
            />
          </div>

          {/* Seção de Mapa */}
          <div>
            <label className="block font-medium" htmlFor="mapLocation">
              Localização <span className="text-red-500">*</span>
            </label>
            {errors.localizacao && (
              <p className="text-red-500 text-sm">{errors.localizacao}</p>
            )}
            <p className="mb-2">
              {editedLocation.latitude || "Não selecionado"},{" "}
              {editedLocation.longitude || "Não selecionado"}
            </p>

            <button
              type="button"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setEditedLocation(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString(),
                      }));
                    },
                    (error) => {
                      console.error("Erro ao obter localização:", error);
                      alert("Não foi possível obter sua localização.");
                    }
                  );
                } else {
                  alert("Geolocalização não é suportada pelo seu navegador.");
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
            >
              Usar minha localização
            </button>

            <div id="mapLocation" className="relative">
              <MapContainer
                center={
                  editedLocation.latitude && editedLocation.longitude
                    ? [parseFloat(editedLocation.latitude), parseFloat(editedLocation.longitude)]
                    : [-23.976769, -46.332818]
                }
                zoom={11}
                style={{
                  height: "200px",
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {editedLocation.latitude && editedLocation.longitude && (
                  <Marker
                    position={[parseFloat(editedLocation.latitude), parseFloat(editedLocation.longitude)]}
                    icon={greenIcon}
                  />
                )}
                <MapClickHandler
                  setNewLocation={(newLoc) =>
                    setEditedLocation((prev) => ({
                      ...prev,
                      latitude: newLoc.latitude,
                      longitude: newLoc.longitude,
                    }))
                  }
                />
              </MapContainer>
              <div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 border-2 rounded-full pointer-events-none"
                style={{ borderColor: crosshairColorMap[editedLocation.tipo] || "#D1D5DB" }}
              ></div>
            </div>
          </div>

          {/* Dropdown de Tipo de Marcador */}
          <div>
            <label className="block font-medium">
              Tipo de Marcador <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full border rounded p-2 flex items-center justify-between text-black"
              >
                <span>
                  {editedLocation.tipo || "Selecione o tipo de marcador"}
                </span>
                <svg
                  className="w-4 h-4 text-black"
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
                <div className="absolute mt-1 w-full bg-white border rounded shadow-lg z-10">
                  {opcoes.map((opcao, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setEditedLocation((prev) => ({
                          ...prev,
                          tipo: opcao.value,
                        }));
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 hover:bg-gray-100 flex items-center ${opcao.cor} text-black`}
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

          {/* Descrição Detalhada */}
          <div>
            <label className="block font-medium" htmlFor="descricao_detalhada">
              Descrição Detalhada <span className="text-red-500">*</span>
            </label>
            {errors.descricao_detalhada && (
              <p className="text-red-500 text-sm">{errors.descricao_detalhada}</p>
            )}
            <textarea
              id="descricao_detalhada"
              className="w-full border rounded p-2 text-black"
              placeholder="Digite uma descrição detalhada"
              value={editedLocation.descricao_detalhada || ""}
              onChange={(e) =>
                setEditedLocation((prev) => ({
                  ...prev,
                  descricao_detalhada: e.target.value,
                }))
              }
            />
          </div>

          {/* Links e Áudio */}
          <div>
            <label className="block font-medium" htmlFor="links">
              Links
            </label>
            <input
              id="links"
              type="url"
              className="w-full border rounded p-2 text-black"
              placeholder="Cole um link aqui (http://...)"
              value={editedLocation.links || ""}
              onChange={(e) =>
                setEditedLocation((prev) => ({
                  ...prev,
                  links: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block font-medium" htmlFor="audio">
              Áudio
            </label>
            <input
              id="audio"
              type="url"
              className="w-full border rounded p-2 text-black"
              placeholder="http://"
              value={editedLocation.audio || ""}
              onChange={(e) =>
                setEditedLocation((prev) => ({
                  ...prev,
                  audio: e.target.value,
                }))
              }
            />
          </div>

          {/* Botões de Ação */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
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
            <div className="text-green-600 text-sm mt-2 animate-fade-in">
              ✔ Local atualizado com sucesso!
            </div>
          )}
        </form>
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
    audio: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditLocationPanel; 