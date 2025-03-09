import React, { useState } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { greenIcon } from "../CustomIcon";
import MapClickHandler from "../MapClickHandler";
import { opcoes, crosshairColorMap } from "./constants";

const AddLocationPanel = ({ newLocation, setNewLocation, onSave, onClose }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({}); // Estado para armazenar erros de validação

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
    if (!newLocation.titulo) newErrors.titulo = "Título é obrigatório.";
    if (!newLocation.latitude || !newLocation.longitude) newErrors.localizacao = "Localização é obrigatória.";
    if (!newLocation.descricao_detalhada) newErrors.descricao_detalhada = "Descrição detalhada é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
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

  return (
    <div className="fixed inset-50  left-0 right-0 z-50 p-4 text-black">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        {/* Cabeçalho */}
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
              value={newLocation.titulo || ""}
              onChange={(e) =>
                setNewLocation((prev) => ({
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
    {newLocation.latitude || "Não selecionado"},{" "}
    {newLocation.longitude || "Não selecionado"}
  </p>

  {/* Botão para obter a localização via GPS */}
  <button
    onClick={() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setNewLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
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
        newLocation.latitude && newLocation.longitude
          ? [newLocation.latitude, newLocation.longitude]
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
      {newLocation.latitude && newLocation.longitude && (
        <Marker position={[newLocation.latitude, newLocation.longitude]} icon={greenIcon} />
      )}
      <MapClickHandler setNewLocation={setNewLocation} />
    </MapContainer>
    <div
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 border-2 rounded-full pointer-events-none"
      style={{ borderColor: crosshairColorMap[newLocation.tipo] || "#D1D5DB" }}
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
                  {newLocation.tipo || "Selecione o tipo de marcador"}
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

          {/* Seções de Mídia */}
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

          {/* Links e Áudio */}
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
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Salvar
        </button>
      </div>

      {/* Mensagem de confirmação */}
      {showConfirmation && (
        <div className="text-green-600 text-sm mt-2 animate-fade-in">✔ Local salvo com sucesso!</div>
      )}
        </form>
      </div>
    </div>
  );
};

// Componentes auxiliares internos
const MediaSection = ({ type, preview, onUpload, onRemove }) => (
  <div>
    <label className="block font-medium" htmlFor={`${type}Upload`}>
      {type === 'image' ? 'Imagens' : 'Vídeo (YouTube URL)'}
    </label>
    {type === 'image' ? (
      <>
        <input
          id={`${type}Upload`}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onUpload}
          className="hidden"
        />
        <label
          htmlFor={`${type}Upload`}
          className="cursor-pointer flex items-center justify-center border rounded p-4 bg-gray-100 text-black"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
          ) : (
            <span>📷 Tirar Foto ou Escolher Imagem</span>
          )}
        </label>
      </>
    ) : (
      <>
        <input
          type="text"
          placeholder="Cole a URL do YouTube"
          className="w-full border rounded p-2 text-black"
          onChange={onUpload}
        />
        {preview && (
          <div className="mt-2">
            <iframe
              width="100%"
              height="200"
              src={preview}
              title="YouTube Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </>
    )}
    {preview && (
      <button
        type="button"
        onClick={onRemove}
        className="mt-2 text-red-500 hover:text-red-700"
      >
        Remover {type === 'image' ? 'Imagem' : 'Vídeo'}
      </button>
    )}
  </div>
);

const InputField = ({ label, id, type, value, onChange, placeholder }) => (
  <div>
    <label className="block font-medium" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      type={type}
      className="w-full border rounded p-2 text-black"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);



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