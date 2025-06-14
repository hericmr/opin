import { useState, useEffect } from "react";

const usePainelVisibility = (painelInfo) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  console.log("usePainelVisibility - painelInfo:", painelInfo);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    console.log("usePainelVisibility effect - painelInfo changed:", painelInfo);
    if (painelInfo) {
      console.log("Setting isVisible to true");
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      console.log("Setting isVisible to false");
      setIsVisible(false);
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [painelInfo]);

  console.log("usePainelVisibility - returning state:", { isVisible, isMobile });

  return { isVisible, isMobile };
};

export default usePainelVisibility;