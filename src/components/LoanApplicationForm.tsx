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
import { DocumentUpload } from "./loan/DocumentUpload";
import { TermsAndConditions } from "./loan-form/TermsAndConditions";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFormValidation } from "./loan-form/useFormValidation";
import { useLoanSubmission } from "./loan-form/useLoanSubmission";
import { useTermsAcceptance } from "./loan-form/useTermsAcceptance";

const LoanApplicationFormContent = () => {
  const { formData, setFormData, currentStep, setCurrentStep } = useLoanApplication();
  const [searchParams] = useSearchParams();
  const [areDocumentsValid, setAreDocumentsValid] = React.useState(false);
  const draftId = searchParams.get('draft');

  const { validationErrors, validateStep, validateForm } = useFormValidation();
  const { isSubmitting, setIsSubmitting, handleSubmit } = useLoanSubmission(formData);
  const { termsAgreed, setTermsAgreed, recordTermsAcceptance } = useTermsAcceptance(draftId);

  React.useEffect(() => {
    const loadDraftData = async () => {
      if (!draftId) return;

      try {
        const { data: draft, error } = await supabase
          .from("loan_applications")
          .select("*")
          .eq("id", draftId)
          .single();

        if (error) throw error;

        if (draft) {
          setFormData({
            firstName: draft.first_name,
            surname: draft.surname,
            dateOfBirth: draft.date_of_birth,
            gender: draft.gender,
            maritalStatus: draft.marital_status,
            district: draft.district,
            village: draft.village,
            homeProvince: draft.home_province,
            employmentStatus: draft.employment_status,
            employerName: draft.employer_name || "",
            occupation: draft.occupation || "",
            monthlyIncome: draft.monthly_income.toString(),
            employmentLength: draft.employment_length || "",
            workAddress: draft.work_address || "",
            workPhone: draft.work_phone || "",
            loanAmount: draft.loan_amount.toString(),
            loanPurpose: draft.loan_purpose,
            repaymentPeriod: draft.repayment_period.toString(),
            existingLoans: draft.existing_loans,
            existingLoanDetails: draft.existing_loan_details || "",
            referenceFullName: draft.reference_full_name,
            referenceRelationship: draft.reference_relationship,
            referenceAddress: draft.reference_address,
            referencePhone: draft.reference_phone,
            referenceOccupation: draft.reference_occupation,
            bankName: draft.bank_name,
            accountNumber: draft.account_number,
            accountType: draft.account_type,
            branchName: draft.branch_name,
            accountHolderName: draft.account_holder_name,
          });
        }
      } catch (error: any) {
        toast.error("Failed to load draft application");
        console.error("Error loading draft:", error);
      }
    };

    loadDraftData();
  }, [draftId, setFormData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep, formData)) {
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
      return;
    }

    // Record terms acceptance
    const termsRecorded = await recordTermsAcceptance();
    if (!termsRecorded) {
      return;
    }

    // Submit the application
    const applicationId = await handleSubmit();
    if (applicationId) {
      // Application submitted successfully
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <form onSubmit={onSubmit} className="container mx-auto px-4 py-8 mt-16 max-w-5xl space-y-8">
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