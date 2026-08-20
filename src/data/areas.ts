export interface AreaTopico {
  titulo: string;
  texto: string;
}

export interface Area {
  slug: string;
  titulo: string;
  descricao: string;
  /** Título editorial da seção de introdução da página da área. */
  introTitulo: string;
  /** Parágrafos introdutórios (2–3) da página da área. */
  intro: string[];
  /** Tópicos concretos de atuação — seção "Como posso ajudar". */
  topicos: AreaTopico[];
  /** Bloco "Para quem é". */
  paraQuem: {
    texto: string;
    perfis: string[];
  };
}

/**
 * Áreas de atuação — fonte única usada nos cards da homepage, no footer
 * e nas páginas /areas/<slug> (geradas por src/pages/areas/[slug].astro).
 */
export const areas: Area[] = [
  {
    slug: 'direito-imobiliario',
    titulo: 'Direito Imobiliário',
    descricao:
      'Contratos, negociações e demandas envolvendo bens imóveis, com rigor técnico da tratativa inicial ao registro em cartório.',
    introTitulo: 'Segurança jurídica em cada etapa do negócio imobiliário.',
    intro: [
      'Um imóvel costuma ser o ativo mais relevante do patrimônio de uma família ou de um investidor. Por isso, cada negócio imobiliário — compra, venda, permuta, locação ou incorporação — merece análise técnica desde a tratativa inicial até o registro na matrícula, momento em que, no direito brasileiro, a propriedade efetivamente se transfere.',
      'A atuação do escritório é essencialmente preventiva e consultiva: examinar a documentação, desenhar contratos claros e antecipar riscos, para que o negócio seja concluído com previsibilidade. Quando o conflito já existe, a condução técnica busca a via mais adequada ao caso — negociada, extrajudicial ou judicial.',
    ],
    topicos: [
      {
        titulo: 'Contratos imobiliários',
        texto:
          'Elaboração e revisão de contratos de compra e venda, permuta, cessão de direitos e promessas, com cláusulas desenhadas para o caso concreto.',
      },
      {
        titulo: 'Locação residencial e comercial',
        texto:
          'Contratos de locação, garantias locatícias, revisões e orientação a locadores e locatários à luz da Lei do Inquilinato.',
      },
      {
        titulo: 'Operações estruturadas',
        texto:
          'Assessoria em negociações, financiamentos com alienação fiduciária, permutas físicas e financeiras e aquisições de maior complexidade.',
      },
      {
        titulo: 'Incorporação e loteamentos',
        texto:
          'Suporte consultivo a incorporadores e loteadores, do registro do empreendimento à entrega das unidades.',
      },
      {
        titulo: 'Atuação notarial e registral',
        texto:
          'Análise de matrículas, acompanhamento de escrituras e registros e tratamento de exigências junto aos cartórios.',
      },
      {
        titulo: 'Conflitos imobiliários',
        texto:
          'Condução de demandas envolvendo posse, propriedade, vícios do negócio e inadimplemento contratual, priorizando a solução mais adequada ao caso.',
      },
    ],
    paraQuem: {
      texto:
        'Para quem compra, vende, aluga ou investe em imóveis e quer decidir com base em informação técnica — antes de assinar.',
      perfis: [
        'Compradores e vendedores de imóveis urbanos e rurais',
        'Investidores do mercado imobiliário',
        'Incorporadoras, loteadoras e construtoras',
        'Corretores e imobiliárias que buscam retaguarda jurídica',
        'Famílias que negociam o próprio patrimônio',
      ],
    },
  },
  {
    slug: 'regularizacao-reurb',
    titulo: 'Regularização de Imóveis & REURB',
    descricao:
      'Usucapião, REURB e destravamento de matrículas: orientação jurídica no caminho da posse consolidada à propriedade plena e registrada.',
    introTitulo: 'Do imóvel de fato ao imóvel de direito.',
    intro: [
      'Grande parte dos imóveis brasileiros apresenta alguma distância entre a realidade e o que consta no registro: posse sem matrícula, construção não averbada, área divergente, loteamento informal. Enquanto essa distância existe, o imóvel não pode ser financiado, vale menos e não circula com segurança.',
      'A regularização fundiária é o campo central da pesquisa acadêmica da Dra. Érika — objeto de seu doutorado em Direito e de seu mestrado em Políticas Públicas pela UFPR — e um dos eixos da prática do escritório. O trabalho consiste em diagnosticar a situação dominial e registral do imóvel e conduzir o instrumento adequado, priorizando as vias extrajudiciais sempre que cabíveis.',
    ],
    topicos: [
      {
        titulo: 'Usucapião judicial e extrajudicial',
        texto:
          'Reconhecimento da propriedade pela posse prolongada, inclusive pela via do cartório de registro de imóveis, quando preenchidos os requisitos legais.',
      },
      {
        titulo: 'REURB-S e REURB-E',
        texto:
          'Regularização fundiária urbana de núcleos informais consolidados, nas modalidades social e específica, com atuação junto ao município e ao registro de imóveis.',
      },
      {
        titulo: 'Adjudicação compulsória',
        texto:
          'Obtenção do título de propriedade quando o vendedor não outorga a escritura devida, pela via judicial ou extrajudicial.',
      },
      {
        titulo: 'Retificação de área e de registro',
        texto:
          'Correção de divergências entre a realidade física do imóvel e a descrição constante da matrícula.',
      },
      {
        titulo: 'Georreferenciamento e imóveis rurais',
        texto:
          'Condução jurídica da certificação e do registro de imóveis rurais, em conjunto com os profissionais técnicos responsáveis.',
      },
      {
        titulo: 'Destravamento de matrículas',
        texto:
          'Tratamento de bloqueios, indisponibilidades, gravames e exigências registrais que impedem a circulação do imóvel.',
      },
      {
        titulo: 'Averbações, desmembramento e unificação',
        texto:
          'Regularização de construções, desmembramento e unificação de áreas e instituição de condomínio.',
      },
    ],
    paraQuem: {
      texto:
        'Para quem possui um imóvel — urbano ou rural — cuja documentação não reflete a realidade, e quer transformá-lo em patrimônio pleno, registrado e negociável.',
      perfis: [
        'Possuidores de imóveis sem matrícula ou sem registro',
        'Famílias com imóveis herdados e nunca formalizados',
        'Proprietários rurais com pendências de georreferenciamento',
        'Loteadores e municípios em projetos de REURB',
        'Investidores que adquirem imóveis com pendências registrais',
      ],
    },
  },
  {
    slug: 'planejamento-patrimonial-sucessorio',
    titulo: 'Planejamento Patrimonial e Sucessório',
    descricao:
      'Arquitetura jurídica para proteger o que foi construído e organizar, com serenidade, a transmissão entre gerações.',
    introTitulo: 'Organizar em vida o que se deseja para as próximas gerações.',
    intro: [
      'Planejar o patrimônio é decidir, com calma e em vida, como os bens serão administrados, protegidos e transmitidos — em vez de deixar essas definições para um inventário futuro, em regra mais caro, mais lento e mais suscetível a conflitos familiares.',
      'O trabalho parte de um diagnóstico da família e do patrimônio e combina os instrumentos adequados a cada caso: doações, testamentos, cláusulas de proteção, regime de bens, estruturas societárias. Não existe fórmula única — existe a arquitetura certa para cada família.',
    ],
    topicos: [
      {
        titulo: 'Diagnóstico patrimonial e familiar',
        texto:
          'Mapeamento de bens, dívidas, regimes de bens e relações familiares como base técnica de qualquer planejamento.',
      },
      {
        titulo: 'Testamentos',
        texto:
          'Elaboração de testamentos públicos e particulares, respeitando a legítima e refletindo com precisão a vontade do titular.',
      },
      {
        titulo: 'Doações com reserva de usufruto',
        texto:
          'Antecipação da transmissão de bens com manutenção do controle e da renda pelo doador, quando adequada ao caso.',
      },
      {
        titulo: 'Cláusulas de proteção',
        texto:
          'Incomunicabilidade, impenhorabilidade e inalienabilidade aplicadas com critério — para proteger sem engessar.',
      },
      {
        titulo: 'Pactos antenupciais e regime de bens',
        texto:
          'Definição ou alteração do regime de bens como peça estrutural do planejamento do casal.',
      },
      {
        titulo: 'Sucessão em empresas familiares',
        texto:
          'Organização da continuidade de negócios entre gerações, em diálogo com a estrutura societária da família.',
      },
    ],
    paraQuem: {
      texto:
        'Para quem construiu patrimônio e prefere organizar a sucessão com serenidade, prevenindo conflitos e custos evitáveis.',
      perfis: [
        'Famílias com imóveis, empresas ou investimentos relevantes',
        'Empresários que pensam na continuidade do negócio',
        'Casais definindo regime de bens e proteção recíproca',
        'Pessoas com filhos de diferentes uniões',
        'Brasileiros com bens ou herdeiros no exterior',
      ],
    },
  },
  {
    slug: 'holdings-familiares',
    titulo: 'Holdings Familiares',
    descricao:
      'Estruturação societária do patrimônio familiar com governança, eficiência tributária e proteção de longo prazo.',
    introTitulo: 'Estrutura societária a serviço da família.',
    intro: [
      'A holding familiar é uma sociedade constituída para concentrar e administrar o patrimônio da família — em geral, imóveis e participações societárias. Bem desenhada, organiza a gestão dos bens, disciplina a convivência entre herdeiros e estrutura a sucessão por meio de quotas, com regras claras de governança.',
      'Holding não é fórmula pronta, nem convém a todos os casos. Antes de constituir a sociedade, é preciso analisar o patrimônio, a família, os objetivos e os efeitos tributários envolvidos — e, muitas vezes, a resposta tecnicamente honesta é combinar a holding com outros instrumentos, ou simplesmente não constituí-la.',
    ],
    topicos: [
      {
        titulo: 'Análise de viabilidade',
        texto:
          'Estudo prévio, jurídico e tributário, para verificar se a holding é o instrumento adequado ao caso concreto.',
      },
      {
        titulo: 'Constituição da holding',
        texto:
          'Elaboração de contrato ou estatuto social com regras de administração, entrada e saída de sócios e resolução de impasses.',
      },
      {
        titulo: 'Integralização de imóveis',
        texto:
          'Transferência de bens ao capital social com atenção aos aspectos registrais e tributários da operação.',
      },
      {
        titulo: 'Doação de quotas com usufruto',
        texto:
          'Estruturação da sucessão por meio de quotas doadas aos herdeiros, com reserva de usufruto e cláusulas de proteção.',
      },
      {
        titulo: 'Acordos de sócios e governança familiar',
        texto:
          'Protocolos e acordos que disciplinam a relação entre os membros da família na gestão do patrimônio comum.',
      },
      {
        titulo: 'Revisão de estruturas existentes',
        texto:
          'Análise de holdings já constituídas, adequação de cláusulas e correção de fragilidades identificadas.',
      },
    ],
    paraQuem: {
      texto:
        'Para famílias com patrimônio imobiliário ou empresarial que buscam gestão organizada e sucessão planejada — a partir de uma análise honesta de custos e benefícios.',
      perfis: [
        'Famílias com múltiplos imóveis de renda',
        'Empresários com participações em sociedades',
        'Patriarcas e matriarcas organizando a sucessão',
        'Herdeiros que administram patrimônio comum',
        'Investidores que estruturam patrimônio de longo prazo',
      ],
    },
  },
  {
    slug: 'inventario-sucessoes',
    titulo: 'Inventário e Sucessões',
    descricao:
      'Condução de inventários judiciais e extrajudiciais com técnica, agilidade e a sensibilidade que o momento exige.',
    introTitulo: 'Um processo técnico para um momento delicado.',
    intro: [
      'O inventário é o procedimento que apura os bens, as dívidas e os herdeiros de quem faleceu e formaliza a partilha. Deve ser aberto no prazo legal — em regra, dois meses contados do falecimento — e sua condução técnica evita multas, desgastes e a paralisação do patrimônio da família.',
      'Sempre que os requisitos legais estão presentes, a via extrajudicial — realizada por escritura pública em cartório de notas — tende a ser mais célere e menos onerosa que o processo judicial. A escolha da via, a organização dos documentos e o desenho da partilha são o coração do trabalho, campo em que a especialização notarial e registral da Dra. Érika é diretamente aplicada.',
    ],
    topicos: [
      {
        titulo: 'Inventário extrajudicial',
        texto:
          'Partilha por escritura pública em cartório de notas — a via mais célere quando presentes os requisitos legais.',
      },
      {
        titulo: 'Inventário judicial',
        texto:
          'Condução do processo judicial quando a via extrajudicial não é cabível ou quando há conflito entre os herdeiros.',
      },
      {
        titulo: 'Sobrepartilha e alvarás',
        texto:
          'Partilha de bens descobertos posteriormente e alvarás judiciais para levantamento de valores e prática de atos específicos.',
      },
      {
        titulo: 'Cumprimento de testamentos',
        texto:
          'Abertura, registro e cumprimento de testamentos, pela via judicial ou extrajudicial, conforme o caso.',
      },
      {
        titulo: 'Regularização de bens herdados',
        texto:
          'Registro da partilha nas matrículas e regularização de imóveis recebidos por herança — inclusive os que nunca foram formalizados.',
      },
      {
        titulo: 'Sucessões internacionais',
        texto:
          'Orientação em inventários com herdeiros ou bens no exterior, em diálogo com profissionais dos países envolvidos.',
      },
    ],
    paraQuem: {
      texto:
        'Para famílias que precisam conduzir um inventário — recente ou pendente há anos — com técnica, previsibilidade e a sensibilidade que o momento pede.',
      perfis: [
        'Herdeiros iniciando o inventário no prazo legal',
        'Famílias com inventários parados ou litigiosos',
        'Herdeiros residentes no exterior',
        'Cônjuges organizando meação e partilha',
        'Famílias com imóveis herdados sem registro',
      ],
    },
  },
  {
    slug: 'due-diligence-imobiliaria',
    titulo: 'Due Diligence Imobiliária',
    descricao:
      'Auditoria completa de riscos antes da aquisição: quem investiga antes de comprar não litiga depois.',
    introTitulo: 'Investigar antes de investir.',
    intro: [
      'Due diligence imobiliária é a auditoria jurídica completa de um imóvel e de seus vendedores antes da aquisição. Ela examina a matrícula, a cadeia dominial, as certidões pessoais e a situação fiscal, urbanística e ambiental do bem — e traduz tudo em um mapa claro de riscos.',
      'No direito brasileiro, quem compra sem investigar pode suportar as consequências: fraudes à execução, dívidas que acompanham o imóvel, gravames e restrições podem alcançar o adquirente. A auditoria prévia existe para que a decisão de comprar — ou de não comprar — seja tomada com pleno conhecimento.',
    ],
    topicos: [
      {
        titulo: 'Matrícula e cadeia dominial',
        texto:
          'Exame do histórico registral do imóvel, de gravames e ônus e de eventuais quebras na cadeia de titularidade.',
      },
      {
        titulo: 'Certidões e análise dos vendedores',
        texto:
          'Levantamento de certidões pessoais, fiscais e trabalhistas para identificar riscos de fraude à execução e de fraude contra credores.',
      },
      {
        titulo: 'Situação urbanística e ambiental',
        texto:
          'Verificação de zoneamento, restrições ambientais, tombamentos e regularidade das edificações.',
      },
      {
        titulo: 'Imóveis rurais',
        texto:
          'Auditoria de CAR, ITR, georreferenciamento, reserva legal e demais especificidades do imóvel rural.',
      },
      {
        titulo: 'Aquisições em leilão',
        texto:
          'Análise prévia de editais e processos para arrematações em leilões judiciais e extrajudiciais.',
      },
      {
        titulo: 'Parecer e fechamento seguro',
        texto:
          'Parecer técnico com o mapa de riscos e recomendações, além de suporte na negociação de garantias e no fechamento da operação.',
      },
    ],
    paraQuem: {
      texto:
        'Para quem vai adquirir um imóvel — para morar, investir ou incorporar — e quer conhecer os riscos antes de assinar.',
      perfis: [
        'Compradores de imóveis de alto valor',
        'Investidores e gestores de patrimônio imobiliário',
        'Arrematantes em leilões judiciais e extrajudiciais',
        'Incorporadoras avaliando terrenos',
        'Brasileiros no exterior e estrangeiros comprando no Brasil',
      ],
    },
  },
];
