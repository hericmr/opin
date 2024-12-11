import React, { useEffect } from 'react';

const GPXComponent = ({ gpxUrl, updateGpxData }) => {
  useEffect(() => {
    if (gpxUrl) {
      fetch(gpxUrl)
        .then(response => response.text())
        .then(data => {
          // Usando DOMParser para lidar com o namespace
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");

          // Obtém todos os pontos da trilha, ignorando o namespace
          const trackPoints = Array.from(xmlDoc.getElementsByTagName('trkpt'));

          if (trackPoints.length === 0) {
            console.error("Nenhum ponto válido encontrado no GPX.");
          } else {
            const points = trackPoints.map((point) => {
              const lat = point.getAttribute('lat');
              const lon = point.getAttribute('lon');
              return { lat: parseFloat(lat), lon: parseFloat(lon) };
            });
            updateGpxData(points); // Passa os pontos para o componente pai
          }
        })
        .catch(err => {
          console.error("Erro ao carregar o arquivo GPX:", err);
        });
    }
  }, [gpxUrl, updateGpxData]);

  return null; // Não precisa renderizar nada
};

export default GPXComponent;
