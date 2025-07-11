
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Settings } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TipoServicoForm } from '@/components/TipoServicoForm';
import { toast } from 'sonner';

export function Servicos() {
  const { tiposServico, addTipoServico, deleteTipoServico } = useStore();

  const handleAddTipoServico = (tipoServicoData: any) => {
    addTipoServico(tipoServicoData);
    toast.success('Tipo de serviço cadastrado com sucesso!');
  };

  const handleDeleteTipoServico = (id: string) => {
    deleteTipoServico(id);
    toast.success('Tipo de serviço removido com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tipos de Serviço</h1>
        <p className="text-muted-foreground">Gerencie os serviços oferecidos</p>
      </div>

      <TipoServicoForm onSubmit={handleAddTipoServico} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Tipos de Serviço Cadastrados ({tiposServico.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tiposServico.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum tipo de serviço cadastrado ainda.
              </p>
            ) : (
              tiposServico.map((tipo) => (
                <div key={tipo.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-semibold">{tipo.nome}</h3>
                    <p className="text-sm text-muted-foreground">{tipo.descricao}</p>
                    <p className="text-sm font-medium">Valor Base: R$ {tipo.valorBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTipoServico(tipo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
