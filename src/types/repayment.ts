export interface RepaymentSchedule {
  id: string;
  loan_application_id: string;
  due_date: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  updated_at: string;
}

export interface Repayment {
  id: string;
  reference_number: string | null;
  loan_application_id: string;
  repayment_schedule_id: string | null;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: 'pending' | 'confirmed' | 'failed';
  transaction_id: string | null;
  receipt_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}