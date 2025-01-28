const pontos = [
    {
      lat: -23.9851111,
      lng: -46.3088611,
      desc: "Estátua de Iemanjá",
      tipo: "historico", 
      detalhes: {
        titulo: "Estátua de Iemanjá",
        descricao: `
          A estátua de Iemanjá, localizada na Praia do José Menino, é um símbolo cultural de Santos e uma homenagem às tradições afro-brasileiras. 
          Sua instalação na orla da praia foi uma conquista dos movimentos negros da região, após permanecer guardada no Teatro Municipal de Santos por vários anos.
        `,
        video: "https://www.youtube.com/embed/Br_ioeUszH0?si=uZLBcYlnhKm_a1qg",
        imagens: [], 
        links: [
          {
            texto: "Levante vai cobrar Estátua de Iemanjá em Santos - DL",
            url: "https://www.diariodolitoral.com.br/cotidiano/levante-vai-cobrar-estatua-de-iemanja-em-santos/136502/",
          },
          {
            texto: "Prometida estátua de Iemanjá não entregue em Santos - BoqNews",
            url: "https://www.boqnews.com/cidades/prometida-estatua-de-iemanja-nao-e-entregue-em-santos/",
          },
        ],
      },
    },
    {
      lat: -23.986538,
      lng: -46.31339,
      desc: "Farolzinho do Canal 6",
      tipo: "historico",
      detalhes: {
        titulo: "Farol do Canal 6",
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

export default pontos;