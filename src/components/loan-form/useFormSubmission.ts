import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoanApplicationData } from "@/contexts/LoanApplicationContext";

type LoanStatus = "pending" | "approved" | "rejected" | "draft";

const transformFormDataToDbFormat = (formData: LoanApplicationData, userId: string, isDraft: boolean = false) => {
  const status: LoanStatus = isDraft ? "draft" : "pending";
  
  return {
    user_id: userId,
    is_draft: isDraft,
    status,
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
    monthly_income: parseFloat(formData.monthlyIncome),
    employment_length: formData.employmentLength,
    work_address: formData.workAddress,
    work_phone: formData.workPhone,
    loan_amount: parseFloat(formData.loanAmount),
    loan_purpose: formData.loanPurpose,
    repayment_period: parseInt(formData.repaymentPeriod),
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

export const useFormSubmission = (
  formData: LoanApplicationData,
  setIsSubmitting: (value: boolean) => void
) => {
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your loan application.",
        variant: "destructive",
      });
      navigate("/login");
      return null;
    }

    try {
      setIsSubmitting(true);
      
      const transformedData = transformFormDataToDbFormat(formData, session.user.id, false);
      
      const { data: { id }, error } = await supabase
        .from("loan_applications")
        .insert(transformedData)
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully!",
      });

      navigate(`/dashboard`);
      return id;
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return handleSubmit;
};