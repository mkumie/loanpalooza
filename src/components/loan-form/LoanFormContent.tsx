import { useState } from "react";
import { FormSteps } from "./FormSteps";
import { FormNavigation } from "./FormNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { useFormSteps } from "./useFormSteps";
import { Navigation } from "../Navigation";
import { useDraftApplication } from "./hooks/useDraftApplication";

interface LoanFormContentProps {
  onSubmitSuccess?: () => void;
}

export const LoanFormContent = ({ onSubmitSuccess }: LoanFormContentProps) => {
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
    isSubmitting,
    handleSubmit,
  } = useFormSteps();

  // Use the draft application hook to prefill form data
  useDraftApplication();

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success && onSubmitSuccess) {
      onSubmitSuccess();
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <div className="container mx-auto px-4 pt-20 pb-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="mb-8">
              <img 
                src="/lovable-uploads/58b13019-da3c-47e4-8458-ebac6ebf7cee.png" 
                alt="YES Finance Logo" 
                className="h-16 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-center text-primary">
                Loan Application Form
              </h1>
              <p className="text-center text-gray-600 mt-2">
                Step {currentStep} of 7
              </p>
            </div>
            
            <form onSubmit={onFormSubmit} className="mt-6 space-y-8">
              <FormSteps
                currentStep={currentStep}
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
                areDocumentsValid={areDocumentsValid}
                setAreDocumentsValid={setAreDocumentsValid}
                termsAgreed={termsAgreed}
                setTermsAgreed={setTermsAgreed}
                draftId={draftId}
              />

              <FormNavigation
                isSubmitDisabled={
                  (currentStep === 6 && !areDocumentsValid) ||
                  (currentStep === 7 && !termsAgreed)
                }
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};