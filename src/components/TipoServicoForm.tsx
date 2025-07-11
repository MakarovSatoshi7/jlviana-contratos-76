
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TipoServico } from '@/types/contract';

const tipoServicoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  servicosOrdinarios: z.string(),
  servicosExtraordinarios: z.string(),
  servicosComplementares: z.string(),
  valorBase: z.number().min(0, 'Valor deve ser positivo'),
});

type TipoServicoFormData = z.infer<typeof tipoServicoSchema>;

interface TipoServicoFormProps {
  onSubmit: (tipoServico: Omit<TipoServico, 'id' | 'createdAt'>) => void;
  initialData?: Partial<TipoServico>;
}

const servicosPredefinidos = [
  'Contabilidade Completa',
  'Contabilidade Simplificada',
  'Contabilidade Fiscal',
  'Contabilidade Trabalhista e Previdenciária',
  'Apuração de Tributos',
  'Escrituração Fiscal Digital',
  'SPED Contábil',
  'SPED Fiscal',
  'ECF – Escrituração Contábil Fiscal',
  'ECD – Escrituração Contábil Digital',
  'Planejamento Tributário',
  'Consultoria Fiscal e Tributária',
  'Gestão de Folha de Pagamento',
  'Admissão e Demissão',
  'eSocial',
  'Emissão de Guias de Tributos',
  'Assessoria Trabalhista',
  'BPO Financeiro',
  'Gestão de Contas a Pagar e Receber',
  'Emissão de Boletos',
  'Conciliação Bancária',
  'Emissão de Nota Fiscal',
  'Gestão de Fluxo'
];

export function TipoServicoForm({ onSubmit, initialData }: TipoServicoFormProps) {
  const form = useForm<TipoServicoFormData>({
    resolver: zodResolver(tipoServicoSchema),
    defaultValues: {
      nome: initialData?.nome || '',
      descricao: initialData?.descricao || '',
      servicosOrdinarios: initialData?.servicosOrdinarios?.join('\n') || '',
      servicosExtraordinarios: initialData?.servicosExtraordinarios?.join('\n') || '',
      servicosComplementares: initialData?.servicosComplementares?.join('\n') || '',
      valorBase: initialData?.valorBase || 0,
    },
  });

  const handleSubmit = (data: TipoServicoFormData) => {
    const tipoServico = {
      ...data,
      servicosOrdinarios: data.servicosOrdinarios.split('\n').filter(s => s.trim()),
      servicosExtraordinarios: data.servicosExtraordinarios.split('\n').filter(s => s.trim()),
      servicosComplementares: data.servicosComplementares.split('\n').filter(s => s.trim()),
    };
    onSubmit(tipoServico);
    form.reset();
  };

  const handleSelectServico = (servicoSelecionado: string) => {
    form.setValue('nome', servicoSelecionado);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro de Tipo de Serviço</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="servicoPredefinido">Selecionar Serviço (opcional)</Label>
              <Select onValueChange={handleSelectServico}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Escolha um serviço predefinido" />
                </SelectTrigger>
                <SelectContent>
                  {servicosPredefinidos.map((servico) => (
                    <SelectItem key={servico} value={servico}>
                      {servico}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nome">Nome do Serviço *</Label>
              <Input
                id="nome"
                {...form.register('nome')}
                className="mt-1"
                placeholder="Digite ou selecione um serviço"
              />
              {form.formState.errors.nome && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              {...form.register('descricao')}
              className="mt-1"
              placeholder="Descreva os detalhes do serviço"
            />
            {form.formState.errors.descricao && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.descricao.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="valorBase">Valor Base (R$) *</Label>
            <Input
              id="valorBase"
              type="number"
              step="0.01"
              {...form.register('valorBase', { valueAsNumber: true })}
              className="mt-1"
              placeholder="0,00"
            />
            {form.formState.errors.valorBase && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.valorBase.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="servicosOrdinarios">Serviços Ordinários (um por linha)</Label>
            <Textarea
              id="servicosOrdinarios"
              {...form.register('servicosOrdinarios')}
              placeholder="Digite cada serviço em uma linha"
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="servicosExtraordinarios">Serviços Extraordinários (um por linha)</Label>
            <Textarea
              id="servicosExtraordinarios"
              {...form.register('servicosExtraordinarios')}
              placeholder="Digite cada serviço em uma linha"
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="servicosComplementares">Serviços Complementares (um por linha)</Label>
            <Textarea
              id="servicosComplementares"
              {...form.register('servicosComplementares')}
              placeholder="Digite cada serviço em uma linha"
              className="mt-1"
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            Cadastrar Tipo de Serviço
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
