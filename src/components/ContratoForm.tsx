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
const TIPOS_SERVICOS_PADROES = ["Contabilidade Completa", "Contabilidade Simplificada", "Contabilidade Consultiva", "BPO Financeiro", "Abertura de Empresa", "Alteração Contratual", "Regularização de Empresa", "Baixa de Empresa", "Assessoria Contábil", "Assessoria Fiscal", "Assessoria Trabalhista", "Planejamento Tributário", "Recuperação de Créditos Tributários", "Gestão da Folha de Pagamento", "Pró-labore", "Gestão do eSocial", "Escrituração Contábil e Fiscal (ECD/ECF)", "Declaração de Imposto de Renda (Pessoa Física e Jurídica)", "Apuração de Impostos", "Enquadramento Tributário (Simples Nacional, Lucro Presumido, Lucro Real)", "Migração de MEI para ME", "Auditoria Contábil", "Perícia Contábil", "Avaliação de Empresas (Valuation)", "Consultoria Financeira", "Emissão de Certificado Digital", "Emissão de Guias de Impostos", "Entrega de Obrigações Acessórias (DCTF, EFD, etc.)"];
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
  return <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between font-light">
            Dados do Cliente (Contratante)
            {hasClienteChanges && <Button type="button" onClick={handleSaveClienteChanges} size="sm" variant="outline">
                Salvar Alterações do Cliente
              </Button>}
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
                {clientes.map(cliente => <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.razaoSocial}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {selectedCliente && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label>Razão Social</Label>
                <div className="text-sm text-muted-foreground">{selectedCliente.razaoSocial}</div>
              </div>
              
              <div>
                <Label htmlFor="cnpj-edit">CNPJ</Label>
                <Input id="cnpj-edit" value={clienteEditData.cnpj || ''} onChange={e => handleClienteChange('cnpj', e.target.value)} className="mt-1" />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="endereco-edit">Endereço</Label>
                <Input id="endereco-edit" value={clienteEditData.endereco || ''} onChange={e => handleClienteChange('endereco', e.target.value)} className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="representante-nome-edit">Representante Legal</Label>
                <Input id="representante-nome-edit" value={clienteEditData.representanteNome || ''} onChange={e => handleClienteChange('representanteNome', e.target.value)} className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="representante-nacionalidade-edit">Nacionalidade</Label>
                <Input id="representante-nacionalidade-edit" value={clienteEditData.representanteNacionalidade || ''} onChange={e => handleClienteChange('representanteNacionalidade', e.target.value)} className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="representante-estado-civil-edit">Estado Civil</Label>
                <Input id="representante-estado-civil-edit" value={clienteEditData.representanteEstadoCivil || ''} onChange={e => handleClienteChange('representanteEstadoCivil', e.target.value)} className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="representante-profissao-edit">Profissão</Label>
                <Input id="representante-profissao-edit" value={clienteEditData.representanteProfissao || ''} onChange={e => handleClienteChange('representanteProfissao', e.target.value)} className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="representante-cpf-edit">CPF</Label>
                <Input id="representante-cpf-edit" value={clienteEditData.representanteCpf || ''} onChange={e => handleClienteChange('representanteCpf', e.target.value)} className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="representante-rg-edit">RG</Label>
                <Input id="representante-rg-edit" value={clienteEditData.representanteRg || ''} onChange={e => handleClienteChange('representanteRg', e.target.value)} className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="representante-orgao-emissor-edit">Órgão Emissor</Label>
                <Input id="representante-orgao-emissor-edit" value={clienteEditData.representanteOrgaoEmissor || ''} onChange={e => handleClienteChange('representanteOrgaoEmissor', e.target.value)} className="mt-1" />
              </div>
            </div>}

          {formData.clienteId && !selectedCliente?.representanteNome && <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ O cliente selecionado não possui todas as informações de representante legal necessárias para gerar o contrato. 
                Por favor, complete as informações acima e clique em "Salvar Alterações do Cliente".
              </p>
            </div>}
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
                <Input value={customTipoServico} onChange={handleCustomTipoServicoChange} placeholder="Digite o tipo de serviço" />
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  setIsCustomType(false);
                  setCustomTipoServico('');
                  updateFormData({
                    tipoServicoId: ''
                  });
                }}>
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

      {/* Parâmetros do Contrato */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Parâmetros do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantidadeEstabelecimentos">
                Quantidade de Estabelecimentos
              </Label>
              <Input type="number" id="quantidadeEstabelecimentos" name="quantidadeEstabelecimentos" value={formData.quantidadeEstabelecimentos} onChange={handleNumberChange} />
            </div>

            <div>
              <Label htmlFor="quantidadeContasBancarias">
                Quantidade de Contas Bancárias
              </Label>
              <Input type="number" id="quantidadeContasBancarias" name="quantidadeContasBancarias" value={formData.quantidadeContasBancarias} onChange={handleNumberChange} />
            </div>
          </div>

          <div>
            <Label htmlFor="volumeLancamentosContabeis">
              Volume de Lançamentos Contábeis
            </Label>
            <Input type="text" id="volumeLancamentosContabeis" name="volumeLancamentosContabeis" value={formData.volumeLancamentosContabeis} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numeroNotasServicos">Número de Notas de Serviços</Label>
              <Input type="text" id="numeroNotasServicos" name="numeroNotasServicos" value={formData.numeroNotasServicos} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="numeroNotasEntradaSaida">
                Número de Notas de Entrada/Saída
              </Label>
              <Input type="text" id="numeroNotasEntradaSaida" name="numeroNotasEntradaSaida" value={formData.numeroNotasEntradaSaida} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantidadeEmpregadosClt">
                Quantidade de Empregados CLT
              </Label>
              <Input type="number" id="quantidadeEmpregadosClt" name="quantidadeEmpregadosClt" value={formData.quantidadeEmpregadosClt} onChange={handleNumberChange} />
            </div>

            <div>
              <Label htmlFor="quantidadeSocios">Quantidade de Sócios</Label>
              <Input type="number" id="quantidadeSocios" name="quantidadeSocios" value={formData.quantidadeSocios} onChange={handleNumberChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados Financeiros */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Dados Financeiros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="valorMensalidade">Valor Mensalidade</Label>
            <Input type="number" id="valorMensalidade" name="valorMensalidade" value={formData.valorMensalidade} onChange={handleNumberChange} />
          </div>

          <div>
            <Label htmlFor="diaVencimento">Dia de Vencimento</Label>
            <Select onValueChange={value => handleSelectChange('diaVencimento', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({
                length: 28
              }, (_, i) => i + 1).map(day => <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="valor13aMensalidade">Valor 13ª Mensalidade</Label>
            <Select onValueChange={value => handleSelectChange('valor13aMensalidade', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o valor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Integral">Integral</SelectItem>
                <SelectItem value="Proporcional">Proporcional</SelectItem>
                <SelectItem value="Não Cobra">Não Cobra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="percentualReajusteAnual">
              Percentual de Reajuste Anual
            </Label>
            <Input type="number" id="percentualReajusteAnual" name="percentualReajusteAnual" value={formData.percentualReajusteAnual} onChange={handleNumberChange} />
          </div>

          <div>
            <Label htmlFor="cobraAlteracaoContrato">Cobra Alteração Contrato</Label>
            <Select onValueChange={value => handleSelectChange('cobraAlteracaoContrato', value)}>
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
            <Label htmlFor="cobraIrpfSocios">Cobra IRPF dos Sócios</Label>
            <Select onValueChange={value => handleSelectChange('cobraIrpfSocios', value)}>
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
            <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
            <Select onValueChange={value => handleSelectChange('formaPagamento', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a forma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Boleto Bancário">Boleto Bancário</SelectItem>
                <SelectItem value="Transferência Bancária">
                  Transferência Bancária
                </SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dados Contratuais */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Dados Contratuais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dataInicioContrato">Data de Início do Contrato</Label>
            <Input type="date" id="dataInicioContrato" name="dataInicioContrato" value={new Date(formData.dataInicioContrato).toISOString().split('T')[0]} onChange={handleDateChange} />
          </div>

          <div>
            <Label htmlFor="prazoVigencia">Prazo de Vigência (meses)</Label>
            <Input type="number" id="prazoVigencia" name="prazoVigencia" value={formData.prazoVigencia} onChange={handleNumberChange} />
          </div>

          <div>
            <Label htmlFor="preAvisoRescisao">Pré-Aviso de Rescisão (dias)</Label>
            <Input type="number" id="preAvisoRescisao" name="preAvisoRescisao" value={formData.preAvisoRescisao} onChange={handleNumberChange} />
          </div>

          <div>
            <Label htmlFor="multaRescisioriaPercentual">
              Multa Rescisória (percentual)
            </Label>
            <Input type="number" id="multaRescisioriaPercentual" name="multaRescisioriaPercentual" value={formData.multaRescisioriaPercentual} onChange={handleNumberChange} />
          </div>
        </CardContent>
      </Card>

      {/* Dados Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Dados Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dpoNome">Nome do DPO</Label>
            <Input type="text" id="dpoNome" name="dpoNome" value={formData.dpoNome} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="dpoEmail">Email do DPO</Label>
            <Input type="email" id="dpoEmail" name="dpoEmail" value={formData.dpoEmail} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testemunha1Nome">Testemunha 1 - Nome</Label>
              <Input type="text" id="testemunha1Nome" name="testemunha1Nome" value={formData.testemunha1Nome} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="testemunha1Rg">Testemunha 1 - RG</Label>
              <Input type="text" id="testemunha1Rg" name="testemunha1Rg" value={formData.testemunha1Rg} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testemunha2Nome">Testemunha 2 - Nome</Label>
              <Input type="text" id="testemunha2Nome" name="testemunha2Nome" value={formData.testemunha2Nome} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="testemunha2Rg">Testemunha 2 - RG</Label>
              <Input type="text" id="testemunha2Rg" name="testemunha2Rg" value={formData.testemunha2Rg} onChange={handleChange} />
            </div>
          </div>

          <div>
            <Label htmlFor="anoBase">Ano Base</Label>
            <Input type="text" id="anoBase" name="anoBase" value={formData.anoBase} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="sistemaGestao">Sistema de Gestão</Label>
            <Input type="text" id="sistemaGestao" name="sistemaGestao" value={formData.sistemaGestao} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>

      {/* Dados da Contratada */}
      <Card>
        <CardHeader>
          <CardTitle className="font-light">Dados da Contratada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contratadaRepresentanteNome">
              Contratada - Representante Nome
            </Label>
            <Input type="text" id="contratadaRepresentanteNome" name="contratadaRepresentanteNome" value={formData.contratadaRepresentanteNome} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="contratadaRepresentanteNacionalidade">
              Contratada - Representante Nacionalidade
            </Label>
            <Input type="text" id="contratadaRepresentanteNacionalidade" name="contratadaRepresentanteNacionalidade" value={formData.contratadaRepresentanteNacionalidade} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="contratadaRepresentanteEstadoCivil">
              Contratada - Representante Estado Civil
            </Label>
            <Input type="text" id="contratadaRepresentanteEstadoCivil" name="contratadaRepresentanteEstadoCivil" value={formData.contratadaRepresentanteEstadoCivil} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="contratadaRepresentanteProfissao">
              Contratada - Representante Profissão
            </Label>
            <Input type="text" id="contratadaRepresentanteProfissao" name="contratadaRepresentanteProfissao" value={formData.contratadaRepresentanteProfissao} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="contratadaRepresentanteCrc">
              Contratada - Representante CRC
            </Label>
            <Input type="text" id="contratadaRepresentanteCrc" name="contratadaRepresentanteCrc" value={formData.contratadaRepresentanteCrc} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="contratadaRepresentanteCpf">
              Contratada - Representante CPF
            </Label>
            <Input type="text" id="contratadaRepresentanteCpf" name="contratadaRepresentanteCpf" value={formData.contratadaRepresentanteCpf} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>

      {showSaveButton && <Button type="submit" className="w-full">Salvar Contrato</Button>}
    </form>;
}