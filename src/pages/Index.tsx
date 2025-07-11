import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Users, Settings } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ClienteForm } from '@/components/ClienteForm';
import { TipoServicoForm } from '@/components/TipoServicoForm';
import { ContratoForm } from '@/components/ContratoForm';
import { ImportClientes } from '@/components/ImportClientes';
import { ContratoPDF } from '@/components/ContratoPDF';
import { Cliente, TipoServico, Contrato } from '@/types/contract';
import { toast } from 'sonner';

const Index = () => {
  const [clientes, setClientes] = useLocalStorage<Cliente[]>('clientes', []);
  const [tiposServico, setTiposServico] = useLocalStorage<TipoServico[]>('tiposServico', []);
  const [contratos, setContratos] = useLocalStorage<Contrato[]>('contratos', []);

  const addCliente = (clienteData: Omit<Cliente, 'id' | 'createdAt'>) => {
    const novoCliente: Cliente = {
      ...clienteData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setClientes([...clientes, novoCliente]);
    toast.success('Cliente cadastrado com sucesso!');
  };

  const addTipoServico = (tipoServicoData: Omit<TipoServico, 'id' | 'createdAt'>) => {
    const novoTipoServico: TipoServico = {
      ...tipoServicoData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTiposServico([...tiposServico, novoTipoServico]);
    toast.success('Tipo de serviço cadastrado com sucesso!');
  };

  const addContrato = (contratoData: Omit<Contrato, 'id' | 'createdAt'>) => {
    const novoContrato: Contrato = {
      ...contratoData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setContratos([...contratos, novoContrato]);
    toast.success('Contrato gerado com sucesso!');
  };

  const importClientes = (clientesImportados: Omit<Cliente, 'id' | 'createdAt'>[]) => {
    const novosClientes: Cliente[] = clientesImportados.map(cliente => ({
      ...cliente,
      id: Date.now().toString() + Math.random(),
      createdAt: new Date(),
    }));
    setClientes([...clientes, ...novosClientes]);
    toast.success(`${novosClientes.length} clientes importados com sucesso!`);
  };

  const deleteCliente = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id));
    toast.success('Cliente removido com sucesso!');
  };

  const deleteTipoServico = (id: string) => {
    setTiposServico(tiposServico.filter(t => t.id !== id));
    toast.success('Tipo de serviço removido com sucesso!');
  };

  const deleteContrato = (id: string) => {
    setContratos(contratos.filter(c => c.id !== id));
    toast.success('Contrato removido com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Geração de Contratos
          </h1>
          <p className="text-xl text-gray-600">
            JLVIANA Consultoria Contábil
          </p>
        </div>

        <Tabs defaultValue="clientes" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="clientes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="servicos" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="contratos" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contratos
            </TabsTrigger>
            <TabsTrigger value="gerados" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Gerados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clientes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClienteForm onSubmit={addCliente} />
              <ImportClientes onImport={importClientes} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Clientes Cadastrados ({clientes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum cliente cadastrado ainda.
                    </p>
                  ) : (
                    clientes.map((cliente) => (
                      <div key={cliente.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{cliente.razaoSocial}</h3>
                          <p className="text-sm text-muted-foreground">CNPJ: {cliente.cnpj}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCliente(cliente.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servicos" className="space-y-6">
            <TipoServicoForm onSubmit={addTipoServico} />

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Serviço Cadastrados ({tiposServico.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tiposServico.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum tipo de serviço cadastrado ainda.
                    </p>
                  ) : (
                    tiposServico.map((tipo) => (
                      <div key={tipo.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{tipo.nome}</h3>
                          <p className="text-sm text-muted-foreground">{tipo.descricao}</p>
                          <p className="text-sm font-medium">Valor Base: R$ {tipo.valorBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteTipoServico(tipo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contratos" className="space-y-6">
            {clientes.length === 0 || tiposServico.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Para gerar contratos, você precisa ter pelo menos:
                    </p>
                    <ul className="text-muted-foreground space-y-2">
                      <li>• 1 cliente cadastrado</li>
                      <li>• 1 tipo de serviço cadastrado</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ContratoForm
                clientes={clientes}
                onSubmit={addContrato}
              />
            )}
          </TabsContent>

          <TabsContent value="gerados" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contratos Gerados ({contratos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contratos.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum contrato gerado ainda.
                    </p>
                  ) : (
                    contratos.map((contrato) => {
                      const cliente = clientes.find(c => c.id === contrato.clienteId);
                      const tipoServico = tiposServico.find(t => t.id === contrato.tipoServicoId);
                      
                      return (
                        <div key={contrato.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{cliente?.razaoSocial || 'Cliente não encontrado'}</h3>
                            <p className="text-sm text-muted-foreground">
                              Serviço: {tipoServico?.nome || 'Serviço não encontrado'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Valor: R$ {contrato.valorMensalidade.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {cliente && tipoServico && (
                              <ContratoPDF
                                contrato={contrato}
                                cliente={cliente}
                                tipoServico={tipoServico}
                              />
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteContrato(contrato.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
