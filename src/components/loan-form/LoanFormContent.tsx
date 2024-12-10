import React from "react";
import { FormHeader } from "./FormHeader";
import { PersonalDetailsSection } from "./PersonalDetailsSection";
import { EmploymentDetailsSection } from "./EmploymentDetailsSection";
import { LoanDetailsSection } from "./LoanDetailsSection";
import { ReferenceDetailsSection } from "./ReferenceDetailsSection";
import { PaymentDetailsSection } from "./PaymentDetailsSection";
import { ProgressStepper } from "./ProgressStepper";
import { FormNavigation } from "./FormNavigation";
import { DocumentUpload } from "../loan/DocumentUpload";
import { TermsAndConditions } from "./TermsAndConditions";
import { useFormSteps } from "./useFormSteps";
import { useLoanApplication } from "@/contexts/LoanApplicationContext";

export const LoanFormContent = () => {
  const {
    currentStep,
    formData,
    setFormData,
    areDocumentsValid,
    setAreDocumentsValid,
    termsAgreed,
    setTermsAgreed,
    validationErrors,
    draftId,
    handleSubmit,
  } = useFormSteps();

  return (
    <form onSubmit={handleSubmit} className="container mx-auto px-4 py-8 mt-16 max-w-5xl space-y-8">
      <FormHeader logoUrl="/lovable-uploads/58b13019-da3c-47e4-8458-ebac6ebf7cee.png" />
      <ProgressStepper />

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

      <FormNavigation 
        isSubmitDisabled={
          (currentStep === 6 && !areDocumentsValid) || 
          (currentStep === 7 && !termsAgreed)
        } 
      />
    </form>
  );
};