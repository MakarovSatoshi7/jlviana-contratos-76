import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Users } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ImportClientes } from '@/components/ImportClientes';
import { toast } from 'sonner';
export function Clientes() {
  const {
    clientes,
    importClientes,
    deleteCliente
  } = useStore();
  const handleImportClientes = (clientesImportados: any[]) => {
    importClientes(clientesImportados);
    toast.success(`${clientesImportados.length} clientes importados com sucesso!`);
  };
  const handleDeleteCliente = (id: string) => {
    deleteCliente(id);
    toast.success('Cliente removido com sucesso!');
  };
  return <div className="space-y-6">
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
            {clientes.length === 0 ? <p className="text-muted-foreground text-center py-8">
                Nenhum cliente cadastrado ainda. Use a importação acima para adicionar clientes.
              </p> : clientes.map(cliente => <div key={cliente.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-light">{cliente.razaoSocial}</h3>
                    <p className="text-sm text-muted-foreground">CNPJ: {cliente.cnpj}</p>
                    {cliente.endereco && <p className="text-sm text-muted-foreground">Endereço: {cliente.endereco}</p>}
                    {cliente.representanteNome && <p className="text-sm text-muted-foreground">Representante: {cliente.representanteNome}</p>}
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCliente(cliente.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
}