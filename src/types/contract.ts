
export interface Cliente {
  id: string;
  razaoSocial: string;
  cnpj: string;
  endereco?: string;
  representanteNome?: string;
  representanteNacionalidade?: string;
  representanteEstadoCivil?: string;
  representanteProfissao?: string;
  representanteCpf?: string;
  representanteRg?: string;
  representanteOrgaoEmissor?: string;
  createdAt: Date;
}

export interface TipoServico {
  id: string;
  nome: string;
  descricao: string;
  servicosOrdinarios: string[];
  servicosExtraordinarios: string[];
  servicosComplementares: string[];
  valorBase: number;
  createdAt: Date;
}

export interface Contrato {
  id: string;
  clienteId: string;
  tipoServicoId: string;
  regimeTributario: string;
  quantidadeEstabelecimentos: number;
  quantidadeContasBancarias: number;
  volumeLancamentosContabeis: string;
  numeroNotasServicos: string;
  numeroNotasEntradaSaida: string;
  quantidadeEmpregadosClt: number;
  quantidadeSocios: number;
  valorMensalidade: number;
  diaVencimento: number;
  valor13aMensalidade: string;
  percentualReajusteAnual: number;
  cobraAlteracaoContrato: string;
  cobraIrpfSocios: string;
  formaPagamento: string;
  dataInicioContrato: Date;
  prazoVigencia: number;
  preAvisoRescisao: number;
  multaRescisioriaPercentual: number;
  dpoNome: string;
  dpoEmail: string;
  testemunha1Nome: string;
  testemunha1Rg: string;
  testemunha2Nome: string;
  testemunha2Rg: string;
  anoBase: string;
  sistemaGestao: string;
  contratadaRepresentanteNome: string;
  contratadaRepresentanteNacionalidade: string;
  contratadaRepresentanteEstadoCivil: string;
  contratadaRepresentanteProfissao: string;
  contratadaRepresentanteCrc: string;
  contratadaRepresentanteCpf: string;
  createdAt: Date;
}
