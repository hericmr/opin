import React, { useState } from "react";

const PainelMedia = ({ imagens = [], video, titulo, descricao_detalhada }) => {
  const [zoomedImage, setZoomedImage] = useState(null);

  const renderizarImagens = () => {
    if (imagens.length === 1) {
      // Versão melhorada para uma única imagem: centralizada com largura adequada
      return (
        <div className="flex justify-center">
          <img
            src={imagens[0]}
            alt={`${titulo} - 1`}
            className="max-w-full max-h-96 object-contain rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
            onClick={() => setZoomedImage(imagens[0])}
          />
        </div>
      );
    } else if (imagens.length === 2) {
      // Se houver duas imagens, exibir em um grid de 2 colunas
      return (
        <div className="grid grid-cols-2 gap-4">
          {imagens.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${titulo} - ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
              onClick={() => setZoomedImage(img)}
            />
          ))}
        </div>
      );
    } else {
      // Se houver mais de duas imagens, exibir em um grid de 3 colunas
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imagens.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${titulo} - ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
              onClick={() => setZoomedImage(img)}
            />
          ))}
        </div>
      );
    }
  };

  // Melhorado o modal de zoom com botão de fechar e animação suave
  const renderZoomedImage = () => {
    if (!zoomedImage) return null;
    
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50"
        onClick={() => setZoomedImage(null)}
      >
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <img
            src={zoomedImage}
            alt="Imagem ampliada"
            className="max-w-full max-h-screen object-contain rounded-lg shadow-lg transition-all duration-500 ease-in-out"
          />
          <button
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
            onClick={() => setZoomedImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
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
      
      {renderZoomedImage()}

      {descricao_detalhada && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Descrição Detalhada</h2>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: descricao_detalhada }}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(PainelMedia);