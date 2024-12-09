import { RequiredDocument } from "@/types/documents";

export const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  {
    type: "loan_application",
    label: "Personal Loan Application Form",
    description: "Fully completed form",
    required: true
  },
  {
    type: "pay_slips",
    label: "Pay Slips",
    description: "Provide 3 x latest Pay Slips",
    required: true
  },
  {
    type: "nasfund_statement",
    label: "NasFund (POSF) Statements",
    description: "Latest statement",
    required: false
  },
  {
    type: "pva_form",
    label: "PVA Form",
    description: "Completed & signed PVA with employer stamp",
    required: true
  },
  {
    type: "data_entry_print",
    label: "Data Entry Print Out",
    description: "With Employer Stamp",
    required: true
  },
  {
    type: "deduction_advice",
    label: "Employee Deduction Advice Form",
    description: "Completed & signed form",
    required: true
  },
  {
    type: "deduct_authority",
    label: "Irrevocable Authority to Deduct Form",
    description: "Completed & signed form",
    required: true
  },
  {
    type: "employment_letter",
    label: "Employment Confirmation Letter",
    description: "From HR Manager",
    required: true
  },
  {
    type: "statutory_declaration",
    label: "Statutory Declaration Form",
    description: "Signed form",
    required: true
  },
  {
    type: "id_card",
    label: "Identification Card",
    description: "Copy of valid ID (NID Card, NASFUND(POSF), or Employer Card)",
    required: true
  },
  {
    type: "rodss",
    label: "Resumption of Duty Summary Sheet (RODSS)",
    description: "Copy of RODSS",
    required: false,
    teacherOnly: true
  },
  {
    type: "headmaster_letter",
    label: "Headmaster Confirmation Letter",
    description: "Confirmation letter",
    required: false,
    teacherOnly: true
  }
];