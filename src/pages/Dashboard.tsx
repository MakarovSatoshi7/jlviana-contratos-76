
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientes } from "@/hooks/useClientes";
import { useTiposServico } from "@/hooks/useTiposServico";
import { useContratos } from "@/hooks/useContratos";
import { Users, Settings, FileText, TrendingUp, Building2, Briefcase } from "lucide-react";

export function Dashboard() {
  const { data: clientes = [] } = useClientes();
  const { data: tiposServico = [] } = useTiposServico();
  const { data: contratos = [] } = useContratos();

  const totalFaturamento = contratos.reduce((sum, c) => sum + c.valorMensalidade, 0);

  const stats = [
    {
      title: "Clientes",
      value: clientes.length,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800/50"
    },
    {
      title: "Tipos de Serviço",
      value: tiposServico.length,
      icon: Briefcase,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      borderColor: "border-emerald-200 dark:border-emerald-800/50"
    },
    {
      title: "Contratos Gerados",
      value: contratos.length,
      icon: FileText,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800/50"
    },
    {
      title: "Faturamento Mensal",
      value: `R$ ${totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-800/50"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-display tracking-tight font-light">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Visão geral do sistema de gestão contábil
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className={`shadow-sm border-border/50 ${stat.bgColor} ${stat.borderColor} transition-all duration-200 hover:shadow-md`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light font-display tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-light">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-4 w-4" />
              </div>
              Últimos Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientes.slice(-5).map((cliente, index) => (
                <div
                  key={cliente.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">{cliente.razaoSocial}</p>
                    <p className="text-xs text-muted-foreground font-mono">{cliente.cnpj}</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {index + 1}
                  </div>
                </div>
              ))}
              {clientes.length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Nenhum cliente cadastrado ainda.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-light">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              Últimos Contratos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contratos.slice(-5).map((contrato, index) => {
                const cliente = clientes.find(c => c.id === contrato.clienteId);
                return (
                  <div
                    key={contrato.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{cliente?.razaoSocial || 'Cliente não encontrado'}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        R$ {contrato.valorMensalidade.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      {index + 1}
                    </div>
                  </div>
                );
              })}
              {contratos.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Nenhum contrato gerado ainda.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
