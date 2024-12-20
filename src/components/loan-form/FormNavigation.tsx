import React from "react";
import { Button } from "@/components/ui/button";
import { useLoanApplication } from "@/contexts/LoanApplicationContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useApplicationSubmission } from "./hooks/useApplicationSubmission";
import { LoanStatus } from "@/types/loan";

interface FormNavigationProps {
  isSubmitDisabled?: boolean;
}

export const FormNavigation = ({ isSubmitDisabled }: FormNavigationProps) => {
  const { currentStep, setCurrentStep, formData } = useLoanApplication();
  const session = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draft');
  const [previousFormData, setPreviousFormData] = React.useState(formData);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const { isSubmitting, handleSubmit } = useApplicationSubmission(draftId);

  // Update previousFormData when formData is loaded from draft
  React.useEffect(() => {
    if (draftId && !isInitialized && Object.values(formData).some(value => value !== "")) {
      setPreviousFormData(formData);
      setIsInitialized(true);
    }
  }, [draftId, formData, isInitialized]);

  const hasDataChanged = () => {
    if (currentStep === 1) {
      const { firstName, surname, dateOfBirth, gender, ...currentStepData } = formData;
      const { firstName: prevFirstName, surname: prevSurname, dateOfBirth: prevDateOfBirth, gender: prevGender, ...previousStepData } = previousFormData;
      return JSON.stringify(currentStepData) !== JSON.stringify(previousStepData);
    }
    return JSON.stringify(formData) !== JSON.stringify(previousFormData);
  };

  const isStepValid = () => {
    // For prefilled data, consider them valid
    switch (currentStep) {
      case 1:
        return Boolean(formData.firstName && formData.surname && formData.dateOfBirth && 
               formData.gender && formData.maritalStatus && formData.district && 
               formData.village && formData.homeProvince);
      case 2:
        return Boolean(formData.employmentStatus && formData.monthlyIncome);
      case 3:
        return Boolean(formData.loanAmount && formData.loanPurpose && formData.repaymentPeriod);
      case 4:
        return Boolean(formData.referenceFullName && formData.referenceRelationship && 
               formData.referenceAddress && formData.referencePhone && 
               formData.referenceOccupation);
      case 5:
        return Boolean(formData.bankName && formData.accountNumber && formData.accountType && 
               formData.branchName && formData.accountHolderName);
      case 6:
        return !isSubmitDisabled; // This is controlled by DocumentUploadSection
      case 7:
        return true; // Terms page has its own validation
      default:
        return true;
    }
  };

  const handleSaveDraft = async () => {
    if (!session?.user) {
      toast.error("Please log in to save your application.");
      navigate("/login");
      return;
    }

    if (!hasDataChanged()) {
      console.log("No changes detected, skipping save");
      return draftId;
    }

    try {
      const transformedData = {
        user_id: session.user.id,
        status: 'draft' as LoanStatus,
        first_name: formData.firstName,
        surname: formData.surname,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        marital_status: formData.maritalStatus,
        district: formData.district,
        village: formData.village,
        home_province: formData.homeProvince,
        employment_status: formData.employmentStatus,
        employer_name: formData.employerName,
        occupation: formData.occupation,
        monthly_income: parseFloat(formData.monthlyIncome || '0'),
        employment_length: formData.employmentLength,
        work_address: formData.workAddress,
        work_phone: formData.workPhone,
        loan_amount: parseFloat(formData.loanAmount || '0'),
        loan_purpose: formData.loanPurpose,
        repayment_period: parseInt(formData.repaymentPeriod || '0'),
        existing_loans: formData.existingLoans,
        existing_loan_details: formData.existingLoanDetails,
        reference_full_name: formData.referenceFullName,
        reference_relationship: formData.referenceRelationship,
        reference_address: formData.referenceAddress,
        reference_phone: formData.referencePhone,
        reference_occupation: formData.referenceOccupation,
        bank_name: formData.bankName,
        account_number: formData.accountNumber,
        account_type: formData.accountType,
        branch_name: formData.branchName,
        account_holder_name: formData.accountHolderName,
      };

      let result;
      
      if (draftId) {
        result = await supabase
          .from("loan_applications")
          .update(transformedData)
          .eq('id', draftId)
          .select()
          .single();
      } else {
        result = await supabase
          .from("loan_applications")
          .insert(transformedData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setPreviousFormData(formData);
      
      if (!draftId && result.data?.id) {
        navigate(`/apply?draft=${result.data.id}`, { replace: true });
      }

      return result.data?.id;
    } catch (error: any) {
      console.error("Error saving progress:", error);
      toast.error(error.message || "Failed to save progress");
      return null;
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const handleSaveAndContinue = async () => {
    if (!isStepValid()) {
      toast.error("Please fill in all required fields before proceeding");
      return;
    }

    const savedId = await handleSaveDraft();
    
    if (currentStep === 5) {
      if (!draftId && !savedId) {
        toast.error("Unable to proceed - application ID not found");
        return;
      }
      setCurrentStep(6);
    } else if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="flex justify-between mt-8">
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          className="bg-white"
        >
          Previous
        </Button>
      )}
      <div className="flex-1" />
      {currentStep === 7 ? (
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary-600"
          disabled={isSubmitting || isSubmitDisabled}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      ) : (
        <Button 
          type="button"
          onClick={handleSaveAndContinue}
          className="bg-primary hover:bg-primary-600"
          disabled={isSubmitting || !isStepValid()}
        >
          {isSubmitting ? "Saving..." : "Next"}
        </Button>
      )}
    </div>
  );
};