
import { Cliente, TipoServico, Contrato } from '@/types/contract';

export interface ContractTemplateData {
  formData: Partial<Contrato>;
  cliente?: Cliente;
  tipoServico?: TipoServico;
}

export const formatDate = (date: Date | string) => {
  if (!date) return '___/___/______';
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

export const formatCurrency = (value: number) => {
  if (!value) return 'R$ _____,__';
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2 
  });
};

export const replaceVariables = (text: string, { formData, cliente, tipoServico }: ContractTemplateData): string => {
  console.log('Template data:', { formData, cliente, tipoServico });
  
  const variables: Record<string, string> = {
    // Dados do Cliente/Contratante
    '{{contratante_razao_social}}': cliente?.razaoSocial || '_____________________',
    '{{contratante_cnpj}}': cliente?.cnpj || '__.___.___/____-__',
    '{{contratante_endereco}}': cliente?.endereco || '_____________________',
    '{{contratante_representante_nome}}': cliente?.representanteNome || '_____________________',
    '{{contratante_representante_nacionalidade}}': cliente?.representanteNacionalidade || '_____________________',
    '{{contratante_representante_estado_civil}}': cliente?.representanteEstadoCivil || '_____________________',
    '{{contratante_representante_profissao}}': cliente?.representanteProfissao || '_____________________',
    '{{contratante_representante_cpf}}': cliente?.representanteCpf || '___.___.___-__',
    '{{contratante_representante_rg}}': cliente?.representanteRg || '___.___.__-_',
    '{{contratante_representante_orgao_emissor}}': cliente?.representanteOrgaoEmissor || '____',
    
    // Dados da Contratada
    '{{contratada_representante_nome}}': formData.contratadaRepresentanteNome || 'Jefferson Lopes Viana',
    '{{contratada_representante_nacionalidade}}': formData.contratadaRepresentanteNacionalidade || 'brasileiro',
    '{{contratada_representante_estado_civil}}': formData.contratadaRepresentanteEstadoCivil || 'casado',
    '{{contratada_representante_profissao}}': formData.contratadaRepresentanteProfissao || 'contador',
    '{{contratada_representante_crc}}': formData.contratadaRepresentanteCrc || '2SP023539/O-4',
    '{{contratada_representante_cpf}}': formData.contratadaRepresentanteCpf || '___.___.___-__',
    
    // Dados do Serviço
    '{{regime_tributario}}': formData.regimeTributario || '_____________________',
    '{{quantidade_estabelecimentos}}': formData.quantidadeEstabelecimentos?.toString() || '_____',
    '{{quantidade_contas_bancarias}}': formData.quantidadeContasBancarias?.toString() || '_____',
    '{{volume_lancamentos_contabeis}}': formData.volumeLancamentosContabeis || '_____________________',
    '{{numero_notas_servicos}}': formData.numeroNotasServicos || '_____________________',
    '{{numero_notas_entrada_saida}}': formData.numeroNotasEntradaSaida || '_____________________',
    '{{quantidade_empregados_clt}}': formData.quantidadeEmpregadosClt?.toString() || '_____',
    '{{quantidade_socios}}': formData.quantidadeSocios?.toString() || '_____',
    
    // Serviços
    '{{servicos_ordinarios}}': tipoServico?.servicosOrdinarios?.map((s, i) => `${i + 1}. ${s}`).join('\n') || '1. _____________________',
    '{{servicos_extraordinarios}}': tipoServico?.servicosExtraordinarios?.map((s, i) => `${i + 1}. ${s}`).join('\n') || '1. _____________________',
    '{{servicos_complementares}}': tipoServico?.servicosComplementares?.map((s, i) => `${i + 1}. ${s}`).join('\n') || '1. _____________________',
    
    // Dados Financeiros
    '{{valor_mensalidade}}': formatCurrency(formData.valorMensalidade || 0),
    '{{valor_mensalidade_extenso}}': '_____________________',
    '{{dia_vencimento}}': formData.diaVencimento?.toString() || '__',
    '{{valor_13a_mensalidade}}': formData.valor13aMensalidade || '_____________________',
    '{{percentual_reajuste_anual}}': formData.percentualReajusteAnual?.toString() || '__',
    '{{forma_pagamento}}': formData.formaPagamento || '_____________________',
    
    // Dados Contratuais
    '{{data_inicio_contrato}}': formatDate(formData.dataInicioContrato || ''),
    '{{prazo_vigencia}}': formData.prazoVigencia?.toString() || '__',
    '{{pre_aviso_rescisao}}': formData.preAvisoRescisao?.toString() || '__',
    '{{multa_rescisoria_percentual}}': formData.multaRescisioriaPercentual?.toString() || '__',
    
    // LGPD
    '{{dpo_nome}}': formData.dpoNome || '_____________________',
    '{{dpo_email}}': formData.dpoEmail || '_____________________',
    
    // Testemunhas
    '{{testemunha1_nome}}': formData.testemunha1Nome || '_____________________',
    '{{testemunha1_rg}}': formData.testemunha1Rg || '_____________________',
    '{{testemunha2_nome}}': formData.testemunha2Nome || '_____________________',
    '{{testemunha2_rg}}': formData.testemunha2Rg || '_____________________',
    
    // Outros
    '{{ano_base}}': formData.anoBase || new Date().getFullYear().toString(),
    '{{sistema_gestao}}': formData.sistemaGestao || '_____________________',
    '{{data_assinatura}}': formatDate(new Date()),
    '{{cidade_assinatura}}': 'São Paulo',
  };

  console.log('Variables for replacement:', variables);

  let result = text;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
    const replaceValue = value && value.trim() !== '' ? value : (key.includes('orgao_emissor') ? '____' : '');
    result = result.replace(regex, replaceValue);
  });
  
  console.log('Result after replacement (first 1000 chars):', result.substring(0, 1000));
  return result;
};

export const contractTemplate = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS CONTÁBEIS

Pelo presente instrumento particular, as partes a seguir qualificadas:

**CONTRATANTE:**

{{contratante_razao_social}}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {{contratante_cnpj}}, com sede na {{contratante_endereco}}, neste ato representada por {{contratante_representante_nome}}, {{contratante_representante_nacionalidade}}, {{contratante_representante_estado_civil}}, {{contratante_representante_profissao}}, portador(a) do CPF nº {{contratante_representante_cpf}} e RG nº {{contratante_representante_rg}} - {{contratante_representante_orgao_emissor}};

**CONTRATADA:**

JLVIANA CONSULTORIA CONTÁBIL LTDA - ME, inscrita no CNPJ sob o nº 07.203.780/0001-16, com sede na Rua dos Heliotrópios, nº 95, Mirandópolis, São Paulo/SP, CEP 04049-060, registrada no CRC/SP sob o nº 2SP023539/O-4, neste ato representada por {{contratada_representante_nome}}, {{contratada_representante_nacionalidade}}, {{contratada_representante_estado_civil}}, {{contratada_representante_profissao}}, CRC {{contratada_representante_crc}}, CPF nº {{contratada_representante_cpf}};

Têm entre si justo e acertado o presente contrato de prestação de serviços contábeis, que se regerá pelas cláusulas e condições a seguir estabelecidas:

**CLÁUSULA PRIMEIRA – DO OBJETO**

1.1. A CONTRATADA obriga-se a prestar à CONTRATANTE os serviços contábeis especificados no presente contrato, de acordo com as normas técnicas de contabilidade e legislação aplicável.

1.2. Os serviços serão prestados considerando os seguintes parâmetros empresariais da CONTRATANTE:

• Regime Tributário: {{regime_tributario}}
• Quantidade de Estabelecimentos: {{quantidade_estabelecimentos}}
• Quantidade de Contas Bancárias: {{quantidade_contas_bancarias}}
• Volume de Lançamentos Contábeis (mensais): {{volume_lancamentos_contabeis}}
• Número de Notas Fiscais de Serviços (mensais): {{numero_notas_servicos}}
• Número de Notas Fiscais de Entrada/Saída (mensais): {{numero_notas_entrada_saida}}
• Quantidade de Empregados CLT: {{quantidade_empregados_clt}}
• Quantidade de Sócios: {{quantidade_socios}}

**CLÁUSULA SEGUNDA – DOS SERVIÇOS CONTRATADOS**

2.1. **SERVIÇOS ORDINÁRIOS MENSAIS:**

{{servicos_ordinarios}}

2.2. **SERVIÇOS EXTRAORDINÁRIOS:** (cobrança à parte, mediante orçamento prévio)

{{servicos_extraordinarios}}

2.3. **SERVIÇOS COMPLEMENTARES:**

{{servicos_complementares}}

**CLÁUSULA TERCEIRA – DO VALOR E FORMA DE PAGAMENTO**

3.1. O valor mensal dos serviços contratados é de {{valor_mensalidade}} ({{valor_mensalidade_extenso}}), com vencimento sempre no dia {{dia_vencimento}} de cada mês.

3.2. O pagamento será efetuado através de {{forma_pagamento}}.

3.3. A CONTRATANTE pagará ainda o valor correspondente à 13ª mensalidade: {{valor_13a_mensalidade}}.

3.4. Os valores contratuais serão reajustados anualmente em {{percentual_reajuste_anual}}% ou pelo IGPM, prevalecendo o menor índice.

3.5. O atraso no pagamento sujeitará a CONTRATANTE ao pagamento de multa de 2% sobre o valor devido, mais juros de mora de 1% ao mês e correção monetária pelo IGPM.

**CLÁUSULA QUARTA – DAS OBRIGAÇÕES DA CONTRATANTE**

4.1. Fornecer à CONTRATADA, até o dia 15 de cada mês, todos os documentos e informações necessários para a execução dos serviços contratados.

4.2. Comunicar imediatamente qualquer alteração em sua situação jurídica, fiscal ou econômica.

4.3. Manter organizados e arquivados todos os documentos fiscais e contábeis.

4.4. Efetuar os pagamentos nos prazos estipulados.

4.5. Fornecer as informações necessárias para cumprimento das obrigações acessórias.

4.6. Entregar anualmente a Carta de Responsabilidade da Administração, conforme Anexo I.

**CLÁUSULA QUINTA – DAS OBRIGAÇÕES DA CONTRATADA**

5.1. Executar os serviços contratados com zelo profissional e dentro dos prazos legais.

5.2. Manter sigilo absoluto sobre todos os dados e informações da CONTRATANTE.

5.3. Orientar a CONTRATANTE sobre as obrigações fiscais, tributárias e trabalhistas.

5.4. Comunicar formalmente quaisquer irregularidades detectadas na documentação.

5.5. Entregar mensalmente os relatórios contábeis e demonstrativos fiscais.

5.6. Cumprir os prazos de entrega das obrigações acessórias.

**CLÁUSULA SEXTA – DA RESPONSABILIDADE**

6.1. A CONTRATADA responsabiliza-se pelos serviços executados dentro dos prazos e informações fornecidas pela CONTRATANTE.

6.2. A CONTRATANTE responsabiliza-se pela veracidade e integridade das informações e documentos fornecidos.

6.3. Eventuais multas decorrentes de atraso na entrega de documentos pela CONTRATANTE serão de sua exclusiva responsabilidade.

**CLÁUSULA SÉTIMA – DA LEI GERAL DE PROTEÇÃO DE DADOS (LGPD)**

7.1. As partes comprometem-se ao cumprimento da Lei nº 13.709/2018 (LGPD).

7.2. Dados do Encarregado (DPO) da CONTRATANTE:
• Nome: {{dpo_nome}}
• E-mail: {{dpo_email}}

7.3. Canal oficial da CONTRATADA para questões de LGPD: lgpd@jlviana.com.br

**CLÁUSULA OITAVA – DAS DESPESAS OPERACIONAIS**

8.1. Correrão por conta da CONTRATANTE as despesas com autenticações, reconhecimento de firma, taxas, emolumentos, livros fiscais e outros materiais necessários à execução dos serviços.

**CLÁUSULA NONA – DA VIGÊNCIA E RESCISÃO**

9.1. Este contrato entra em vigor na data de {{data_inicio_contrato}} e terá prazo de vigência de {{prazo_vigencia}} meses.

9.2. O contrato poderá ser rescindido por qualquer das partes, mediante aviso prévio de {{pre_aviso_rescisao}} dias.

9.3. A parte que não respeitar o prazo de aviso prévio pagará à outra multa equivalente a {{multa_rescisoria_percentual}}% do valor mensal vigente.

9.4. A CONTRATADA poderá rescindir imediatamente o contrato em caso de inadimplemento ou quebra de confiança.

**CLÁUSULA DÉCIMA – DAS DISPOSIÇÕES GERAIS**

10.1. Este contrato substitui e revoga qualquer acordo anterior entre as partes.

10.2. Alterações somente serão válidas se feitas por escrito e assinadas pelas partes.

10.3. Se qualquer cláusula for considerada inválida, as demais permanecerão em vigor.

**CLÁUSULA DÉCIMA PRIMEIRA – DO FORO**

11.1. As partes elegem o Foro da Comarca de São Paulo/SP para dirimir questões oriundas deste contrato.

E, por estarem justas e contratadas, as partes assinam o presente instrumento em 2 (duas) vias de igual teor e forma, na presença das testemunhas abaixo.

{{cidade_assinatura}}, {{data_assinatura}}.

________________________________
{{contratante_razao_social}}
CONTRATANTE

________________________________
JLVIANA CONSULTORIA CONTÁBIL LTDA - ME
CONTRATADA

**TESTEMUNHAS:**

1) ____________________________     2) ____________________________
   {{testemunha1_nome}}                 {{testemunha2_nome}}
   RG: {{testemunha1_rg}}              RG: {{testemunha2_rg}}

---

**ANEXO I – CARTA DE RESPONSABILIDADE DA ADMINISTRAÇÃO**

{{cidade_assinatura}}, {{data_assinatura}}.

À JLVIANA CONSULTORIA CONTÁBIL LTDA - ME

Prezados Senhores,

Na qualidade de administradores da empresa {{contratante_razao_social}}, CNPJ nº {{contratante_cnpj}}, declaramos que as informações e documentos por nós fornecidos para a elaboração da escrituração contábil e demonstrações contábeis relativas ao exercício social encerrado em 31/12/{{ano_base}} são completos e fidedignos.

Declaramos ainda que:

1. Todos os registros de ativos e passivos estão adequadamente demonstrados nas contas patrimoniais;

2. Não existem ônus, gravames ou garantias sobre os ativos que não estejam devidamente registrados;

3. Todas as operações foram adequadamente autorizadas e estão registradas;

4. Os estoques foram devidamente inventariados e avaliados;

5. Não há conhecimento de irregularidades envolvendo administradores e empregados;

6. Todos os livros e registros foram disponibilizados para exame;

7. O sistema de controle interno é adequado ao tipo e porte da empresa;

8. Sistema de gestão utilizado: {{sistema_gestao}}.

Assumimos total responsabilidade pelas informações prestadas.

Atenciosamente,

________________________________
{{contratante_representante_nome}}
Administrador`;
