export type DocumentType = 
  | "loan_application" 
  | "pay_slips" 
  | "nasfund_statement" 
  | "pva_form" 
  | "data_entry_print" 
  | "deduction_advice" 
  | "deduct_authority" 
  | "employment_letter" 
  | "statutory_declaration" 
  | "id_card" 
  | "rodss" 
  | "headmaster_letter";

export interface RequiredDocument {
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
  teacherOnly?: boolean;
}

export interface DocumentUploadStatus {
  type: DocumentType;
  uploaded: boolean;
  fileName?: string;
  previousFileName?: string;
  previousFilePath?: string;
}