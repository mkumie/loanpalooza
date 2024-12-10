import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LoanApplicationData } from "@/contexts/LoanApplicationContext";
import { LoanStatus } from "@/types/loan";

const transformFormDataToDbFormat = (formData: LoanApplicationData, userId: string, isDraft: boolean = true) => {
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
    account_holder_name: formData.accountHolderName
  };
};

const updateUserProfile = async (userId: string, formData: LoanApplicationData) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: formData.firstName,
      surname: formData.surname,
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
  }
};

export const useFormSubmission = (formData: LoanApplicationData, setIsSubmitting: (value: boolean) => void) => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      toast.error("You must be logged in to submit an application");
      setIsSubmitting(false);
      return null;
    }

    try {
      // Transform form data to match database schema
      const dbData = transformFormDataToDbFormat(formData, user.id, false);

      const { data, error } = await supabase
        .from("loan_applications")
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;

      // Update profile with personal details
      await updateUserProfile(user.id, formData);

      toast.success("Application submitted successfully!");
      navigate("/dashboard");
      return data.id;
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "Failed to submit application");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return handleSubmit;
};