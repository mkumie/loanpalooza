export type LoanStatus = "pending" | "approved" | "rejected";

export interface LoanApplication {
  id: string;
  created_at: string;
  loan_amount: number;
  loan_purpose: string;
  status: LoanStatus;
  admin_comments?: string | null;
}