import { useEffect } from "react";

export const useDynamicURL = (painelInfo, gerarLinkCustomizado) => {
  useEffect(() => {
    if (painelInfo) {
      const url = gerarLinkCustomizado();
      window.history.pushState({}, "", url);
    }
  }, [painelInfo, gerarLinkCustomizado]);
};