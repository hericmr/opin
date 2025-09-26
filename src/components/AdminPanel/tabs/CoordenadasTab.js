import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Icon } from 'ol/style';
import 'ol/ol.css';

// Caminho para o marcador SVG
const MARKER_SVG_PATH = `${process.env.PUBLIC_URL || ''}/map-marker.svg`;

const CoordenadasTab = ({ editingLocation, setEditingLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Função para atualizar o mapa quando as coordenadas mudam
  const updateMap = (lat, lng) => {
    if (!mapInstanceRef.current) return;

    const view = mapInstanceRef.current.getView();
    
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      const coordinates = fromLonLat([parseFloat(lng), parseFloat(lat)]);
      
      // Atualizar o centro do mapa
      view.setCenter(coordinates);
      view.setZoom(15);

      // Atualizar ou criar o marcador
      const vectorSource = mapInstanceRef.current.getLayers().getArray()
        .find(layer => layer instanceof VectorLayer)?.getSource();

      if (vectorSource) {
        // Remover marcador anterior
        if (markerRef.current) {
          vectorSource.removeFeature(markerRef.current);
        }

        // Criar novo marcador
        const marker = new Feature({
          geometry: new Point(coordinates)
        });

        marker.setStyle(new Style({
          image: new Icon({
            src: MARKER_SVG_PATH,
            scale: 0.6,
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            color: '#fbbf24'
          })
        }));

        vectorSource.addFeature(marker);
        markerRef.current = marker;
      }
    }
  };

  // Função para atualizar coordenadas quando o mapa é clicado
  const handleMapClick = (event) => {
    const coordinates = toLonLat(event.coordinate);
    const [lng, lat] = coordinates;
    
    setEditingLocation({
      ...editingLocation,
      'latitude': lat.toFixed(6),
      'longitude': lng.toFixed(6)
    });
  };

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current) return;

    // Criar mapa
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        }),
        new VectorLayer({
          source: new VectorSource()
        })
      ],
      view: new View({
        center: fromLonLat([-46.6388, -23.5489]), // São Paulo
        zoom: 8
      })
    });

    mapInstanceRef.current = map;

    // Adicionar evento de clique
    map.on('click', handleMapClick);

    // Atualizar mapa com coordenadas iniciais
    const lat = editingLocation['Latitude'];
    const lng = editingLocation['Longitude'];
    if (lat && lng) {
      updateMap(lat, lng);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
      }
    };
  }, []);

  // Atualizar mapa quando coordenadas mudam
  useEffect(() => {
    const lat = editingLocation['Latitude'];
    const lng = editingLocation['Longitude'];
    updateMap(lat, lng);
  }, [editingLocation['Latitude'], editingLocation['Longitude']]);

  return (
    <div className="space-y-6">
      {/* Campos de Coordenadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latitude */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
            value={editingLocation['Latitude'] || ''}
            onChange={e => setEditingLocation({ ...editingLocation, 'Latitude': e.target.value })}
            placeholder="Ex: -23.5489"
          />
          <p className="text-xs text-gray-400 mt-1">
            Valor entre -90 e 90 (ex: -23.5489 para São Paulo)
          </p>
        </div>

        {/* Longitude */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
            value={editingLocation['Longitude'] || ''}
            onChange={e => setEditingLocation({ ...editingLocation, 'Longitude': e.target.value })}
            placeholder="Ex: -46.6388"
          />
          <p className="text-xs text-gray-400 mt-1">
            Valor entre -180 e 180 (ex: -46.6388 para São Paulo)
          </p>
        </div>
      </div>

      {/* Mapa */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Mapa - Clique para definir a localização
        </label>
        <div 
          ref={mapRef}
          className="w-full h-64 border border-gray-700 rounded-lg bg-gray-800"
          style={{ minHeight: '256px' }}
        />
        <p className="text-xs text-gray-400 mt-1">
          Clique no mapa para definir as coordenadas automaticamente
        </p>
      </div>

      {/* Informações sobre Coordenadas */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-600 pb-2">
          Como Usar as Coordenadas
        </h3>
        
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <strong className="text-amber-400">Método 1 - Digite manualmente:</strong>
            <p>Digite as coordenadas nos campos acima. Use ponto decimal (ex: -23.5489).</p>
          </div>
          
          <div>
            <strong className="text-amber-400">Método 2 - Clique no mapa:</strong>
            <p>Clique no mapa para definir automaticamente as coordenadas da localização.</p>
          </div>
          
          <div>
            <strong className="text-amber-400">Formato das coordenadas:</strong>
            <p>Latitude: -90 a +90 | Longitude: -180 a +180</p>
          </div>
          
          <div>
            <strong className="text-amber-400">Exemplos para São Paulo:</strong>
            <p>Latitude: -23.5489 | Longitude: -46.6388</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordenadasTab; 