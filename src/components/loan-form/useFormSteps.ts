import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLoanApplication } from "@/contexts/LoanApplicationContext";
import { useFormValidation } from "./useFormValidation";
import { useFormSubmission } from "./useFormSubmission";
import { useTermsAcceptance } from "./useTermsAcceptance";
import { toast } from "sonner";

export const useFormSteps = () => {
  const { formData, setFormData, currentStep, setCurrentStep } = useLoanApplication();
  const [searchParams] = useSearchParams();
  const [areDocumentsValid, setAreDocumentsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const draftId = searchParams.get('draft');

  const { validationErrors, validateStep, validateForm } = useFormValidation();
  const submitApplication = useFormSubmission(formData);
  const { termsAgreed, setTermsAgreed, recordTermsAcceptance } = useTermsAcceptance(draftId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");
    
    if (!validateStep(currentStep, formData)) {
      console.log("Validation failed for current step");
      return;
    }

    // If we're not on the final terms step, just move to next step
    if (currentStep < 7) {
      // If moving to terms step, check documents first
      if (currentStep === 6 && !areDocumentsValid) {
        toast.error("Please upload all required documents before proceeding");
        return;
      }
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final submission checks
    if (!areDocumentsValid) {
      toast.error("Please upload all required documents before submitting");
      return;
    }

    if (!termsAgreed) {
      toast.error("Please agree to the terms and conditions before submitting");
      return;
    }

    // Validate all steps before final submission
    if (!validateForm(formData)) {
      toast.error("Please ensure all required fields are filled correctly");
      return;
    }

    console.log("Starting final submission process");
    setIsSubmitting(true);

    try {
      // Record terms acceptance
      const termsRecorded = await recordTermsAcceptance();
      if (!termsRecorded) {
        toast.error("Failed to record terms acceptance");
        return;
      }

      // Submit the application
      const applicationId = await submitApplication();
      if (applicationId) {
        console.log("Application submitted successfully:", applicationId);
        toast.success("Application submitted successfully!");
      } else {
        toast.error("Failed to submit application");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting the application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};