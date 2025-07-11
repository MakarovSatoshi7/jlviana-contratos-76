
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Eye, EyeOff } from 'lucide-react';
import { useClientes } from '@/hooks/useClientes';
import { useTiposServico } from '@/hooks/useTiposServico';
import { useContratos, useDeleteContrato } from '@/hooks/useContratos';
import { ContratoPDF } from '@/components/ContratoPDF';
import { ContractPreview } from '@/components/ContractPreview';
import { toast } from 'sonner';
import { useState } from 'react';

export function ContratosGerados() {
  const { data: contratos = [] } = useContratos();
  const { data: clientes = [] } = useClientes();
  const { data: tiposServico = [] } = useTiposServico();
  const deleteContratoMutation = useDeleteContrato();
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(new Set());

  const handleDeleteContrato = (id: string) => {
    deleteContratoMutation.mutate(id);
    toast.success('Contrato removido com sucesso!');
  };

  const toggleContractView = (contractId: string) => {
    const newExpanded = new Set(expandedContracts);
    if (newExpanded.has(contractId)) {
      newExpanded.delete(contractId);
    } else {
      newExpanded.add(contractId);
    }
    setExpandedContracts(newExpanded);
  };

  console.log('ContratosGerados - contratos:', contratos);
  console.log('ContratosGerados - clientes:', clientes);
  console.log('ContratosGerados - tiposServico:', tiposServico);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-light text-2xl">Contratos Gerados</h1>
        <p className="text-muted-foreground">Visualize e gerencie os contratos criados</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-light text-xl">
            <FileText className="h-5 w-5" />
            Contratos Gerados ({contratos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {contratos.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum contrato gerado ainda.
              </p>
            ) : (
              contratos.map(contrato => {
                const cliente = clientes.find(c => c.id === contrato.clienteId);
                const tipoServico = tiposServico.find(t => t.id === contrato.tipoServicoId);
                const isExpanded = expandedContracts.has(contrato.id);

                console.log('Rendering contract:', { contrato, cliente, tipoServico });

                return (
                  <div key={contrato.id} className="border rounded-lg overflow-hidden">
                    {/* Contract Header */}
                    <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
                      <div className="flex-1">
                        <h3 className="text-lg font-light">{cliente?.razaoSocial || 'Cliente não encontrado'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm text-muted-foreground">
                          <p>
                            <span className="font-medium">Serviço:</span> {tipoServico?.nome || 'Serviço não encontrado'}
                          </p>
                          <p>
                            <span className="font-medium">Valor:</span> R$ {contrato.valorMensalidade.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p>
                            <span className="font-medium">Criado em:</span> {new Date(contrato.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleContractView(contrato.id)}
                        >
                          {isExpanded ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Ocultar
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </>
                          )}
                        </Button>
                        {cliente && (
                          <ContratoPDF contrato={contrato} cliente={cliente} tipoServico={tipoServico} />
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteContrato(contrato.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Contract Content */}
                    {isExpanded && cliente && (
                      <div className="p-6 bg-white">
                        <div className="max-w-4xl mx-auto">
                          <ContractPreview formData={contrato} cliente={cliente} tipoServico={tipoServico} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
