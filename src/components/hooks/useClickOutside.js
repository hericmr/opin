import { useEffect } from "react";

export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Só fecha se o clique for no mapa (leaflet-container)
      let el = event.target;
      let isMap = false;
      while (el) {
        if (
          el.classList && el.classList.contains('leaflet-container')
        ) {
          isMap = true;
          break;
        }
        if (
          el.classList && el.classList.contains('ol-marker') ||
          el.getAttribute?.('data-marker') === 'true' ||
          el.getAttribute?.('data-map-marker') === 'true'
        ) {
          // Clique em marcador, não fecha
          return;
        }
        el = el.parentElement;
      }
      if (isMap && ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, handler]);
};