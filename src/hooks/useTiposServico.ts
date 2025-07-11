
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TipoServico } from '@/types/contract';
import { toast } from 'sonner';

export function useTiposServico() {
  return useQuery({
    queryKey: ['tipos-servico'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tipos_servico')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform Supabase data to match our TipoServico type
      return data.map(tipo => ({
        id: tipo.id,
        nome: tipo.nome,
        descricao: tipo.descricao || '',
        servicosOrdinarios: tipo.servicos_ordinarios || [],
        servicosExtraordinarios: tipo.servicos_extraordinarios || [],
        servicosComplementares: tipo.servicos_complementares || [],
        valorBase: Number(tipo.valor_base),
        createdAt: new Date(tipo.created_at),
      })) as TipoServico[];
    },
  });
}

export function useAddTipoServico() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tipoServico: Omit<TipoServico, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('tipos_servico')
        .insert({
          nome: tipoServico.nome,
          descricao: tipoServico.descricao,
          servicos_ordinarios: tipoServico.servicosOrdinarios,
          servicos_extraordinarios: tipoServico.servicosExtraordinarios,
          servicos_complementares: tipoServico.servicosComplementares,
          valor_base: tipoServico.valorBase,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-servico'] });
      toast.success('Tipo de serviço cadastrado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao cadastrar tipo de serviço:', error);
      toast.error('Erro ao cadastrar tipo de serviço');
    },
  });
}

export function useDeleteTipoServico() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tipos_servico')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-servico'] });
      toast.success('Tipo de serviço removido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao remover tipo de serviço:', error);
      toast.error('Erro ao remover tipo de serviço');
    },
  });
}
