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

async function seedTiposServicoPadrao() {
  for (const nome of TIPOS_SERVICOS_PADRAO) {
    // Verifica se já existe
    const { data, error } = await supabase
      .from('tipos_servico')
      .select('id')
      .eq('nome', nome)
      .maybeSingle();
    if (error) {
      console.error(`Erro ao consultar tipo de serviço '${nome}':`, error.message);
      continue;
    }
    if (!data) {
      // Insere se não existir
      const { error: insertError } = await supabase
        .from('tipos_servico')
        .insert({
          nome,
          descricao: '',
          servicos_ordinarios: [],
          servicos_extraordinarios: [],
          servicos_complementares: [],
          valor_base: 0,
        });
      if (insertError) {
        console.error(`Erro ao inserir tipo de serviço '${nome}':`, insertError.message);
      } else {
        console.log(`Tipo de serviço '${nome}' cadastrado.`);
      }
    } else {
      console.log(`Tipo de serviço '${nome}' já existe.`);
    }
  }
  console.log('Seed finalizado.');
}

seedTiposServicoPadrao().then(() => process.exit(0)); 