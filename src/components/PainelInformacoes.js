import React, { useState, useEffect } from "react";

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (painelInfo) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [painelInfo]);

  if (!painelInfo) return null;

  return (
    <div
      className={`fixed top-20 right-2 left-2 sm:left-auto sm:w-3/4 lg:w-[49%] bg-green-50 rounded-xl shadow-lg z-30 transform transition-transform duration-700 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{
        maxHeight: "90vh", // Mantém um limite máximo para evitar ultrapassar a tela
        height: "auto", // Ajusta a altura conforme o conteúdo
        transition: "opacity 0.7s ease, transform 0.7s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        onClick={() => {
          closePainel();
          document.body.style.overflow = "";
        }}
        className="absolute top-4 right-4 text-gray-900 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full text-xl"
        aria-label="Fechar painel"
      >
        ✕
      </button>

      {/* Conteúdo interno com rolagem */}
      <div className="p-6 overflow-y-auto flex-1">
        <h2 className="text-2xl lg:text-3xl font-extrabold tracking-wide text-green-800 mb-6 text-center lg:text-left">
          {painelInfo.titulo}
        </h2>

        {painelInfo.imagens?.length > 0 && (
          <div className="mb-6">
            {painelInfo.imagens.map((img, index) => (
              <div key={index} className="mb-4">
                <img
                  src={img}
                  alt={`${painelInfo.titulo} - ${index + 1}`}
                  className="w-full max-h-96 object-contain "
                />
              </div>
            ))}
          </div>
        )}

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

        {painelInfo.descricao && (
          <div className="prose prose-sm sm:prose lg:prose-lg text-gray-800 mb-6">
            <p
              className="text-base lg:text-lg leading-relaxed text-gray-700 text-center lg:text-left"
              dangerouslySetInnerHTML={{ __html: painelInfo.descricao }}
            ></p>
          </div>
        )}

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