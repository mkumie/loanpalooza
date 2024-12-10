import React from "react";
import { Button } from "@/components/ui/button";
import { useLoanApplication } from "@/contexts/LoanApplicationContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { LoanStatus } from "@/types/loan";

interface FormNavigationProps {
  isSubmitDisabled?: boolean;
}

export const FormNavigation = ({ isSubmitDisabled }: FormNavigationProps) => {
  const { currentStep, setCurrentStep, isSubmitting, formData } = useLoanApplication();
  const session = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draft');
  const [previousFormData, setPreviousFormData] = React.useState(formData);

  const hasDataChanged = () => {
    return JSON.stringify(formData) !== JSON.stringify(previousFormData);
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

      // Update the previous form data after successful save
      setPreviousFormData(formData);
      
      toast.success("Progress saved successfully");
      
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
    const savedId = await handleSaveDraft();
    
    if (currentStep === 5) {
      // For bank details step, ensure we have an application ID before proceeding
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
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      ) : (
        <Button 
          type="button"
          onClick={handleSaveAndContinue}
          className="bg-primary hover:bg-primary-600"
          disabled={isSubmitting || isSubmitDisabled}
        >
          {isSubmitting ? "Saving..." : hasDataChanged() ? "Save and Continue" : "Next"}
        </Button>
      )}
    </div>
  );
};