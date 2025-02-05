import React from "react";

// Este componente exibe imagens e vídeos no painel ainda precisa de ajustes na largura do video

const PainelMedia = ({ imagens, video, titulo }) => (
  <div className="mb-6">
    {imagens?.length > 0 &&
      imagens.map((img, index) => (
        <div key={index} className="mb-4">
          <img src={img} alt={`${titulo} - ${index + 1}`} className="w-full max-h-96 object-contain" />
        </div>
      ))}
    {video && (
      <div className="mb-6">
        <iframe
          className="w-full h-80 rounded-lg shadow-md"
          src={video}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={titulo}
        ></iframe>
      </div>
    )}
  </div>
);

export default PainelMedia;