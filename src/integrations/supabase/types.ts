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
      profiles: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
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
          id?: string
          is_admin?: boolean | null
          phone_number?: string | null
          surname?: string | null
          updated_at?: string
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
      loan_status: "pending" | "approved" | "rejected"
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
