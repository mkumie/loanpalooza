import React from 'react';
import { Button } from "@/components/ui/button";
import { useLoanApplication } from '@/contexts/LoanApplicationContext';
import { validateAllSteps } from '@/utils/loanFormValidation';
import { useFormSubmission } from './useFormSubmission';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const transformFormDataToDbFormat = (formData: any, userId: string, isDraft: boolean = true) => {
  return {
    user_id: userId,
    is_draft: isDraft,
    status: isDraft ? 'draft' : 'pending',
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
    monthly_income: parseFloat(formData.monthlyIncome) || 0,
    employment_length: formData.employmentLength,
    work_address: formData.workAddress,
    work_phone: formData.workPhone,
    loan_amount: parseFloat(formData.loanAmount) || 0,
    loan_purpose: formData.loanPurpose,
    repayment_period: parseInt(formData.repaymentPeriod) || 0,
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
    account_holder_name: formData.accountHolderName
  };
};

export const FormNavigation = () => {
  const { currentStep, setCurrentStep, isSubmitting, formData } = useLoanApplication();
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();

  const handleSaveDraft = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your application.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const transformedData = transformFormDataToDbFormat(formData, session.user.id);
      
      const { error } = await supabase
        .from("loan_applications")
        .insert(transformedData);

      if (error) throw error;

      toast({
        title: "Draft Saved",
        description: "Your application has been saved as a draft.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "There was an error saving your draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const missingRequirements = currentStep === 6 ? validateAllSteps(formData) : [];
  const isSubmitDisabled = isSubmitting || (currentStep === 6 && missingRequirements.length > 0);

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
      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          Save Draft
        </Button>
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary-600"
          disabled={isSubmitDisabled}
        >
          {isSubmitting 
            ? "Submitting..." 
            : currentStep === 6
              ? "Submit Application" 
              : "Next"
          }
        </Button>
      </div>
    </div>
  );
};