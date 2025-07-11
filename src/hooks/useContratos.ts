
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Contrato } from '@/types/contract';
import { toast } from 'sonner';

export function useContratos() {
  return useQuery({
    queryKey: ['contratos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform Supabase data to match our Contrato type
      return data.map(contrato => ({
        id: contrato.id,
        clienteId: contrato.cliente_id,
        tipoServicoId: contrato.tipo_servico_id,
        regimeTributario: contrato.regime_tributario,
        quantidadeEstabelecimentos: contrato.quantidade_estabelecimentos || 1,
        quantidadeContasBancarias: contrato.quantidade_contas_bancarias || 1,
        volumeLancamentosContabeis: contrato.volume_lancamentos_contabeis || '',
        numeroNotasServicos: contrato.numero_notas_servicos || '',
        numeroNotasEntradaSaida: contrato.numero_notas_entrada_saida || '',
        quantidadeEmpregadosClt: contrato.quantidade_empregados_clt || 0,
        quantidadeSocios: contrato.quantidade_socios || 1,
        valorMensalidade: Number(contrato.valor_mensalidade),
        diaVencimento: contrato.dia_vencimento,
        valor13aMensalidade: contrato.valor_13a_mensalidade || '',
        percentualReajusteAnual: Number(contrato.percentual_reajuste_anual || 0),
        cobraAlteracaoContrato: contrato.cobra_alteracao_contrato || '',
        cobraIrpfSocios: contrato.cobra_irpf_socios || '',
        formaPagamento: contrato.forma_pagamento || '',
        dataInicioContrato: new Date(contrato.data_inicio_contrato),
        prazoVigencia: contrato.prazo_vigencia,
        preAvisoRescisao: contrato.pre_aviso_rescisao,
        multaRescisioriaPercentual: Number(contrato.multa_rescisoria_percentual || 0),
        dpoNome: contrato.dpo_nome || '',
        dpoEmail: contrato.dpo_email || '',
        testemunha1Nome: contrato.testemunha1_nome || '',
        testemunha1Rg: contrato.testemunha1_rg || '',
        testemunha2Nome: contrato.testemunha2_nome || '',
        testemunha2Rg: contrato.testemunha2_rg || '',
        anoBase: contrato.ano_base || '',
        sistemaGestao: contrato.sistema_gestao || '',
        contratadaRepresentanteNome: contrato.contratada_representante_nome || '',
        contratadaRepresentanteNacionalidade: contrato.contratada_representante_nacionalidade || '',
        contratadaRepresentanteEstadoCivil: contrato.contratada_representante_estado_civil || '',
        contratadaRepresentanteProfissao: contrato.contratada_representante_profissao || '',
        contratadaRepresentanteCrc: contrato.contratada_representante_crc || '',
        contratadaRepresentanteCpf: contrato.contratada_representante_cpf || '',
        createdAt: new Date(contrato.created_at),
      })) as Contrato[];
    },
  });
}

export function useAddContrato() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contrato: Omit<Contrato, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('contratos')
        .insert({
          cliente_id: contrato.clienteId,
          tipo_servico_id: contrato.tipoServicoId,
          regime_tributario: contrato.regimeTributario,
          quantidade_estabelecimentos: contrato.quantidadeEstabelecimentos,
          quantidade_contas_bancarias: contrato.quantidadeContasBancarias,
          volume_lancamentos_contabeis: contrato.volumeLancamentosContabeis,
          numero_notas_servicos: contrato.numeroNotasServicos,
          numero_notas_entrada_saida: contrato.numeroNotasEntradaSaida,
          quantidade_empregados_clt: contrato.quantidadeEmpregadosClt,
          quantidade_socios: contrato.quantidadeSocios,
          valor_mensalidade: contrato.valorMensalidade,
          dia_vencimento: contrato.diaVencimento,
          valor_13a_mensalidade: contrato.valor13aMensalidade,
          percentual_reajuste_anual: contrato.percentualReajusteAnual,
          cobra_alteracao_contrato: contrato.cobraAlteracaoContrato,
          cobra_irpf_socios: contrato.cobraIrpfSocios,
          forma_pagamento: contrato.formaPagamento,
          data_inicio_contrato: contrato.dataInicioContrato.toISOString().split('T')[0],
          prazo_vigencia: contrato.prazoVigencia,
          pre_aviso_rescisao: contrato.preAvisoRescisao,
          multa_rescisoria_percentual: contrato.multaRescisioriaPercentual,
          dpo_nome: contrato.dpoNome,
          dpo_email: contrato.dpoEmail,
          testemunha1_nome: contrato.testemunha1Nome,
          testemunha1_rg: contrato.testemunha1Rg,
          testemunha2_nome: contrato.testemunha2Nome,
          testemunha2_rg: contrato.testemunha2Rg,
          ano_base: contrato.anoBase,
          sistema_gestao: contrato.sistemaGestao,
          contratada_representante_nome: contrato.contratadaRepresentanteNome,
          contratada_representante_nacionalidade: contrato.contratadaRepresentanteNacionalidade,
          contratada_representante_estado_civil: contrato.contratadaRepresentanteEstadoCivil,
          contratada_representante_profissao: contrato.contratadaRepresentanteProfissao,
          contratada_representante_crc: contrato.contratadaRepresentanteCrc,
          contratada_representante_cpf: contrato.contratadaRepresentanteCpf,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      toast.success('Contrato gerado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao gerar contrato:', error);
      toast.error('Erro ao gerar contrato');
    },
  });
}

export function useDeleteContrato() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      toast.success('Contrato removido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao remover contrato:', error);
      toast.error('Erro ao remover contrato');
    },
  });
}
