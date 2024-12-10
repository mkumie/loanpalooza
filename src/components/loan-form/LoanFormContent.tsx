import React from "react";
import { FormHeader } from "./FormHeader";
import { ProgressStepper } from "./ProgressStepper";
import { FormNavigation } from "./FormNavigation";
import { FormSteps } from "./FormSteps";
import { useFormSteps } from "./useFormSteps";
import { useDraftApplication } from "./hooks/useDraftApplication";

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
  } = useFormSteps();

  const { draftId } = useDraftApplication();

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-5xl space-y-8">
      <FormHeader logoUrl="/lovable-uploads/58b13019-da3c-47e4-8458-ebac6ebf7cee.png" />
      <ProgressStepper />

      <FormSteps
        currentStep={currentStep}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        areDocumentsValid={areDocumentsValid}
        setAreDocumentsValid={setAreDocumentsValid}
        termsAgreed={termsAgreed}
        setTermsAgreed={setTermsAgreed}
        draftId={draftId || ''}
      />

      <FormNavigation 
        isSubmitDisabled={
          (currentStep === 6 && !areDocumentsValid) || 
          (currentStep === 7 && !termsAgreed)
        } 
      />
    </div>
  );
};