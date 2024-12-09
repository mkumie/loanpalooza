export type DocumentType = "id" | "proof_of_income" | "bank_statement" | "utility_bill" | "other";

export interface RequiredDocument {
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
}

export interface DocumentUploadStatus {
  type: DocumentType;
  uploaded: boolean;
  fileName?: string;
}