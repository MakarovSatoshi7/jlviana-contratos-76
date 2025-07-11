
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileEdit, ZoomIn, ZoomOut, Eye, Settings } from 'lucide-react';
import { useClientes } from '@/hooks/useClientes';
import { useAddContrato } from '@/hooks/useContratos';
import { ContratoForm } from '@/components/ContratoForm';
import { ContractPreview } from '@/components/ContractPreview';
import { ContratoPDF } from '@/components/ContratoPDF';
import { Contrato } from '@/types/contract';
import { toast } from 'sonner';

export function ContractEditor() {
  const { data: clientes = [] } = useClientes();
  const addContratoMutation = useAddContrato();
  const [formData, setFormData] = useState<Partial<Contrato>>({});
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  console.log('ContractEditor - clientes:', clientes);

  const selectedCliente = clientes.find(c => c.id === formData.clienteId);

  const handleFormChange = (data: Partial<Contrato>) => {
    console.log('Form data changed:', data);
    setFormData(data);
  };

  const handleSaveContract = (contratoData: Omit<Contrato, 'id' | 'createdAt'>) => {
    console.log('Saving contract:', contratoData);
    addContratoMutation.mutate(contratoData);
    toast.success('Contrato salvo com sucesso!');

    // Reset form data
    setFormData({});
  };

  const canGeneratePDF = selectedCliente && formData.valorMensalidade;

  if (clientes.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-light text-2xl">Editor de Contratos</h1>
          <p className="text-muted-foreground">Crie contratos com preview em tempo real</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Para usar o editor de contratos, você precisa ter pelo menos:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• 1 cliente cadastrado</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light">Editor de Contratos</h1>
          <p className="text-muted-foreground">Crie contratos com preview em tempo real</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === 'form' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('form')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Dados
            </Button>
            <Button
              variant={activeTab === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('preview')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
          
          {activeTab === 'preview' && (
            <div className="flex items-center gap-2 border rounded-lg px-3 py-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {canGeneratePDF && (
            <ContratoPDF contrato={formData as Contrato} cliente={selectedCliente} />
          )}
        </div>
      </div>

      <div className="min-h-[calc(100vh-200px)]">
        {activeTab === 'form' && (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-light">
                <FileEdit className="h-5 w-5" />
                Dados do Contrato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                <ContratoForm
                  clientes={clientes}
                  onSubmit={handleSaveContract}
                  onChange={handleFormChange}
                  showSaveButton={true}
                  key={Object.keys(formData).length === 0 ? 'reset' : 'editing'}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {activeTab === 'preview' && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview do Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-center">
                <ScrollArea className="h-[calc(100vh-300px)] w-full">
                  <div
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: 'top center',
                      minHeight: '100%',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <ContractPreview formData={formData} cliente={selectedCliente} />
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
