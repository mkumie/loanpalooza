import React from "react";
import { FormHeader } from "./loan-form/FormHeader";
import { PersonalDetailsSection } from "./loan-form/PersonalDetailsSection";
import { EmploymentDetailsSection } from "./loan-form/EmploymentDetailsSection";
import { LoanDetailsSection } from "./loan-form/LoanDetailsSection";
import { ReferenceDetailsSection } from "./loan-form/ReferenceDetailsSection";
import { PaymentDetailsSection } from "./loan-form/PaymentDetailsSection";
import { ProgressStepper } from "./loan-form/ProgressStepper";
import { FormNavigation } from "./loan-form/FormNavigation";
import { Navigation } from "./Navigation";
import { LoanApplicationProvider, useLoanApplication } from "@/contexts/LoanApplicationContext";
import { validateCurrentStep, validateAllSteps, showValidationErrors } from "@/utils/loanFormValidation";
import { DocumentUpload } from "./loan/DocumentUpload";
import { useFormSubmission } from "./loan-form/useFormSubmission";

const LoanApplicationFormContent = () => {
  const { formData, setFormData, currentStep, setCurrentStep, setIsSubmitting } = useLoanApplication();
  const handleSubmit = useFormSubmission(formData, setIsSubmitting);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep(currentStep, formData)) {
      return;
    }

    // If we're not on the final documents step, just move to next step
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Validate all steps before final submission
    const missingRequirements = validateAllSteps(formData);
    if (missingRequirements.length > 0) {
      showValidationErrors(missingRequirements);
      return;
    }

    const applicationId = await handleSubmit();
    if (applicationId) {
      // You can use the applicationId here if needed for documents
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <form onSubmit={onSubmit} className="container mx-auto px-4 py-8 mt-16 max-w-5xl space-y-8">
        <FormHeader logoUrl="/lovable-uploads/58b13019-da3c-47e4-8458-ebac6ebf7cee.png" />
        <ProgressStepper />

        <div className="space-y-8">
          {currentStep === 1 && <PersonalDetailsSection />}
          {currentStep === 2 && <EmploymentDetailsSection formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && <LoanDetailsSection formData={formData} setFormData={setFormData} />}
          {currentStep === 4 && <ReferenceDetailsSection formData={formData} setFormData={setFormData} />}
          {currentStep === 5 && <PaymentDetailsSection formData={formData} setFormData={setFormData} />}
          {currentStep === 6 && <DocumentUpload applicationId={null} />}
        </div>

        <FormNavigation />
      </form>
    </div>
  );
};

export const LoanApplicationForm = () => {
  return (
    <LoanApplicationProvider>
      <LoanApplicationFormContent />
    </LoanApplicationProvider>
  );
};