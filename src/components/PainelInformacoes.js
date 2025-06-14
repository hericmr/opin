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

  // Funções de formatação para cada seção
  const formatters = {
    informacoesBasicas: () => ({
      "Nome da Escola": escola.titulo,
      "Município": escola.municipio,
      "Endereço": escola.endereco,
      "Terra Indígena": escola.terra_indigena,
      "Tipo de Escola": escola.tipo_escola,
      "Parcerias com o Município": escola.parcerias_municipio,
      "Diretoria de Ensino": escola.diretoria_ensino,
      "Ano de Criação": escola.ano_criacao
    }),

    povosELinguas: () => ({
      "Povos Indígenas": escola.povos_indigenas,
      "Línguas Faladas": escola.linguas_faladas
    }),

    ensino: () => ({
      "Modalidade de Ensino": escola.modalidade_ensino,
      "Número de Alunos": escola.numero_alunos,
      "Disciplinas Bilíngues": escola.disciplinas_bilingues,
      "Material Pedagógico Não Indígena": escola.material_nao_indigena,
      "Material Pedagógico Indígena": escola.material_indigena,
      "Práticas Pedagógicas Indígenas": escola.praticas_pedagogicas,
      "Formas de Avaliação": escola.formas_avaliacao
    }),

    infraestrutura: () => ({
      "Espaço Escolar e Estrutura": escola.espaco_escolar,
      "Cozinha/Merenda Escolar": escola.cozinha_merenda,
      "Acesso à Água": escola.acesso_agua,
      "Coleta de Lixo": escola.coleta_lixo,
      "Acesso à Internet": escola.acesso_internet,
      "Equipamentos Tecnológicos": escola.equipamentos,
      "Modo de Acesso à Escola": escola.modo_acesso
    }),

    gestaoEProfessores: () => ({
      "Gestão/Nome": escola.gestao,
      "Outros Funcionários": escola.outros_funcionarios,
      "Professores Indígenas": escola.professores_indigenas,
      "Professores Não Indígenas": escola.professores_nao_indigenas,
      "Professores Falam a Língua Indígena": escola.professores_falam_lingua,
      "Formação dos Professores": escola.formacao_professores,
      "Formação Continuada": escola.formacao_continuada
    }),

    projetoPedagogico: () => ({
      "Possui PPP Próprio": escola.ppp_proprio,
      "PPP Elaborado com a Comunidade": escola.ppp_comunidade
    }),

    projetosEParcerias: () => ({
      "Projetos em Andamento": escola.projetos_andamento,
      "Parcerias com Universidades": escola.parcerias_universidades,
      "Ações com ONGs ou Coletivos": escola.acoes_ongs,
      "Desejos da Comunidade": escola.desejos_comunidade
    }),

    redesSociaisEMidia: () => ({
      "Utiliza Redes Sociais": escola.usa_redes_sociais,
      "Links das Redes Sociais": escola.links_redes_sociais,
      "História da Aldeia": escola.historia_aldeia
    }),

    midia: () => ({
      "Imagens": escola.imagens,
      "Áudio": escola.audio,
      "Vídeo": escola.video
    }),

    links: () => ({
      "Links": escola.links
    }),

    localizacao: () => ({
      "Latitude": escola.latitude,
      "Longitude": escola.longitude
    })
  };

  // Função para formatar as seções
  const formatSection = (title, data) => {
    const items = Object.entries(data).filter(([_, value]) => value);
    if (items.length === 0) return null;

    return (
      <div key={title} className="mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">{title}</h3>
        <div className="bg-white/50 rounded-lg p-4 space-y-2">
          {items.map(([key, value]) => {
            // Se o valor for uma string de URLs separadas por vírgula, renderiza como links
            if (typeof value === 'string' && (key === 'links' || key === 'Links das Redes Sociais')) {
              const urls = value.split(',').map(url => url.trim()).filter(url => url);
              return (
                <div key={key} className="mb-2">
                  <span className="font-medium text-gray-700">{key}: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            // Se for áudio, renderiza o player de áudio
            if (key === 'Áudio' && value) {
              return (
                <div key={key} className="mb-2">
                  <span className="font-medium text-gray-700">Áudio: </span>
                  <audio controls className="mt-1">
                    <source src={value} type="audio/wav" />
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                </div>
              );
            }

            // Se for vídeo, renderiza o player de vídeo
            if (key === 'Vídeo' && value) {
              return (
                <div key={key} className="mb-2">
                  <span className="font-medium text-gray-700">Vídeo: </span>
                  <video controls className="mt-1 max-w-full">
                    <source src={value} type="video/mp4" />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                </div>
              );
            }

            // Se for imagens, renderiza em grid
            if (key === 'Imagens' && value) {
              const imagens = Array.isArray(value) ? value : value.split(',').map(url => url.trim()).filter(url => url);
              return (
                <div key={key} className="mb-2">
                  <span className="font-medium text-gray-700">Imagens: </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {imagens.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              );
            }

            // Para outros campos, renderiza normalmente
            return (
              <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1">
                <span className="font-medium text-gray-700 min-w-[200px]">{key}:</span>
                <span className="text-gray-600 flex-1">{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Estrutura das seções
  const sections = [
    { title: "Informações Básicas", data: formatters.informacoesBasicas() },
    { title: "Povos e Línguas", data: formatters.povosELinguas() },
    { title: "Ensino", data: formatters.ensino() },
    { title: "Infraestrutura", data: formatters.infraestrutura() },
    { title: "Gestão e Professores", data: formatters.gestaoEProfessores() },
    { title: "Projeto Pedagógico", data: formatters.projetoPedagogico() },
    { title: "Projetos e Parcerias", data: formatters.projetosEParcerias() },
    { title: "Redes Sociais e Mídia", data: formatters.redesSociaisEMidia() },
    { title: "Mídia", data: formatters.midia() },
    { title: "Links", data: formatters.links() },
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
        titulo={painelInfo.titulo} 
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