import React, { memo } from 'react';

const TerraIndigenaInfo = memo(({ terraIndigena }) => {
  if (!terraIndigena) {
    console.log("TerraIndigenaInfo: terraIndigena é null ou undefined");
    return null;
  }

  const formatarSuperficie = () => {
    return terraIndigena.superficie ? 
      `Superfície: ${parseFloat(terraIndigena.superficie).toFixed(2)} ha` : null;
  };

  const formatarLocalizacao = () => {
    return `${terraIndigena.municipio || ''}, ${terraIndigena.uf || ''}`.trim();
  };

  const informacoes = [
    terraIndigena.etnia && `Etnia: ${terraIndigena.etnia}`,
    formatarLocalizacao(),
    formatarSuperficie(),
    terraIndigena.fase && `Fase: ${terraIndigena.fase}`,
    terraIndigena.modalidade && `Modalidade: ${terraIndigena.modalidade}`,
    terraIndigena.reestudo && `Reestudo: ${terraIndigena.reestudo}`,
    terraIndigena.cr && `Coordenação Regional: ${terraIndigena.cr}`,
    terraIndigena.faixa_fron && `Faixa de Fronteira: ${terraIndigena.faixa_fron}`,
    terraIndigena.undadm_nom && `Unidade Administrativa: ${terraIndigena.undadm_nom}`,
    terraIndigena.undadm_sig && `Sigla Unidade: ${terraIndigena.undadm_sig}`,
    terraIndigena.dominio_un && `Domínio: ${terraIndigena.dominio_un}`,
    terraIndigena.data_atual && `Data de Atualização: ${terraIndigena.data_atual}`,
    terraIndigena.terrai_cod && `Código Terra Indígena: ${terraIndigena.terrai_cod}`,
    terraIndigena.undadm_cod && `Código Unidade Administrativa: ${terraIndigena.undadm_cod}`
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {informacoes.map((info, index) => (
          <p key={index} className="text-gray-700">{info}</p>
        ))}
      </div>
    </div>
  );
});

export default TerraIndigenaInfo; 