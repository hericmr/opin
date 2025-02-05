import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useLocation } from "react-router-dom";

const PainelHeader = ({ titulo, closePainel }) => (
  <div className="relative p-6 border-b border-gray-100">
    <h2 className="text-2xl lg:text-3xl font-extrabold tracking-wide text-green-800 text-center">
      {titulo}
    </h2>
    <button
      onClick={closePainel}
      className="absolute top-4 right-4 text-gray-900 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full text-xl"
      aria-label="Fechar painel"
    >
      ✖
    </button>
  </div>
);

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

const PainelDescricao = ({ descricao }) => {
  const isHTML = (str) => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.body.innerHTML !== str;
  };

  return (
    descricao && (
      <div className="mb-6">
        {isHTML(descricao) ? (
          <div className="prose prose-sm sm:prose lg:prose-lg text-gray-800" dangerouslySetInnerHTML={{ __html: descricao }} />
        ) : (
          <ReactMarkdown className="prose prose-sm sm:prose lg:prose-lg text-gray-800">
            {descricao}
          </ReactMarkdown>
        )}
      </div>
    )
  );
};

const PainelLinks = ({ links }) => (
  links?.length > 0 && (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Referências:</h3>
      <ul className="list-disc pl-6 space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-800 hover:underline">
              {link.texto}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
);

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (painelInfo) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";

      const baseText = painelInfo.desc || painelInfo.titulo || "painel";
      const snakeCaseDesc = baseText
        .normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "")
        .toLowerCase();

      if (snakeCaseDesc) {
        navigate(`/cartografiasocial/${snakeCaseDesc}`, { replace: true });
      }
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [painelInfo, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const painelParam = params.get("painel");
    if (painelParam && painelInfo?.titulo) {
      setIsVisible(true);
    }
  }, [location.search, painelInfo]);

  const handleClose = () => {
    navigate(".", { replace: true });
    closePainel();
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiado!");
  };

  if (!painelInfo) return null;

  return (
    <div
      className={`fixed top-20 right-2 left-2 sm:left-auto sm:w-3/4 lg:w-[49%] bg-green-50 rounded-xl shadow-lg z-30 transform transition-transform duration-700 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{ 
        maxHeight: isMobile ? "89vh" : "90vh", 
        height: "auto", 
        transition: "opacity 0.7s ease, transform 0.7s ease", 
        display: "flex", 
        flexDirection: "column" 
      }}
    >
      <PainelHeader titulo={painelInfo.titulo} closePainel={handleClose} />
      <div className="p-6 overflow-y-auto flex-1">
        <PainelMedia imagens={painelInfo.imagens} video={painelInfo.video} titulo={painelInfo.titulo} />
        <PainelDescricao descricao={painelInfo.descricao} />
        <PainelLinks links={painelInfo.links} />

        <div className="mt-4 text-center">
          <button
            onClick={copiarLink}
            className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-500"
          >
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PainelInformacoes;
