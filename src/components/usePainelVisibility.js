import { useState, useEffect } from "react";

const usePainelVisibility = (painelInfo, navigate) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return { isVisible, isMobile };
};

export default usePainelVisibility;