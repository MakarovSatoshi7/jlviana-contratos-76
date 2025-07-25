
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileEdit, ZoomIn, ZoomOut, Settings, Image } from 'lucide-react';
import { useClientes } from '@/hooks/useClientes';
import { useAddContrato } from '@/hooks/useContratos';
import { useTiposServico } from '@/hooks/useTiposServico';
import { ContratoForm } from '@/components/ContratoForm';
import { ContractImagePreview } from '@/components/ContractImagePreview';
import { ContratoPDF } from '@/components/ContratoPDF';
import { Contrato } from '@/types/contract';
import { autoSeedTiposServicoPadrao } from '@/integrations/supabase/autoSeedTiposServico';

export function ContractEditor() {
  // Seed tipos de serviço padrão ao montar
  useEffect(() => {
    autoSeedTiposServicoPadrao();
  }, []);

  const { data: clientes = [] } = useClientes();
  const { data: tiposServico = [], isLoading: tiposLoading, error: tiposError } = useTiposServico();
  const addContratoMutation = useAddContrato();
  const [formData, setFormData] = useState<Partial<Contrato>>({});
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<'form' | 'modelo'>('form');

  console.log('ContractEditor - clientes:', clientes);

  const selectedCliente = clientes.find(c => c.id === formData.clienteId);

  const handleFormChange = (data: Partial<Contrato>) => {
    console.log('Form data changed:', data);
    setFormData(data);
  };

  const handleSaveContract = (contratoData: Omit<Contrato, 'id' | 'createdAt'>) => {
    console.log('Saving contract:', contratoData);
    // Se o campo tipoServicoId estiver vazio (customizado), envie null, senão envie o valor selecionado
    const tipoServicoId = contratoData.tipoServicoId === '' ? null : contratoData.tipoServicoId;
    const contratoDataFormatted = {
      ...contratoData,
      tipoServicoId: tipoServicoId,
    };
    console.log('Contrato formatado para salvar:', contratoDataFormatted);
    addContratoMutation.mutate(contratoDataFormatted, {
      onSuccess: () => {
        setFormData({});
      }
    });
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

  if (tiposLoading) {
    return <div>Carregando tipos de serviço...</div>;
  }
  if (tiposError) {
    return <div>Erro ao carregar tipos de serviço.</div>;
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
              variant={activeTab === 'modelo' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('modelo')}
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Modelo
            </Button>
          </div>
          
          {activeTab === 'modelo' && (
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
                  tiposServico={tiposServico}
                  onSubmit={handleSaveContract}
                  onChange={handleFormChange}
                  showSaveButton={true}
                  key={Object.keys(formData).length === 0 ? 'reset' : 'editing'}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {activeTab === 'modelo' && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Modelo do Contrato
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
                    <ContractImagePreview />
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
