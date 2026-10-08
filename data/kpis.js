/* Dados verificados em fontes públicas oficiais. Atualize aqui. Ver "fontes" e "observacao" de cada KPI.
   Campos de série: ano, valor (município), meta (quando a fonte publica), al/br (referência de comparação). */
window.PAINEL = {
  atualizado: '08/10/2026',
  nomeMunicipio: 'Arapiraca',

  eixos: [
    { id: 'educacao', nome: 'Educação', cor: '#0090D8', soft: '#E6F5FC', icone: 'E',
      descricao: 'Qualidade do aprendizado e fluxo escolar na rede municipal (IDEB).' },
    { id: 'saude', nome: 'Saúde', cor: '#D81818', soft: '#FDECEC', icone: 'S',
      descricao: 'Resultado de saúde materno-infantil e acesso à atenção básica.' },
    { id: 'economia', nome: 'Desenvolvimento Econômico', cor: '#E0700F', soft: '#FEF1E6', icone: 'D',
      descricao: 'Produção de riqueza por habitante e remuneração do trabalho formal.' }
  ],

  kpis: [
    /* ---------------- EDUCAÇÃO ---------------- */
    {
      id: 'E1', eixo: 'educacao', tag: 'Educação · IDEB',
      titulo: 'IDEB — anos iniciais (rede municipal)',
      descricao: 'Nota que combina aprovação e desempenho em Língua Portuguesa e Matemática (SAEB).',
      unidadeCurta: 'pts', dec: 1, melhorSe: 'maior', inicioZero: false,
      serie: [
        { ano: 2005, valor: 3.0, meta: null, al: 2.38, br: 3.51 },
        { ano: 2007, valor: 3.7, meta: 3.0, al: 2.87, br: 3.92 },
        { ano: 2009, valor: 3.5, meta: 3.4, al: 3.3, br: 4.42 },
        { ano: 2011, valor: 4.1, meta: 3.8, al: 3.33, br: 4.77 },
        { ano: 2013, valor: 4.1, meta: 4.1, al: 3.59, br: 4.94 },
        { ano: 2015, valor: 4.6, meta: 4.4, al: 4.22, br: 5.29 },
        { ano: 2017, valor: 5.0, meta: 4.7, al: 4.78, br: 5.52 },
        { ano: 2019, valor: 5.4, meta: 5.0, al: 5.27, br: 5.68 },
        { ano: 2021, valor: 5.6, meta: 5.3, al: 5.32, br: 5.54 },
        { ano: 2023, valor: 5.5, meta: null, al: 5.91, br: 5.79 },
        { ano: 2025, valor: 6.3, meta: null, al: 6.52, br: 6.18 }
      ],
      pergunta: 'O ensino municipal de 1º ao 5º ano está aprendendo e avançando de série no ritmo esperado?',
      formula: 'IDEB = taxa de aprovação (P) × média padronizada do SAEB (N)',
      fonte: 'INEP — IDEB, planilha de resultados por município (anos iniciais), rede municipal, código 2700300',
      url: 'https://download.inep.gov.br/ideb/resultados/divulgacao_anos_iniciais_municipios_2025.zip',
      comparacao: 'Meta projetada pelo INEP (2007–2021), média simples dos municípios de Alagoas e do Brasil (rede municipal) no mesmo ano.',
      permite: 'Arapiraca subiu de 3,0 (2005) para 6,3 (2025) e superou a meta publicada até 2021. Em 2025, ficou 0,2 abaixo da média simples de Alagoas (6,52) e 0,1 acima da do Brasil (6,18).',
      naoPermite: 'Não permite dizer a causa da melhora nem atribuí-la a uma gestão ou programa. A nota agrega aprovação e aprendizagem; não mostra, sozinha, quais escolas ou séries puxam o resultado.',
      decisao: { acao: 'Alterar', texto: 'Priorizar apoio pedagógico nas escolas com nota abaixo da média estadual, antes de ampliar metas.' },
      limitacao: 'IDEB é divulgado a cada dois anos, com pausas em 2020–2021 pela pandemia. A média de Alagoas e do Brasil é calculada pela média simples dos municípios, não é a nota oficial do estado ou do país.'
    },
    {
      id: 'E2', eixo: 'educacao', tag: 'Educação · IDEB',
      titulo: 'IDEB — anos finais (rede municipal)',
      descricao: 'Mesma escala do IDEB, para o 6º ao 9º ano do ensino fundamental.',
      unidadeCurta: 'pts', dec: 1, melhorSe: 'maior', inicioZero: false,
      serie: [
        { ano: 2005, valor: 2.0, meta: null, al: 2.26, br: 3.04 },
        { ano: 2007, valor: 2.6, meta: 2.1, al: 2.47, br: 3.34 },
        { ano: 2009, valor: 3.3, meta: 2.3, al: 2.71, br: 3.56 },
        { ano: 2011, valor: 3.3, meta: 2.6, al: 2.55, br: 3.71 },
        { ano: 2013, valor: 3.2, meta: 3.1, al: 2.73, br: 3.78 },
        { ano: 2015, valor: 3.8, meta: 3.5, al: 3.14, br: 4.02 },
        { ano: 2017, valor: 3.8, meta: 3.8, al: 3.84, br: 4.17 },
        { ano: 2019, valor: 4.5, meta: 4.1, al: 4.47, br: 4.46 },
        { ano: 2021, valor: 5.0, meta: 4.3, al: 4.66, br: 4.73 },
        { ano: 2023, valor: 4.7, meta: null, al: 4.9, br: 4.59 },
        { ano: 2025, valor: 5.4, meta: null, al: 5.33, br: 4.88 }
      ],
      pergunta: 'Os alunos do 6º ao 9º ano estão aprendendo e concluindo a etapa no tempo previsto?',
      formula: 'IDEB = taxa de aprovação (P) × média padronizada do SAEB (N)',
      fonte: 'INEP — IDEB, planilha de resultados por município (anos finais), rede municipal, código 2700300',
      url: 'https://download.inep.gov.br/ideb/resultados/divulgacao_anos_finais_municipios_2025.zip',
      comparacao: 'Meta projetada pelo INEP (2007–2021), média simples dos municípios de Alagoas e do Brasil (rede municipal) no mesmo ano.',
      permite: 'Em 2025, o IDEB dos anos finais (5,4) ficou acima da média simples de Alagoas (5,33) e da do Brasil (4,88), e superou a meta até 2021. A trajetória desde 2005 é de melhora clara.',
      naoPermite: 'Não permite afirmar que o ensino está bom ou ruim em termos absolutos. A queda de 5,0 (2021) para 4,7 (2023) precisa ser explicada antes de qualquer conclusão sobre tendência.',
      decisao: { acao: 'Manter', texto: 'Manter o acompanhamento e investigar a queda de 2023 pelos componentes (aprovação e SAEB) antes de decidir mudanças.' },
      limitacao: 'Mesma limitação de periodicidade do IDEB. A comparação com o estado é feita pela média simples dos municípios, e não pela nota oficial de Alagoas.'
    },

    /* ---------------- SAÚDE ---------------- */
    {
      id: 'S1', eixo: 'saude', tag: 'Saúde · Materno-infantil',
      titulo: 'Mortalidade infantil',
      descricao: 'Óbitos de menores de 1 ano para cada mil nascidos vivos.',
      unidadeCurta: '/mil NV', dec: 1, melhorSe: 'menor', inicioZero: false,
      serie: [
        { ano: 2024, valor: 14.7, meta: null, al: null, br: null }
      ],
      pergunta: 'Quantas crianças menores de 1 ano morrem para cada mil nascidas vivas em Arapiraca?',
      formula: 'Óbitos de menores de 1 ano / nascidos vivos no mesmo ano × 1.000',
      fonte: 'Secretaria Municipal de Saúde de Arapiraca — Boletim Epidemiológico (Vigi-Óbito, ref. jan–dez/2024)',
      url: 'https://web.arapiraca.al.gov.br/wp-content/uploads/2025/01/BOLETIMEPIDEMIOLGICOVIGIBITOBITOMATERNOINFANTILEFETALJANDEZDE2024.pdf',
      comparacao: 'Apenas o próprio valor de 2024. Não há série histórica nem média de Alagoas ou do Brasil verificadas nesta versão.',
      permite: 'Em 2024, a taxa municipal foi de 14,7 óbitos infantis por mil nascidos vivos, segundo o boletim municipal.',
      naoPermite: 'Não permite dizer se a mortalidade melhorou ou piorou, nem se é alta ou baixa, porque não há série nem referência comparável. Não substitui a série oficial do SIM/SINASC.',
      decisao: { acao: 'Alterar', texto: 'Antes de usar o indicador para decidir, levantar a série 2010–2024 no TabNet (SIM/SINASC) e comparar com Alagoas e Brasil.' },
      limitacao: 'Dado de boletim municipal, não consolidado pelo SIM/SINASC. O denominador (nascidos vivos) não aparece no texto do boletim. Os boletins de 2025 são parciais.'
    },
    {
      id: 'S2', eixo: 'saude', tag: 'Saúde · Atenção Básica',
      titulo: 'Cobertura da Atenção Básica (Saúde da Família)',
      descricao: 'Percentual da população coberta por equipes de Saúde da Família.',
      unidadeCurta: '%', dec: 1, melhorSe: 'maior', inicioZero: true,
      serie: [],
      pergunta: 'Quanto da população de Arapiraca tem equipe de saúde da família perto de casa?',
      formula: 'População coberta por equipes de Saúde da Família / população estimada × 100',
      fonte: 'e-Gestor Atenção Básica / SISAB (Ministério da Saúde)',
      url: 'https://egestorab.saude.gov.br/',
      comparacao: 'Não verificado nesta versão. A referência ideal é a série do próprio município, com Alagoas e Brasil no mesmo ano.',
      permite: 'Ainda não há valor verificado. O indicador foi mantido porque é central para ler acesso à saúde.',
      naoPermite: 'Não permite conclusão nenhuma sobre cobertura até que a série seja extraída do e-Gestor AB.',
      decisao: { acao: 'Alterar', texto: 'Extrair a série de cobertura do e-Gestor AB (Arapiraca, 2019–2024) e preencher este cartão antes da AB2.' },
      limitacao: 'O e-Gestor AB não respondeu durante a coleta. Este cartão aparece vazio de propósito, para não preencher com número sem fonte.'
    },

    /* ---------------- DESENVOLVIMENTO ECONÔMICO ---------------- */
    {
      id: 'D1', eixo: 'economia', tag: 'Desenvolvimento Econômico · Renda',
      titulo: 'PIB per capita',
      descricao: 'Riqueza produzida no município dividida pela população residente (preços correntes).',
      unidadeCurta: 'R$', prefixo: true, dec: 0, melhorSe: 'maior', inicioZero: true,
      serie: [
        { ano: 2019, valor: 21423.02, meta: null, al: 17667.79, br: 35161.7 },
        { ano: 2020, valor: 22430.51, meta: null, al: 18857.69, br: 35935.74 },
        { ano: 2021, valor: 25249.73, meta: null, al: 22662.01, br: 42247.52 },
        { ano: 2023, valor: 29318.52, meta: null, al: null, br: null }
      ],
      pergunta: 'Quanto cada morador de Arapiraca corresponde em riqueza produzida pelo município?',
      formula: 'PIB a preços correntes do município / população residente estimada',
      fonte: 'IBGE — Contas Regionais (PIB dos Municípios) e Estimativas da População',
      url: 'https://www.ibge.gov.br/cidades-e-estados/al/arapiraca.html',
      comparacao: 'Média de Alagoas e do Brasil em 2019–2021. Para 2023, o valor vem do IBGE Cidades e não há referência estadual calculada.',
      permite: 'De 2019 a 2023, o PIB per capita nominal subiu cerca de 37%. Em 2021, Arapiraca (R$ 25.250) ficou acima da média de Alagoas (R$ 22.662) e abaixo da do Brasil (R$ 42.248).',
      naoPermite: 'Não permite falar em ganho de renda da população: o valor é nominal (sem descontar inflação) e a riqueza do município não se traduz em salário ou distribuição.',
      decisao: { acao: 'Manter', texto: 'Manter o indicador e incluir uma versão deflacionada (IPCA) e a série até 2024, quando publicada.' },
      limitacao: 'Valores nominais. Os valores de 2019–2021 foram calculados pelo grupo a partir de PIB e população do IBGE. O de 2023 é o valor publicado no IBGE Cidades. 2022 e 2024 não foram verificados.'
    },
    {
      id: 'D2', eixo: 'economia', tag: 'Desenvolvimento Econômico · Trabalho',
      titulo: 'Salário médio mensal do trabalho formal',
      descricao: 'Remuneração média de quem tem carteira assinada, em reais correntes.',
      unidadeCurta: 'R$', prefixo: true, dec: 0, melhorSe: 'maior', inicioZero: true,
      serie: [
        { ano: 2010, valor: 845.87, meta: null, al: 1197.07, br: 1650.3 },
        { ano: 2011, valor: 915.53, meta: null, al: 1281.08, br: 1792.61 },
        { ano: 2012, valor: 1022.93, meta: null, al: 1398.87, br: 1944.2 },
        { ano: 2013, valor: 1113.9, meta: null, al: 1544.7, br: 2129.17 },
        { ano: 2014, valor: 1203.48, meta: null, al: 1697.92, br: 2302.84 },
        { ano: 2015, valor: 1280.81, meta: null, al: 1796.51, br: 2480.36 },
        { ano: 2016, valor: 1416.53, meta: null, al: 1955.47, br: 2661.18 },
        { ano: 2017, valor: 1517.82, meta: null, al: 2102.29, br: 2848.77 },
        { ano: 2018, valor: 1604.82, meta: null, al: 2212.77, br: 2952.87 },
        { ano: 2019, valor: 1613.29, meta: null, al: 2262.62, br: 2975.74 },
        { ano: 2020, valor: 1615.08, meta: null, al: 2322.87, br: 3043.81 },
        { ano: 2021, valor: 1767.15, meta: null, al: 2427.38, br: 3266.53 }
      ],
      pergunta: 'Quanto ganha, em média, quem tem emprego formal em Arapiraca, e isso acompanha o estado e o país?',
      formula: 'Salários e outras remunerações / pessoal assalariado médio (valor mensal, em reais)',
      fonte: 'IBGE — Cadastro Central de Empresas (CEMPRE), agregado 1685, variável 10143',
      url: 'https://servicodados.ibge.gov.br/api/v3/agregados/1685/periodos/2010-2021/variaveis/10143?localidades=N6[2700300]',
      comparacao: 'Média de Alagoas e do Brasil no mesmo ano (2010–2021).',
      permite: 'O salário médio formal de Arapiraca subiu de R$ 846 (2010) para R$ 1.767 (2021). Em 2021 ele era cerca de 73% do salário médio de Alagoas, contra cerca de 71% em 2010.',
      naoPermite: 'Não permite dizer se o trabalho formal aumentou no município: o valor é médio e nominal, e não informa quantas pessoas têm carteira assinada.',
      decisao: { acao: 'Alterar', texto: 'Buscar a série após 2021 (RAIS ou Novo CAGED) e acrescentar o número de vínculos formais antes de decidir.' },
      limitacao: 'A série oficial do IBGE encerra em 2021. Valores nominais. Não há dado de vínculos formais verificado nesta versão.'
    }
  ],

  permite: [
    'A rede municipal de anos iniciais e anos finais melhorou o IDEB desde 2005 e superou a meta publicada até 2021.',
    'Em 2025, o IDEB dos anos finais de Arapiraca ficou acima da média simples de Alagoas e do Brasil.',
    'A renda média por habitante (PIB per capita) cresceu em termos nominais e supera a média de Alagoas.',
    'O salário formal médio de Arapiraca é cerca de 73% do de Alagoas, com distância quase estável desde 2010.'
  ],
  naoPermite: [
    'Dizer se o município tem bom ou mau desempenho global: são seis indicadores, de três áreas, com séries de tamanhos diferentes.',
    'Atribuir melhoras a uma gestão, secretaria ou programa. Não há dados de execução orçamentária por política neste painel.',
    'Avaliar a mortalidade infantil e a cobertura de saúde: faltam série histórica e referência comparável.',
    'Afirmar aumento real de renda, pois os valores econômicos são nominais e não foram deflacionados.'
  ],
  recomendacoes: [
    '<strong>Completar as séries de saúde:</strong> extrair a mortalidade infantil 2010–2024 no TabNet (SIM/SINASC) e a cobertura da Atenção Básica no e-Gestor AB, comparando com Alagoas e Brasil.',
    '<strong>Deflacionar a renda:</strong> incluir PIB per capita e salário médio em reais de um mesmo ano (IPCA), para separar crescimento real de inflação.',
    '<strong>Ampliar a série de emprego:</strong> buscar RAIS ou Novo CAGED para 2022 em diante e acrescentar o número de vínculos formais ao salário médio.',
    '<strong>Explicar a queda do IDEB dos anos finais em 2023:</strong> separar aprovação e SAEB antes de decidir mudanças pedagógicas.'
  ],
  fontes: [
    'INEP — IDEB, resultados por município (anos iniciais e finais), 2005–2025. <a href="https://ideb.inep.gov.br/" target="_blank" rel="noopener">ideb.inep.gov.br</a>',
    'IBGE — Contas Regionais (PIB dos Municípios, agregado 5938) e Estimativas da População (agregado 6579), via API de Agregados. <a href="https://www.ibge.gov.br/cidades-e-estados/al/arapiraca.html" target="_blank" rel="noopener">IBGE Cidades: Arapiraca</a>',
    'IBGE — CEMPRE, salário médio mensal (agregado 1685, variável 10143), 2010–2021.',
    'Secretaria Municipal de Saúde de Arapiraca — Boletim Epidemiológico Vigi-Óbito (ref. 2024). <a href="https://web.arapiraca.al.gov.br/" target="_blank" rel="noopener">web.arapiraca.al.gov.br</a>',
    'Referências de Alagoas e Brasil em IDEB: média simples das notas da rede municipal, calculada a partir das planilhas do INEP.'
  ]
};
