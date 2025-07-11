
-- Criar tabelas principais do sistema de contratos

-- Tabela de clientes
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  endereco TEXT,
  representante_nome TEXT,
  representante_nacionalidade TEXT,
  representante_estado_civil TEXT,
  representante_profissao TEXT,
  representante_cpf TEXT,
  representante_rg TEXT,
  representante_orgao_emissor TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tipos de serviço
CREATE TABLE public.tipos_servico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  servicos_ordinarios TEXT[],
  servicos_extraordinarios TEXT[],
  servicos_complementares TEXT[],
  valor_base DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contratos
CREATE TABLE public.contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo_servico_id UUID REFERENCES public.tipos_servico(id) ON DELETE CASCADE,
  regime_tributario TEXT NOT NULL,
  quantidade_estabelecimentos INTEGER DEFAULT 1,
  quantidade_contas_bancarias INTEGER DEFAULT 1,
  volume_lancamentos_contabeis TEXT,
  numero_notas_servicos TEXT,
  numero_notas_entrada_saida TEXT,
  quantidade_empregados_clt INTEGER DEFAULT 0,
  quantidade_socios INTEGER DEFAULT 1,
  valor_mensalidade DECIMAL(10,2) NOT NULL,
  dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
  valor_13a_mensalidade TEXT,
  percentual_reajuste_anual DECIMAL(5,2) DEFAULT 0,
  cobra_alteracao_contrato TEXT,
  cobra_irpf_socios TEXT,
  forma_pagamento TEXT,
  data_inicio_contrato DATE NOT NULL,
  prazo_vigencia INTEGER NOT NULL, -- em meses
  pre_aviso_rescisao INTEGER NOT NULL, -- em dias
  multa_rescisoria_percentual DECIMAL(5,2) DEFAULT 0,
  dpo_nome TEXT,
  dpo_email TEXT,
  testemunha1_nome TEXT,
  testemunha1_rg TEXT,
  testemunha2_nome TEXT,
  testemunha2_rg TEXT,
  ano_base TEXT,
  sistema_gestao TEXT,
  contratada_representante_nome TEXT,
  contratada_representante_nacionalidade TEXT,
  contratada_representante_estado_civil TEXT,
  contratada_representante_profissao TEXT,
  contratada_representante_crc TEXT,
  contratada_representante_cpf TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico de contratos (para auditoria)
CREATE TABLE public.historico_contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id UUID REFERENCES public.contratos(id) ON DELETE CASCADE,
  acao TEXT NOT NULL, -- 'created', 'updated', 'deleted'
  dados_anteriores JSONB,
  dados_novos JSONB,
  usuario_id UUID, -- pode ser null se não houver autenticação
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do sistema
CREATE TABLE public.configuracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT NOT NULL UNIQUE,
  valor TEXT,
  descricao TEXT,
  tipo TEXT DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de templates de contrato
CREATE TABLE public.templates_contrato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  variaveis JSONB, -- lista de variáveis disponíveis no template
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de sistema
CREATE TABLE public.logs_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nivel TEXT NOT NULL, -- 'info', 'warning', 'error', 'debug'
  mensagem TEXT NOT NULL,
  detalhes JSONB,
  origem TEXT, -- origem do log (ex: 'contrato_generation', 'pdf_export')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO public.configuracoes (chave, valor, descricao, tipo) VALUES
('empresa_nome', 'JLVIANA Consultoria Contábil', 'Nome da empresa contratada', 'string'),
('empresa_cnpj', '', 'CNPJ da empresa contratada', 'string'),
('empresa_endereco', '', 'Endereço da empresa contratada', 'string'),
('empresa_telefone', '', 'Telefone da empresa contratada', 'string'),
('empresa_email', '', 'Email da empresa contratada', 'string'),
('contrato_template_padrao', '', 'ID do template padrão para contratos', 'string'),
('dias_vencimento_permitidos', '[5, 10, 15, 20, 25, 30]', 'Dias de vencimento permitidos', 'json'),
('percentual_multa_padrao', '10.00', 'Percentual padrão de multa rescisória', 'number'),
('prazo_vigencia_padrao', '12', 'Prazo padrão de vigência em meses', 'number');

-- Inserir template padrão de contrato
INSERT INTO public.templates_contrato (nome, conteudo, variaveis) VALUES
('Template Padrão', 
'CONTRATO DE PRESTAÇÃO DE SERVIÇOS CONTÁBEIS

CONTRATANTE: {{cliente.razaoSocial}}, CNPJ: {{cliente.cnpj}}
CONTRATADA: {{empresa.nome}}

Valor da Mensalidade: R$ {{contrato.valorMensalidade}}
Vencimento: Todo dia {{contrato.diaVencimento}}
Vigência: {{contrato.prazoVigencia}} meses

Serviços Contratados:
{{tipoServico.servicosOrdinarios}}

Data: {{contrato.dataInicioContrato}}

_______________________          _______________________
    CONTRATANTE                      CONTRATADA',
'{
  "cliente": ["razaoSocial", "cnpj", "endereco", "representanteNome"],
  "empresa": ["nome", "cnpj", "endereco"],
  "contrato": ["valorMensalidade", "diaVencimento", "prazoVigencia", "dataInicioContrato"],
  "tipoServico": ["nome", "servicosOrdinarios", "servicosExtraordinarios"]
}');

-- Desabilitar RLS em todas as tabelas
ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_servico DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_contratos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates_contrato DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_sistema DISABLE ROW LEVEL SECURITY;

-- Criar índices para melhor performance
CREATE INDEX idx_clientes_cnpj ON public.clientes(cnpj);
CREATE INDEX idx_contratos_cliente_id ON public.contratos(cliente_id);
CREATE INDEX idx_contratos_tipo_servico_id ON public.contratos(tipo_servico_id);
CREATE INDEX idx_contratos_data_inicio ON public.contratos(data_inicio_contrato);
CREATE INDEX idx_historico_contrato_id ON public.historico_contratos(contrato_id);
CREATE INDEX idx_configuracoes_chave ON public.configuracoes(chave);
CREATE INDEX idx_logs_sistema_nivel ON public.logs_sistema(nivel);
CREATE INDEX idx_logs_sistema_origem ON public.logs_sistema(origem);
CREATE INDEX idx_logs_sistema_created_at ON public.logs_sistema(created_at);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tipos_servico_updated_at BEFORE UPDATE ON public.tipos_servico
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contratos_updated_at BEFORE UPDATE ON public.contratos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON public.configuracoes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_contrato_updated_at BEFORE UPDATE ON public.templates_contrato
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Criar função para log de auditoria
CREATE OR REPLACE FUNCTION public.log_contrato_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.historico_contratos (contrato_id, acao, dados_anteriores)
        VALUES (OLD.id, 'deleted', to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.historico_contratos (contrato_id, acao, dados_anteriores, dados_novos)
        VALUES (NEW.id, 'updated', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.historico_contratos (contrato_id, acao, dados_novos)
        VALUES (NEW.id, 'created', to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Criar trigger para auditoria de contratos
CREATE TRIGGER contratos_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.contratos
    FOR EACH ROW EXECUTE FUNCTION public.log_contrato_changes();
