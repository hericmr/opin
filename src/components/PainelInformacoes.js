import React, { useState, useEffect } from "react";

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (painelInfo) {
      setIsVisible(true); // Ativa a animação ao abrir o painel
    } else {
      setIsVisible(false); // Desativa a animação ao fechar
    }
  }, [painelInfo]);

  if (!painelInfo) return null;

  return (
    <div
      className={`absolute top-0 right-0 h-full w-full sm:w-3/4 lg:w-[45%] bg-green-50 rounded-xl shadow-lg z-20 overflow-y-auto transform transition-all duration-500 ease-in-out ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button
        onClick={closePainel}
        className="absolute top-4 right-4 text-gray-900 hover:text-gray-800"
        aria-label="Fechar painel"
      >
        &#10005;
      </button>
      <div className="p-6">
        <h2 className="text-2xl lg:text-3xl font-extrabold tracking-wide text-green-800 mb-6 text-center lg:text-left">
          {painelInfo.titulo}
        </h2>

        {/* Renderizar imagens */}
        {painelInfo.imagens && painelInfo.imagens.length > 0 && (
          <div className="mb-6">
            {painelInfo.imagens.map((img, index) => (
              <div key={index} className="mb-4">
                <img
                  src={img}
                  alt={`${painelInfo.titulo} - ${index + 1}`}
                  className="w-full max-h-96 object-contain rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        )}

        {/* Renderizar vídeo */}
        {painelInfo.video && (
          <div className="mb-6">
            <iframe
              className="w-full h-80 rounded-lg shadow-md"
              src={painelInfo.video}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={painelInfo.titulo}
            ></iframe>
          </div>
        )}

        {/* Renderizar descrição */}
        {painelInfo.descricao && (
          <div className="prose prose-sm sm:prose lg:prose-lg text-gray-800 mb-6">
            <p
              className="text-base lg:text-lg leading-relaxed text-gray-700 text-center lg:text-left"
              dangerouslySetInnerHTML={{ __html: painelInfo.descricao }}
            ></p>
          </div>
        )}

        {/* Renderizar links */}
        {painelInfo.links && painelInfo.links.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Referências:</h3>
            <ul className="list-disc pl-6 space-y-2">
              {painelInfo.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800 hover:text-blue-800 hover:underline"
                  >
                    {link.texto}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PainelInformacoes;
