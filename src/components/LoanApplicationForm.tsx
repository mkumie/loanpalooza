import React from "react";
import { FormHeader } from "./loan-form/FormHeader";
import { PersonalDetailsSection } from "./loan-form/PersonalDetailsSection";
import { EmploymentDetailsSection } from "./loan-form/EmploymentDetailsSection";
import { LoanDetailsSection } from "./loan-form/LoanDetailsSection";
import { ReferenceDetailsSection } from "./loan-form/ReferenceDetailsSection";
import { PaymentDetailsSection } from "./loan-form/PaymentDetailsSection";
import { ProgressStepper } from "./loan-form/ProgressStepper";
import { FormNavigation } from "./loan-form/FormNavigation";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";
import { LoanApplicationProvider, useLoanApplication } from "@/contexts/LoanApplicationContext";
import { validateCurrentStep, validateAllSteps, showValidationErrors } from "@/utils/loanFormValidation";
import { DocumentUpload } from "./loan/DocumentUpload";

const LoanApplicationFormContent = () => {
  const { formData, setFormData, currentStep, setCurrentStep, setIsSubmitting } = useLoanApplication();
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep(currentStep, formData)) {
      return;
    }

    // If we're not on the final documents step, just move to next step
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Validate all steps before final submission
    const missingRequirements = validateAllSteps(formData);
    if (missingRequirements.length > 0) {
      showValidationErrors(missingRequirements);
      return;
    }

    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your loan application.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data: { id }, error } = await supabase.from("loan_applications").insert({
        user_id: session.user.id,
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
        account_holder_name: formData.accountHolderName,
      }).select('id').single();

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully!",
      });

      navigate(`/dashboard`);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <form onSubmit={handleSubmit} className="container mx-auto px-4 py-8 mt-16 max-w-5xl space-y-8">
        <FormHeader logoUrl="/lovable-uploads/58b13019-da3c-47e4-8458-ebac6ebf7cee.png" />
        <ProgressStepper />

        <div className="space-y-8">
          {currentStep === 1 && <PersonalDetailsSection />}
          {currentStep === 2 && <EmploymentDetailsSection formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && <LoanDetailsSection formData={formData} setFormData={setFormData} />}
          {currentStep === 4 && <ReferenceDetailsSection formData={formData} setFormData={setFormData} />}
          {currentStep === 5 && <PaymentDetailsSection formData={formData} setFormData={setFormData} />}
          {currentStep === 6 && <DocumentUpload applicationId={null} />}
        </div>

        <FormNavigation />
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