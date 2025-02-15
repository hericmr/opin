import React, { useRef, useEffect } from "react";
import slugify from "slugify";
import PainelHeader from "./PainelHeader";
import PainelMedia from "./PainelMedia";
import PainelDescricao from "./PainelDescricao";
import PainelLinks from "./PainelLinks";
import usePainelVisibility from "./usePainelVisibility";
import useAudio from "./useAudio";
import AudioButton from "./AudioButton";
import ShareButton from "./ShareButton";

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const painelRef = useRef(null);
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);

  // Função para gerar o link customizado
  const gerarLinkCustomizado = () => {
    return (
      window.location.origin +
      window.location.pathname +
      "?panel=" +
      slugify(painelInfo.titulo, { lower: true, remove: /[*+~.()'"!:@]/g })
    );
  };

  // Função para copiar o link
  const copiarLink = async () => {
    const url = gerarLinkCustomizado();
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copiado!");
    } catch (err) {
      // Fallback para navegadores que não suportam navigator.clipboard
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      alert("Link copiado (método alternativo)!");
    }
  };

  // Função para compartilhar em redes sociais
  const compartilhar = () => {
    const url = gerarLinkCustomizado();
    const texto = `Confira este painel: ${painelInfo.titulo}`;
    if (navigator.share) {
      navigator.share({
        title: painelInfo.titulo,
        text: texto,
        url: url,
      });
    } else {
      // Fallback para abrir uma nova janela com opções de compartilhamento
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          texto
        )}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    }
  };

  // Atualiza a URL no navegador sem recarregar a página
  useEffect(() => {
    if (painelInfo) {
      const url = gerarLinkCustomizado();
      window.history.pushState({}, "", url);
    }
  }, [painelInfo]);

  // Fechar o painel ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (painelRef.current && !painelRef.current.contains(event.target)) {
        closePainel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closePainel]);

  if (!painelInfo) return null;

  const navbarHeight = isMobile ? 62 : 0;
  const painelHeight = `calc(${isMobile ? "100vh" : "100vh"} - ${navbarHeight}px)`;

  return (
    <div
      ref={painelRef}
      role="dialog"
      aria-labelledby="painel-titulo"
      aria-describedby="painel-descricao"
      className={`fixed bottom-0 left-0 right-0 sm:left-auto sm:w-3/4 lg:w-[49%] bg-green-50 rounded-xl shadow-lg z-30 transform transition-transform duration-700 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{
        height: isMobile ? painelHeight : "auto",
        maxHeight: isMobile ? "96vh" : "92vh",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PainelHeader titulo={painelInfo.titulo} closePainel={closePainel} />
      <div className="p-6 overflow-y-auto flex-1">
        {painelInfo.audioUrl && (
          <AudioButton isAudioEnabled={isAudioEnabled} toggleAudio={toggleAudio} />
        )}

        <PainelMedia
          imagens={painelInfo.imagens}
          video={painelInfo.video}
          titulo={painelInfo.titulo}
          audioUrl={painelInfo.audioUrl}
        />
        <PainelDescricao descricao={painelInfo.descricao} />
        <PainelLinks links={painelInfo.links || []} />

        <div className="mt-4 text-center">
          <ShareButton onClick={copiarLink} onShare={compartilhar} />
        </div>
      </div>
    </div>
  );
};

export default PainelInformacoes;