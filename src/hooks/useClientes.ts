
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Cliente } from '@/types/contract';
import { toast } from 'sonner';

export function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      console.log('Buscando clientes do Supabase...');
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
      }
      
      console.log('Dados recebidos do Supabase:', data);
      
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
      console.log('Adicionando cliente no Supabase:', cliente);
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
      
      if (error) {
        console.error('Erro ao inserir cliente:', error);
        throw error;
      }
      console.log('Cliente inserido com sucesso:', data);
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
      console.log('Deletando cliente:', id);
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar cliente:', error);
        throw error;
      }
      console.log('Cliente deletado com sucesso');
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
      console.log('Iniciando importação de clientes:', clientes.length);
      
      const clientesData = clientes.map(cliente => ({
        razao_social: cliente.razaoSocial,
        cnpj: cliente.cnpj,
        endereco: cliente.endereco || null,
        representante_nome: cliente.representanteNome || null,
        representante_nacionalidade: cliente.representanteNacionalidade || null,
        representante_estado_civil: cliente.representanteEstadoCivil || null,
        representante_profissao: cliente.representanteProfissao || null,
        representante_cpf: cliente.representanteCpf || null,
        representante_rg: cliente.representanteRg || null,
        representante_orgao_emissor: cliente.representanteOrgaoEmissor || null,
      }));
      
      console.log('Dados preparados para inserção:', clientesData);
      
      const { data, error } = await supabase
        .from('clientes')
        .insert(clientesData)
        .select();
      
      if (error) {
        console.error('Erro na importação:', error);
        throw error;
      }
      
      console.log('Importação concluída com sucesso:', data);
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
