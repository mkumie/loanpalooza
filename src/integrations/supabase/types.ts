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
      client_feedback: {
        Row: {
          additional_comments: string | null
          created_at: string
          id: string
          other_source: string | null
          referral_source: Database["public"]["Enums"]["referral_source"]
          user_id: string | null
        }
        Insert: {
          additional_comments?: string | null
          created_at?: string
          id?: string
          other_source?: string | null
          referral_source: Database["public"]["Enums"]["referral_source"]
          user_id?: string | null
        }
        Update: {
          additional_comments?: string | null
          created_at?: string
          id?: string
          other_source?: string | null
          referral_source?: Database["public"]["Enums"]["referral_source"]
          user_id?: string | null
        }
        Relationships: []
      }
      downloadable_files: {
        Row: {
          category: Database["public"]["Enums"]["file_category"]
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_type: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["file_category"]
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_type: string
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["file_category"]
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      interest_rates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          effective_from: string | null
          id: string
          is_active: boolean | null
          rate_percentage: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          effective_from?: string | null
          id?: string
          is_active?: boolean | null
          rate_percentage: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          effective_from?: string | null
          id?: string
          is_active?: boolean | null
          rate_percentage?: number
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          account_holder_name: string
          account_number: string
          account_type: string
          admin_comments: string | null
          bank_name: string
          branch_name: string
          created_at: string
          date_of_birth: string
          district: string
          employer_name: string | null
          employment_length: string | null
          employment_status: string
          existing_loan_details: string | null
          existing_loans: boolean
          first_name: string
          gender: string
          home_province: string
          id: string
          loan_amount: number
          loan_purpose: string
          marital_status: string
          monthly_income: number
          occupation: string | null
          reference_address: string
          reference_full_name: string
          reference_number: string | null
          reference_occupation: string
          reference_phone: string
          reference_relationship: string
          repayment_period: number
          status: Database["public"]["Enums"]["loan_status"]
          surname: string
          updated_at: string
          user_id: string | null
          village: string
          work_address: string | null
          work_phone: string | null
        }
        Insert: {
          account_holder_name: string
          account_number: string
          account_type: string
          admin_comments?: string | null
          bank_name: string
          branch_name: string
          created_at?: string
          date_of_birth: string
          district: string
          employer_name?: string | null
          employment_length?: string | null
          employment_status: string
          existing_loan_details?: string | null
          existing_loans?: boolean
          first_name: string
          gender: string
          home_province: string
          id?: string
          loan_amount: number
          loan_purpose: string
          marital_status: string
          monthly_income: number
          occupation?: string | null
          reference_address: string
          reference_full_name: string
          reference_number?: string | null
          reference_occupation: string
          reference_phone: string
          reference_relationship: string
          repayment_period: number
          status?: Database["public"]["Enums"]["loan_status"]
          surname: string
          updated_at?: string
          user_id?: string | null
          village: string
          work_address?: string | null
          work_phone?: string | null
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          account_type?: string
          admin_comments?: string | null
          bank_name?: string
          branch_name?: string
          created_at?: string
          date_of_birth?: string
          district?: string
          employer_name?: string | null
          employment_length?: string | null
          employment_status?: string
          existing_loan_details?: string | null
          existing_loans?: boolean
          first_name?: string
          gender?: string
          home_province?: string
          id?: string
          loan_amount?: number
          loan_purpose?: string
          marital_status?: string
          monthly_income?: number
          occupation?: string | null
          reference_address?: string
          reference_full_name?: string
          reference_number?: string | null
          reference_occupation?: string
          reference_phone?: string
          reference_relationship?: string
          repayment_period?: number
          status?: Database["public"]["Enums"]["loan_status"]
          surname?: string
          updated_at?: string
          user_id?: string | null
          village?: string
          work_address?: string | null
          work_phone?: string | null
        }
        Relationships: []
      }
      loan_documents: {
        Row: {
          document_type: string
          file_name: string
          file_path: string
          file_type: string
          id: string
          loan_application_id: string | null
          uploaded_at: string
        }
        Insert: {
          document_type: string
          file_name: string
          file_path: string
          file_type: string
          id?: string
          loan_application_id?: string | null
          uploaded_at?: string
        }
        Update: {
          document_type?: string
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          loan_application_id?: string | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_documents_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_penalties: {
        Row: {
          amount: number
          applied_at: string | null
          applied_by: string | null
          created_at: string | null
          due_date: string | null
          id: string
          loan_application_id: string | null
          paid_amount: number | null
          penalty_type_id: string | null
          reason: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          applied_at?: string | null
          applied_by?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          loan_application_id?: string | null
          paid_amount?: number | null
          penalty_type_id?: string | null
          reason?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          applied_at?: string | null
          applied_by?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          loan_application_id?: string | null
          paid_amount?: number | null
          penalty_type_id?: string | null
          reason?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_penalties_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_penalties_penalty_type_id_fkey"
            columns: ["penalty_type_id"]
            isOneToOne: false
            referencedRelation: "penalty_types"
            referencedColumns: ["id"]
          },
        ]
      }
      penalty_types: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          fixed_amount: number | null
          id: string
          is_active: boolean | null
          is_percentage: boolean | null
          name: string
          rate_percentage: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          fixed_amount?: number | null
          id?: string
          is_active?: boolean | null
          is_percentage?: boolean | null
          name: string
          rate_percentage?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          fixed_amount?: number | null
          id?: string
          is_active?: boolean | null
          is_percentage?: boolean | null
          name?: string
          rate_percentage?: number | null
        }
        Relationships: []
      }
      privacy_policy_versions: {
        Row: {
          content: string
          created_at: string | null
          effective_date: string | null
          id: string
          version: string
        }
        Insert: {
          content: string
          created_at?: string | null
          effective_date?: string | null
          id?: string
          version: string
        }
        Update: {
          content?: string
          created_at?: string | null
          effective_date?: string | null
          id?: string
          version?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          gender: string | null
          id: string
          is_admin: boolean | null
          phone_number: string | null
          surname: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          is_admin?: boolean | null
          phone_number?: string | null
          surname?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_admin?: boolean | null
          phone_number?: string | null
          surname?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      terms_acceptances: {
        Row: {
          accepted_at: string | null
          id: string
          ip_address: string | null
          loan_application_id: string | null
          terms_version_id: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          id?: string
          ip_address?: string | null
          loan_application_id?: string | null
          terms_version_id?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          id?: string
          ip_address?: string | null
          loan_application_id?: string | null
          terms_version_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "terms_acceptances_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: true
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_acceptances_terms_version_id_fkey"
            columns: ["terms_version_id"]
            isOneToOne: false
            referencedRelation: "terms_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_versions: {
        Row: {
          content: string
          created_at: string | null
          effective_date: string | null
          id: string
          version: string
        }
        Insert: {
          content: string
          created_at?: string | null
          effective_date?: string | null
          id?: string
          version: string
        }
        Update: {
          content?: string
          created_at?: string | null
          effective_date?: string | null
          id?: string
          version?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_draft_application: {
        Args: {
          draft_id: string
          user_id_input: string
        }
        Returns: boolean
      }
    }
    Enums: {
      file_category: "policy" | "form" | "guide" | "other"
      loan_status: "pending" | "approved" | "rejected" | "draft" | "reviewing"
      referral_source:
        | "friend_family"
        | "social_media"
        | "search_engine"
        | "advertisement"
        | "employer"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
