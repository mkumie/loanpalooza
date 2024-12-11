import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LoanApplicationData } from "@/contexts/LoanApplicationContext";
import { LoanStatus } from "@/types/loan";
import { FormSteps } from "./FormSteps";
import { FormNavigation } from "./FormNavigation";
import { FormHeader } from "./FormHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useFormSteps } from "./useFormSteps";

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

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success && onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <FormHeader currentStep={currentStep} />
        
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
  );
};