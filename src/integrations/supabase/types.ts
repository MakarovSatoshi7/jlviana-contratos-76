export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          cnpj: string
          created_at: string | null
          endereco: string | null
          id: string
          razao_social: string
          representante_cpf: string | null
          representante_estado_civil: string | null
          representante_nacionalidade: string | null
          representante_nome: string | null
          representante_orgao_emissor: string | null
          representante_profissao: string | null
          representante_rg: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj: string
          created_at?: string | null
          endereco?: string | null
          id?: string
          razao_social: string
          representante_cpf?: string | null
          representante_estado_civil?: string | null
          representante_nacionalidade?: string | null
          representante_nome?: string | null
          representante_orgao_emissor?: string | null
          representante_profissao?: string | null
          representante_rg?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string
          created_at?: string | null
          endereco?: string | null
          id?: string
          razao_social?: string
          representante_cpf?: string | null
          representante_estado_civil?: string | null
          representante_nacionalidade?: string | null
          representante_nome?: string | null
          representante_orgao_emissor?: string | null
          representante_profissao?: string | null
          representante_rg?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          created_at: string | null
          descricao: string | null
          id: string
          tipo: string | null
          updated_at: string | null
          valor: string | null
        }
        Insert: {
          chave: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          tipo?: string | null
          updated_at?: string | null
          valor?: string | null
        }
        Update: {
          chave?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          tipo?: string | null
          updated_at?: string | null
          valor?: string | null
        }
        Relationships: []
      }
      contratos: {
        Row: {
          ano_base: string | null
          cliente_id: string | null
          cobra_alteracao_contrato: string | null
          cobra_irpf_socios: string | null
          contratada_representante_cpf: string | null
          contratada_representante_crc: string | null
          contratada_representante_estado_civil: string | null
          contratada_representante_nacionalidade: string | null
          contratada_representante_nome: string | null
          contratada_representante_profissao: string | null
          created_at: string | null
          data_inicio_contrato: string
          dia_vencimento: number
          dpo_email: string | null
          dpo_nome: string | null
          forma_pagamento: string | null
          id: string
          multa_rescisoria_percentual: number | null
          numero_notas_entrada_saida: string | null
          numero_notas_servicos: string | null
          percentual_reajuste_anual: number | null
          prazo_vigencia: number
          pre_aviso_rescisao: number
          quantidade_contas_bancarias: number | null
          quantidade_empregados_clt: number | null
          quantidade_estabelecimentos: number | null
          quantidade_socios: number | null
          regime_tributario: string
          sistema_gestao: string | null
          testemunha1_nome: string | null
          testemunha1_rg: string | null
          testemunha2_nome: string | null
          testemunha2_rg: string | null
          tipo_servico_id: string | null
          updated_at: string | null
          valor_13a_mensalidade: string | null
          valor_mensalidade: number
          volume_lancamentos_contabeis: string | null
        }
        Insert: {
          ano_base?: string | null
          cliente_id?: string | null
          cobra_alteracao_contrato?: string | null
          cobra_irpf_socios?: string | null
          contratada_representante_cpf?: string | null
          contratada_representante_crc?: string | null
          contratada_representante_estado_civil?: string | null
          contratada_representante_nacionalidade?: string | null
          contratada_representante_nome?: string | null
          contratada_representante_profissao?: string | null
          created_at?: string | null
          data_inicio_contrato: string
          dia_vencimento: number
          dpo_email?: string | null
          dpo_nome?: string | null
          forma_pagamento?: string | null
          id?: string
          multa_rescisoria_percentual?: number | null
          numero_notas_entrada_saida?: string | null
          numero_notas_servicos?: string | null
          percentual_reajuste_anual?: number | null
          prazo_vigencia: number
          pre_aviso_rescisao: number
          quantidade_contas_bancarias?: number | null
          quantidade_empregados_clt?: number | null
          quantidade_estabelecimentos?: number | null
          quantidade_socios?: number | null
          regime_tributario: string
          sistema_gestao?: string | null
          testemunha1_nome?: string | null
          testemunha1_rg?: string | null
          testemunha2_nome?: string | null
          testemunha2_rg?: string | null
          tipo_servico_id?: string | null
          updated_at?: string | null
          valor_13a_mensalidade?: string | null
          valor_mensalidade: number
          volume_lancamentos_contabeis?: string | null
        }
        Update: {
          ano_base?: string | null
          cliente_id?: string | null
          cobra_alteracao_contrato?: string | null
          cobra_irpf_socios?: string | null
          contratada_representante_cpf?: string | null
          contratada_representante_crc?: string | null
          contratada_representante_estado_civil?: string | null
          contratada_representante_nacionalidade?: string | null
          contratada_representante_nome?: string | null
          contratada_representante_profissao?: string | null
          created_at?: string | null
          data_inicio_contrato?: string
          dia_vencimento?: number
          dpo_email?: string | null
          dpo_nome?: string | null
          forma_pagamento?: string | null
          id?: string
          multa_rescisoria_percentual?: number | null
          numero_notas_entrada_saida?: string | null
          numero_notas_servicos?: string | null
          percentual_reajuste_anual?: number | null
          prazo_vigencia?: number
          pre_aviso_rescisao?: number
          quantidade_contas_bancarias?: number | null
          quantidade_empregados_clt?: number | null
          quantidade_estabelecimentos?: number | null
          quantidade_socios?: number | null
          regime_tributario?: string
          sistema_gestao?: string | null
          testemunha1_nome?: string | null
          testemunha1_rg?: string | null
          testemunha2_nome?: string | null
          testemunha2_rg?: string | null
          tipo_servico_id?: string | null
          updated_at?: string | null
          valor_13a_mensalidade?: string | null
          valor_mensalidade?: number
          volume_lancamentos_contabeis?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_tipo_servico_id_fkey"
            columns: ["tipo_servico_id"]
            isOneToOne: false
            referencedRelation: "tipos_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_contratos: {
        Row: {
          acao: string
          contrato_id: string | null
          created_at: string | null
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string
          usuario_id: string | null
        }
        Insert: {
          acao: string
          contrato_id?: string | null
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          contrato_id?: string | null
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_contratos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_sistema: {
        Row: {
          created_at: string | null
          detalhes: Json | null
          id: string
          mensagem: string
          nivel: string
          origem: string | null
        }
        Insert: {
          created_at?: string | null
          detalhes?: Json | null
          id?: string
          mensagem: string
          nivel: string
          origem?: string | null
        }
        Update: {
          created_at?: string | null
          detalhes?: Json | null
          id?: string
          mensagem?: string
          nivel?: string
          origem?: string | null
        }
        Relationships: []
      }
      templates_contrato: {
        Row: {
          ativo: boolean | null
          conteudo: string
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
          variaveis: Json | null
        }
        Insert: {
          ativo?: boolean | null
          conteudo: string
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
          variaveis?: Json | null
        }
        Update: {
          ativo?: boolean | null
          conteudo?: string
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          variaveis?: Json | null
        }
        Relationships: []
      }
      tipos_servico: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          servicos_complementares: string[] | null
          servicos_extraordinarios: string[] | null
          servicos_ordinarios: string[] | null
          updated_at: string | null
          valor_base: number
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          servicos_complementares?: string[] | null
          servicos_extraordinarios?: string[] | null
          servicos_ordinarios?: string[] | null
          updated_at?: string | null
          valor_base?: number
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          servicos_complementares?: string[] | null
          servicos_extraordinarios?: string[] | null
          servicos_ordinarios?: string[] | null
          updated_at?: string | null
          valor_base?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
