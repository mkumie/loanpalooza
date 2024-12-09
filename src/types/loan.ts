export type LoanStatus = "pending" | "approved" | "rejected";

export interface LoanApplication {
  id: string;
  created_at: string;
  first_name: string;
  surname: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  district: string;
  village: string;
  home_province: string;
  employment_status: string;
  employer_name: string | null;
  occupation: string | null;
  monthly_income: number;
  employment_length: string | null;
  work_address: string | null;
  work_phone: string | null;
  loan_amount: number;
  loan_purpose: string;
  repayment_period: number;
  existing_loans: boolean;
  existing_loan_details: string | null;
  reference_full_name: string;
  reference_relationship: string;
  reference_address: string;
  reference_phone: string;
  reference_occupation: string;
  bank_name: string;
  account_number: string;
  account_type: string;
  branch_name: string;
  account_holder_name: string;
  status: LoanStatus;
  admin_comments: string | null;
}