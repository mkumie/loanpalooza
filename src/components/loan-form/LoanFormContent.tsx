import React, { useEffect } from "react";
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
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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

  const [searchParams] = useSearchParams();
  const draftIdFromUrl = searchParams.get('draft');

  // Fetch draft data if draftId is present
  const { data: draftData } = useQuery({
    queryKey: ['draft-application', draftIdFromUrl],
    queryFn: async () => {
      if (!draftIdFromUrl) return null;

      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('id', draftIdFromUrl)
        .eq('status', 'draft')
        .single();

      if (error) {
        console.error('Error fetching draft:', error);
        toast.error('Failed to load draft application');
        return null;
      }

      return data;
    },
    enabled: !!draftIdFromUrl,
  });

  // Prefill form data when draft data is loaded
  useEffect(() => {
    if (draftData) {
      setFormData({
        firstName: draftData.first_name,
        surname: draftData.surname,
        dateOfBirth: draftData.date_of_birth,
        gender: draftData.gender,
        maritalStatus: draftData.marital_status,
        district: draftData.district,
        village: draftData.village,
        homeProvince: draftData.home_province,
        employmentStatus: draftData.employment_status,
        employerName: draftData.employer_name || '',
        occupation: draftData.occupation || '',
        monthlyIncome: draftData.monthly_income?.toString() || '',
        employmentLength: draftData.employment_length || '',
        workAddress: draftData.work_address || '',
        workPhone: draftData.work_phone || '',
        loanAmount: draftData.loan_amount?.toString() || '',
        loanPurpose: draftData.loan_purpose,
        repaymentPeriod: draftData.repayment_period?.toString() || '',
        existingLoans: draftData.existing_loans,
        existingLoanDetails: draftData.existing_loan_details || '',
        referenceFullName: draftData.reference_full_name,
        referenceRelationship: draftData.reference_relationship,
        referenceAddress: draftData.reference_address,
        referencePhone: draftData.reference_phone,
        referenceOccupation: draftData.reference_occupation,
        bankName: draftData.bank_name,
        accountNumber: draftData.account_number,
        accountType: draftData.account_type,
        branchName: draftData.branch_name,
        accountHolderName: draftData.account_holder_name,
      });
    }
  }, [draftData, setFormData]);

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
            applicationId={draftIdFromUrl || ''} 
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