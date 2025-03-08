import React, { useState } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { greenIcon } from "./CustomIcon"; // Importe o seu greenIcon

// Componente para capturar cliques no mapa e atualizar a localização
const MapClickHandler = ({ setNewLocation }) => {
  useMapEvents({
    click(e) {
      setNewLocation((prev) => ({
        ...prev,
        latitude: e.latlng.lat.toFixed(6),
        longitude: e.latlng.lng.toFixed(6),
      }));
    },
  });
  return null;
};

MapClickHandler.propTypes = {
  setNewLocation: PropTypes.func.isRequired,
};

const AddLocationPanel = ({ newLocation, setNewLocation, onSave, onClose }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Array de opções para seleção do tipo de marcador
  const opcoes = [
    {
      acao: "toggleBairros",
      estado: "bairros",
      icone: "🏘",
      label: "Bairros",
      value: "bairro",
      cor: "bg-gray-200",
    },
    {
      acao: "toggleAssistencia",
      estado: "assistencia",
      icone:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
      label: "Assistência",
      value: "assistencia",
      cor: "bg-green-500 text-black",
    },
    {
      acao: "toggleHistoricos",
      estado: "historicos",
      icone:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
      label: "Históricos",
      value: "historico",
      cor: "bg-yellow-300",
    },
    {
      acao: "toggleCulturais",
      estado: "culturais",
      icone:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
      label: "Lazer",
      value: "lazer",
      cor: "bg-blue-400",
    },
    {
      acao: "toggleComunidades",
      estado: "comunidades",
      icone:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      label: "Comunidades",
      value: "comunidades",
      cor: "bg-red-500",
    },
    {
      acao: "toggleEducação",
      estado: "educação",
      icone:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
      label: "Educação",
      value: "educação",
      cor: "bg-purple-400",
    },
    {
      acao: "toggleReligiao",
      estado: "religiao",
      icone:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png",
      label: "Religião",
      value: "religiao",
      cor: "bg-gray-400",
    },
  ];

  // Mapeamento de tipo para cor em hexadecimal (para o crosshair)
  const crosshairColorMap = {
    bairro: "#E5E7EB",       // cor equivalente ao bg-gray-200
    assistencia: "#10B981",   // cor equivalente ao bg-green-500
    historico: "#FACC15",     // cor equivalente ao bg-yellow-300
    lazer: "#60A5FA",         // cor equivalente ao bg-blue-400
    comunidades: "#EF4444",   // cor equivalente ao bg-red-500
    educação: "#A78BFA",      // cor equivalente ao bg-purple-400
    religiao: "#9CA3AF",      // cor equivalente ao bg-gray-400
  };

  // Handlers para upload de imagens e vídeos
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 p-4 text-black">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Adicionar um Novo Local</h2>
          <button
            onClick={onClose}
            className="text-black hover:text-black text-lg"
            aria-label="Fechar painel"
          >
            ✖
          </button>
        </div>

        {/* Formulário principal */}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {/* Seção de Localização e Mapa com Crosshair */}
          <div>
            <label className="block font-medium" htmlFor="mapLocation">
              Localização <span className="text-red-500">*</span>
            </label>
            <p className="mb-2">
              {newLocation.latitude || "Não selecionado"},{" "}
              {newLocation.longitude || "Não selecionado"}
            </p>
            <div id="mapLocation" className="relative">
              <MapContainer
                center={[-23.98, -46.36]}
                zoom={13}
                style={{
                  height: "200px",
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {newLocation.latitude && newLocation.longitude && (
                  <Marker
                    position={[newLocation.latitude, newLocation.longitude]}
                    icon={greenIcon}
                  />
                )}
                <MapClickHandler setNewLocation={setNewLocation} />
              </MapContainer>
              {/* Crosshair central com cor dinâmica (usando inline style) */}
              <div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 border-2 rounded-full pointer-events-none"
                style={{ borderColor: crosshairColorMap[newLocation.tipo] || "#D1D5DB" }}
              ></div>
            </div>
          </div>

          {/* Seção de Seleção do Tipo de Marcador (Dropdown expansível) */}
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
                  {newLocation.titulo || "Selecione o tipo de marcador"}
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
                        setNewLocation((prev) => ({
                          ...prev,
                          tipo: opcao.value,
                          titulo: opcao.label,
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

          {/* Seção de Descrição Detalhada */}
          <div>
            <label className="block font-medium" htmlFor="descricao_detalhada">
              Descrição Detalhada <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descricao_detalhada"
              className="w-full border rounded p-2 text-black"
              placeholder="Digite uma descrição detalhada"
              value={newLocation.descricao_detalhada || ""}
              required
              onChange={(e) =>
                setNewLocation((prev) => ({
                  ...prev,
                  descricao_detalhada: e.target.value,
                }))
              }
            />
          </div>

          {/* Seção de Upload de Imagem */}
          <div>
            <label className="block font-medium" htmlFor="imageUpload">
              Imagens
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer flex items-center justify-center border rounded p-4 bg-gray-100 text-black"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview da imagem selecionada"
                  className="w-32 h-32 object-cover rounded"
                />
              ) : (
                <span>📷 Tirar Foto ou Escolher Imagem</span>
              )}
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Remover Imagem
              </button>
            )}
          </div>

          {/* Seção de Upload de Vídeo */}
          <div>
            <label className="block font-medium" htmlFor="videoUpload">
              Vídeo
            </label>
            <input
              id="videoUpload"
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <label
              htmlFor="videoUpload"
              className="cursor-pointer flex items-center justify-center border rounded p-4 bg-gray-100 text-black"
            >
              {videoPreview ? (
                <video
                  src={videoPreview}
                  controls
                  className="w-32 h-32 object-cover rounded"
                />
              ) : (
                <span>🎥 Escolher Vídeo</span>
              )}
            </label>
            {videoPreview && (
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Remover Vídeo
              </button>
            )}
          </div>

          {/* Seção de Links */}
          <div>
            <label className="block font-medium" htmlFor="links">
              Links
            </label>
            <input
              id="links"
              type="url"
              className="w-full border rounded p-2 text-black"
              placeholder="Cole um link aqui (http://...)"
              value={newLocation.links || ""}
              onChange={(e) =>
                setNewLocation((prev) => ({ ...prev, links: e.target.value }))
              }
            />
          </div>

          {/* Seção de Áudio */}
          <div>
            <label className="block font-medium" htmlFor="audio">
              Áudio
            </label>
            <input
              id="audio"
              type="url"
              className="w-full border rounded p-2 text-black"
              placeholder="http://"
              value={newLocation.audio || ""}
              onChange={(e) =>
                setNewLocation((prev) => ({ ...prev, audio: e.target.value }))
              }
            />
          </div>

          {/* Botões de Ação */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Salvar
            </button>
          </div>
        </form>
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
};

export default AddLocationPanel;
