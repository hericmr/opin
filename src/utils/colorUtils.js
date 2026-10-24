export const getEdgeColor = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Pega pixel da coordenada 2, 2 (canto superior esquerdo)
        const px = ctx.getImageData(Math.min(2, img.width - 1), Math.min(2, img.height - 1), 1, 1).data;
        const rgb = `rgb(${px[0]}, ${px[1]}, ${px[2]})`;
        
        resolve({
           rgb,
           r: px[0],
           g: px[1],
           b: px[2]
        });
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};
