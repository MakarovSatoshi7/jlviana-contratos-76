
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

export const replaceVariables = (text: string, { formData, cliente, tipoServico }: ContractTemplateData): string => {
  console.log('Template data:', { formData, cliente, tipoServico });
  
  const variables: Record<string, string> = {
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
    '{{contratada_representante_nome}}': formData.contratadaRepresentanteNome || 'Jefferson Lopes Viana',
    '{{contratada_representante_nacionalidade}}': formData.contratadaRepresentanteNacionalidade || 'brasileiro',
    '{{contratada_representante_estado_civil}}': formData.contratadaRepresentanteEstadoCivil || 'solteiro',
    '{{contratada_representante_profissao}}': formData.contratadaRepresentanteProfissao || 'contador',
    '{{contratada_representante_crc}}': formData.contratadaRepresentanteCrc || 'CRC 1SP123456/O-1',
    '{{contratada_representante_cpf}}': formData.contratadaRepresentanteCpf || '___.___.___-__',
    '{{regime_tributario}}': formData.regimeTributario || '_____________________',
    '{{quantidade_estabelecimentos}}': formData.quantidadeEstabelecimentos?.toString() || '_____',
    '{{quantidade_contas_bancarias}}': formData.quantidadeContasBancarias?.toString() || '_____',
    '{{volume_lancamentos_contabeis}}': formData.volumeLancamentosContabeis || '_____________________',
    '{{numero_notas_servicos}}': formData.numeroNotasServicos || '_____________________',
    '{{numero_notas_entrada_saida}}': formData.numeroNotasEntradaSaida || '_____________________',
    '{{quantidade_empregados_clt}}': formData.quantidadeEmpregadosClt?.toString() || '_____',
    '{{quantidade_socios}}': formData.quantidadeSocios?.toString() || '_____',
    '{{servicos_ordinarios}}': tipoServico?.servicosOrdinarios?.map(s => `• ${s}`).join('\n') || '• _____________________',
    '{{servicos_extraordinarios}}': tipoServico?.servicosExtraordinarios?.map(s => `• ${s}`).join('\n') || '• _____________________',
    '{{servicos_complementares}}': tipoServico?.servicosComplementares?.map(s => `• ${s}`).join('\n') || '• _____________________',
    '{{valor_mensalidade}}': formData.valorMensalidade?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '_____,__',
    '{{dia_vencimento}}': formData.diaVencimento?.toString() || '__',
    '{{valor_13a_mensalidade}}': formData.valor13aMensalidade || '_____________________',
    '{{percentual_reajuste_anual}}': formData.percentualReajusteAnual?.toString() || '__',
    '{{cobra_alteracao_contrato}}': formData.cobraAlteracaoContrato || '_____________________',
    '{{cobra_irpf_socios}}': formData.cobraIrpfSocios || '_____________________',
    '{{forma_pagamento}}': formData.formaPagamento || '_____________________',
    '{{data_inicio_contrato}}': formatDate(formData.dataInicioContrato || ''),
    '{{prazo_vigencia}}': formData.prazoVigencia?.toString() || '__',
    '{{pre_aviso_rescisao}}': formData.preAvisoRescisao?.toString() || '__',
    '{{multa_rescisoria_percentual}}': formData.multaRescisioriaPercentual?.toString() || '__',
    '{{dpo_nome}}': formData.dpoNome || '_____________________',
    '{{dpo_email}}': formData.dpoEmail || '_____________________',
    '{{testemunha1_nome}}': formData.testemunha1Nome || '_____________________',
    '{{testemunha1_rg}}': formData.testemunha1Rg || '_____________________',
    '{{testemunha2_nome}}': formData.testemunha2Nome || '_____________________',
    '{{testemunha2_rg}}': formData.testemunha2Rg || '_____________________',
    '{{ano_base}}': formData.anoBase || new Date().getFullYear().toString(),
    '{{sistema_gestao}}': formData.sistemaGestao || '_____________________',
    '{{data_assinatura}}': formatDate(new Date()),
  };

  console.log('Variables for replacement:', variables);
  console.log('Cliente orgao emissor value:', cliente?.representanteOrgaoEmissor);

  let result = text;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
    const replaceValue = value && value.trim() !== '' ? value : (key === '{{contratante_representante_orgao_emissor}}' ? '____' : '');
    result = result.replace(regex, replaceValue);
  });
  
  console.log('Result after replacement (first 1000 chars):', result.substring(0, 1000));
  return result;
};

export const contractTemplate = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS CONTÁBEIS

CONTRATANTE:
{{contratante_razao_social}}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº {{contratante_cnpj}}, com sede à {{contratante_endereco}}, representada neste ato por seu representante legal {{contratante_representante_nome}}, {{contratante_representante_nacionalidade}}, {{contratante_representante_estado_civil}}, {{contratante_representante_profissao}}, portador do CPF nº {{contratante_representante_cpf}}, RG nº {{contratante_representante_rg}}, órgão emissor {{contratante_representante_orgao_emissor}}, doravante denominado simplesmente CONTRATANTE.

CONTRATADA:
JLVIANA CONSULTORIA CONTÁBIL LTDA - ME, nome fantasia JLVIANA CONSULTORIA CONTÁBIL, inscrita no CNPJ sob nº 07.203.780/0001-16, registrada no CRC nº 2SP023539/O-4, com sede à Rua dos Heliotrópios, nº 95 – Mirandópolis, São Paulo/SP, representada neste ato por {{contratada_representante_nome}}, {{contratada_representante_nacionalidade}}, {{contratada_representante_estado_civil}}, {{contratada_representante_profissao}}, CRC {{contratada_representante_crc}}, CPF nº {{contratada_representante_cpf}}, doravante denominada simplesmente CONTRATADA.

CLÁUSULA PRIMEIRA – DO OBJETO
A CONTRATANTE contrata os serviços da CONTRATADA para a prestação de serviços contábeis mensais, conforme parâmetros e limites de atuação:

• Regime Tributário: {{regime_tributario}}
• Número de Estabelecimentos: {{quantidade_estabelecimentos}}
• Número de Contas Bancárias: {{quantidade_contas_bancarias}}
• Volume Máximo de Lançamentos Contábeis: {{volume_lancamentos_contabeis}}
• Número Máximo de Notas Fiscais de Serviços: {{numero_notas_servicos}}
• Número Máximo de Notas de Entrada/Saída: {{numero_notas_entrada_saida}}
• Número de Empregados CLT: {{quantidade_empregados_clt}}
• Número de Sócios: {{quantidade_socios}}

Serviços Ordinários Contratados:
{{servicos_ordinarios}}

Serviços Extraordinários Especiais:
{{servicos_extraordinarios}}

Serviços Complementares:
{{servicos_complementares}}

CLÁUSULA SEGUNDA – DO VALOR E FORMA DE PAGAMENTO
O valor mensal será de R$ {{valor_mensalidade}}, com vencimento todo dia {{dia_vencimento}}.

• Valor da 13ª Mensalidade: {{valor_13a_mensalidade}}
• Percentual de Reajuste Anual: {{percentual_reajuste_anual}}%

Outras cobranças:
• Alterações Contratuais: {{cobra_alteracao_contrato}}
• IRPF dos Sócios: {{cobra_irpf_socios}}

O pagamento será realizado via {{forma_pagamento}}.

CLÁUSULA TERCEIRA – DA VIGÊNCIA
Este contrato entra em vigor em {{data_inicio_contrato}} e terá prazo de {{prazo_vigencia}} meses, podendo ser rescindido mediante aviso prévio de {{pre_aviso_rescisao}} dias.

Em caso de rescisão sem aviso prévio, aplica-se multa rescisória de {{multa_rescisoria_percentual}}% sobre o valor contratual.

CLÁUSULA QUARTA – DAS OBRIGAÇÕES DA CONTRATANTE
• Fornecer documentos e informações nos prazos estipulados.
• Informar alterações societárias ou cadastrais.
• Cumprir os prazos de envio de informações.
• Realizar pagamentos pontualmente.
• Manter o sigilo das condições contratuais.
• Entregar a Carta de Responsabilidade (Anexo I) até o encerramento do exercício social.

CLÁUSULA QUINTA – DAS OBRIGAÇÕES DA CONTRATADA
• Prestar serviços contábeis conforme normas legais.
• Entregar guias, relatórios e obrigações acessórias nos prazos legais.
• Manter sigilo sobre dados e informações da CONTRATANTE.
• Comunicar irregularidades encontradas nos documentos enviados.
• Orientar tecnicamente a CONTRATANTE sobre obrigações fiscais, trabalhistas e previdenciárias.
• Cumprir prazos de entrega conforme legislação vigente.

CLÁUSULA SEXTA – DA LEI GERAL DE PROTEÇÃO DE DADOS (LGPD)
As partes se obrigam a cumprir a Lei nº 13.709/18 (LGPD).

Dados do DPO do Contratante:
• Nome: {{dpo_nome}}
• E-mail: {{dpo_email}}

Canal oficial da Contratada para assuntos de LGPD: qualidade@jlviana.com.br

CLÁUSULA SÉTIMA – DAS DESPESAS OPERACIONAIS
Despesas operacionais, diligências, custas, autenticações, reconhecimentos de firma, taxas, livros fiscais e outros materiais necessários à execução dos serviços serão reembolsadas pela CONTRATANTE mediante apresentação de comprovantes.

CLÁUSULA OITAVA – DA RESILIÇÃO E RESCISÃO
O contrato poderá ser resilido a qualquer tempo mediante aviso prévio de {{pre_aviso_rescisao}} dias.

A parte que não respeitar o aviso prévio estará sujeita ao pagamento de multa compensatória equivalente a 2 (duas) mensalidades vigentes.

A CONTRATADA poderá rescindir o contrato em caso de inadimplência, quebra de confiança ou descumprimento contratual, mediante notificação formal.

CLÁUSULA NONA – DO FORO
Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o Foro da Comarca de São Paulo/SP, renunciando a qualquer outro, por mais privilegiado que seja.

E por estarem assim justas e contratadas, firmam o presente instrumento em 2 (duas) vias de igual teor e forma.

São Paulo, {{data_assinatura}}.

CONTRATANTE:
{{contratante_razao_social}}

CONTRATADA:
JLVIANA CONSULTORIA CONTÁBIL LTDA - ME

TESTEMUNHAS:
1. Nome: {{testemunha1_nome}} – RG: {{testemunha1_rg}}
2. Nome: {{testemunha2_nome}} – RG: {{testemunha2_rg}}

ANEXO I – CARTA DE RESPONSABILIDADE DA ADMINISTRAÇÃO

São Paulo, {{data_assinatura}}.

À JLVIANA CONSULTORIA CONTÁBIL LTDA - ME

Declaramos, como administradores e responsáveis legais da {{contratante_razao_social}} – CNPJ {{contratante_cnpj}}, que as informações fornecidas para escrituração e elaboração das demonstrações contábeis do período-base {{ano_base}} são fidedignas.

Confirmamos:
• Controles internos adequados.
• Inexistência de operações ilegais.
• Idoneidade dos documentos enviados.
• Estoques contados e avaliados corretamente.
• Veracidade dos registros no sistema {{sistema_gestao}}.

Assumimos integral responsabilidade pelas informações prestadas.`;
