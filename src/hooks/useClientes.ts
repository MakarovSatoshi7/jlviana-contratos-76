
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Cliente } from '@/types/contract';
import { toast } from 'sonner';

export function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform Supabase data to match our Cliente type
      return data.map(cliente => ({
        id: cliente.id,
        razaoSocial: cliente.razao_social,
        cnpj: cliente.cnpj,
        endereco: cliente.endereco,
        representanteNome: cliente.representante_nome,
        representanteNacionalidade: cliente.representante_nacionalidade,
        representanteEstadoCivil: cliente.representante_estado_civil,
        representanteProfissao: cliente.representante_profissao,
        representanteCpf: cliente.representante_cpf,
        representanteRg: cliente.representante_rg,
        representanteOrgaoEmissor: cliente.representante_orgao_emissor,
        createdAt: new Date(cliente.created_at),
      })) as Cliente[];
    },
  });
}

export function useAddCliente() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cliente: Omit<Cliente, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('clientes')
        .insert({
          razao_social: cliente.razaoSocial,
          cnpj: cliente.cnpj,
          endereco: cliente.endereco,
          representante_nome: cliente.representanteNome,
          representante_nacionalidade: cliente.representanteNacionalidade,
          representante_estado_civil: cliente.representanteEstadoCivil,
          representante_profissao: cliente.representanteProfissao,
          representante_cpf: cliente.representanteCpf,
          representante_rg: cliente.representanteRg,
          representante_orgao_emissor: cliente.representanteOrgaoEmissor,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente cadastrado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao cadastrar cliente:', error);
      toast.error('Erro ao cadastrar cliente');
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente removido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao remover cliente:', error);
      toast.error('Erro ao remover cliente');
    },
  });
}

export function useImportClientes() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clientes: Omit<Cliente, 'id' | 'createdAt'>[]) => {
      const clientesData = clientes.map(cliente => ({
        razao_social: cliente.razaoSocial,
        cnpj: cliente.cnpj,
        endereco: cliente.endereco,
        representante_nome: cliente.representanteNome,
        representante_nacionalidade: cliente.representanteNacionalidade,
        representante_estado_civil: cliente.representanteEstadoCivil,
        representante_profissao: cliente.representanteProfissao,
        representante_cpf: cliente.representanteCpf,
        representante_rg: cliente.representanteRg,
        representante_orgao_emissor: cliente.representanteOrgaoEmissor,
      }));
      
      const { data, error } = await supabase
        .from('clientes')
        .insert(clientesData)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success(`${data.length} clientes importados com sucesso!`);
    },
    onError: (error) => {
      console.error('Erro ao importar clientes:', error);
      toast.error('Erro ao importar clientes');
    },
  });
}
