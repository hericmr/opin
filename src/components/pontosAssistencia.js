const pontosAssistencia = [
  {
    lat: -23.93788,
    lng: -46.319121,
    desc: "Centro POP Santos",
    tipo: "assistencia", // 
    detalhes: {
      titulo: "Centro POP Santos",
      descricao: `
        O Centro de Referência Especializado para População em Situação de Rua (Centro POP) oferece suporte para pessoas em situação de rua,
        incluindo alimentação, higiene, e encaminhamento para serviços de saúde e assistência social.
      `,
      video: "https://www.youtube.com/embed/exampleVideoID", // Link temporário
      imagens: [],
      links: [
        {
          texto: "Centro POP Santos - Prefeitura",
          url: "https://www.santos.sp.gov.br/centropop",
        },
      ],
        },
      },

      {
        lat: -23.9810589,
        lng: -46.3003071,
        desc: "Complexo Esportivo e Recreativo Rebouças",
        tipo: "cultura",
        detalhes: {
      titulo: "Complexo Esportivo e Recreativo Rebouças",
      descricao: `
        Localizado em uma área de 23 mil m², o Rebouças oferece atividades esportivas e recreativas para todas as idades. Conta com três quadras cobertas, três piscinas (recreativa, biribol e olímpica), academia, pista de cooper, ginásio com arquibancada e salas especializadas para esportes e artes marciais.
        As modalidades oferecidas incluem musculação, natação, hidroginástica, futsal, voleibol, basquete, dança, pilates, artes marciais, entre outras.
        No local também funciona a Secretaria Municipal de Esportes.
      `,
      video: "https://www.youtube.com/embed/exampleVideoID", // Link temporário
      imagens: [],
      links: [
        {
          texto: "Complexo Esportivo e Recreativo Rebouças - Prefeitura",
          url: "https://www.santos.sp.gov.br/?q=portal/centro-esportivo-e-recreativo-reboucas",
        },
      ],
    },
  },
      {
      lat: -23.986538,
      lng: -46.31339,
      desc: "Farolzinho do Canal 6",
      detalhes: {
        titulo: "Farol do Canal 6",
        tipo: "cultura",
        descricao: `
          O Farol do Canal 6 é um ponto icônico de Santos, marcando a entrada do canal e oferecendo uma vista deslumbrante do marzão.
        `,
        video: null, // Vídeo ausente
        imagens: [
          "https://s2.glbimg.com/RfVWirfUe5XAfGdGooaVIg9NQpg=/s.glbimg.com/jo/g1/f/original/2015/01/28/farol12.jpg",
        ],
        links: [], // Links mantidos como array vazio
      },
    },
];

export default pontosAssistencia;
