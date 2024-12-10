import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoanApplicationData } from "@/contexts/LoanApplicationContext";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

export const useLoanSubmission = (formData: LoanApplicationData) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draft');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      toast.error("You must be logged in to submit an application");
      setIsSubmitting(false);
      return null;
    }

    try {
      // If this is a draft submission, delete related records first
      if (draftId) {
        // First delete any terms acceptances for this draft
        const { error: termsDeleteError } = await supabase
          .from("terms_acceptances")
          .delete()
          .eq('loan_application_id', draftId);

        if (termsDeleteError) {
          console.error("Error deleting terms acceptances:", termsDeleteError);
          throw termsDeleteError;
        }

        // Then delete the draft application
        const { error: deleteError } = await supabase
          .from("loan_applications")
          .delete()
          .eq('id', draftId)
          .eq('user_id', user.id)
          .eq('is_draft', true);

        if (deleteError) {
          console.error("Error deleting draft:", deleteError);
          throw deleteError;
        }
      }

      // Submit the new application
      const { data, error } = await supabase
        .from("loan_applications")
        .insert({
          user_id: user.id,
          is_draft: false,
          status: 'pending',
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
        })
        .select()
        .single();

      if (error) throw error;

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

  return {
    isSubmitting,
    setIsSubmitting,
    handleSubmit
  };
};