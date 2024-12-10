import { useState } from "react";
import { validateCurrentStep, validateAllSteps, showValidationErrors } from "@/utils/loanFormValidation";
import { LoanApplicationData } from "@/contexts/LoanApplicationContext";
import { toast } from "sonner";

export const useFormValidation = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number, formData: LoanApplicationData) => {
    setValidationErrors({});
    const errors = validateCurrentStep(currentStep, formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }
    return true;
  };

  const validateForm = (formData: LoanApplicationData) => {
    const missingRequirements = validateAllSteps(formData);
    if (missingRequirements.length > 0) {
      showValidationErrors(missingRequirements);
      return false;
    }
    return true;
  };

  return {
    validationErrors,
    setValidationErrors,
    validateStep,
    validateForm
  };
};