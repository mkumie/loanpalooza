import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLoanApplication } from "@/contexts/LoanApplicationContext";
import { useFormValidation } from "./useFormValidation";
import { useFormSubmission } from "./useFormSubmission";
import { useTermsAcceptance } from "./useTermsAcceptance";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useFormSteps = () => {
  const { formData, setFormData, currentStep, setCurrentStep } = useLoanApplication();
  const [searchParams] = useSearchParams();
  const [areDocumentsValid, setAreDocumentsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const draftId = searchParams.get('draft');

  const { validationErrors, validateStep, validateForm } = useFormValidation();
  const submitApplication = useFormSubmission(formData);
  const { termsAgreed, setTermsAgreed, recordTermsAcceptance } = useTermsAcceptance(draftId);

  const cleanupDraft = async (draftId: string) => {
    try {
      const { data: result, error: rpcError } = await supabase
        .rpc('delete_draft_application', {
          draft_id: draftId,
          user_id_input: (await supabase.auth.getSession()).data.session?.user.id
        });

      if (rpcError) {
        console.error("Error cleaning up draft:", rpcError);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in cleanupDraft:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();
    console.log("Form submission started");
    
    if (!validateStep(currentStep, formData)) {
      console.log("Validation failed for current step");
      return false;
    }

    // If we're not on the final terms step, just move to next step
    if (currentStep < 7) {
      // If moving to terms step, check documents first
      if (currentStep === 6 && !areDocumentsValid) {
        toast.error("Please upload all required documents before proceeding");
        return false;
      }
      setCurrentStep(currentStep + 1);
      return true;
    }

    // Final submission checks
    if (!areDocumentsValid) {
      toast.error("Please upload all required documents before submitting");
      return false;
    }

    if (!termsAgreed) {
      toast.error("Please agree to the terms and conditions before submitting");
      return false;
    }

    // Validate all steps before final submission
    if (!validateForm(formData)) {
      toast.error("Please ensure all required fields are filled correctly");
      return false;
    }

    console.log("Starting final submission process");
    setIsSubmitting(true);

    try {
      // Record terms acceptance
      const termsRecorded = await recordTermsAcceptance();
      if (!termsRecorded) {
        toast.error("Failed to record terms acceptance");
        return false;
      }

      // Submit the application
      const applicationId = await submitApplication();
      if (applicationId) {
        console.log("Application submitted successfully:", applicationId);
        
        // If this was a draft, clean it up after successful submission
        if (draftId) {
          const cleanupSuccess = await cleanupDraft(draftId);
          if (!cleanupSuccess) {
            console.warn("Draft cleanup failed, but application was submitted successfully");
          }
        }
        
        toast.success("Application submitted successfully!");
        return true;
      } else {
        toast.error("Failed to submit application");
        return false;
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting the application");
      return false;
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