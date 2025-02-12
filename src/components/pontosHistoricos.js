const pontosHistoricos = [
    {
      lat: -23.9851111,
      lng: -46.3088611,

      tipo: "historico", 
      detalhes: {
        titulo: 'Estátua de Iemanjá - Rainha do Mar',
        descricao: `
A estátua de Iemanjá, localizada na Praia do José Menino, é um dos símbolos da força e presença afro-brasileira em Santos. Sua instalação na orla da praia foi uma conquista dos movimentos negros da região, após permanecer guardada no Teatro Municipal de Santos por vários anos.
        `,
        video: "",
        imagens: ["/cartografiasocial/fotos/yemanja.png"], 
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
      lat: -23.9916556,
      lng: -46.3029044,
      tipo: "historico",
      detalhes: {
        titulo: 'Ponte dos Práticos',
        descricao: `A **Ponte dos Práticos**, chamada oficialmente **Ponte Edgard Perdigão**, é um atracadouro inaugurado em 11 de junho de 1968. Com uma vista bonita da baía de Santos, Guarujá e Ilha Porchat, recebe diariamente milhares de pessoas, sobretudo aquelas que fazem a travessia para a praia do **Góes** e **Santa Cruz dos Navegantes** que é conhecida também popularmente como Pouca Farinha. Há também ponto de embarque para escunas turísticas e barcos pesqueiros, além de uma lanchonete particular . A Ponte dos Práticos se mantém como um ponto **histórico**, **turístico** e **funcional** para a cidade de Santos.`,
        video: "",
        imagens: ["/cartografiasocial/fotos/ponte.png"],
        links: [
          {
            texto: "Uma ponte para o mar -NovoMilenio",
            url: "http://www.novomilenio.inf.br/santos/h0288.htm"
          }
        ],
      },
    },
    {
      lat: -23.9503151,
      lng: -46.3391494,
      desc: "Estátua em homenagem a Zito, eterno capitão do Santos FC",
      tipo: "historico",
      detalhes: {
        titulo: "Estátua de Zito",
        descricao: `
          A estátua de José Ely de Miranda, conhecido como Zito, na Rua Princesa Isabel, em frente ao portão 6 do estádio Vila Belmiro, em Santos. Zito defendeu o Santos Futebol Clube de 1952 a 1967, conquistando diversos títulos, incluindo os Mundiais de 1962 e 1963. Ele também foi bicampeão mundial com a Seleção Brasileira em 1958 e 1962. Após encerrar a carreira como jogador, Zito tornou-se um grande incentivador das categorias de base do Santos, sendo responsável direto pelas gerações dos "Meninos da Vila" em 1979, 2002 e 2010. 
          
          A estátua é uma homenagem que eterniza a memória de Zito, destacando sua liderança e legado no futebol brasileiro.
        `,
        video: null,
        imagens: [
          "/cartografiasocial/fotos/zito.jpeg",
          "/cartografiasocial/fotos/zito2.png",
          "/cartografiasocial/fotos/zito3.png",
        ],
        links: [
          {
            texto: "Fonte: Santos FC",
            url: "https://www.santosfc.com.br/zito-o-eterno-capitao-do-santos/"
          }
        ]
      }
      },
      {
        lat: -23.93858343910077,
        lng: -46.31737352946441,
        tipo: "historico",
        desc: "Cemitério do Paquetá - O mais antigo de Santos, inaugurado em 1853.",
        audioUrl: "/cartografiasocial/audio/cemiterio.mp3",
        detalhes: {
          titulo: "Cemitério do Paquetá",
          descricao: `
            O Cemitério do Paquetá, o mais antigo de Santos, teve seus primeiros enterros em 1853, substituindo os sepultamentos nas igrejas, como a do Valongo. Devido à falta de espaço, a Câmara adquiriu um terreno em 1851 para a construção do cemitério. Inicialmente, apenas o muro, o portão e parte do terreno foram preparados. Em 1854, a Capela de Santo Cristo foi construída, e o cemitério foi inaugurado em 30 de novembro. Sua regulamentação ocorreu em 16 de fevereiro de 1855. No mesmo ano, uma epidemia de cólera exigiu a ampliação emergencial do local.
      
            Tomado por imagens de anjos, alamedas arborizadas e sepulturas que são verdadeiras obras de arte, o Cemitério do Paquetá é referência histórica nacional e o mais antigo de Santos. Figuras ilustres, como o ex-governador Mário Covas; os ex-prefeitos Luiz La Scala Jr., Antônio Feliciano; os poetas Martins Fontes e Vicente de Carvalho; o escritor Júlio Ribeiro e o pintor Benedicto Calixto, foram enterradas no local e suas sepulturas podem ser visitadas. Muitos dos ornamentos das campas foram confeccionados com mármore de Carrara, cobre e bronze. A sepultura que mais chama a atenção e intriga santistas há anos é a do túmulo do advogado abolicionista João Galeão Carvalhal. A obra possui uma imagem de uma mulher, em tamanho natural, debruçada sobre a lápide chorando sua perda, com um busto acima ladeado por dois anjos. O Cemitério do Paquetá fica na Rua Doutor Cóchrane, s/n, no Paquetá e fica aberto das 7h às 17h, todos os dias, com visitação livre.
          `,
          video: null,
          imagens: [
            "/cartografiasocial/fotos/cemiterio.jpg"],
          links: [
            {
              texto: "Fonte: Prefeitura de Santos",
              url: "https://www.santos.sp.gov.br"
            }
          ]
        }
      }
];

export default pontosHistoricos;