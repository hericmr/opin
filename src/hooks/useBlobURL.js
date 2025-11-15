import { useEffect, useRef, useState } from 'react';

/**
 * Hook para gerenciar criação e revogação de blob URLs
 * Compatível com React 19 Strict Mode (renderização dupla)
 * 
 * @param {File|null} file - Arquivo para criar blob URL
 * @returns {string|null} - Blob URL ou null se não houver arquivo
 */
export const useBlobURL = (file) => {
  const [blobURL, setBlobURL] = useState(null);
  const urlRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    // Se não há arquivo, limpar URL existente
    if (!file) {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
        setBlobURL(null);
      }
      fileRef.current = null;
      return;
    }

    // Se o arquivo mudou, revogar URL anterior e criar nova
    if (fileRef.current !== file) {
      // Revogar URL anterior se existir
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
      
      // Criar nova URL
      const url = URL.createObjectURL(file);
      urlRef.current = url;
      fileRef.current = file;
      setBlobURL(url);
    }

    // Cleanup: revogar URL quando componente desmonta ou file muda
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [file]); // Apenas file na dependência, não blobURL

  return blobURL;
};

export default useBlobURL;

