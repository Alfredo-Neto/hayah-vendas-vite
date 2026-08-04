export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_authorizations: {
        Row: {
          atualizado_em: string
          auth_user_id: string | null
          criado_em: string
          email: string
          id: string
          status: Database["public"]["Enums"]["coordenador_authorization_status"]
        }
        Insert: {
          atualizado_em?: string
          auth_user_id?: string | null
          criado_em?: string
          email: string
          id?: string
          status?: Database["public"]["Enums"]["coordenador_authorization_status"]
        }
        Update: {
          atualizado_em?: string
          auth_user_id?: string | null
          criado_em?: string
          email?: string
          id?: string
          status?: Database["public"]["Enums"]["coordenador_authorization_status"]
        }
        Relationships: []
      }
      convites: {
        Row: {
          accepted_at: string | null
          accepted_by_usuario_id: string | null
          atualizado_em: string
          code: string
          created_by_usuario_id: string
          criado_em: string
          edicao_id: string | null
          equipe_id: string | null
          expires_at: string
          id: string
          igreja_local_id: string
          invited_email: string
          papel: Database["public"]["Enums"]["convite_papel"]
          status: Database["public"]["Enums"]["convite_status"]
        }
        Insert: {
          accepted_at?: string | null
          accepted_by_usuario_id?: string | null
          atualizado_em?: string
          code: string
          created_by_usuario_id: string
          criado_em?: string
          edicao_id?: string | null
          equipe_id?: string | null
          expires_at: string
          id?: string
          igreja_local_id: string
          invited_email: string
          papel?: Database["public"]["Enums"]["convite_papel"]
          status?: Database["public"]["Enums"]["convite_status"]
        }
        Update: {
          accepted_at?: string | null
          accepted_by_usuario_id?: string | null
          atualizado_em?: string
          code?: string
          created_by_usuario_id?: string
          criado_em?: string
          edicao_id?: string | null
          equipe_id?: string | null
          expires_at?: string
          id?: string
          igreja_local_id?: string
          invited_email?: string
          papel?: Database["public"]["Enums"]["convite_papel"]
          status?: Database["public"]["Enums"]["convite_status"]
        }
        Relationships: [
          {
            foreignKeyName: "convites_accepted_by_usuario_id_fkey"
            columns: ["accepted_by_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_created_by_usuario_id_fkey"
            columns: ["created_by_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_edicao_id_fkey"
            columns: ["edicao_id"]
            isOneToOne: false
            referencedRelation: "edicoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_igreja_local_id_fkey"
            columns: ["igreja_local_id"]
            isOneToOne: false
            referencedRelation: "igrejas_locais"
            referencedColumns: ["id"]
          },
        ]
      }
      coordenador_authorizations: {
        Row: {
          activated_at: string | null
          atualizado_em: string
          authorized_by_admin_usuario_id: string
          criado_em: string
          email: string
          id: string
          nome: string | null
          status: Database["public"]["Enums"]["coordenador_authorization_status"]
          usuario_id: string | null
        }
        Insert: {
          activated_at?: string | null
          atualizado_em?: string
          authorized_by_admin_usuario_id: string
          criado_em?: string
          email: string
          id?: string
          nome?: string | null
          status?: Database["public"]["Enums"]["coordenador_authorization_status"]
          usuario_id?: string | null
        }
        Update: {
          activated_at?: string | null
          atualizado_em?: string
          authorized_by_admin_usuario_id?: string
          criado_em?: string
          email?: string
          id?: string
          nome?: string | null
          status?: Database["public"]["Enums"]["coordenador_authorization_status"]
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coordenador_authorizations_authorized_by_admin_usuario_id_fkey"
            columns: ["authorized_by_admin_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coordenador_authorizations_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      edicao_assignments: {
        Row: {
          criado_em: string
          edicao_id: string
          equipe_id: string
          id: string
          igreja_local_id: string
          papel: Database["public"]["Enums"]["edicao_papel"]
          usuario_id: string
        }
        Insert: {
          criado_em?: string
          edicao_id: string
          equipe_id: string
          id?: string
          igreja_local_id: string
          papel?: Database["public"]["Enums"]["edicao_papel"]
          usuario_id: string
        }
        Update: {
          criado_em?: string
          edicao_id?: string
          equipe_id?: string
          id?: string
          igreja_local_id?: string
          papel?: Database["public"]["Enums"]["edicao_papel"]
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edicao_assignments_edicao_id_fkey"
            columns: ["edicao_id"]
            isOneToOne: false
            referencedRelation: "edicoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edicao_assignments_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edicao_assignments_igreja_local_id_fkey"
            columns: ["igreja_local_id"]
            isOneToOne: false
            referencedRelation: "igrejas_locais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edicao_assignments_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      edicoes: {
        Row: {
          atualizado_em: string
          criado_em: string
          criado_por_usuario_id: string
          data_fim: string | null
          data_inicio: string | null
          id: string
          igreja_local_id: string
          nome: string
          status: Database["public"]["Enums"]["edicao_status"]
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          criado_por_usuario_id: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          igreja_local_id: string
          nome: string
          status?: Database["public"]["Enums"]["edicao_status"]
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          criado_por_usuario_id?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          igreja_local_id?: string
          nome?: string
          status?: Database["public"]["Enums"]["edicao_status"]
        }
        Relationships: [
          {
            foreignKeyName: "edicoes_criado_por_usuario_id_fkey"
            columns: ["criado_por_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edicoes_igreja_local_id_fkey"
            columns: ["igreja_local_id"]
            isOneToOne: false
            referencedRelation: "igrejas_locais"
            referencedColumns: ["id"]
          },
        ]
      }
      equipes: {
        Row: {
          atualizado_em: string
          criado_em: string
          edicao_id: string
          id: string
          igreja_local_id: string
          lider_usuario_id: string | null
          nome: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          edicao_id: string
          id?: string
          igreja_local_id: string
          lider_usuario_id?: string | null
          nome: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          edicao_id?: string
          id?: string
          igreja_local_id?: string
          lider_usuario_id?: string | null
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipes_edicao_id_fkey"
            columns: ["edicao_id"]
            isOneToOne: false
            referencedRelation: "edicoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipes_igreja_local_id_fkey"
            columns: ["igreja_local_id"]
            isOneToOne: false
            referencedRelation: "igrejas_locais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipes_lider_usuario_id_fkey"
            columns: ["lider_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      fechamentos_equipe: {
        Row: {
          atualizado_em: string
          comprovante_transferencia_path: string
          criado_em: string
          edicao_id: string
          enviado_por_usuario_id: string
          equipe_id: string
          id: string
          igreja_local_id: string
          observacao: string | null
          status: Database["public"]["Enums"]["fechamento_status"]
          validado_em: string | null
          validado_por_usuario_id: string | null
          valor_repassado: number
        }
        Insert: {
          atualizado_em?: string
          comprovante_transferencia_path: string
          criado_em?: string
          edicao_id: string
          enviado_por_usuario_id: string
          equipe_id: string
          id?: string
          igreja_local_id: string
          observacao?: string | null
          status?: Database["public"]["Enums"]["fechamento_status"]
          validado_em?: string | null
          validado_por_usuario_id?: string | null
          valor_repassado: number
        }
        Update: {
          atualizado_em?: string
          comprovante_transferencia_path?: string
          criado_em?: string
          edicao_id?: string
          enviado_por_usuario_id?: string
          equipe_id?: string
          id?: string
          igreja_local_id?: string
          observacao?: string | null
          status?: Database["public"]["Enums"]["fechamento_status"]
          validado_em?: string | null
          validado_por_usuario_id?: string | null
          valor_repassado?: number
        }
        Relationships: [
          {
            foreignKeyName: "fechamentos_equipe_edicao_id_fkey"
            columns: ["edicao_id"]
            isOneToOne: false
            referencedRelation: "edicoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fechamentos_equipe_enviado_por_usuario_id_fkey"
            columns: ["enviado_por_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fechamentos_equipe_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fechamentos_equipe_igreja_local_id_fkey"
            columns: ["igreja_local_id"]
            isOneToOne: false
            referencedRelation: "igrejas_locais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fechamentos_equipe_validado_por_usuario_id_fkey"
            columns: ["validado_por_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      igreja_local_membros: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          igreja_local_id: string
          papel: Database["public"]["Enums"]["igreja_local_papel"]
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          igreja_local_id: string
          papel?: Database["public"]["Enums"]["igreja_local_papel"]
          usuario_id: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          igreja_local_id?: string
          papel?: Database["public"]["Enums"]["igreja_local_papel"]
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "igreja_local_membros_igreja_local_id_fkey"
            columns: ["igreja_local_id"]
            isOneToOne: false
            referencedRelation: "igrejas_locais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "igreja_local_membros_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      igrejas_locais: {
        Row: {
          atualizado_em: string
          criado_em: string
          criado_por_usuario_id: string
          id: string
          nome: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          criado_por_usuario_id: string
          id?: string
          nome: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          criado_por_usuario_id?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "igrejas_locais_criado_por_usuario_id_fkey"
            columns: ["criado_por_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          atualizado_em: string
          auth_user_id: string
          criado_em: string
          email: string
          id: string
          nome: string | null
        }
        Insert: {
          atualizado_em?: string
          auth_user_id: string
          criado_em?: string
          email: string
          id?: string
          nome?: string | null
        }
        Update: {
          atualizado_em?: string
          auth_user_id?: string
          criado_em?: string
          email?: string
          id?: string
          nome?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      autorizar_coordenador: {
        Args: { p_email: string; p_nome?: string | null }
        Returns: {
          id: string
          email: string
          nome: string | null
          status: Database["public"]["Enums"]["coordenador_authorization_status"]
        }[]
      }
      criar_igreja_local: {
        Args: { p_nome: string }
        Returns: { id: string; nome: string }[]
      }
      current_usuario: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Tables"]["usuarios"]["Row"]
      }
      current_usuario_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_usuario_access: {
        Args: Record<PropertyKey, never>
        Returns: {
          is_admin: boolean
          is_coordenador_authorized: boolean
          is_coordenador: boolean
          coordenador_igreja_local_id: string | null
          status: string
        }[]
      }
    }
    Enums: {
      coordenador_authorization_status: "active" | "revoked"
      convite_papel: "lider"
      convite_status: "pending" | "accepted" | "revoked"
      edicao_papel: "lider"
      edicao_status: "draft" | "active" | "review" | "finalized"
      fechamento_status: "enviado" | "validado" | "rejeitado"
      igreja_local_papel: "coordenador" | "usuario"
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
    Enums: {
      coordenador_authorization_status: ["active", "revoked"],
      convite_papel: ["lider"],
      convite_status: ["pending", "accepted", "revoked"],
      edicao_papel: ["lider"],
      edicao_status: ["draft", "active", "review", "finalized"],
      fechamento_status: ["enviado", "validado", "rejeitado"],
      igreja_local_papel: ["coordenador", "usuario"],
    },
  },
} as const
