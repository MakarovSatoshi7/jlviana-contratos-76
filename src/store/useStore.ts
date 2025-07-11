
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cliente, TipoServico, Contrato } from '@/types/contract';

interface Store {
  // State
  clientes: Cliente[];
  tiposServico: TipoServico[];
  contratos: Contrato[];
  
  // Actions
  addCliente: (cliente: Omit<Cliente, 'id' | 'createdAt'>) => void;
  updateCliente: (id: string, clienteData: Partial<Cliente>) => void;
  addTipoServico: (tipoServico: Omit<TipoServico, 'id' | 'createdAt'>) => void;
  addContrato: (contrato: Omit<Contrato, 'id' | 'createdAt'>) => void;
  importClientes: (clientes: Omit<Cliente, 'id' | 'createdAt'>[]) => void;
  deleteCliente: (id: string) => void;
  deleteTipoServico: (id: string) => void;
  deleteContrato: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      clientes: [],
      tiposServico: [],
      contratos: [],
      
      addCliente: (clienteData) =>
        set((state) => ({
          clientes: [
            ...state.clientes,
            {
              ...clienteData,
              id: Date.now().toString(),
              createdAt: new Date(),
            },
          ],
        })),

      updateCliente: (id, clienteData) =>
        set((state) => ({
          clientes: state.clientes.map((cliente) =>
            cliente.id === id
              ? { ...cliente, ...clienteData }
              : cliente
          ),
        })),
        
      addTipoServico: (tipoServicoData) =>
        set((state) => ({
          tiposServico: [
            ...state.tiposServico,
            {
              ...tipoServicoData,
              id: Date.now().toString(),
              createdAt: new Date(),
            },
          ],
        })),
        
      addContrato: (contratoData) =>
        set((state) => ({
          contratos: [
            ...state.contratos,
            {
              ...contratoData,
              id: Date.now().toString(),
              createdAt: new Date(),
            },
          ],
        })),
        
      importClientes: (clientesImportados) =>
        set((state) => ({
          clientes: [
            ...state.clientes,
            ...clientesImportados.map((cliente) => ({
              ...cliente,
              id: Date.now().toString() + Math.random(),
              createdAt: new Date(),
            })),
          ],
        })),
        
      deleteCliente: (id) =>
        set((state) => ({
          clientes: state.clientes.filter((c) => c.id !== id),
        })),
        
      deleteTipoServico: (id) =>
        set((state) => ({
          tiposServico: state.tiposServico.filter((t) => t.id !== id),
        })),
        
      deleteContrato: (id) =>
        set((state) => ({
          contratos: state.contratos.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'jlviana-storage',
    }
  )
);
