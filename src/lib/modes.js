/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const f = s =>
  s
    .replaceAll(/([^\n{])\n([^\n}\s+])/g, '$1 $2')
    .replaceAll(/\n{3,}/g, '\n\n')
    .trim()

const HIGH_QUALITY_LEGAL_STANDARD = `

INSTRUÇÕES GERAIS DE ALTA QUALIDADE:
1.  **PROFUNDIDADE E VOLUME:** Gere um documento completo, robusto e volumoso. Não crie um simples modelo com lacunas. Desenvolva os argumentos, explore os fatos fornecidos e construa uma peça processual detalhada e pronta para uso. A peça deve ser significativamente mais longa e detalhada do que um template básico.
2.  **RIGOR TÉCNICO E LINGUAGEM:** Utilize linguagem jurídica formal e de alto nível. Incorpore termos técnicos e expressões em latim (e.g., "fumus boni iuris", "periculum in mora", "in dubio pro reo") de forma correta e contextualizada. A redação deve ser precisa, eloquente e persuasiva.
3.  **FUNDAMENTAÇÃO ROBUSTA:** Baseie todos os argumentos em dispositivos legais específicos (citando artigos, parágrafos e incisos do Código Civil, CPC, CLT, etc.), doutrina relevante e, quando a pesquisa for ativada, em jurisprudência atualizada.
4.  **ESTRUTURA CLÁSSICA:** Siga a estrutura canônica para o tipo de documento, com tópicos bem definidos (e.g., "I - DOS FATOS", "II - DO DIREITO", "III - DOS PEDIDOS").
`;

const HIGH_QUALITY_CULTURAL_STANDARD = `

INSTRUÇÕES GERAIS PARA PROJETOS CULTURAIS:
1.  **CONCEITUAÇÃO E POÉTICA:** Desenvolva a fundamentação teórica e artística do projeto com profundidade. Utilize referências culturais, históricas e sociais pertinentes.
2.  **DETALHAMENTO TÉCNICO:** Descreva minuciosamente as etapas de execução, metodologias e recursos necessários.
3.  **IMPACTO SOCIAL E ACESSIBILIDADE:** Enfatize como o projeto promove a democratização do acesso à cultura e atende às exigências de acessibilidade física e atitudinal.
4.  **LINGUAGEM ADEQUADA:** Utilize terminologia própria da gestão cultural e editais (e.g., "contrapartida social", "público-alvo", "difusão", "fomento").
5.  **ESTRUTURA DE EDITAL:** Organize o documento conforme os padrões exigidos pelos principais órgãos de fomento (Lei Paulo Gustavo, Lei Aldir Blanc, Rouanet, etc.).
`;

const HIGH_QUALITY_ACADEMIC_STANDARD = `

INSTRUÇÕES GERAIS PARA TRABALHOS ACADÊMICOS:
1.  **RIGOR CIENTÍFICO:** Utilize metodologia acadêmica, citações bibliográficas e linguagem técnica apropriada.
2.  **ESTRUTURA DIDÁTICA:** Organize o conteúdo de forma lógica e progressiva, facilitando a compreensão do tema.
3.  **PROFUNDIDADE ANALÍTICA:** Explore as diferentes correntes doutrinárias e jurisprudenciais sobre o assunto.
4.  **FORMATAÇÃO:** Siga as normas da ABNT (ou equivalente) para citações e referências.
`;

export default {
  direitoBrasileiroPrivado: {
    name: "Direito Brasileiro - Privado",
    areas: {
      civilParteGeral: {
        name: "Civil - Parte Geral",
        emoji: "⚖️",
        documents: {
          peticaoInicialCivel: { name: "Petição Inicial Cível", emoji: "📝", systemInstruction: f(`Elabore uma Petição Inicial Cível completa. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contestacao: { name: "Contestação", emoji: "🛡️", systemInstruction: f(`Elabore uma Contestação Cível. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          reconvencao: { name: "Reconvenção", emoji: "🔄", systemInstruction: f(`Elabore uma Reconvenção. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          replica: { name: "Réplica à Contestação", emoji: "🗣️", systemInstruction: f(`Elabore uma Réplica à Contestação. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          agravoDeInstrumento: { name: "Agravo de Instrumento", emoji: "📄", systemInstruction: f(`Elabore um Agravo de Instrumento. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          apelacaoCivel: { name: "Apelação Cível", emoji: "🏛️", systemInstruction: f(`Elabore uma Apelação Cível. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          embargosDeDeclaracao: { name: "Embargos de Declaração", emoji: "🔎", systemInstruction: f(`Elabore Embargos de Declaração. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoEspecial: { name: "Recurso Especial", emoji: "🔵", systemInstruction: f(`Elabore um Recurso Especial Cível ao STJ. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoExtraordinario: { name: "Recurso Extraordinário", emoji: "🔴", systemInstruction: f(`Elabore um Recurso Extraordinário ao STF. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          tutelaDeUrgencia: { name: "Tutela de Urgência", emoji: "⚡", systemInstruction: f(`Elabore um pedido de Tutela de Urgência. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDeclaratoria: { name: "Ação Declaratória", emoji: "📣", systemInstruction: f(`Elabore uma Ação Declaratória. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDeCobranca: { name: "Ação de Cobrança", emoji: "💰", systemInstruction: f(`Elabore uma Ação de Cobrança. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          execucaoDeTituloExtrajudicial: { name: "Execução de Título Extrajudicial", emoji: "🔩", systemInstruction: f(`Elabore uma Ação de Execução de Título Extrajudicial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          embargosAExecucao: { name: "Embargos à Execução", emoji: "✋", systemInstruction: f(`Elabore Embargos à Execução. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          excecaoDePreExecutividade: { name: "Exceção de Pré-executividade", emoji: "💡", systemInstruction: f(`Elabore uma Exceção de Pré-executividade. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          memoriais: { name: "Memoriais", emoji: "✍️", systemInstruction: f(`Elabore Memoriais / Alegações Finais por escrito. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      obrigacoesEContratos: {
        name: "Obrigações e Contratos",
        emoji: "📜",
        documents: {
          contratoCompraEVenda: { name: "Contrato de Compra e Venda", emoji: "🛒", systemInstruction: f(`Elabore um Contrato de Compra e Venda. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoDeLocacao: { name: "Contrato de Locação", emoji: "🏘️", systemInstruction: f(`Elabore um Contrato de Locação. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoPrestacaoServicos: { name: "Contrato de Prestação de Serviços", emoji: "👨‍🔧", systemInstruction: f(`Elabore um Contrato de Prestação de Serviços. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoDeEmpreitada: { name: "Contrato de Empreitada", emoji: "🏗️", systemInstruction: f(`Elabore um Contrato de Empreitada. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoDeMutuo: { name: "Contrato de Mútuo", emoji: "💸", systemInstruction: f(`Elabore um Contrato de Mútuo. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoRevisionalContrato: { name: "Ação Revisional de Contrato", emoji: "🔄", systemInstruction: f(`Elabore uma Ação Revisional de Contrato. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoResolucaoContratual: { name: "Ação de Resolução Contratual", emoji: "💥", systemInstruction: f(`Elabore uma Ação de Resolução Contratual por inadimplemento. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoConsignacaoPagamento: { name: "Ação de Consignação em Pagamento", emoji: "🏦", systemInstruction: f(`Elabore uma Ação de Consignação em Pagamento. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          distratoContratual: { name: "Distrato Contratual", emoji: "🤝", systemInstruction: f(`Elabore um Distrato Contratual. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          notificacaoExtrajudicialInadimplemento: { name: "Notificação Extrajudicial de Inadimplemento", emoji: "✉️", systemInstruction: f(`Elabore uma Notificação Extrajudicial de Inadimplemento. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoComodato: { name: "Contrato de Comodato", emoji: "🏠", systemInstruction: f(`Elabore um Contrato de Comodato. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoDeposito: { name: "Contrato de Depósito", emoji: "📦", systemInstruction: f(`Elabore um Contrato de Depósito. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoDasCoisas: {
        name: "Direito das Coisas / Reais",
        emoji: "🏞️",
        documents: {
          acaoUsucapiaoExtraordinaria: { name: "Ação de Usucapião Extraordinária", emoji: "⏳", systemInstruction: f(`Elabore uma Ação de Usucapião Extraordinária. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoReivindicatoria: { name: "Ação Reivindicatória", emoji: "🔑", systemInstruction: f(`Elabore uma Ação Reivindicatória. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoReintegracaoPosse: { name: "Ação de Reintegração de Posse", emoji: "🚶‍♂️", systemInstruction: f(`Elabore uma Ação de Reintegração de Posse. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          interditoProibitorio: { name: "Interdito Proibitório", emoji: "🚧", systemInstruction: f(`Elabore um Interdito Proibitório. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          embargosDeTerceiro: { name: "Embargos de Terceiro", emoji: "🛡️", systemInstruction: f(`Elabore Embargos de Terceiro. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoExtincaoCondominio: { name: "Ação de Extinção de Condomínio", emoji: "➗", systemInstruction: f(`Elabore uma Ação de Extinção de Condomínio. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoNunciacaoObraNova: { name: "Ação de Nunciação de Obra Nova", emoji: "🏗️", systemInstruction: f(`Elabore uma Ação de Nunciação de Obra Nova. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDanoInfecto: { name: "Ação de Dano Infecto", emoji: "🏚️", systemInstruction: f(`Elabore uma Ação de Dano Infecto. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDemarcatoria: { name: "Ação Demarcatória", emoji: "📏", systemInstruction: f(`Elabore uma Ação Demarcatória. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDivisoria: { name: "Ação Divisória", emoji: "✂️", systemInstruction: f(`Elabore uma Ação Divisória de Terras Particulares. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoImissaoPosse: { name: "Ação de Imissão na Posse", emoji: "🚪", systemInstruction: f(`Elabore uma Ação de Imissão na Posse. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoManutencaoPosse: { name: "Ação de Manutenção de Posse", emoji: "✋", systemInstruction: f(`Elabore uma Ação de Manutenção de Posse. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoFamilia: {
        name: "Direito de Família",
        emoji: "👨‍👩‍👧‍👦",
        documents: {
          divorcioConsensual: { name: "Divórcio Consensual", emoji: "🤝", systemInstruction: f(`Elabore uma Petição de Divórcio Consensual. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          divorcioLitigioso: { name: "Divórcio Litigioso", emoji: "⚔️", systemInstruction: f(`Elabore uma Petição de Divórcio Litigioso. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          dissolucaoUniaoEstavel: { name: "Dissolução de União Estável", emoji: "💔", systemInstruction: f(`Elabore uma Petição de Dissolução de União Estável. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoAlimentos: { name: "Ação de Alimentos", emoji: "🍽️", systemInstruction: f(`Elabore uma Ação de Alimentos. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          execucaoAlimentos: { name: "Execução de Alimentos", emoji: "⚖️", systemInstruction: f(`Elabore uma Ação de Execução de Alimentos (rito da prisão ou expropriação). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoGuarda: { name: "Ação de Guarda", emoji: "👶", systemInstruction: f(`Elabore uma Ação de Guarda (unilateral ou compartilhada). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          investigacaoPaternidade: { name: "Investigação de Paternidade", emoji: "🧬", systemInstruction: f(`Elabore uma Ação de Investigação de Paternidade. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          adocao: { name: "Adoção", emoji: "❤️", systemInstruction: f(`Elabore uma Ação de Adoção. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          interdicao: { name: "Interdição / Curatela", emoji: "🧑‍⚖️", systemInstruction: f(`Elabore uma Ação de Interdição e Curatela. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pactoAntenupcial: { name: "Pacto Antenupcial", emoji: "💍", systemInstruction: f(`Elabore uma minuta de Pacto Antenupcial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoRevisionalAlimentos: { name: "Ação Revisional de Alimentos", emoji: "📈", systemInstruction: f(`Elabore uma Ação Revisional de Alimentos. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoExoneracaoAlimentos: { name: "Ação de Exoneração de Alimentos", emoji: "🔓", systemInstruction: f(`Elabore uma Ação de Exoneração de Alimentos. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoSucessoes: {
        name: "Direito das Sucessões",
        emoji: "🕊️",
        documents: {
          inventarioJudicial: { name: "Inventário Judicial", emoji: "🏛️", systemInstruction: f(`Elabore uma Petição de Abertura de Inventário Judicial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          inventarioExtrajudicial: { name: "Inventário Extrajudicial", emoji: "✍️", systemInstruction: f(`Elabore uma minuta de Escritura para Inventário Extrajudicial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          arrolamentoSumario: { name: "Arrolamento Sumário", emoji: "📄", systemInstruction: f(`Elabore uma Petição de Arrolamento Sumário. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          alvaraJudicial: { name: "Alvará Judicial", emoji: "💸", systemInstruction: f(`Elabore um Pedido de Alvará Judicial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoNulidadeTestamento: { name: "Ação de Nulidade de Testamento", emoji: "❌", systemInstruction: f(`Elabore uma Ação de Nulidade de Testamento. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          cessaoDireitosHereditarios: { name: "Cessão de Direitos Hereditários", emoji: "🔄", systemInstruction: f(`Elabore um Contrato de Cessão de Direitos Hereditários. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          testamentoPublico: { name: "Testamento Público", emoji: "📜", systemInstruction: f(`Elabore uma minuta de Testamento Público. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          peticaoHeranca: { name: "Ação de Petição de Herança", emoji: "🙋‍♂️", systemInstruction: f(`Elabore uma Ação de Petição de Herança. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoSonegados: { name: "Ação de Sonegados", emoji: "🕵️", systemInstruction: f(`Elabore uma Ação de Sonegados. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoSobrepartilha: { name: "Ação de Sobrepartilha", emoji: "➕", systemInstruction: f(`Elabore uma Ação de Sobrepartilha. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoConsumidor: {
        name: "Direito do Consumidor",
        emoji: "🛒",
        documents: {
          peticaoInicialJEC: { name: "Petição Inicial (JEC)", emoji: "⚡", systemInstruction: f(`Elabore uma Petição Inicial para Juizado Especial Cível (Consumidor). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contestacaoConsumerista: { name: "Contestação Consumerista", emoji: "🛡️", systemInstruction: f(`Elabore uma Contestação em Ação de Consumidor. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoInominado: { name: "Recurso Inominado", emoji: "📤", systemInstruction: f(`Elabore um Recurso Inominado (JEC). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoRepeticaoIndebito: { name: "Ação de Repetição de Indébito", emoji: "💰", systemInstruction: f(`Elabore uma Ação de Repetição de Indébito. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoVicioProduto: { name: "Ação de Vício do Produto", emoji: "🔧", systemInstruction: f(`Elabore uma Ação por Vício do Produto ou Serviço. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoNegativacaoIndevida: { name: "Ação de Negativação Indevida", emoji: "🚫", systemInstruction: f(`Elabore uma Ação por Negativação Indevida. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoAtrasoVoo: { name: "Ação por Atraso ou Cancelamento de Voo", emoji: "✈️", systemInstruction: f(`Elabore uma Ação de Indenização por Danos Morais e Materiais devido a atraso/cancelamento de voo. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoPropagandaEnganosa: { name: "Ação por Propaganda Enganosa", emoji: "📢", systemInstruction: f(`Elabore uma Ação de Indenização por Propaganda Enganosa. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoCobrancaIndevidaTelefonia: { name: "Ação de Cobrança Indevida (Telefonia)", emoji: "📱", systemInstruction: f(`Elabore uma Ação de Repetição de Indébito contra operadora de telefonia. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoResponsabilidadeFatoServico: { name: "Ação de Responsabilidade pelo Fato do Serviço", emoji: "⚠️", systemInstruction: f(`Elabore uma Ação de Indenização por danos causados por defeito na prestação do serviço. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoImobiliario: {
        name: "Direito Imobiliário",
        emoji: "🏘️",
        documents: {
          contratoCompraVendaImovel: { name: "Contrato de Compra e Venda de Imóvel", emoji: "📜", systemInstruction: f(`Elabore um Contrato de Compra e Venda de Imóvel. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoLocacaoResidencial: { name: "Contrato de Locação Residencial", emoji: "🏠", systemInstruction: f(`Elabore um Contrato de Locação Residencial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDespejo: { name: "Ação de Despejo", emoji: "🚪", systemInstruction: f(`Elabore uma Ação de Despejo (falta de pagamento, denúncia vazia, etc.). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoRenovatoria: { name: "Ação Renovatória de Locação", emoji: "🔄", systemInstruction: f(`Elabore uma Ação Renovatória de Locação Comercial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          adjudicacaoCompulsoria: { name: "Adjudicação Compulsória", emoji: "✍️", systemInstruction: f(`Elabore uma Ação de Adjudicação Compulsória. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          convencaoCondominio: { name: "Convenção de Condomínio", emoji: "🏢", systemInstruction: f(`Elabore uma Convenção de Condomínio. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoCobrancaCondominial: { name: "Ação de Cobrança Condominial", emoji: "💸", systemInstruction: f(`Elabore uma Ação de Cobrança de Cotas Condominiais. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoRevisionalAluguel: { name: "Ação Revisional de Aluguel", emoji: "📊", systemInstruction: f(`Elabore uma Ação Revisional de Aluguel. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoConsignacaoChaves: { name: "Ação de Consignação de Chaves", emoji: "🔑", systemInstruction: f(`Elabore uma Ação de Consignação de Chaves e Aluguéis. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoUsucapiaoUrbana: { name: "Ação de Usucapião Urbana", emoji: "🏙️", systemInstruction: f(`Elabore uma Ação de Usucapião Especial Urbana. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoTrabalho: {
        name: "Direito do Trabalho",
        emoji: "🧑‍💼",
        documents: {
          reclamacaoTrabalhista: { name: "Reclamação Trabalhista", emoji: "✊", systemInstruction: f(`Elabore uma Reclamação Trabalhista completa. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contestacaoTrabalhista: { name: "Contestação Trabalhista", emoji: "🛡️", systemInstruction: f(`Elabore uma Contestação Trabalhista. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoOrdinario: { name: "Recurso Ordinário (RO)", emoji: "📤", systemInstruction: f(`Elabore um Recurso Ordinário Trabalhista. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoRevista: { name: "Recurso de Revista (RR)", emoji: "✈️", systemInstruction: f(`Elabore um Recurso de Revista ao TST. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          agravoPeticao: { name: "Agravo de Petição", emoji: "⚙️", systemInstruction: f(`Elabore um Agravo de Petição. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          embargosExecucaoTrabalhista: { name: "Embargos à Execução Trabalhista", emoji: "✋", systemInstruction: f(`Elabore Embargos à Execução Trabalhista. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acordoExtrajudicialCLT: { name: "Acordo Extrajudicial (CLT 855-B)", emoji: "🤝", systemInstruction: f(`Elabore uma Petição de Homologação de Acordo Extrajudicial Trabalhista. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          inqueritoFaltaGrave: { name: "Inquérito para Apuração de Falta Grave", emoji: "🕵️", systemInstruction: f(`Elabore um Inquérito para Apuração de Falta Grave. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          replicaTrabalhista: { name: "Réplica Trabalhista", emoji: "🗣️", systemInstruction: f(`Elabore uma Réplica à Contestação na Justiça do Trabalho. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoRescisoriaTrabalhista: { name: "Ação Rescisória Trabalhista", emoji: "❌", systemInstruction: f(`Elabore uma Ação Rescisória na esfera Trabalhista. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoEmpresarialSocietario: {
        name: "Empresarial - Societário",
        emoji: "🏢",
        documents: {
          contratoSocial: { name: "Contrato Social", emoji: "📝", systemInstruction: f(`Elabore um Contrato Social (LTDA). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          estatutoSocialSA: { name: "Estatuto Social de S/A", emoji: "📈", systemInstruction: f(`Elabore um Estatuto Social de Sociedade Anônima. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acordoAcionistas: { name: "Acordo de Sócios/Acionistas", emoji: "🤝", systemInstruction: f(`Elabore um Acordo de Sócios ou Acionistas. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          dissolucaoSociedade: { name: "Dissolução de Sociedade", emoji: "💔", systemInstruction: f(`Elabore uma Ação de Dissolução (Total ou Parcial) de Sociedade. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoApuracaoHaveres: { name: "Ação de Apuração de Haveres", emoji: "📊", systemInstruction: f(`Elabore uma Ação de Apuração de Haveres. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          exclusaoSocio: { name: "Ação de Exclusão de Sócio", emoji: "🚫", systemInstruction: f(`Elabore uma Ação de Exclusão de Sócio por falta grave. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoResponsabilidadeAdministrador: { name: "Ação de Responsabilidade de Administrador", emoji: "🧑‍💼", systemInstruction: f(`Elabore uma Ação de Responsabilidade contra Administrador de Sociedade. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          alteracaoContratoSocial: { name: "Alteração de Contrato Social", emoji: "📝", systemInstruction: f(`Elabore uma Alteração de Contrato Social. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acordoCotistas: { name: "Acordo de Cotistas", emoji: "🤝", systemInstruction: f(`Elabore um Acordo de Cotistas para LTDA. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          distratoSocial: { name: "Distrato Social", emoji: "👋", systemInstruction: f(`Elabore um Distrato Social para encerramento de empresa. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      recuperacaoJudicialFalencia: {
        name: "Recuperação Judicial e Falência",
        emoji: "⏳",
        documents: {
          pedidoRecuperacaoJudicial: { name: "Pedido de Recuperação Judicial", emoji: "🙏", systemInstruction: f(`Elabore uma Petição Inicial de Recuperação Judicial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          planoRecuperacaoJudicial: { name: "Plano de Recuperação Judicial", emoji: "🗺️", systemInstruction: f(`Elabore um Plano de Recuperação Judicial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          habilitacaoCredito: { name: "Habilitação de Crédito", emoji: "💰", systemInstruction: f(`Elabore uma Habilitação ou Impugnação de Crédito. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoFalencia: { name: "Pedido de Falência", emoji: "💥", systemInstruction: f(`Elabore um Pedido de Falência (pelo credor ou autofalência). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoRevocatoria: { name: "Ação Revocatória Falimentar", emoji: "⏪", systemInstruction: f(`Elabore uma Ação Revocatória Falimentar. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          impugnacaoRelacaoCredores: { name: "Impugnação à Relação de Credores", emoji: "❌", systemInstruction: f(`Elabore uma Impugnação à Relação de Credores. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoExtensaoEfeitosFalencia: { name: "Extensão de Efeitos da Falência", emoji: "🔗", systemInstruction: f(`Elabore um Pedido de Extensão de Efeitos da Falência para outras empresas do grupo. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoRestitucaoFalencia: { name: "Pedido de Restituição em Falência", emoji: "🔙", systemInstruction: f(`Elabore um Pedido de Restituição de Bem em Processo Falimentar. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          incidenteVerificacaoCredito: { name: "Incidente de Verificação de Crédito", emoji: "🔍", systemInstruction: f(`Elabore um Incidente de Verificação de Crédito. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoEncerramentoFalencia: { name: "Pedido de Encerramento de Falência", emoji: "🏁", systemInstruction: f(`Elabore um Pedido de Encerramento de Falência. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      propriedadeIntelectual: {
        name: "Propriedade Intelectual",
        emoji: "💡",
        documents: {
          pedidoRegistroMarca: { name: "Pedido de Registro de Marca (INPI)", emoji: "®️", systemInstruction: f(`Elabore um Pedido de Registro de Marca no INPI. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          oposicaoRegistroMarca: { name: "Oposição a Registro de Marca", emoji: "🚫", systemInstruction: f(`Elabore uma Oposição a Pedido de Registro de Marca. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoNulidadeMarca: { name: "Ação de Nulidade de Marca", emoji: "❌", systemInstruction: f(`Elabore uma Ação de Nulidade de Registro de Marca. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoAbstencaoUsoMarca: { name: "Ação de Abstenção de Uso de Marca", emoji: "✋", systemInstruction: f(`Elabore uma Ação de Abstenção de Uso de Marca (infração). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoLicenciamentoMarca: { name: "Contrato de Licenciamento de Marca", emoji: "🏷️", systemInstruction: f(`Elabore um Contrato de Licenciamento de Uso de Marca. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoViolacaoDireitosAutorais: { name: "Ação de Violação de Direitos Autorais", emoji: "©️", systemInstruction: f(`Elabore uma Ação de Violação de Direitos Autorais. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          notificacaoContrafacao: { name: "Notificação por Contrafação", emoji: "✉️", systemInstruction: f(`Elabore uma Notificação Extrajudicial por uso indevido de propriedade intelectual. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDanosPlagio: { name: "Ação de Reparação por Plágio", emoji: "✍️", systemInstruction: f(`Elabore uma Ação de Indenização por Plágio e violação de direitos morais. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoFranquia: { name: "Contrato de Franquia (Franchising)", emoji: "🏢", systemInstruction: f(`Elabore um Contrato de Franquia. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoAdministrativoINPI: { name: "Recurso Administrativo INPI", emoji: "📤", systemInstruction: f(`Elabore um Recurso Administrativo contra indeferimento de marca/patente no INPI. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoBancario: {
        name: "Direito Bancário e Financeiro",
        emoji: "🏦",
        documents: {
          acaoRevisionalContratoBancario: { name: "Ação Revisional de Contrato Bancário", emoji: "🔄", systemInstruction: f(`Elabore uma Ação Revisional de Contrato Bancário. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          defesaBuscaApreensao: { name: "Defesa em Busca e Apreensão", emoji: "🛡️", systemInstruction: f(`Elabore uma Defesa em Ação de Busca e Apreensão (Alienação Fiduciária). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          embargosExecucaoBancaria: { name: "Embargos à Execução Bancária", emoji: "✋", systemInstruction: f(`Elabore Embargos à Execução Bancária. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDanoMoralBancario: { name: "Ação de Dano Moral Bancário", emoji: "💸", systemInstruction: f(`Elabore uma Ação de Dano Moral por falha na prestação de serviço bancário. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoPrestacaoContasBancaria: { name: "Ação de Exigir Contas (Banco)", emoji: "📊", systemInstruction: f(`Elabore uma Ação de Exigir Contas contra instituição financeira. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoFraudePix: { name: "Ação por Fraude em Transferência PIX", emoji: "📱", systemInstruction: f(`Elabore uma Ação de Reparação de Danos por fraude/golpe via PIX com responsabilidade do banco. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          defesaExecucaoCedulaCredito: { name: "Defesa em Execução de CCB", emoji: "🛡️", systemInstruction: f(`Elabore uma Defesa (Embargos) em Execução de Cédula de Crédito Bancário. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoLimitacaoJuros: { name: "Ação de Limitação de Juros", emoji: "📉", systemInstruction: f(`Elabore uma Ação para Limitação de Juros Remuneratórios à taxa média de mercado. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoCancelamentoCartaoFraude: { name: "Ação por Fraude em Cartão de Crédito", emoji: "💳", systemInstruction: f(`Elabore uma Ação de Inexistência de Débito por compras fraudulentas no cartão. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          indenizacaoGolpeBoleto: { name: "Ação por Golpe do Boleto Falso", emoji: "📄", systemInstruction: f(`Elabore uma Ação de Indenização contra banco por emissão de boleto falso em sistema fraudado. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoAgrario: {
        name: "Direito Agrário",
        emoji: "🚜",
        documents: {
          contratoArrendamentoRural: { name: "Contrato de Arrendamento Rural", emoji: "🚜", systemInstruction: f(`Elabore um Contrato de Arrendamento Rural. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDesapropriacaoReformaAgraria: { name: "Defesa em Desapropriação Agrária", emoji: "🏞️", systemInstruction: f(`Elabore uma Defesa em Ação de Desapropriação para Reforma Agrária. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoReintegracaoPosseRural: { name: "Reintegração de Posse Rural", emoji: "🚶‍♂️", systemInstruction: f(`Elabore uma Ação de Reintegração de Posse Rural. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          usucapiaoRural: { name: "Ação de Usucapião Rural", emoji: "⏳", systemInstruction: f(`Elabore uma Ação de Usucapião Especial Rural (Pro Labore). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          divisaoTerrasRurais: { name: "Ação de Divisão de Terras Rurais", emoji: "✂️", systemInstruction: f(`Elabore uma Ação Divisória de Imóvel Rural. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          demarcacaoTerrasRurais: { name: "Ação Demarcatória Rural", emoji: "📏", systemInstruction: f(`Elabore uma Ação de Demarcação de Terras Rurais. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoParceriaRural: { name: "Contrato de Parceria Rural", emoji: "🤝", systemInstruction: f(`Elabore um Contrato de Parceria Rural (Agrícola ou Pecuária). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoPreferenciaRural: { name: "Ação de Preferência (Arrendatário)", emoji: "🏷️", systemInstruction: f(`Elabore uma Ação de Adjudicação Compulsória / Preferência para Arrendatário Rural. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          reintegracaoServidaoPassagem: { name: "Reintegração de Servidão de Passagem", emoji: "🛣️", systemInstruction: f(`Elabore uma Ação de Manutenção/Reintegração de Servidão de Passagem Rural. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDanoAmbientalRural: { name: "Ação por Dano Ambiental Rural", emoji: "🌳", systemInstruction: f(`Elabore uma Ação de Reparação de Danos por contaminação ou desmatamento ilegal em propriedade rural. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      terceiroSetor: {
        name: "Terceiro Setor",
        emoji: "🤝",
        documents: {
          estatutoSocialAssociacao: { name: "Estatuto Social de Associação", emoji: "📜", systemInstruction: f(`Elabore um Estatuto Social para Associação ou Fundação. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          termoColaboracao: { name: "Termo de Colaboração/Fomento", emoji: "✍️", systemInstruction: f(`Elabore um Termo de Colaboração ou Fomento com o poder público. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          mandadoSegurancaCEBAS: { name: "Mandado de Segurança (CEBAS)", emoji: "🛡️", systemInstruction: f(`Elabore um Mandado de Segurança referente ao CEBAS. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          prestacaoContas: { name: "Prestação de Contas", emoji: "📊", systemInstruction: f(`Elabore uma Prestação de Contas para projetos incentivados. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          constituicaoCooperativa: { name: "Estatuto de Cooperativa", emoji: "🚜", systemInstruction: f(`Elabore um Estatuto Social para uma Cooperativa. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          regimentoInternoTerceiroSetor: { name: "Regimento Interno", emoji: "📑", systemInstruction: f(`Elabore um Regimento Interno para uma ONG/OSC. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          ataAssembleiaGeral: { name: "Ata de Assembleia Geral", emoji: "🗣️", systemInstruction: f(`Elabore uma Ata de Assembleia Geral Ordinária/Extraordinária. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acordoParceriaPrivada: { name: "Acordo de Parceria Privada", emoji: "🤝", systemInstruction: f(`Elabore um Acordo de Cooperação/Parceria entre ONGs ou com empresas privadas. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          projetoUtilidadePublica: { name: "Projeto de Utilidade Pública", emoji: "📜", systemInstruction: f(`Elabore uma justificativa técnica para reconhecimento de Utilidade Pública Municipal/Estadual. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          prestacaoContasMP: { name: "Prestação de Contas (MP)", emoji: "👨‍⚖️", systemInstruction: f(`Elabore um relatório de Prestação de Contas anual para o Ministério Público (Fundações). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoInternacionalPrivado: {
        name: "Direito Internacional Privado",
        emoji: "🌐",
        documents: {
          cartaRogatoria: { name: "Carta Rogatória", emoji: "✉️", systemInstruction: f(`Elabore uma petição de Carta Rogatória. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          homologacaoSentencaEstrangeira: { name: "Homologação de Sentença Estrangeira", emoji: "⚖️", systemInstruction: f(`Elabore uma Ação de Homologação de Decisão Estrangeira. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          defesaExtradicao: { name: "Defesa em Extradição", emoji: "🛡️", systemInstruction: f(`Elabore uma Defesa em Processo de Extradição. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          sequestroInternacionalMenores: { name: "Ação de Sequestro Internacional de Menores", emoji: "👶", systemInstruction: f(`Elabore uma Ação de Busca, Apreensão e Restituição de Menor (Convenção de Haia). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoExequatur: { name: "Pedido de Exequatur", emoji: "📜", systemInstruction: f(`Elabore um pedido de Exequatur em Sentença Arbitral Estrangeira. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          cartaPrecatoriaInternacional: { name: "Carta Precatória Internacional", emoji: "✉️", systemInstruction: f(`Elabore uma Carta Precatória para cumprimento de atos em outro país. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          divorcioInternacional: { name: "Divórcio Internacional", emoji: "💔", systemInstruction: f(`Elabore uma Ação de Divórcio com citação de réu no exterior. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          cobrancaInternacional: { name: "Ação de Cobrança Internacional", emoji: "💰", systemInstruction: f(`Elabore uma Ação de Cobrança baseada em contrato internacional. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          requerimentoNacionalidade: { name: "Requerimento de Nacionalidade", emoji: "🛂", systemInstruction: f(`Elabore uma petição/requerimento fundamentado para reconhecimento de nacionalidade brasileira (ou instrução para estrangeira). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoAsiloPolitico: { name: "Pedido de Asilo Político", emoji: "🗽", systemInstruction: f(`Elabore uma fundamentação jurídica para pedido de Asilo Político ou Refúgio. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
    }
  },
  direitoBrasileiroPublico: {
    name: "Direito Brasileiro - Público",
    areas: {
      direitoPrevidenciarioRGPS: {
        name: "Previdenciário (RGPS/INSS)",
        emoji: "👵",
        documents: {
          aposentadoriaIdade: { name: "Aposentadoria por Idade", emoji: "🎂", systemInstruction: f(`Elabore uma petição de Aposentadoria por Idade. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          aposentadoriaEspecial: { name: "Aposentadoria Especial", emoji: "👷", systemInstruction: f(`Elabore uma petição de Aposentadoria Especial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          auxilioDoenca: { name: "Auxílio por Incapacidade Temporária", emoji: "♿", systemInstruction: f(`Elabore uma petição de Auxílio por Incapacidade. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pensaoPorMorte: { name: "Pensão por Morte", emoji: "💔", systemInstruction: f(`Elabore uma petição de Pensão por Morte. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          bpcLoas: { name: "BPC/LOAS", emoji: "❤️", systemInstruction: f(`Elabore uma petição de BPC/LOAS. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          revisaoBeneficio: { name: "Revisão de Benefício", emoji: "🔄", systemInstruction: f(`Elabore uma petição de Revisão de Benefício Previdenciário. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          mandadoSegurancaPrevidenciario: { name: "Mandado de Segurança Previdenciário", emoji: "⚡", systemInstruction: f(`Elabore um Mandado de Segurança contra ato do INSS. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          aposentadoriaTempoContribuicao: { name: "Aposentadoria por Tempo de Contribuição", emoji: "⏳", systemInstruction: f(`Elabore uma petição para Aposentadoria por Tempo de Contribuição (regras de transição). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          revisaoVidaToda: { name: "Revisão da Vida Toda", emoji: "📈", systemInstruction: f(`Elabore uma petição de Revisão da Vida Toda (PBC). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          auxilioAcidente: { name: "Auxílio-Acidente", emoji: "🩹", systemInstruction: f(`Elabore uma petição de concessão de Auxílio-Acidente. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoPenalComum: {
        name: "Penal - Crimes Comuns",
        emoji: "⚖️",
        documents: {
          queixaCrime: { name: "Queixa-Crime", emoji: "✍️", systemInstruction: f(`Elabore uma Queixa-Crime. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          respostaAcusacao: { name: "Resposta à Acusação", emoji: "🛡️", systemInstruction: f(`Elabore uma Resposta à Acusação. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          alegacoesFinais: { name: "Alegações Finais por Memoriais", emoji: "📝", systemInstruction: f(`Elabore Alegações Finais por Memoriais. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          apelacaoCriminal: { name: "Apelação Criminal", emoji: "📤", systemInstruction: f(`Elabore uma Apelação Criminal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoSentidoEstrito: { name: "Recurso em Sentido Estrito", emoji: "🔄", systemInstruction: f(`Elabore um Recurso em Sentido Estrito. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          revisaoCriminal: { name: "Revisão Criminal", emoji: "🧐", systemInstruction: f(`Elabore uma Revisão Criminal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          habeasCorpus: { name: "Habeas Corpus", emoji: "🗽", systemInstruction: f(`Elabore um Habeas Corpus. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          revogacaoPrisao: { name: "Revogação de Prisão Preventiva", emoji: "🕊️", systemInstruction: f(`Elabore um Pedido de Revogação de Prisão Preventiva. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoLiberdadeProvisoria: { name: "Liberdade Provisória", emoji: "🔓", systemInstruction: f(`Elabore um Pedido de Liberdade Provisória (com ou sem fiança). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          agravoExecucaoPenal: { name: "Agravo em Execução", emoji: "⚙️", systemInstruction: f(`Elabore um Agravo em Execução Penal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      execucaoPenal: {
        name: "Penal - Execução Penal",
        emoji: "⛓️",
        documents: {
          progressaoRegime: { name: "Pedido de Progressão de Regime", emoji: "➡️", systemInstruction: f(`Elabore um Pedido de Progressão de Regime. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          livramentoCondicional: { name: "Pedido de Livramento Condicional", emoji: "🚶", systemInstruction: f(`Elabore um Pedido de Livramento Condicional. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          remicaoPena: { name: "Pedido de Remição de Pena", emoji: "📚", systemInstruction: f(`Elabore um Pedido de Remição de Pena (trabalho ou estudo). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          agravoExecucao: { name: "Agravo em Execução Penal", emoji: "📤", systemInstruction: f(`Elabore um Agravo em Execução Penal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          detracaoPenal: { name: "Pedido de Detração Penal", emoji: "➖", systemInstruction: f(`Elabore um Pedido de Detração Penal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          unificacaoPenas: { name: "Pedido de Unificação de Penas", emoji: "🔗", systemInstruction: f(`Elabore um Pedido de Soma ou Unificação de Penas. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          indultoComutacao: { name: "Pedido de Indulto ou Comutação", emoji: "🕊️", systemInstruction: f(`Elabore um Pedido de Indulto ou Comutação de Pena baseado em Decreto Presidencial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          prisaoDomiciliarExecucao: { name: "Prisão Domiciliar (Execução)", emoji: "🏠", systemInstruction: f(`Elabore um Pedido de Prisão Domiciliar no curso da execução penal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoTratamentoSaudePreso: { name: "Tratamento de Saúde (Preso)", emoji: "⚕️", systemInstruction: f(`Elabore um Pedido de Tratamento Médico ou Saída para Tratamento de Saúde de detento. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          reabilitacaoCriminal: { name: "Ação de Reabilitação Criminal", emoji: "✅", systemInstruction: f(`Elabore uma Ação de Reabilitação Criminal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      tribunalDoJuri: {
        name: "Penal - Tribunal do Júri",
        emoji: "👨‍⚖️",
        documents: {
          defesaAcusacaoJuri: { name: "Resposta à Acusação (Júri)", emoji: "🛡️", systemInstruction: f(`Elabore uma Resposta à Acusação no procedimento do Júri. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoContraPronuncia: { name: "RESE (Contra Pronúncia)", emoji: "🔄", systemInstruction: f(`Elabore um Recurso em Sentido Estrito contra decisão de pronúncia. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          apelacaoJuri: { name: "Apelação (Decisão do Júri)", emoji: "📤", systemInstruction: f(`Elabore uma Apelação contra decisão do Júri. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          alegacoesFinaisJuri: { name: "Alegações Finais (Júri)", emoji: "📝", systemInstruction: f(`Elabore Alegações Finais por memoriais na 1ª fase do Júri. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          desaforamentoJuri: { name: "Pedido de Desaforamento", emoji: "🗺️", systemInstruction: f(`Elabore um Pedido de Desaforamento do julgamento pelo Júri. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          protestoNovoJuri: { name: "Protesto por Novo Júri", emoji: "🔄", systemInstruction: f(`Elabore (histórico/fundamentação) um Protesto por Novo Júri (conforme aplicabilidade legal). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          habeasCorpusJuri: { name: "Habeas Corpus (Júri)", emoji: "🗽", systemInstruction: f(`Elabore um Habeas Corpus visando trancamento da ação ou liberdade no rito do Júri. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          revisaoCriminalJuri: { name: "Revisão Criminal (Júri)", emoji: "🧐", systemInstruction: f(`Elabore uma Revisão Criminal contra decisão soberana do Júri. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          desaforamentoUrgente: { name: "Desaforamento Urgente", emoji: "⚠️", systemInstruction: f(`Elabore um Pedido Urgente de Desaforamento por risco à imparcialidade ou segurança. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          quesitosJuri: { name: "Sugestão de Quesitos", emoji: "❓", systemInstruction: f(`Elabore uma sugestão de Quesitos para serem respondidos pelo Conselho de Sentença. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      crimesCiberneticos: {
        name: "Crimes Cibernéticos",
        emoji: "💻",
        documents: {
          noticiaCrimeCibernetica: { name: "Notícia-Crime Cibernética", emoji: "🚨", systemInstruction: f(`Elabore uma Notícia-Crime por crime cibernético. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          defesaEstelionatoDigital: { name: "Defesa em Estelionato Digital", emoji: "🛡️", systemInstruction: f(`Elabore uma Defesa em crime de Estelionato Digital. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoQuebraSigiloTelematico: { name: "Quebra de Sigilo Telemático", emoji: "🔍", systemInstruction: f(`Elabore um Pedido de Quebra de Sigilo Telemático. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoRemocaoFotosIntimas: { name: "Remoção de Fotos (Revenge Porn)", emoji: "🚫", systemInstruction: f(`Elabore uma Ação Urgente para remoção de conteúdo íntimo e reparação de danos. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          queixaCrimeCaluniaNet: { name: "Queixa-Crime (Honra Digital)", emoji: "✍️", systemInstruction: f(`Elabore uma Queixa-Crime por injúria/calúnia cometida em redes sociais. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          notificacaoProvedorDados: { name: "Notificação Provedor (Dados)", emoji: "✉️", systemInstruction: f(`Elabore uma Notificação Extrajudicial para provedor de internet preservar logs de acesso. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          defesaInvasaoDispositivo: { name: "Defesa (Invasão Dispositivo)", emoji: "🛡️", systemInstruction: f(`Elabore uma Defesa em processo por Invasão de Dispositivo Informático (Art. 154-A CP). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoIndenizacaoHackeamento: { name: "Indenização (Conta Hackeada)", emoji: "📉", systemInstruction: f(`Elabore uma Ação de Indenização contra plataforma por falha de segurança e hackeamento de conta. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoPericiaForenseDigital: { name: "Pedido de Perícia Digital", emoji: "🔬", systemInstruction: f(`Elabore um Pedido de Perícia Forense Digital em processo criminal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDanosMoraisCyberbullying: { name: "Indenização (Cyberbullying)", emoji: "🗣️", systemInstruction: f(`Elabore uma Ação de Indenização por danos morais decorrentes de cyberbullying. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoTributario: {
        name: "Direito Tributário",
        emoji: "💰",
        documents: {
          acaoAnulatoriaDebitoFiscal: { name: "Ação Anulatória de Débito Fiscal", emoji: "❌", systemInstruction: f(`Elabore uma Ação Anulatória de Débito Fiscal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          mandadoSegurancaTributario: { name: "Mandado de Segurança Tributário", emoji: "⚡", systemInstruction: f(`Elabore um Mandado de Segurança Tributário. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          embargosExecucaoFiscal: { name: "Embargos à Execução Fiscal", emoji: "✋", systemInstruction: f(`Elabore Embargos à Execução Fiscal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          excecaoPreExecutividadeTributario: { name: "Exceção de Pré-executividade", emoji: "💡", systemInstruction: f(`Elabore uma Exceção de Pré-executividade em matéria tributária. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoRepeticaoIndebito: { name: "Ação de Repetição de Indébito", emoji: "💸", systemInstruction: f(`Elabore uma Ação de Repetição de Indébito Tributário. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          impugnacaoAdministrativa: { name: "Impugnação Administrativa Fiscal", emoji: "📄", systemInstruction: f(`Elabore uma Impugnação a Auto de Infração. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDeclaratoriaInexistenciaTributaria: { name: "Declaratória de Inexistência", emoji: "📣", systemInstruction: f(`Elabore uma Ação Declaratória de Inexistência de Relação Jurídico-Tributária. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoConsignacaoPagamentoTributo: { name: "Consignação em Pagamento", emoji: "🏦", systemInstruction: f(`Elabore uma Ação de Consignação em Pagamento de Tributos. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoVoluntarioCARF: { name: "Recurso Voluntário (CARF)", emoji: "📤", systemInstruction: f(`Elabore um Recurso Voluntário ao CARF ou Conselho de Contribuintes. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          medidaCautelarFiscal: { name: "Medida Cautelar Fiscal", emoji: "🛡️", systemInstruction: f(`Elabore uma Medida Cautelar Fiscal ou defesa contra ela. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoAdministrativo: {
        name: "Administrativo Geral",
        emoji: "🏛️",
        documents: {
          mandadoSeguranca: { name: "Mandado de Segurança", emoji: "⚡", systemInstruction: f(`Elabore um Mandado de Segurança contra ato de autoridade. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoPopular: { name: "Ação Popular", emoji: "👥", systemInstruction: f(`Elabore uma Ação Popular. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoCivilPublica: { name: "Ação Civil Pública", emoji: "🌍", systemInstruction: f(`Elabore uma Ação Civil Pública. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoImprobidade: { name: "Defesa em Improbidade", emoji: "🚫", systemInstruction: f(`Elabore uma Defesa em Ação de Improbidade Administrativa. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoResponsabilidadeEstado: { name: "Responsabilidade Civil do Estado", emoji: "💥", systemInstruction: f(`Elabore uma Ação de Responsabilidade Civil do Estado. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoAdministrativo: { name: "Recurso Administrativo", emoji: "📤", systemInstruction: f(`Elabore um Recurso Administrativo genérico. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoAnulatoriaAtoAdministrativo: { name: "Anulatória de Ato Administrativo", emoji: "❌", systemInstruction: f(`Elabore uma Ação Anulatória de Ato Administrativo. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDesapropriacaoDireta: { name: "Contestação em Desapropriação", emoji: "🏗️", systemInstruction: f(`Elabore uma Contestação em Ação de Desapropriação Direta (discutindo valor). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDesapropriacaoIndireta: { name: "Desapropriação Indireta", emoji: "🛣️", systemInstruction: f(`Elabore uma Ação de Indenização por Desapropriação Indireta. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoReconsideracaoAdm: { name: "Pedido de Reconsideração", emoji: "🙏", systemInstruction: f(`Elabore um Pedido de Reconsideração Administrativa. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      servidoresPublicos: {
        name: "Servidores Públicos",
        emoji: "👨‍🏫",
        documents: {
          mandadoSegurancaConcurso: { name: "Mandado de Segurança (Concurso)", emoji: "🎯", systemInstruction: f(`Elabore um Mandado de Segurança em Concurso Público. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoReintegracao: { name: "Ação de Reintegração de Servidor", emoji: "🔄", systemInstruction: f(`Elabore uma Ação de Reintegração de Servidor Público. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          defesaPAD: { name: "Defesa em PAD / Sindicância", emoji: "🛡️", systemInstruction: f(`Elabore uma Defesa Prévia ou Alegações Finais em PAD. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoAnulatoriaPAD: { name: "Ação Anulatória de PAD", emoji: "❌", systemInstruction: f(`Elabore uma Ação Anulatória de Processo Administrativo Disciplinar. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoCobrancaVencimentos: { name: "Cobrança de Vencimentos", emoji: "💰", systemInstruction: f(`Elabore uma Ação de Cobrança de Vencimentos ou Diferenças Salariais de Servidor. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          mandadoSegurancaRemocao: { name: "MS (Remoção de Servidor)", emoji: "🏠", systemInstruction: f(`Elabore um Mandado de Segurança contra remoção arbitrária de servidor. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoProgressaoFuncional: { name: "Progressão Funcional", emoji: "📈", systemInstruction: f(`Elabore uma Ação de Obrigação de Fazer para implementação de Progressão Funcional. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          defesaTomadaContas: { name: "Defesa em Tomada de Contas", emoji: "📊", systemInstruction: f(`Elabore uma Defesa em Tomada de Contas Especial perante o Tribunal de Contas. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoAposentadoriaServidor: { name: "Aposentadoria de Servidor", emoji: "👵", systemInstruction: f(`Elabore um requerimento fundamentado de Aposentadoria de Servidor Público (RPPS). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoIndenizacaoAssedioMoralAdm: { name: "Assédio Moral (Serviço Público)", emoji: "🗣️", systemInstruction: f(`Elabore uma Ação de Indenização por Assédio Moral no ambiente de trabalho público. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      licitacoesContratos: {
        name: "Licitações e Contratos Adm.",
        emoji: "📄",
        documents: {
          impugnacaoEdital: { name: "Impugnação ao Edital", emoji: "🚫", systemInstruction: f(`Elabore uma Impugnação ao Edital de Licitação. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoLicitatorio: { name: "Recurso Adm. Licitatório", emoji: "📤", systemInstruction: f(`Elabore um Recurso Administrativo em Licitação (Habilitação/Julgamento). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          mandadoSegurancaLicitacao: { name: "Mandado de Segurança (Licitação)", emoji: "⚡", systemInstruction: f(`Elabore um Mandado de Segurança em Licitação. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoReequilibrio: { name: "Reequilíbrio Econômico-Financeiro", emoji: "⚖️", systemInstruction: f(`Elabore um Pedido de Reequilíbrio Econômico-Financeiro de Contrato. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          defesaProcessoSanconatorio: { name: "Defesa em Sanção Administrativa", emoji: "🛡️", systemInstruction: f(`Elabore uma Defesa contra aplicação de multas ou suspensão de contratar. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoCobrancaContratoAdm: { name: "Cobrança contra Ente Público", emoji: "💰", systemInstruction: f(`Elabore uma Ação de Cobrança por serviços prestados e não pagos pela Administração. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          notificacaoRescisaoContratoAdm: { name: "Rescisão Amigável/Unilateral", emoji: "✉️", systemInstruction: f(`Elabore uma Notificação ou Requerimento de Rescisão de Contrato Administrativo por inadimplemento da Adm. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoProrrogacaoPrazoContrato: { name: "Prorrogação de Prazo", emoji: "📅", systemInstruction: f(`Elabore uma justificativa técnica para prorrogação de prazo contratual. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          denunciaTribunalContas: { name: "Denúncia ao Tribunal de Contas", emoji: "🕵️", systemInstruction: f(`Elabore uma representação/denúncia de irregularidade em licitação perante o TCE/TCU. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoDeclaratoriaNulidadeLicitacao: { name: "Nulidade de Licitação", emoji: "❌", systemInstruction: f(`Elabore uma Ação Ordinária visando a Nulidade de Certame Licitatório. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoEleitoral: {
        name: "Direito Eleitoral",
        emoji: "🗳️",
        documents: {
          impugnacaoRegistro: { name: "AIRC - Impugnação de Registro", emoji: "🚫", systemInstruction: f(`Elabore uma Ação de Impugnação de Registro de Candidatura (AIRC). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          investigacaoJudicial: { name: "AIJE - Investigação Judicial", emoji: "🕵️", systemInstruction: f(`Elabore uma Ação de Investigação Judicial Eleitoral (AIJE). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          impugnacaoMandato: { name: "AIME - Impugnação de Mandato", emoji: "💥", systemInstruction: f(`Elabore uma Ação de Impugnação de Mandato Eletivo (AIME). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoContraExpedicao: { name: "RCED - Contra Expedição de Diploma", emoji: "📜", systemInstruction: f(`Elabore um Recurso contra Expedição de Diploma (RCED). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          representacaoPropaganda: { name: "Representação (Propaganda)", emoji: "📢", systemInstruction: f(`Elabore uma Representação por Propaganda Irregular. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          defesaPrestacaoContasEleitorais: { name: "Defesa (Prestação de Contas)", emoji: "🛡️", systemInstruction: f(`Elabore uma Defesa em processo de Prestação de Contas de Campanha. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          mandadoSegurancaEleitoral: { name: "Mandado de Segurança Eleitoral", emoji: "⚡", systemInstruction: f(`Elabore um Mandado de Segurança em matéria eleitoral. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          recursoEleitoralOrdinario: { name: "Recurso Eleitoral", emoji: "📤", systemInstruction: f(`Elabore um Recurso Eleitoral para o TRE. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          representacaoDoacaoIlegal: { name: "Representação (Doação Ilegal)", emoji: "💸", systemInstruction: f(`Elabore uma Representação por doação acima do limite legal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoDireitoRespostaEleitoral: { name: "Direito de Resposta", emoji: "🗣️", systemInstruction: f(`Elabore um Pedido de Direito de Resposta em horário eleitoral ou internet. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoAmbiental: {
        name: "Direito Ambiental",
        emoji: "🌳",
        documents: {
          defesaAutoInfracao: { name: "Defesa em Auto de Infração", emoji: "🛡️", systemInstruction: f(`Elabore uma Defesa Administrativa em Auto de Infração Ambiental. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoCivilPublicaAmbiental: { name: "Contestação em ACP Ambiental", emoji: "🌍", systemInstruction: f(`Elabore uma Contestação em Ação Civil Pública Ambiental. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          termoAjustamentoConduta: { name: "TAC Ambiental", emoji: "🤝", systemInstruction: f(`Elabore uma minuta de Termo de Ajustamento de Conduta Ambiental. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          mandadoSegurancaLicenciamento: { name: "MS (Licenciamento Ambiental)", emoji: "⚡", systemInstruction: f(`Elabore um Mandado de Segurança contra negativa de licenciamento. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoAnulatoriaMultaAmbiental: { name: "Anulatória de Multa Ambiental", emoji: "❌", systemInstruction: f(`Elabore uma Ação Ordinária visando a anulação de multa ambiental. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          notificacaoDanoAmbientalVizinho: { name: "Notificação (Dano Ambiental)", emoji: "✉️", systemInstruction: f(`Elabore uma Notificação Extrajudicial por dano ambiental em propriedade vizinha. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          defesaCrimeAmbiental: { name: "Defesa em Crime Ambiental", emoji: "⚖️", systemInstruction: f(`Elabore uma Resposta à Acusação em processo por Crime Ambiental. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoLicenciamentoSimplificado: { name: "Requerimento Licenciamento", emoji: "📄", systemInstruction: f(`Elabore um requerimento administrativo fundamentado para licenciamento simplificado. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoReparacaoDanoAmbientalPrivado: { name: "Indenização (Dano Ambiental)", emoji: "📉", systemInstruction: f(`Elabore uma Ação de Reparação de Danos Materiais e Morais decorrentes de impacto ambiental privado. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          impugnacaoEiaRima: { name: "Impugnação ao EIA/RIMA", emoji: "🚫", systemInstruction: f(`Elabore uma impugnação técnica/jurídica a Estudo de Impacto Ambiental. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoSaude: {
        name: "Direito da Saúde",
        emoji: "⚕️",
        documents: {
          acaoFornecimentoMedicamento: { name: "Ação Fornecimento Medicamento", emoji: "💊", systemInstruction: f(`Elabore uma Ação para Fornecimento de Medicamento de Alto Custo (SUS). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoContraPlanoSaude: { name: "Ação contra Plano de Saúde", emoji: "🏥", systemInstruction: f(`Elabore uma Ação de Obrigação de Fazer contra Plano de Saúde (negativa de cirurgia/exame). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoErroMedico: { name: "Ação de Erro Médico", emoji: "🩺", systemInstruction: f(`Elabore uma Ação de Indenização por Erro Médico. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoHomeCare: { name: "Ação para Home Care", emoji: "🏠", systemInstruction: f(`Elabore uma Ação para compelir plano de saúde/estado a fornecer Home Care. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          defesaAdministrativaANS: { name: "Defesa na ANS", emoji: "🛡️", systemInstruction: f(`Elabore uma defesa administrativa perante a Agência Nacional de Saúde Suplementar. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoFornecimentoProtese: { name: "Ação para Prótese/Órtese", emoji: "🦿", systemInstruction: f(`Elabore uma Ação para fornecimento de prótese, órtese ou materiais especiais. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          mandadoSegurancaVagaLeito: { name: "MS (Vaga em Leito de UTI)", emoji: "⚡", systemInstruction: f(`Elabore um Mandado de Segurança Urgente para obtenção de vaga em leito de UTI. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoRevisionalMensalidadePlano: { name: "Revisional de Plano de Saúde", emoji: "📊", systemInstruction: f(`Elabore uma Ação Revisional de mensalidade de plano de saúde por reajuste abusivo (faixa etária). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          notificacaoNegativaCobertura: { name: "Notificação (Negativa Cobertura)", emoji: "✉️", systemInstruction: f(`Elabore uma Notificação Extrajudicial exigindo justificativa de negativa de cobertura. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoIndenizacaoDanoEsteticoSaude: { name: "Indenização (Dano Estético)", emoji: "🩹", systemInstruction: f(`Elabore uma Ação de Indenização por erro em procedimento estético ou cirurgia plástica. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoDigitalLGPD: {
        name: "Direito Digital e LGPD",
        emoji: "🤖",
        documents: {
          acaoRemocaoConteudo: { name: "Ação de Remoção de Conteúdo", emoji: "🚫", systemInstruction: f(`Elabore uma Ação de Obrigação de Fazer para Remoção de Conteúdo da Internet. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoViolacaoLGPD: { name: "Ação de Violação de LGPD", emoji: "🛡️", systemInstruction: f(`Elabore uma Ação por Violação da LGPD (vazamento de dados). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          relatorioImpactoLGPD: { name: "Relatório de Impacto (RIPD)", emoji: "📄", systemInstruction: f(`Elabore um Relatório de Impacto à Proteção de Dados (RIPD). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          termosDeUso: { name: "Termos e Privacidade", emoji: "📜", systemInstruction: f(`Elabore Termos de Uso e Política de Privacidade para um site ou aplicativo. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          notificacaoVazamentoDados: { name: "Notificação de Vazamento", emoji: "🚨", systemInstruction: f(`Elabore uma Notificação de Vazamento de Dados para a ANPD e titulares. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoTratamentoDados: { name: "Acordo de Tratamento de Dados", emoji: "🤝", systemInstruction: f(`Elabore um Data Processing Agreement (DPA) para parceiros de negócio. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          acaoInexistenciaDebitoInternet: { name: "Ação contra Assinatura Digital", emoji: "💸", systemInstruction: f(`Elabore uma Ação por contratação fraudulenta de serviços digitais. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoExclusaoDadosLGPD: { name: "Requerimento Direito Esquecimento", emoji: "🧹", systemInstruction: f(`Elabore um Requerimento Administrativo fundamentado na LGPD para exclusão de dados. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          clausulaLGPDContratoTrabalho: { name: "Cláusulas LGPD (Trabalho)", emoji: "📝", systemInstruction: f(`Elabore cláusulas de proteção de dados para contratos de trabalho. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          auditoriaConformidadeLGPD: { name: "Checklist de Auditoria LGPD", emoji: "🔍", systemInstruction: f(`Elabore um relatório técnico-jurídico de diagnóstico de conformidade com a LGPD. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      }
    }
  },
  direitoInternacionalCommonLaw: {
    name: "Internacional - Common Law",
    areas: {
      civilLitigation: {
        name: "Civil Litigation (USA/UK)",
        emoji: "🏛️",
        documents: {
          complaint: { name: "Complaint (Petição Inicial)", emoji: "📝", systemInstruction: f(`Elabore uma Complaint de acordo com o Common Law. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          answer: { name: "Answer (Contestação)", emoji: "🛡️", systemInstruction: f(`Elabore uma Answer. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          motionToDismiss: { name: "Motion to Dismiss", emoji: "🚫", systemInstruction: f(`Elabore uma Motion to Dismiss fundamentada. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          motionForSummaryJudgment: { name: "Summary Judgment Motion", emoji: "⚖️", systemInstruction: f(`Elabore uma Motion for Summary Judgment. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          appealBrief: { name: "Appeal Brief", emoji: "📤", systemInstruction: f(`Elabore um Appeal Brief. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          affidavit: { name: "Affidavit", emoji: "✍️", systemInstruction: f(`Elabore um Affidavit detalhado. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          subpoenaResponse: { name: "Response to Subpoena", emoji: "📥", systemInstruction: f(`Elabore uma resposta ou moção para anular uma Subpoena. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          settlementAgreementCommonLaw: { name: "Settlement Agreement", emoji: "🤝", systemInstruction: f(`Elabore um Settlement Agreement e Release. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          depositionOutline: { name: "Deposition Outline", emoji: "📝", systemInstruction: f(`Elabore um roteiro (outline) para Deposição de testemunha. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          interrogatories: { name: "Interrogatories", emoji: "❓", systemInstruction: f(`Elabore uma lista de Interrogatories para a fase de Discovery. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      criminalLaw: {
        name: "Criminal Law (USA/UK)",
        emoji: "⚖️",
        documents: {
          motionToSuppress: { name: "Motion to Suppress", emoji: "🔇", systemInstruction: f(`Elabore uma Motion to Suppress evidence. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pleaAgreement: { name: "Plea Agreement", emoji: "🤝", systemInstruction: f(`Elabore um Plea Agreement. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          habeasCorpusPetition: { name: "Habeas Corpus Petition", emoji: "🗽", systemInstruction: f(`Elabore um Habeas Corpus Petition sob o sistema federal ou estadual. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          motionForBail: { name: "Motion for Bail", emoji: "🔓", systemInstruction: f(`Elabore uma moção para soltura sob fiança ou redução de valor. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          criminalComplaint: { name: "Criminal Complaint", emoji: "🚨", systemInstruction: f(`Elabore uma Criminal Complaint ou denúncia privada (se aplicável). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          motionForDiscovery: { name: "Motion for Discovery (Criminal)", emoji: "🔍", systemInstruction: f(`Elabore uma moção exigindo evidências (Brady material). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          sentencingMemorandum: { name: "Sentencing Memorandum", emoji: "📉", systemInstruction: f(`Elabore um Sentencing Memorandum pedindo leniência. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          petitionForClemency: { name: "Petition for Clemency", emoji: "🙏", systemInstruction: f(`Elabore uma petição por clemência ou perdão. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          motionForNewTrial: { name: "Motion for New Trial", emoji: "🔄", systemInstruction: f(`Elabore uma Motion for New Trial baseada em erros de procedimento ou novas evidências. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          extraditionDefenseBrief: { name: "Extradition Defense Brief", emoji: "🛡️", systemInstruction: f(`Elabore uma defesa técnica contra pedido de extradição internacional. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      contractLaw: {
        name: "Contract Law (USA/UK)",
        emoji: "📜",
        documents: {
          nonDisclosureAgreement: { name: "NDA (Common Law)", emoji: "🤫", systemInstruction: f(`Elabore um Non-Disclosure Agreement (NDA). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          employmentContract: { name: "Employment Contract", emoji: "🧑‍💼", systemInstruction: f(`Elabore um Employment Contract completo. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          serviceAgreement: { name: "Service Agreement", emoji: "👨‍🔧", systemInstruction: f(`Elabore um Service Agreement. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          masterServiceAgreement: { name: "Master Service Agreement (MSA)", emoji: "🏗️", systemInstruction: f(`Elabore um Master Service Agreement. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          licenseAgreement: { name: "Software License Agreement", emoji: "💻", systemInstruction: f(`Elabore um License Agreement para software/SaaS. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          partnershipAgreement: { name: "Partnership Agreement", emoji: "🤝", systemInstruction: f(`Elabore um Partnership Agreement. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          jointVentureAgreement: { name: "Joint Venture Agreement", emoji: "🌍", systemInstruction: f(`Elabore um Joint Venture Agreement. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          stockPurchaseAgreement: { name: "Stock Purchase Agreement (SPA)", emoji: "📈", systemInstruction: f(`Elabore um Stock Purchase Agreement. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          operatingAgreement: { name: "Operating Agreement", emoji: "⚙️", systemInstruction: f(`Elabore um Operating Agreement para LLC. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          terminationNotice: { name: "Notice of Termination", emoji: "✉️", systemInstruction: f(`Elabore uma Notificação formal de encerramento de contrato. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      corporateLaw: {
        name: "Corporate Law (USA/UK)",
        emoji: "🏢",
        documents: {
          articlesOfIncorporation: { name: "Articles of Incorporation", emoji: "📝", systemInstruction: f(`Elabore Articles of Incorporation. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          bylaws: { name: "Corporate Bylaws", emoji: "📜", systemInstruction: f(`Elabore Bylaws corporativos. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          shareholderAgreement: { name: "Shareholder Agreement", emoji: "🤝", systemInstruction: f(`Elabore um Shareholder Agreement robusto. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          operatingAgreementLLC: { name: "Operating Agreement (LLC)", emoji: "📄", systemInstruction: f(`Elabore um Operating Agreement para LLC. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          boardResolutions: { name: "Board Resolutions", emoji: "✅", systemInstruction: f(`Elabore resoluções do conselho de administração. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          mergerAgreement: { name: "Merger Agreement", emoji: "🔗", systemInstruction: f(`Elabore um contrato de fusão/incorporação. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          dissolutionPapers: { name: "Corporate Dissolution", emoji: "💔", systemInstruction: f(`Elabore documentos para dissolução de empresa. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          privatePlacementMemorandum: { name: "PPM (Private Placement)", emoji: "📄", systemInstruction: f(`Elabore um Private Placement Memorandum para investidores. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          votingTrustAgreement: { name: "Voting Trust Agreement", emoji: "🗳️", systemInstruction: f(`Elabore um Voting Trust Agreement. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          confidentialityDisclosure: { name: "Confidentiality Policy", emoji: "🤫", systemInstruction: f(`Elabore uma política interna de confidencialidade e proteção de segredos. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
    }
  },
  direitoInternacionalCivilLaw: {
    name: "Internacional - Civil Law",
    areas: {
      europeanUnionLaw: {
        name: "European Union Law",
        emoji: "🇪🇺",
        documents: {
          gdprCompliance: { name: "GDPR Documentation", emoji: "🛡️", systemInstruction: f(`Elabore a documentação de conformidade com o GDPR. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          dataProcessingAgreement: { name: "DPA (GDPR)", emoji: "✍️", systemInstruction: f(`Elabore um Data Processing Agreement (DPA). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          competitionLawComplaint: { name: "Competition Complaint", emoji: "⚔️", systemInstruction: f(`Elabore uma denúncia de violação da lei da concorrência à Comissão Europeia. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          infringementAction: { name: "Infringement Action", emoji: "🚫", systemInstruction: f(`Elabore uma petição de Infringement Action perante o CJEU. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          preliminaryRulingRequest: { name: "Preliminary Ruling Request", emoji: "❓", systemInstruction: f(`Elabore um pedido de decisão prejudicial ao Tribunal de Justiça da UE. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          euTrademarkApplication: { name: "EUTM Application", emoji: "🏷️", systemInstruction: f(`Elabore um requerimento de marca comunitária (EUIPO). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          europeanOrderForPayment: { name: "Order for Payment", emoji: "💰", systemInstruction: f(`Elabore um pedido de Injuncção de Pagamento Europeia. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          actionForAnnulment: { name: "Action for Annulment", emoji: "❌", systemInstruction: f(`Elabore uma Ação de Anulação de ato da União perante o CJEU. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          consumerRightsDisclosure: { name: "EU Consumer Disclosure", emoji: "📜", systemInstruction: f(`Elabore informações obrigatórias ao consumidor sob as diretrizes da UE. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          stateAidDefense: { name: "State Aid Defense Brief", emoji: "🛡️", systemInstruction: f(`Elabore uma defesa técnica contra investigação de auxílio estatal ilegal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoFrances: {
        name: "Direito Francês",
        emoji: "🇫🇷",
        documents: {
          assignation: { name: "Assignation", emoji: "📝", systemInstruction: f(`Elabore uma Assignation (citação inicial). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          conclusions: { name: "Conclusions", emoji: "🗣️", systemInstruction: f(`Elabore Conclusions (alegações). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          appel: { name: "Appel", emoji: "📤", systemInstruction: f(`Elabore um Appel (apelação). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratTravailFrance: { name: "Contrat de Travail", emoji: "🧑‍💼", systemInstruction: f(`Elabore um contrato de trabalho sob a lei francesa (CDI/CDD). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          statutsSarl: { name: "Statuts SARL", emoji: "🏢", systemInstruction: f(`Elabore os estatutos de uma SARL. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          refeereLiberté: { name: "Référé-Liberté", emoji: "⚡", systemInstruction: f(`Elabore um pedido de Référé-Liberté urgente. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          procesVerbal: { name: "Procès-Verbal", emoji: "📄", systemInstruction: f(`Elabore um Procès-Verbal formal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          miseEnDemeure: { name: "Mise en Demeure", emoji: "✉️", systemInstruction: f(`Elabore uma Notificação (Mise en demeure). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          compromisDeVente: { name: "Compromis de Vente", emoji: "🏠", systemInstruction: f(`Elabore um Compromis de Vente imobiliário. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          requeteConseilEtat: { name: "Requête Conseil d'État", emoji: "🏛️", systemInstruction: f(`Elabore uma petição perante o Conselho de Estado Francês. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      direitoAlemao: {
        name: "Direito Alemão",
        emoji: "🇩🇪",
        documents: {
          klageschrift: { name: "Klageschrift", emoji: "📝", systemInstruction: f(`Elabore uma Klageschrift (petição inicial). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          berufung: { name: "Berufung", emoji: "📤", systemInstruction: f(`Elabore uma Berufung (apelação). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          gesellschaftsvertrag: { name: "Gesellschaftsvertrag (GmbH)", emoji: "🏢", systemInstruction: f(`Elabore um Gesellschaftsvertrag (contrato social de GmbH). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          abmahnung: { name: "Abmahnung", emoji: "✉️", systemInstruction: f(`Elabore uma Abmahnung (notificação de infração/aviso). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          arbeitsvertrag: { name: "Arbeitsvertrag", emoji: "🧑‍💼", systemInstruction: f(`Elabore um Arbeitsvertrag (contrato de trabalho). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          mietvertrag: { name: "Mietvertrag", emoji: "🏠", systemInstruction: f(`Elabore um Mietvertrag (contrato de locação). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          strafanzeige: { name: "Strafanzeige", emoji: "🚨", systemInstruction: f(`Elabore uma Strafanzeige (queixa criminal). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          vollmacht: { name: "Vollmacht", emoji: "✍️", systemInstruction: f(`Elabore uma Vollmacht (procuração). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          impressum: { name: "Impressum", emoji: "📜", systemInstruction: f(`Elabore um Impressum legal para site alemão. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          datenschutzerklaerung: { name: "Datenschutzerklärung", emoji: "🛡️", systemInstruction: f(`Elabore uma declaração de proteção de dados (Privacy Policy). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
    }
  },
  direitoInternacionalOutros: {
    name: "Internacional - Outros",
    areas: {
      arbitragemInternacional: {
        name: "Arbitragem Internacional",
        emoji: "🌐",
        documents: {
          requestForArbitration: { name: "Request for Arbitration", emoji: "🚀", systemInstruction: f(`Elabore um Request for Arbitration (ICC/UNCITRAL). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          statementOfClaim: { name: "Statement of Claim", emoji: "📝", systemInstruction: f(`Elabore um Statement of Claim detalhado. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          statementOfDefense: { name: "Statement of Defense", emoji: "🛡️", systemInstruction: f(`Elabore um Statement of Defense. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          award: { name: "Arbitral Award", emoji: "🏆", systemInstruction: f(`Elabore uma minuta de Sentença Arbitral. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          arbitrationAgreement: { name: "Arbitration Agreement", emoji: "📜", systemInstruction: f(`Elabore uma cláusula compromissória ou compromisso arbitral. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          termsOfReference: { name: "Terms of Reference", emoji: "📑", systemInstruction: f(`Elabore os Termos de Referência da arbitragem. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          proceduralOrder1: { name: "Procedural Order No. 1", emoji: "⚙️", systemInstruction: f(`Elabore uma ordem procedimental inicial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          witnessStatement: { name: "Witness Statement", emoji: "🗣️", systemInstruction: f(`Elabore um Witness Statement formal. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          postHearingBrief: { name: "Post-Hearing Brief", emoji: "📝", systemInstruction: f(`Elabore um memorial pós-audiência. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          challengeOfArbitrator: { name: "Challenge of Arbitrator", emoji: "🚫", systemInstruction: f(`Elabore um pedido de impugnação de árbitro por suspeição/impedimento. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
      tribunaisInternacionais: {
        name: "Tribunais Internacionais",
        emoji: "🌍",
        documents: {
          applicationICJ: { name: "Application (ICJ)", emoji: "📝", systemInstruction: f(`Elabore uma Application para a Corte Internacional de Justiça. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          petitionIACHR: { name: "Petition to IACHR", emoji: "✍️", systemInstruction: f(`Elabore uma petição para a Comissão Interamericana de Direitos Humanos. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          amicusCuriae: { name: "Amicus Curiae Brief", emoji: "🤝", systemInstruction: f(`Elabore um Amicus Curiae Brief para tribunais internacionais. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          memorialToCourt: { name: "Memorial to the Court", emoji: "📜", systemInstruction: f(`Elabore um memorial detalhado para corte internacional. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          communicationToICC: { name: "Communication to the ICC", emoji: "⚖️", systemInstruction: f(`Elabore uma comunicação/denúncia ao Tribunal Penal Internacional (OTP). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          provisionalMeasuresRequest: { name: "Provisional Measures", emoji: "⚡", systemInstruction: f(`Elabore um pedido de medidas provisórias de urgência. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          objectionToJurisdiction: { name: "Objection to Jurisdiction", emoji: "🚫", systemInstruction: f(`Elabore uma exceção de incompetência ou jurisdição. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          counterMemorial: { name: "Counter-Memorial", emoji: "🛡️", systemInstruction: f(`Elabore um contramemorial respondendo aos fatos e mérito. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          replyInternational: { name: "Reply", emoji: "🗣️", systemInstruction: f(`Elabore uma Réplica (Reply) em procedimento internacional. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          rejoinderInternational: { name: "Rejoinder", emoji: "💬", systemInstruction: f(`Elabore uma Tréplica (Rejoinder) em procedimento internacional. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
    }
  },
  documentosGerais: {
    name: "Documentos Gerais",
    areas: {
      ferramentasJuridicas: {
        name: "Ferramentas Jurídicas",
        emoji: "🛠️",
        documents: {
          procuracaoAdJudicia: { name: "Procuração Ad Judicia", emoji: "✍️", systemInstruction: f(`Elabore uma Procuração Ad Judicia et Extra. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          contratoHonorarios: { name: "Contrato de Honorários", emoji: "💰", systemInstruction: f(`Elabore um Contrato de Honorários Advocatícios. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          notificacaoExtrajudicial: { name: "Notificação Extrajudicial", emoji: "✉️", systemInstruction: f(`Elabore uma Notificação Extrajudicial. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          parecerJuridico: { name: "Parecer Jurídico", emoji: "🧐", systemInstruction: f(`Elabore um Parecer Jurídico detalhado. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          declaracaoHipossuficiencia: { name: "Declaração Hipossuficiência", emoji: "📄", systemInstruction: f(`Elabore uma Declaração de Hipossuficiência. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          termoConfidencialidade: { name: "Termo Confidencialidade", emoji: "🤫", systemInstruction: f(`Elabore um Termo de Confidencialidade e Sigilo. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          reciboHonorarios: { name: "Recibo de Honorários", emoji: "💸", systemInstruction: f(`Elabore um Recibo de Honorários Advocatícios. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          substabelecimento: { name: "Substabelecimento", emoji: "🔄", systemInstruction: f(`Elabore um Substabelecimento (com ou sem reserva de poderes). ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          peticaoJuntada: { name: "Petição de Juntada", emoji: "📎", systemInstruction: f(`Elabore uma Petição de Juntada de Documentos ou Substabelecimento. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
          pedidoVistaCopia: { name: "Vista e Cópia", emoji: "🔍", systemInstruction: f(`Elabore uma Petição de Pedido de Vista ou Carga dos Autos. ${HIGH_QUALITY_LEGAL_STANDARD}`) },
        }
      },
    }
  },
  direitoAcademico: {
    name: "Direito Acadêmico",
    areas: {
      seminariosEPalestras: {
        name: "Seminários e Palestras",
        emoji: "🎤",
        documents: {
          seminarioDireito: { name: "Seminário de Direito", emoji: "🎓", systemInstruction: f(`Elabore um roteiro completo para um Seminário de Direito, incluindo introdução, desenvolvimento dos tópicos principais, referências bibliográficas e sugestões de perguntas para debate. ${HIGH_QUALITY_ACADEMIC_STANDARD}`) },
        }
      },
    }
  }
}
