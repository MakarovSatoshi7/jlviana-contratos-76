import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Cliente, TipoServico, Contrato } from '@/types/contract';
import { useUpdateCliente } from '@/hooks/useClientes';
import { toast } from 'sonner';

interface ContratoFormProps {
  clientes: Cliente[];
  tiposServico: TipoServico[];
  onSubmit: (contrato: Omit<Contrato, 'id' | 'createdAt'>) => void;
  onChange?: (data: Partial<Contrato>) => void;
  showSaveButton?: boolean;
}

const initialFormData: Omit<Contrato, 'id' | 'createdAt'> = {
  clienteId: '',
  tipoServicoId: '',
  regimeTributario: '',
  quantidadeEstabelecimentos: 1,
  quantidadeContasBancarias: 1,
  volumeLancamentosContabeis: '',
  numeroNotasServicos: '',
  numeroNotasEntradaSaida: '',
  quantidadeEmpregadosClt: 0,
  quantidadeSocios: 1,
  valorMensalidade: 0,
  diaVencimento: 5,
  valor13aMensalidade: 'Integral',
  percentualReajusteAnual: 5,
  cobraAlteracaoContrato: 'Sim',
  cobraIrpfSocios: 'Não',
  formaPagamento: 'Boleto Bancário',
  dataInicioContrato: new Date(),
  prazoVigencia: 12,
  preAvisoRescisao: 30,
  multaRescisioriaPercentual: 10,
  dpoNome: '',
  dpoEmail: '',
  testemunha1Nome: '',
  testemunha1Rg: '',
  testemunha2Nome: '',
  testemunha2Rg: '',
  anoBase: new Date().getFullYear().toString(),
  sistemaGestao: 'Nenhum',
  contratadaRepresentanteNome: 'Jefferson Lopes Viana',
  contratadaRepresentanteNacionalidade: 'Brasileiro',
  contratadaRepresentanteEstadoCivil: 'Casado',
  contratadaRepresentanteProfissao: 'Contador',
  contratadaRepresentanteCrc: '2SP023539/O-4',
  contratadaRepresentanteCpf: '123.456.789-00'
};

export function ContratoForm({
  clientes,
  tiposServico,
  onSubmit,
  onChange,
  showSaveButton = false
}: ContratoFormProps) {
  const updateClienteMutation = useUpdateCliente();
  const [formData, setFormData] = useState<Omit<Contrato, 'id' | 'createdAt'>>(initialFormData);
  const [customTipoServico, setCustomTipoServico] = useState('');
  const [isCustomType, setIsCustomType] = useState(false);
  const [clienteEditData, setClienteEditData] = useState<Partial<Cliente>>({});
  const [hasClienteChanges, setHasClienteChanges] = useState(false);
  console.log('ContratoForm - clientes received:', clientes);

  // Reset form when key changes (controlled by parent)
  useEffect(() => {
    console.log('ContratoForm mounted/reset');
  }, []);
  const updateFormData = (updates: Partial<Contrato>) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        ...updates
      };
      console.log('Form data updated:', newData);
      return newData;
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    updateFormData({
      [name]: value
    });
  };
  const handleSelectChange = (name: string, value: string) => {
    console.log(`Select changed - ${name}:`, value);
    if (name === 'tipoServicoId' && value === 'custom') {
      setIsCustomType(true);
      updateFormData({
        [name]: ''
      });
      return;
    }
    if (name === 'tipoServicoId') {
      setIsCustomType(false);
    }
    updateFormData({
      [name]: value
    });
  };
  const handleCustomTipoServicoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomTipoServico(value);
    updateFormData({
      tipoServicoId: value
    });
  };
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    const parsedValue = parseInt(value, 10);
    updateFormData({
      [name]: isNaN(parsedValue) ? 0 : parsedValue
    });
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    updateFormData({
      [name]: new Date(value)
    });
  };
  const handleClienteChange = (field: keyof Cliente, value: string) => {
    setClienteEditData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasClienteChanges(true);
  };
  const handleSaveClienteChanges = () => {
    if (!formData.clienteId || !hasClienteChanges) return;
    updateClienteMutation.mutate({
      id: formData.clienteId,
      ...clienteEditData
    });
    setHasClienteChanges(false);
    toast.success('Dados do cliente atualizados!');
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onSubmit(formData);

    // Reset form after submission
    setFormData(initialFormData);
    setCustomTipoServico('');
    setIsCustomType(false);
    setClienteEditData({});
    setHasClienteChanges(false);
  };
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
    // Log para depuração
    console.log('DEBUG tipoServicoId:', formData.tipoServicoId);
  }, [formData, onChange]);

  // Se tiposServico existir e tipoServicoId estiver vazio, setar valor inicial
  useEffect(() => {
    if (!isCustomType && tiposServico.length > 0 && !formData.tipoServicoId) {
      setFormData(prev => ({ ...prev, tipoServicoId: tiposServico[0].id }));
    }
  }, [tiposServico, isCustomType]);
  const selectedCliente = clientes.find(c => c.id === formData.clienteId);

  // Update cliente edit data when client selection changes
  useEffect(() => {
    if (selectedCliente) {
      setClienteEditData({
        cnpj: selectedCliente.cnpj,
        endereco: selectedCliente.endereco || '',
        representanteNome: selectedCliente.representanteNome || '',
        representanteNacionalidade: selectedCliente.representanteNacionalidade || '',
        representanteEstadoCivil: selectedCliente.representanteEstadoCivil || '',
        representanteProfissao: selectedCliente.representanteProfissao || '',
        representanteCpf: selectedCliente.representanteCpf || '',
        representanteRg: selectedCliente.representanteRg || '',
        representanteOrgaoEmissor: selectedCliente.representanteOrgaoEmissor || ''
      });
      setHasClienteChanges(false);
    }
  }, [selectedCliente]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between font-light">
            Dados do Cliente (Contratante)
            {hasClienteChanges && (
              <Button
                type="button"
                onClick={handleSaveClienteChanges}
                size="sm"
                variant="outline"
              >
                Salvar Alterações do Cliente
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clienteId">Cliente</Label>
            <Select value={formData.clienteId} onValueChange={value => handleSelectChange('clienteId', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map(cliente => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.razaoSocial}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCliente && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label>Razão Social</Label>
                <div className="text-sm text-muted-foreground">{selectedCliente.razaoSocial}</div>
              </div>
              
              <div>
                <Label htmlFor="cnpj-edit">CNPJ</Label>
                <Input
                  id="cnpj-edit"
                  value={clienteEditData.cnpj || ''}
                  onChange={e => handleClienteChange('cnpj', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="endereco-edit">Endereço</Label>
                <Input
                  id="endereco-edit"
                  value={clienteEditData.endereco || ''}
                  onChange={e => handleClienteChange('endereco', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="representante-nome-edit">Representante Legal</Label>
                <Input
                  id="representante-nome-edit"
                  value={clienteEditData.representanteNome || ''}
                  onChange={e => handleClienteChange('representanteNome', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="representante-cpf-edit">CPF</Label>
                <Input
                  id="representante-cpf-edit"
                  value={clienteEditData.representanteCpf || ''}
                  onChange={e => handleClienteChange('representanteCpf', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dados do Serviço */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Dados do Serviço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tipoServicoId">Tipo de Serviço</Label>
            {!isCustomType ? (
              <Select value={formData.tipoServicoId} onValueChange={value => handleSelectChange('tipoServicoId', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de serviço" />
                </SelectTrigger>
                <SelectContent>
                  {tiposServico.map(tipo => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">
                    Outro (digite o tipo de serviço)
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  value={customTipoServico}
                  onChange={handleCustomTipoServicoChange}
                  placeholder="Digite o tipo de serviço"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCustomType(false);
                    setCustomTipoServico('');
                    updateFormData({ tipoServicoId: '' });
                  }}
                >
                  Voltar para lista padrão
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="regimeTributario">Regime Tributário</Label>
            <Select value={formData.regimeTributario} onValueChange={value => handleSelectChange('regimeTributario', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o regime" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Simples Nacional">Simples Nacional</SelectItem>
                <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
                <SelectItem value="Lucro Real">Lucro Real</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Valores e Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Valores e Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="valorMensalidade">Valor Mensal</Label>
            <Input
              type="number"
              id="valorMensalidade"
              name="valorMensalidade"
              value={formData.valorMensalidade}
              onChange={handleNumberChange}
            />
          </div>

          <div>
            <Label htmlFor="diaVencimento">Dia de Pagamento</Label>
            <Select value={formData.diaVencimento?.toString()} onValueChange={value => handleSelectChange('diaVencimento', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="numeroProposta">Número da Proposta</Label>
            <Input
              type="text"
              id="numeroProposta"
              name="numeroProposta"
              value={formData.numeroProposta || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
            <Select value={formData.formaPagamento} onValueChange={value => handleSelectChange('formaPagamento', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a forma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Boleto Bancário">Boleto Bancário</SelectItem>
                <SelectItem value="Transferência Bancária">Transferência Bancária</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vigência e Dados Contratuais */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Vigência e Dados Contratuais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dataInicioContrato">Data de Início</Label>
            <Input
              type="date"
              id="dataInicioContrato"
              name="dataInicioContrato"
              value={new Date(formData.dataInicioContrato).toISOString().split('T')[0]}
              onChange={handleDateChange}
            />
          </div>

          <div>
            <Label htmlFor="prazoVigencia">Prazo de Vigência (meses)</Label>
            <Input
              type="number"
              id="prazoVigencia"
              name="prazoVigencia"
              value={formData.prazoVigencia}
              onChange={handleNumberChange}
            />
          </div>

          <div>
            <Label htmlFor="diasAviso">Dias de Aviso (Rescisão)</Label>
            <Input
              type="number"
              id="diasAviso"
              name="diasAviso"
              value={formData.preAvisoRescisao || 30}
              onChange={handleNumberChange}
            />
          </div>

          <div>
            <Label htmlFor="percentualMultaRescisao">Percentual Multa Rescisão (%)</Label>
            <Input
              type="number"
              id="percentualMultaRescisao"
              name="percentualMultaRescisao"
              value={formData.multaRescisioriaPercentual || 10}
              onChange={handleNumberChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Confidencialidade e LGPD */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Confidencialidade e LGPD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prazoConfidencialidade">Prazo Confidencialidade (anos)</Label>
            <Input
              type="number"
              id="prazoConfidencialidade"
              name="prazoConfidencialidade"
              value={formData.prazoConfidencialidade || 5}
              onChange={handleNumberChange}
            />
          </div>

          <div>
            <Label htmlFor="diasIncidente">Dias para Notificar Incidente</Label>
            <Input
              type="number"
              id="diasIncidente"
              name="diasIncidente"
              value={formData.diasIncidente || 72}
              onChange={handleNumberChange}
            />
          </div>

          <div>
            <Label htmlFor="dpoNome">Nome do DPO</Label>
            <Input
              type="text"
              id="dpoNome"
              name="dpoNome"
              value={formData.dpoNome}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="dpoEmail">Email do DPO</Label>
            <Input
              type="email"
              id="dpoEmail"
              name="dpoEmail"
              value={formData.dpoEmail}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dimensionamento - Obrigatório */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Dimensionamento - Obrigatório</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantidadeEmpregadosClt">Qtd Funcionários</Label>
              <Input
                type="number"
                id="quantidadeEmpregadosClt"
                name="quantidadeEmpregadosClt"
                value={formData.quantidadeEmpregadosClt}
                onChange={handleNumberChange}
              />
            </div>

            <div>
              <Label htmlFor="quantidadeSocios">Qtd Sócios</Label>
              <Input
                type="number"
                id="quantidadeSocios"
                name="quantidadeSocios"
                value={formData.quantidadeSocios}
                onChange={handleNumberChange}
              />
            </div>

            <div>
              <Label htmlFor="quantidadeContasBancarias">Qtd Contas Correntes</Label>
              <Input
                type="number"
                id="quantidadeContasBancarias"
                name="quantidadeContasBancarias"
                value={formData.quantidadeContasBancarias}
                onChange={handleNumberChange}
              />
            </div>

            <div>
              <Label htmlFor="quantidadeEstabelecimentos">Qtd Estabelecimentos</Label>
              <Input
                type="number"
                id="quantidadeEstabelecimentos"
                name="quantidadeEstabelecimentos"
                value={formData.quantidadeEstabelecimentos}
                onChange={handleNumberChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimensionamento - Fiscal */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Dimensionamento - Fiscal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="notasEmitidasMedias">Notas Emitidas Médias</Label>
              <Input
                type="text"
                id="notasEmitidasMedias"
                name="notasEmitidasMedias"
                value={formData.numeroNotasServicos || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="notasRecebidasMedias">Notas Recebidas Médias</Label>
              <Input
                type="text"
                id="notasRecebidasMedias"
                name="notasRecebidasMedias"
                value={formData.numeroNotasEntradaSaida || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="qtdCodigosServico">Qtd Códigos Serviço</Label>
              <Input
                type="text"
                id="qtdCodigosServico"
                name="qtdCodigosServico"
                value={formData.qtdCodigosServico || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="substTributaria">Subst Tributária</Label>
              <Select value={formData.substTributaria || ''} onValueChange={value => handleSelectChange('substTributaria', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="comercioInterestadual">Comércio Interestadual</Label>
              <Select value={formData.comercioInterestadual || ''} onValueChange={value => handleSelectChange('comercioInterestadual', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimensionamento - Contábil */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Dimensionamento - Contábil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="volumeLancamentosContabeis">Volume Lançamentos</Label>
            <Input
              type="text"
              id="volumeLancamentosContabeis"
              name="volumeLancamentosContabeis"
              value={formData.volumeLancamentosContabeis}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="frequenciaDemonstracoes">Frequência Demonstrações</Label>
            <Select value={formData.frequenciaDemonstracoes || ''} onValueChange={value => handleSelectChange('frequenciaDemonstracoes', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mensal">Mensal</SelectItem>
                <SelectItem value="Trimestral">Trimestral</SelectItem>
                <SelectItem value="Anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="necessidadeRelatorios">Necessidade Relatórios</Label>
            <Select value={formData.necessidadeRelatorios || ''} onValueChange={value => handleSelectChange('necessidadeRelatorios', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Básicos">Básicos</SelectItem>
                <SelectItem value="Intermediários">Intermediários</SelectItem>
                <SelectItem value="Avançados">Avançados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="controlesInternos">Controles Internos</Label>
            <Select value={formData.controlesInternos || ''} onValueChange={value => handleSelectChange('controlesInternos', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dimensionamento - Departamento Pessoal */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Dimensionamento - Departamento Pessoal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admissoesMes">Admissões/Mês</Label>
              <Input
                type="number"
                id="admissoesMes"
                name="admissoesMes"
                value={formData.admissoesMes || 0}
                onChange={handleNumberChange}
              />
            </div>

            <div>
              <Label htmlFor="rescisoesMes">Rescisões/Mês</Label>
              <Input
                type="number"
                id="rescisoesMes"
                name="rescisoesMes"
                value={formData.rescisoesMes || 0}
                onChange={handleNumberChange}
              />
            </div>

            <div>
              <Label htmlFor="qtdEstagiarios">Qtd Estagiários</Label>
              <Input
                type="number"
                id="qtdEstagiarios"
                name="qtdEstagiarios"
                value={formData.qtdEstagiarios || 0}
                onChange={handleNumberChange}
              />
            </div>

            <div>
              <Label htmlFor="inclusaoRPA">Inclusão RPA</Label>
              <Select value={formData.inclusaoRPA || ''} onValueChange={value => handleSelectChange('inclusaoRPA', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="feriasProgramadas">Férias Programadas</Label>
              <Select value={formData.feriasProgramadas || ''} onValueChange={value => handleSelectChange('feriasProgramadas', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outras Variáveis */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Outras Variáveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="qtdCNPJs">Qtd CNPJs</Label>
              <Input
                type="number"
                id="qtdCNPJs"
                name="qtdCNPJs"
                value={formData.qtdCNPJs || 1}
                onChange={handleNumberChange}
              />
            </div>

            <div>
              <Label htmlFor="localizacaoFiliais">Localização Filiais</Label>
              <Input
                type="text"
                id="localizacaoFiliais"
                name="localizacaoFiliais"
                value={formData.localizacaoFiliais || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="relatoriosPersonalizados">Relatórios Personalizados</Label>
              <Select value={formData.relatoriosPersonalizados || ''} onValueChange={value => handleSelectChange('relatoriosPersonalizados', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="freqReunioes">Freq Reuniões</Label>
              <Select value={formData.freqReunioes || ''} onValueChange={value => handleSelectChange('freqReunioes', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semanal">Semanal</SelectItem>
                  <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                  <SelectItem value="Mensal">Mensal</SelectItem>
                  <SelectItem value="Trimestral">Trimestral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="atendimentoPresencial">Atendimento Presencial</Label>
              <Select value={formData.atendimentoPresencial || ''} onValueChange={value => handleSelectChange('atendimentoPresencial', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="atendimentoEmergencial">Atendimento Emergencial</Label>
              <Select value={formData.atendimentoEmergencial || ''} onValueChange={value => handleSelectChange('atendimentoEmergencial', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auditoria */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Auditoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="diasAvisoAuditoria">Dias Aviso Auditoria</Label>
            <Input
              type="number"
              id="diasAvisoAuditoria"
              name="diasAvisoAuditoria"
              value={formData.diasAvisoAuditoria || 30}
              onChange={handleNumberChange}
            />
          </div>
        </CardContent>
      </Card>

      {showSaveButton && (
        <Button type="submit" className="w-full">
          Salvar Contrato
        </Button>
      )}
    </form>
  );
}
