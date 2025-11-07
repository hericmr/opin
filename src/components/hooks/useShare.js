import { criarSlug } from '../../utils/slug';

export const useShare = (painelInfo) => {
  const gerarLinkCustomizado = () => {
    const slug = criarSlug(painelInfo?.titulo || "");
    const pathname = window.location.pathname;
    let basePath;

    if (pathname.includes('/mapa')) {
      basePath = pathname.split('?')[0];
    } else if (pathname.includes('/opin')) {
      basePath = '/opin/mapa';
    } else {
      basePath = '/mapa';
    }

    return `${window.location.origin}${basePath}?panel=${slug}`;
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