import { criarSlug } from '../../utils/slug';

export const useShare = (painelInfo) => {
  const gerarLinkCustomizado = () => {
    return (
      window.location.origin +
      window.location.pathname +
      "?panel=" +
      criarSlug(painelInfo.titulo)
    );
  };

  const copiarLink = async () => {
    const url = gerarLinkCustomizado();
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copiado!");
    } catch (err) {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      alert("Link copiado!");
    }
  };

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
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    }
  };

  return { gerarLinkCustomizado, copiarLink, compartilhar };
};