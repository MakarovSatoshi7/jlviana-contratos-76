import { supabase } from './client';

const TIPOS_SERVICOS_PADRAO = [
  'Contabilidade Completa',
  'Contabilidade Simplificada',
  'Contabilidade Consultiva',
  'BPO Financeiro',
  'Abertura de Empresa',
  'Alteração Contratual',
  'Regularização de Empresa',
  'Baixa de Empresa',
  'Assessoria Contábil',
  'Assessoria Fiscal',
  'Assessoria Trabalhista',
  'Planejamento Tributário',
  'Recuperação de Créditos Tributários',
  'Gestão da Folha de Pagamento',
  'Pró-labore',
  'Gestão do eSocial',
  'Escrituração Contábil e Fiscal (ECD/ECF)',
  'Declaração de Imposto de Renda (Pessoa Física e Jurídica)',
  'Apuração de Impostos',
  'Enquadramento Tributário (Simples Nacional, Lucro Presumido, Lucro Real)',
  'Migração de MEI para ME',
  'Auditoria Contábil',
  'Perícia Contábil',
  'Avaliação de Empresas (Valuation)',
  'Consultoria Financeira',
  'Emissão de Certificado Digital',
  'Emissão de Guias de Impostos',
  'Entrega de Obrigações Acessórias (DCTF, EFD, etc.)',
];

export async function autoSeedTiposServicoPadrao() {
  for (const nome of TIPOS_SERVICOS_PADRAO) {
    const { data, error } = await supabase
      .from('tipos_servico')
      .select('id')
      .eq('nome', nome)
      .maybeSingle();
    if (!data && !error) {
      await supabase
        .from('tipos_servico')
        .insert({
          nome,
          descricao: '',
          servicos_ordinarios: [],
          servicos_extraordinarios: [],
          servicos_complementares: [],
          valor_base: 0,
        });
    }
  }
} 