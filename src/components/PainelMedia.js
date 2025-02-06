import React, { useState } from "react";

const PainelMedia = ({ imagens = [], video, titulo }) => {
  const [zoomedImage, setZoomedImage] = useState(null);

  const renderizarImagens = () => {
    if (imagens.length === 1) {
      // Se houver apenas uma imagem, ela ocupa toda a largura com altura máxima de 96 (384px)
      return (
        <img
          src={imagens[0]}
          alt={`${titulo} - 1`}
          className="w-full max-h-96 object-contain rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
          onClick={() => setZoomedImage(imagens[0])}
        />
      );
    } else {
      // Se houver múltiplas imagens, elas são exibidas em uma grade organizada
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imagens.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${titulo} - ${index + 1}`}
              className="w-full object-contain rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
              onClick={() => setZoomedImage(img)}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="mb-6">
      {imagens.length > 0 && <div className="mb-4">{renderizarImagens()}</div>}
      
      {video && (
        <div className="mb-6 flex justify-center">
          <iframe
            className="w-full md:w-3/4 h-80 rounded-lg shadow-md"
            src={video}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={titulo}
          ></iframe>
        </div>
      )}
      
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="max-w-full max-h-full rounded-lg shadow-lg transition-transform duration-500 ease-in-out scale-105"
          />
        </div>
      )}
    </div>
  );
};

export default PainelMedia;
