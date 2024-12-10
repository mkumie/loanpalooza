import { DocumentUpload } from "../loan/DocumentUpload";
import { TermsAndConditions } from "./TermsAndConditions";
import { PersonalDetailsSection } from "./PersonalDetailsSection";
import { EmploymentDetailsSection } from "./EmploymentDetailsSection";
import { LoanDetailsSection } from "./LoanDetailsSection";
import { ReferenceDetailsSection } from "./ReferenceDetailsSection";
import { PaymentDetailsSection } from "./PaymentDetailsSection";

interface FormStepsProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
  validationErrors: Record<string, string>;
  areDocumentsValid: boolean;
  setAreDocumentsValid: (valid: boolean) => void;
  termsAgreed: boolean;
  setTermsAgreed: (agreed: boolean) => void;
  draftId: string;
}

export const FormSteps = ({
  currentStep,
  formData,
  setFormData,
  validationErrors,
  areDocumentsValid,
  setAreDocumentsValid,
  termsAgreed,
  setTermsAgreed,
  draftId,
}: FormStepsProps) => {
  return (
    <div className="space-y-8">
      {currentStep === 1 && (
        <PersonalDetailsSection 
          validationErrors={validationErrors} 
        />
      )}
      {currentStep === 2 && (
        <EmploymentDetailsSection 
          formData={formData} 
          setFormData={setFormData} 
          validationErrors={validationErrors}
        />
      )}
      {currentStep === 3 && (
        <LoanDetailsSection 
          formData={formData} 
          setFormData={setFormData}
          validationErrors={validationErrors}
        />
      )}
      {currentStep === 4 && (
        <ReferenceDetailsSection 
          formData={formData} 
          setFormData={setFormData}
          validationErrors={validationErrors}
        />
      )}
      {currentStep === 5 && (
        <PaymentDetailsSection 
          formData={formData} 
          setFormData={setFormData}
          validationErrors={validationErrors}
        />
      )}
      {currentStep === 6 && (
        <DocumentUpload 
          applicationId={draftId} 
          onValidationChange={setAreDocumentsValid}
        />
      )}
      {currentStep === 7 && (
        <TermsAndConditions
          agreed={termsAgreed}
          onAgreeChange={setTermsAgreed}
        />
      )}
    </div>
  );
};