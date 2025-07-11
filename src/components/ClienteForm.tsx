
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cliente } from '@/types/contract';

const clienteSchema = z.object({
  razaoSocial: z.string().min(1, 'Razão Social é obrigatória'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos'),
  endereco: z.string().optional(),
  representanteNome: z.string().optional(),
  representanteNacionalidade: z.string().optional(),
  representanteEstadoCivil: z.string().optional(),
  representanteProfissao: z.string().optional(),
  representanteCpf: z.string().optional(),
  representanteRg: z.string().optional(),
  representanteOrgaoEmissor: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  onSubmit: (cliente: Omit<Cliente, 'id' | 'createdAt'>) => void;
  initialData?: Partial<Cliente>;
}

export function ClienteForm({ onSubmit, initialData }: ClienteFormProps) {
  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: ClienteFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro de Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="razaoSocial">Razão Social *</Label>
              <Input
                id="razaoSocial"
                {...form.register('razaoSocial')}
                className="mt-1"
              />
              {form.formState.errors.razaoSocial && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.razaoSocial.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                {...form.register('cnpj')}
                placeholder="00.000.000/0001-00"
                className="mt-1"
              />
              {form.formState.errors.cnpj && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.cnpj.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                {...form.register('endereco')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="representanteNome">Nome do Representante</Label>
              <Input
                id="representanteNome"
                {...form.register('representanteNome')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="representanteNacionalidade">Nacionalidade</Label>
              <Input
                id="representanteNacionalidade"
                {...form.register('representanteNacionalidade')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="representanteEstadoCivil">Estado Civil</Label>
              <Input
                id="representanteEstadoCivil"
                {...form.register('representanteEstadoCivil')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="representanteProfissao">Profissão</Label>
              <Input
                id="representanteProfissao"
                {...form.register('representanteProfissao')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="representanteCpf">CPF</Label>
              <Input
                id="representanteCpf"
                {...form.register('representanteCpf')}
                placeholder="000.000.000-00"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="representanteRg">RG</Label>
              <Input
                id="representanteRg"
                {...form.register('representanteRg')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="representanteOrgaoEmissor">Órgão Emissor</Label>
              <Input
                id="representanteOrgaoEmissor"
                {...form.register('representanteOrgaoEmissor')}
                className="mt-1"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Cadastrar Cliente
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
