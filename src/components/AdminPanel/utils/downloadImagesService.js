import { supabase } from '../../../dbClient';
import logger from '../../../utils/logger';

export const downloadAllImages = async () => {
  try {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    const { data: imagens, error } = await supabase
      .storage
      .from('imagens')
      .list('', { limit: 1000, offset: 0 });

    if (error) {
      logger.error('Erro ao buscar imagens:', error);
      alert('Erro ao buscar imagens: ' + error.message);
      return;
    }

    if (!imagens || imagens.length === 0) {
      alert('Nenhuma imagem encontrada no bucket.');
      return;
    }

    const loadingEl = document.createElement('div');
    loadingEl.innerHTML = `
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
                  background:rgba(0,0,0,0.8);color:white;padding:20px;border-radius:10px;
                  z-index:9999;text-align:center;">
        <div style="margin-bottom:10px;">Preparando download...</div>
        <div id="dl-progress" style="font-size:12px;">Encontradas ${imagens.length} imagens</div>
      </div>
    `;
    document.body.appendChild(loadingEl);
    const progressEl = loadingEl.querySelector('#dl-progress');

    for (let i = 0; i < imagens.length; i++) {
      const imagem = imagens[i];
      try {
        const { data: imageData, error: downloadError } = await supabase
          .storage
          .from('imagens')
          .download(imagem.name);

        if (downloadError) {
          logger.error(`Erro ao baixar ${imagem.name}:`, downloadError);
          continue;
        }
        zip.file(imagem.name, imageData);
        if (progressEl) progressEl.textContent = `${i + 1} de ${imagens.length} imagens processadas`;
      } catch (err) {
        logger.error(`Erro ao processar ${imagem.name}:`, err);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-imagens-escolas-${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    document.body.removeChild(loadingEl);
    alert(`Download concluído! ${imagens.length} imagens foram baixadas em um arquivo ZIP.`);
  } catch (error) {
    logger.error('Erro ao fazer download das imagens:', error);
    alert('Erro ao fazer download das imagens: ' + error.message);
  }
};
