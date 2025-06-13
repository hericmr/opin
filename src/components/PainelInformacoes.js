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

  // Funções de formatação para cada campo do CSV
  const formatters = {
    basico: () => ({
      escola: escola.Escola,
      municipio: escola.Município,
      endereco: escola.Endereço,
      terraIndigena: escola['Terra Indigena (TI)'],
      tipoEscola: escola['Escola Estadual ou Municipal'],
      parcerias: escola['Parcerias com o municipípio'],
      diretoriaEnsino: escola['Diretoria de Ensino']
    }),

    povosELinguas: () => ({
      povos: escola['Povos indigenas'],
      linguas: escola['Linguas faladas'],
      anoCriacao: escola['Ano de criação da escola']
    }),

    ensino: () => ({
      modalidade: escola['Modalidade de Ensino/turnos de funcionamento'],
      numeroAlunos: escola['Numero de alunos']
    }),

    infraestrutura: () => ({
      espacos: escola['Espaço escolar e estrutura'],
      cozinha: escola['Cozinha/Merenda escolar/diferenciada'],
      agua: escola['Acesso à água'],
      coletaLixo: escola['Tem coleta de lixo?'],
      internet: escola['Acesso à internet'],
      equipamentos: escola['Equipamentos Tecnológicos (Computadores, tablets e impressoras)'],
      acesso: escola['Modo de acesso à escola']
    }),

    pessoal: () => ({
      gestao: escola['Gestão/Nome'],
      outrosFuncionarios: escola['Outros funcionários'],
      profIndigenas: escola['Quantidade de professores indígenas'],
      profNaoIndigenas: escola['Quantidade de professores não indígenas'],
      profFalamLingua: escola['Professores falam a língua indígena?'],
      formacaoProf: escola['Formação dos professores'],
      formacaoContinuada: escola['Formação continuada oferecida']
    }),

    pedagogico: () => ({
      ppp: escola['A escola possui PPP próprio?'],
      pppComunidade: escola['PPP elaborado com a comunidade?'],
      disciplinasBilingues: escola['Disciplinas bilíngues?'],
      materialNaoIndigena: escola['Material pedagógico não indígena'],
      materialIndigena: escola['Material pedagógico indígena'],
      praticasPedagogicas: escola['Práticas pedagógicas indígenas'],
      formasAvaliacao: escola['Formas de avaliação']
    }),

    projetos: () => ({
      projetosAndamento: escola['Projetos em andamento'],
      parceriasUniversidades: escola['Parcerias com universidades?'],
      acoesONGs: escola['Ações com ONGs ou coletivos?'],
      desejosComunidade: escola['Desejos da comunidade para a escola']
    }),

    social: () => ({
      redesSociais: escola['Escola utiliza redes sociais?'],
      links: escola['Links das redes sociais'],
      historia: escola['historia da aldeia']
    }),

    localizacao: () => ({
      latitude: escola.Latitude,
      longitude: escola.Longitude
    })
  };

  // Função para formatar as seções
  const formatSection = (title, data) => {
    const items = Object.entries(data).filter(([_, value]) => value);
    if (items.length === 0) return null;

  return (
      <div key={title} className="mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">{title}</h3>
        {items.map(([key, value]) => (
          <p key={key} className="text-gray-700 mb-1">
            <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}: </span>
            {value}
          </p>
        ))}
      </div>
    );
  };

  // Estrutura das seções
  const sections = [
    { title: "Informações Básicas", data: formatters.basico() },
    { title: "Povos e Línguas", data: formatters.povosELinguas() },
    { title: "Ensino", data: formatters.ensino() },
    { title: "Infraestrutura", data: formatters.infraestrutura() },
    { title: "Pessoal", data: formatters.pessoal() },
    { title: "Pedagógico", data: formatters.pedagogico() },
    { title: "Projetos e Parcerias", data: formatters.projetos() },
    { title: "Redes Sociais e História", data: formatters.social() },
    { title: "Localização", data: formatters.localizacao() }
  ];

  return (
    <div className="space-y-6">
      {sections.map(section => formatSection(section.title, section.data))}
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