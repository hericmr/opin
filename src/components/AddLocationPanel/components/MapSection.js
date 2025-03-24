import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { greenIcon, blueIcon, yellowIcon, redIcon, violetIcon, blackIcon, orangeIcon } from "../../CustomIcon";
import MapClickHandler from "../../MapClickHandler";
import { crosshairColorMap } from "../constants";
import { Loader2, Upload, X, Mic, Square, Play, Pause } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

// Componentes reutilizáveis
const LoadingSpinner = () => <Loader2 className="w-4 h-4 animate-spin" />;

const ErrorMessage = ({ message }) => (
  message ? <p className="text-red-500 text-sm mt-2">{message}</p> : null
);

const MapSection = ({ newLocation, setNewLocation, error }) => {
  // Estados agrupados por funcionalidade
  const [locationState, setLocationState] = useState({
    isGettingLocation: false,
    error: ""
  });

  const [mediaState, setMediaState] = useState({
    selectedImages: [],
    imageUrls: [],
    uploadingImages: false,
    uploadError: "",
  });

  const [audioState, setAudioState] = useState({
    isRecording: false,
    audioBlob: null,
    isPlaying: false,
    uploadingAudio: false
  });

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  // Estilos comuns
  const buttonBaseStyles = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors";
  const primaryButtonStyles = `${buttonBaseStyles} bg-blue-500 text-white hover:bg-blue-600`;
  const dangerButtonStyles = `${buttonBaseStyles} bg-red-500 text-white hover:bg-red-600`;
  const successButtonStyles = `${buttonBaseStyles} bg-green-500 text-white hover:bg-green-600`;
  const disabledButtonStyles = `${buttonBaseStyles} bg-gray-400 cursor-not-allowed text-white`;

  const getIconByType = (tipo) => {
    const iconMap = {
      assistencia: greenIcon,
      lazer: blueIcon,
      historico: yellowIcon,
      comunidades: redIcon,
      educação: violetIcon,
      religiao: blackIcon,
      bairro: orangeIcon
    };
    return iconMap[tipo?.toLowerCase()] || greenIcon;
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({ ...prev, error: "Geolocalização não é suportada pelo seu navegador." }));
      return;
    }

    setLocationState(prev => ({ ...prev, isGettingLocation: true, error: "" }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setNewLocation(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationState(prev => ({ ...prev, isGettingLocation: false }));
      },
      (error) => {
        const errorMessages = {
          1: "Permissão para acessar a localização foi negada.",
          2: "Informação de localização não está disponível.",
          3: "Tempo esgotado ao tentar obter localização.",
        };
        setLocationState(prev => ({
          ...prev,
          error: errorMessages[error.code] || "Erro ao obter localização.",
          isGettingLocation: false
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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

      setNewLocation(prev => ({
        ...prev,
        imagens: uploadedUrls.join(',')
      }));

      setMediaState(prev => ({
        ...prev,
        selectedImages: [],
        imageUrls: []
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
    setMediaState(prev => ({
      ...prev,
      selectedImages: prev.selectedImages.filter((_, i) => i !== index),
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  // Funções de áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioState(prev => ({ ...prev, audioBlob }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setAudioState(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      setMediaState(prev => ({
        ...prev,
        uploadError: "Erro ao acessar o microfone. Verifique as permissões."
      }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && audioState.isRecording) {
      mediaRecorderRef.current.stop();
      setAudioState(prev => ({ ...prev, isRecording: false }));
    }
  };

  const handleAudioPlayback = () => {
    if (!audioState.audioBlob) return;

    if (audioState.isPlaying) {
      audioPlayerRef.current?.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    } else {
      const audioUrl = URL.createObjectURL(audioState.audioBlob);
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const handleUploadAudio = async () => {
    if (!audioState.audioBlob) return;

    setAudioState(prev => ({ ...prev, uploadingAudio: true }));
    setMediaState(prev => ({ ...prev, uploadError: "" }));

    try {
      const fileName = `audio_${Math.random().toString(36).substring(2)}.wav`;
      const filePath = `audios/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, audioState.audioBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setNewLocation(prev => ({
        ...prev,
        audio: publicUrl
      }));

      setAudioState(prev => ({ ...prev, audioBlob: null }));
    } catch (error) {
      console.error('Erro no upload do áudio:', error);
      setMediaState(prev => ({
        ...prev,
        uploadError: "Erro ao fazer upload do áudio. Tente novamente."
      }));
    } finally {
      setAudioState(prev => ({ ...prev, uploadingAudio: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Seção do Mapa */}
      <section>
        <label className="block font-medium" htmlFor="mapLocation">
          Localização <span className="text-red-500">*</span>
        </label>
        <ErrorMessage message={error || locationState.error} />
        <p className="mb-2">
          {newLocation.latitude || "Não selecionado"},{" "}
          {newLocation.longitude || "Não selecionado"}
        </p>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={locationState.isGettingLocation}
          className={locationState.isGettingLocation ? disabledButtonStyles : primaryButtonStyles}
        >
          {locationState.isGettingLocation ? (
            <>
              <LoadingSpinner />
              <span>Obtendo localização...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Usar minha localização</span>
            </>
          )}
        </button>

        <div className="relative mt-2">
          <MapContainer
            center={
              newLocation.latitude && newLocation.longitude
                ? [newLocation.latitude, newLocation.longitude]
                : [-23.976769, -46.332818]
            }
            zoom={10}
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
                icon={getIconByType(newLocation.tipo)} 
              />
            )}
            <MapClickHandler setNewLocation={setNewLocation} />
          </MapContainer>
          <div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 border-2 rounded-full pointer-events-none"
            style={{ borderColor: crosshairColorMap[newLocation.tipo] || "#D1D5DB" }}
          />
        </div>
      </section>

      {/* Seção de Imagens */}
      <section className="border-t pt-4">
        <label className="block font-medium mb-2">
          Imagens
          <span className="text-sm text-gray-500 ml-2">(JPG/PNG até 5MB)</span>
        </label>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {mediaState.imageUrls.map((url, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex-1">
            <input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
              <Upload size={20} />
              <span>Galeria</span>
            </div>
          </label>

          <label className="flex-1">
            <input
              type="file"
              accept="image/jpeg,image/png"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
              <span>Câmera</span>
            </div>
          </label>
        </div>

        {mediaState.selectedImages.length > 0 && (
          <button
            type="button"
            onClick={handleUploadImages}
            disabled={mediaState.uploadingImages}
            className={`w-full mt-2 ${mediaState.uploadingImages ? disabledButtonStyles : successButtonStyles}`}
          >
            {mediaState.uploadingImages ? (
              <>
                <LoadingSpinner />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>
                  Fazer Upload ({mediaState.selectedImages.length} {mediaState.selectedImages.length === 1 ? 'imagem' : 'imagens'})
                </span>
              </>
            )}
          </button>
        )}
      </section>

      {/* Seção de Áudio */}
      <section className="border-t pt-4">
        <label className="block font-medium mb-2">
          Gravar Áudio da Descrição
          <span className="text-sm text-gray-500 ml-2">(Para acessibilidade)</span>
        </label>

        <div className="flex flex-col gap-2">
          {!audioState.isRecording && !audioState.audioBlob && (
            <button
              type="button"
              onClick={startRecording}
              className={dangerButtonStyles}
            >
              <Mic size={20} />
              <span>Gravar Áudio</span>
            </button>
          )}

          {audioState.isRecording && (
            <button
              type="button"
              onClick={stopRecording}
              className={`${dangerButtonStyles} animate-pulse`}
            >
              <Square size={20} />
              <span>Parar Gravação</span>
            </button>
          )}

          {audioState.audioBlob && !audioState.isRecording && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAudioPlayback}
                className={primaryButtonStyles}
              >
                {audioState.isPlaying ? <Pause size={20} /> : <Play size={20} />}
                <span>{audioState.isPlaying ? 'Pausar' : 'Ouvir'}</span>
              </button>

              <button
                type="button"
                onClick={handleUploadAudio}
                disabled={audioState.uploadingAudio}
                className={audioState.uploadingAudio ? disabledButtonStyles : successButtonStyles}
              >
                {audioState.uploadingAudio ? (
                  <>
                    <LoadingSpinner />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Salvar Áudio</span>
                  </>
                )}
              </button>

              {!audioState.uploadingAudio && (
                <button
                  type="button"
                  onClick={() => setAudioState(prev => ({ ...prev, audioBlob: null }))}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          <audio ref={audioPlayerRef} onEnded={() => setAudioState(prev => ({ ...prev, isPlaying: false }))} className="hidden" />

          {audioState.isRecording && (
            <p className="text-sm text-red-500 animate-pulse">
              Gravando... Clique em "Parar Gravação" quando terminar.
            </p>
          )}
        </div>
      </section>

      <ErrorMessage message={mediaState.uploadError} />
    </div>
  );
};

MapSection.propTypes = {
  newLocation: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tipo: PropTypes.string,
  }).isRequired,
  setNewLocation: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default MapSection; 