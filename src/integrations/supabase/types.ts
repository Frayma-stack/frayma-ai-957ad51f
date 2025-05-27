export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      authors: {
        Row: {
          backstory: string
          beliefs: Json | null
          client_id: string | null
          created_at: string
          experiences: Json | null
          id: string
          name: string
          organization: string
          role: string
          social_links: Json | null
          tones: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backstory: string
          beliefs?: Json | null
          client_id?: string | null
          created_at?: string
          experiences?: Json | null
          id?: string
          name: string
          organization: string
          role: string
          social_links?: Json | null
          tones?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backstory?: string
          beliefs?: Json | null
          client_id?: string | null
          created_at?: string
          experiences?: Json | null
          id?: string
          name?: string
          organization?: string
          role?: string
          social_links?: Json | null
          tones?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "authors_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company_links: Json | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_links?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_links?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      drafts: {
        Row: {
          author_id: string | null
          client_id: string
          content: string
          content_type: string
          created_at: string
          created_by: string
          id: string
          last_edited_by: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_id?: string | null
          client_id: string
          content: string
          content_type: string
          created_at?: string
          created_by: string
          id?: string
          last_edited_by?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_id?: string | null
          client_id?: string
          content?: string
          content_type?: string
          created_at?: string
          created_by?: string
          id?: string
          last_edited_by?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drafts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drafts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      icp_story_scripts: {
        Row: {
          client_id: string | null
          core_beliefs: Json | null
          created_at: string
          demographics: string
          desired_transformations: Json | null
          external_struggles: Json | null
          id: string
          internal_pains: Json | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          core_beliefs?: Json | null
          created_at?: string
          demographics: string
          desired_transformations?: Json | null
          external_struggles?: Json | null
          id?: string
          internal_pains?: Json | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          core_beliefs?: Json | null
          created_at?: string
          demographics?: string
          desired_transformations?: Json | null
          external_struggles?: Json | null
          id?: string
          internal_pains?: Json | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "icp_story_scripts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          client_id: string | null
          created_at: string
          cta: string | null
          id: string
          narrative: string | null
          product_tie_in: string | null
          score: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          cta?: string | null
          id?: string
          narrative?: string | null
          product_tie_in?: string | null
          score?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          cta?: string | null
          id?: string
          narrative?: string | null
          product_tie_in?: string | null
          score?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      product_contexts: {
        Row: {
          category_pov: string
          client_id: string | null
          company_links: Json | null
          company_mission: string
          created_at: string
          differentiators: Json | null
          features: Json | null
          id: string
          unique_insight: string
          updated_at: string
          use_cases: Json | null
          user_id: string
        }
        Insert: {
          category_pov: string
          client_id?: string | null
          company_links?: Json | null
          company_mission: string
          created_at?: string
          differentiators?: Json | null
          features?: Json | null
          id?: string
          unique_insight: string
          updated_at?: string
          use_cases?: Json | null
          user_id: string
        }
        Update: {
          category_pov?: string
          client_id?: string | null
          company_links?: Json | null
          company_mission?: string
          created_at?: string
          differentiators?: Json | null
          features?: Json | null
          id?: string
          unique_insight?: string
          updated_at?: string
          use_cases?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_contexts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          after_summary: string
          before_summary: string
          client_id: string | null
          created_at: string
          features: Json | null
          id: string
          quotes: Json | null
          title: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          after_summary: string
          before_summary: string
          client_id?: string | null
          created_at?: string
          features?: Json | null
          id?: string
          quotes?: Json | null
          title: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          after_summary?: string
          before_summary?: string
          client_id?: string | null
          created_at?: string
          features?: Json | null
          id?: string
          quotes?: Json | null
          title?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "success_stories_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
