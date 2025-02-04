const pontosLazer = [

    {
      lat: -23.944197486169877,
      lng: -46.332842733017344,
      desc: "Teatro Patrícia Galvão",
      tipo: "lazer",
      detalhes: {
        titulo: "Teatro Patrícia Galvão",
        descricao: `
          O Teatro Patrícia Galvão é um dos principais espaços culturais de Santos, conhecido por sua arquitetura e por abrigar diversas produções teatrais e eventos culturais ao longo do ano. O teatro leva o nome de Pagu, uma importante feminista, militante de esquerda e artista de Santos.
        `,
        video: "https://www.youtube.com/embed/KvPW7w3DXUE?si=rqqRxqWtjzsyTZ5-",
        imagens: [], // Adicionado array vazio para consistência
        links: [], // Links mantidos como array vazio
      },
    },

    {
      lat: -23.9810589,
      lng: -46.3003071,
      desc: "Complexo esportivo e recreativo Rebouças",
      tipo: "lazer",
      detalhes: {
    titulo: "Complexo esportivo e recreativo Rebouças",
    descricao: `
      O Rebouças oferece atividades esportivas e recreativas para varias as idades. Tem três quadras cobertas, três piscinas (recreativa, biribol e olímpica), academia, pista de cooper, ginásio com arquibancada e salas especializadas para esportes e artes marciais.
      As modalidades oferecidas incluem musculação, natação, hidroginástica, futsal, voleibol, basquete, dança, pilates, artes marciais, entre outras.
      No local também funciona a Secretaria Municipal de Esportes.
    `,
    imagens: [ "/cartografiasocial/fotos/rebouças.jpg"],
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
  tipo: "lazer",
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

{
  lat: -23.987463,
  lng: -46.308058,
  desc: "Chorinho no Aquário",
  tipo: "lazer",
  detalhes: {
    titulo: "Chorinho no Aquário",
    descricao: `
      O "Chorinho no Aquário" é uma atividade musical que ocorre todos os sábados, a partir das 18h, na Praça Vereador Luiz La Scala, localizada na Ponta da Praia, em Santos. As apresentações são gratuitas e destacam o melhor do choro, samba, MPB e bossa nova, com repertórios que incluem clássicos de ícones como Waldir Azevedo, Cartola, Noel Rosa e Pixinguinha.
    `,
    video: null, // Vídeo ausente
    imagens: [null]
    links: [
      {
        texto: "Facebook do Chorinho no Aquário",
        url: "https://www.facebook.com/chorinhonoaquario/",
      },
      {
        texto: "Notícia sobre o aniversário de 17 anos do projeto",
        url: "https://www.santos.sp.gov.br/?q=noticia%2Fchorinho-no-aquario-comemora-aniversario-com-show-de-demonios-da-garoa-em-santos",
      },
    ],
  },
},

];
  
  export default pontosLazer;
  