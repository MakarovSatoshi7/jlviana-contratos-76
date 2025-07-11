
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Users } from 'lucide-react';
import { ImportClientes } from '@/components/ImportClientes';
import { useClientes, useDeleteCliente, useImportClientes } from '@/hooks/useClientes';

export function Clientes() {
  const { data: clientes = [], isLoading } = useClientes();
  const deleteClienteMutation = useDeleteCliente();
  const importClientesMutation = useImportClientes();

  const handleImportClientes = (clientesImportados: any[]) => {
    console.log('Importando clientes via Supabase:', clientesImportados);
    importClientesMutation.mutate(clientesImportados);
  };

  const handleDeleteCliente = (id: string) => {
    console.log('Deletando cliente via Supabase:', id);
    deleteClienteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-light">Clientes</h1>
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light">Clientes</h1>
        <p className="text-muted-foreground">Importe seus clientes via planilha</p>
      </div>

      <ImportClientes onImport={handleImportClientes} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-light">
            <Users className="h-5 w-5" />
            Clientes Cadastrados ({clientes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum cliente cadastrado ainda. Use a importação acima para adicionar clientes.
              </p>
            ) : (
              clientes.map(cliente => (
                <div key={cliente.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-light">{cliente.razaoSocial}</h3>
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
        </CardContent>
      </Card>
    </div>
  );
}
