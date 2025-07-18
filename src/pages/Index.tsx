import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Users, Settings } from 'lucide-react';
import { ClienteForm } from '@/components/ClienteForm';
import { TipoServicoForm } from '@/components/TipoServicoForm';
import { ContratoForm } from '@/components/ContratoForm';
import { ImportClientes } from '@/components/ImportClientes';
import { ContratoPDF } from '@/components/ContratoPDF';
import { useClientes, useAddCliente, useDeleteCliente, useImportClientes } from '@/hooks/useClientes';
import { useTiposServico, useAddTipoServico, useDeleteTipoServico } from '@/hooks/useTiposServico';
import { useContratos, useAddContrato, useDeleteContrato } from '@/hooks/useContratos';

const Index = () => {
  const { data: clientes = [], isLoading: clientesLoading } = useClientes();
  const { data: tiposServico = [], isLoading: tiposLoading } = useTiposServico();
  const { data: contratos = [], isLoading: contratosLoading } = useContratos();

  const addClienteMutation = useAddCliente();
  const deleteClienteMutation = useDeleteCliente();
  const importClientesMutation = useImportClientes();

  const addTipoServicoMutation = useAddTipoServico();
  const deleteTipoServicoMutation = useDeleteTipoServico();

  const addContratoMutation = useAddContrato();
  const deleteContratoMutation = useDeleteContrato();

  const handleAddCliente = (clienteData: any) => {
    console.log('Adicionando cliente:', clienteData);
    addClienteMutation.mutate(clienteData);
  };

  const handleImportClientes = (clientesImportados: any[]) => {
    console.log('Importando clientes via Supabase:', clientesImportados);
    importClientesMutation.mutate(clientesImportados);
  };

  const handleDeleteCliente = (id: string) => {
    console.log('Deletando cliente:', id);
    deleteClienteMutation.mutate(id);
  };

  const handleAddTipoServico = (tipoServicoData: any) => {
    addTipoServicoMutation.mutate(tipoServicoData);
  };

  const handleDeleteTipoServico = (id: string) => {
    deleteTipoServicoMutation.mutate(id);
  };

  const handleAddContrato = (contratoData: any) => {
    addContratoMutation.mutate(contratoData);
  };

  const handleDeleteContrato = (id: string) => {
    deleteContratoMutation.mutate(id);
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
              <ClienteForm onSubmit={handleAddCliente} />
              <ImportClientes onImport={handleImportClientes} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Clientes Cadastrados ({clientes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {clientesLoading ? (
                  <p className="text-center py-8">Carregando clientes...</p>
                ) : (
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
                            {cliente.endereco && (
                              <p className="text-sm text-muted-foreground">Endereço: {cliente.endereco}</p>
                            )}
                            {cliente.representanteNome && (
                              <p className="text-sm text-muted-foreground">Representante: {cliente.representanteNome}</p>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCliente(cliente.id)}
                            disabled={deleteClienteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servicos" className="space-y-6">
            <TipoServicoForm onSubmit={handleAddTipoServico} />

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Serviço Cadastrados ({tiposServico.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {tiposLoading ? (
                  <p className="text-center py-8">Carregando tipos de serviço...</p>
                ) : (
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
                            onClick={() => handleDeleteTipoServico(tipo.id)}
                            disabled={deleteTipoServicoMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
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
                tiposServico={tiposServico}
                onSubmit={handleAddContrato}
              />
            )}
          </TabsContent>

          <TabsContent value="gerados" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contratos Gerados ({contratos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {contratosLoading ? (
                  <p className="text-center py-8">Carregando contratos...</p>
                ) : (
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
                                onClick={() => handleDeleteContrato(contrato.id)}
                                disabled={deleteContratoMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
