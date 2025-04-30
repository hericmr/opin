import React, { useRef, memo } from "react";
import PainelHeader from "./PainelHeader";
import PainelMedia from "./PainelMedia";
import PainelDescricao from "./PainelDescricao";
import PainelLinks from "./PainelLinks";
import usePainelVisibility from "./hooks/usePainelVisibility";
import useAudio from "./hooks/useAudio";
import AudioButton from "./AudioButton";
import ShareButton from "./ShareButton";
import { useShare } from "./hooks/useShare";
import { useDynamicURL } from "./hooks/useDynamicURL";
import { useClickOutside } from "./hooks/useClickOutside";
import { usePainelDimensions } from "./hooks/usePainelDimensions";

// Componente para exibir informações da escola
const EscolaInfo = memo(({ escola }) => {
  console.log("EscolaInfo recebeu:", escola);
  
  if (!escola) {
    console.log("EscolaInfo: escola é null ou undefined");
    return null;
  }

  const formatarEndereco = () => {
    const partes = [
      escola.Endereço,
      escola.Município,
      escola.UF
    ].filter(Boolean);
    return partes.join(", ");
  };

  const formatarTelefone = () => {
    return escola.Telefone ? `Tel: ${escola.Telefone}` : null;
  };

  const formatarDependencia = () => {
    return escola['Dependência Administrativa'] ? 
      `Dependência: ${escola['Dependência Administrativa']}` : null;
  };

  const formatarEtapasEnsino = () => {
    return escola['Etapas e Modalidade de Ensino Oferecidas'] ?
      `Etapas de Ensino: ${escola['Etapas e Modalidade de Ensino Oferecidas']}` : null;
  };

  const formatarLocalizacao = () => {
    return escola.Localização ? 
      `Localização: ${escola.Localização}` : null;
  };

  const formatarLocalidadeDiferenciada = () => {
    return escola['Localidade Diferenciada'] ?
      `Localidade Diferenciada: ${escola['Localidade Diferenciada']}` : null;
  };

  const formatarCodigoINEP = () => {
    return escola['Código INEP'] ? 
      `Código INEP: ${escola['Código INEP']}` : null;
  };

  const formatarCategoriaAdministrativa = () => {
    return escola['Categoria Administrativa'] ?
      `Categoria Administrativa: ${escola['Categoria Administrativa']}` : null;
  };

  const formatarCategoriaEscolaPrivada = () => {
    return escola['Categoria Escola Privada'] ?
      `Categoria Escola Privada: ${escola['Categoria Escola Privada']}` : null;
  };

  const formatarConveniadaPoderPublico = () => {
    return escola['Conveniada Poder Público'] ?
      `Conveniada Poder Público: ${escola['Conveniada Poder Público']}` : null;
  };

  const formatarRegulamentacao = () => {
    return escola['Regulamentação pelo Conselho de Educação'] ?
      `Regulamentação: ${escola['Regulamentação pelo Conselho de Educação']}` : null;
  };

  const formatarPorte = () => {
    return escola['Porte da Escola'] ?
      `Porte: ${escola['Porte da Escola']}` : null;
  };

  const formatarOutrasOfertas = () => {
    return escola['Outras Ofertas Educacionais'] ?
      `Outras Ofertas: ${escola['Outras Ofertas Educacionais']}` : null;
  };

  const formatarRestricaoAtendimento = () => {
    return escola['Restrição de Atendimento'] ?
      `Restrição de Atendimento: ${escola['Restrição de Atendimento']}` : null;
  };

  const informacoes = [
    formatarCodigoINEP(),
    formatarEndereco(),
    formatarTelefone(),
    formatarCategoriaAdministrativa(),
    formatarDependencia(),
    formatarCategoriaEscolaPrivada(),
    formatarConveniadaPoderPublico(),
    formatarRegulamentacao(),
    formatarPorte(),
    formatarEtapasEnsino(),
    formatarOutrasOfertas(),
    formatarLocalizacao(),
    formatarLocalidadeDiferenciada(),
    formatarRestricaoAtendimento()
  ].filter(Boolean);

  console.log("Informações formatadas:", informacoes);

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

// Componente para exibir informações da terra indígena
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

const ShareSection = memo(({ copiarLink, compartilhar }) => (
  <div className="mt-8 flex justify-center space-x-4">
    <ShareButton onClick={copiarLink} onShare={compartilhar} />
  </div>
));

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  console.log("PainelInformacoes recebeu:", painelInfo);
  
  const painelRef = useRef(null);
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);
  const { gerarLinkCustomizado, copiarLink, compartilhar } = useShare(painelInfo);
  const painelDimensions = usePainelDimensions(isMobile);
  
  useDynamicURL(painelInfo, gerarLinkCustomizado);
  useClickOutside(painelRef, closePainel);

  if (!painelInfo) {
    console.log("PainelInformacoes: painelInfo é null ou undefined");
    return null;
  }

  const baseClasses = `
    fixed top-16 right-0 sm:left-auto sm:w-3/4 lg:w-[49%] 
    rounded-xl shadow-xl z-40 transform transition-all duration-500 ease-in-out
    bg-gradient-to-b from-green-50/95 to-green-50/90 backdrop-blur-sm
  `;
  
  const visibilityClasses = isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0";

  // Determina se é uma terra indígena ou escola
  const isTerraIndigena = painelInfo.tipo === 'terra_indigena';

  return (
    <div
      ref={painelRef}
      role="dialog"
      aria-labelledby="painel-titulo"
      aria-describedby="painel-descricao"
      aria-modal="true"
      className={`${baseClasses} ${visibilityClasses}`}
      style={{
        height: isMobile ? 'calc(100vh - 4rem)' : painelDimensions.height,
        maxHeight: isMobile ? 'calc(100vh - 4rem)' : painelDimensions.maxHeight,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PainelHeader 
        titulo={isTerraIndigena ? painelInfo.titulo : painelInfo.Escola} 
        closePainel={closePainel} 
      />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600/40 scrollbar-track-green-50/20">
        <div className="p-6 space-y-6">
          <div className="prose prose-lg lg:prose-xl max-w-none">
            {isTerraIndigena ? (
              <TerraIndigenaInfo terraIndigena={painelInfo} />
            ) : (
              <EscolaInfo escola={painelInfo} />
            )}
          </div>
          
          <ShareSection copiarLink={copiarLink} compartilhar={compartilhar} />
        </div>
      </div>
    </div>
  );
};

export default memo(PainelInformacoes);