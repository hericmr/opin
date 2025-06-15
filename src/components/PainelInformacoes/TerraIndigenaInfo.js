import React, { memo } from 'react';
import { Globe } from 'lucide-react';
import InfoSection from './components/InfoSection';
import InfoItem from './components/InfoItem';

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

  return (
    <InfoSection title="Informações da Terra Indígena" icon={Globe}>
      <InfoItem label="Etnia" value={terraIndigena.etnia} />
      <InfoItem label="Localização" value={formatarLocalizacao()} />
      <InfoItem label="Superfície" value={formatarSuperficie()} />
      <InfoItem label="Fase" value={terraIndigena.fase} />
      <InfoItem label="Modalidade" value={terraIndigena.modalidade} />
      <InfoItem label="Reestudo" value={terraIndigena.reestudo} />
      <InfoItem label="Coordenação Regional" value={terraIndigena.cr} />
      <InfoItem label="Faixa de Fronteira" value={terraIndigena.faixa_fron} />
      <InfoItem label="Unidade Administrativa" value={terraIndigena.undadm_nom} />
      <InfoItem label="Sigla Unidade" value={terraIndigena.undadm_sig} />
      <InfoItem label="Domínio" value={terraIndigena.dominio_un} />
      <InfoItem label="Data de Atualização" value={terraIndigena.data_atual} />
      <InfoItem label="Código Terra Indígena" value={terraIndigena.terrai_cod} />
      <InfoItem label="Código Unidade Administrativa" value={terraIndigena.undadm_cod} />
    </InfoSection>
  );
});

export default TerraIndigenaInfo; 