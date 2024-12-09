import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormHeader } from "./loan-form/FormHeader";
import { PersonalDetailsSection } from "./loan-form/PersonalDetailsSection";
import { EmploymentDetailsSection } from "./loan-form/EmploymentDetailsSection";
import { LoanDetailsSection } from "./loan-form/LoanDetailsSection";
import { ReferenceDetailsSection } from "./loan-form/ReferenceDetailsSection";
import { PaymentDetailsSection } from "./loan-form/PaymentDetailsSection";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const LoanApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    surname: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    district: "",
    village: "",
    homeProvince: "",
    // Employment Details
    employmentStatus: "",
    employerName: "",
    occupation: "",
    monthlyIncome: "",
    employmentLength: "",
    workAddress: "",
    workPhone: "",
    // Loan Details
    loanAmount: "",
    loanPurpose: "",
    repaymentPeriod: "",
    existingLoans: false,
    existingLoanDetails: "",
    // Reference Details
    referenceFullName: "",
    referenceRelationship: "",
    referenceAddress: "",
    referencePhone: "",
    referenceOccupation: "",
    // Bank Account Details
    bankName: "",
    accountNumber: "",
    accountType: "",
    branchName: "",
    accountHolderName: "",
  });

  const validateCurrentStep = () => {
    const requiredFields: { [key: number]: string[] } = {
      1: ["firstName", "surname", "dateOfBirth", "gender", "maritalStatus", "district", "village", "homeProvince"],
      2: ["employmentStatus", "monthlyIncome"],
      3: ["loanAmount", "loanPurpose", "repaymentPeriod"],
      4: ["referenceFullName", "referenceRelationship", "referenceAddress", "referencePhone", "referenceOccupation"],
      5: ["bankName", "accountNumber", "accountType", "branchName", "accountHolderName"],
    };

    const currentFields = requiredFields[currentStep];
    const emptyFields = currentFields.filter(field => !formData[field as keyof typeof formData]);

    if (emptyFields.length > 0) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
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
      
      const { error } = await supabase.from("loan_applications").insert({
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
      });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully!",
      });

      // Reset form and redirect to dashboard
      setFormData({
        firstName: "",
        surname: "",
        dateOfBirth: "",
        gender: "",
        maritalStatus: "",
        district: "",
        village: "",
        homeProvince: "",
        employmentStatus: "",
        employerName: "",
        occupation: "",
        monthlyIncome: "",
        employmentLength: "",
        workAddress: "",
        workPhone: "",
        loanAmount: "",
        loanPurpose: "",
        repaymentPeriod: "",
        existingLoans: false,
        existingLoanDetails: "",
        referenceFullName: "",
        referenceRelationship: "",
        referenceAddress: "",
        referencePhone: "",
        referenceOccupation: "",
        bankName: "",
        accountNumber: "",
        accountType: "",
        branchName: "",
        accountHolderName: "",
      });
      
      navigate("/dashboard");
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

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-8">
      <FormHeader logoUrl="/lovable-uploads/58b13019-da3c-47e4-8458-ebac6ebf7cee.png" />
      
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              {step < 5 && (
                <div
                  className={`w-12 h-1 ${
                    step < currentStep ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {currentStep === 1 && (
          <PersonalDetailsSection formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 2 && (
          <EmploymentDetailsSection formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 3 && (
          <LoanDetailsSection formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 4 && (
          <ReferenceDetailsSection formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 5 && (
          <PaymentDetailsSection formData={formData} setFormData={setFormData} />
        )}
      </div>

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
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary-600"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? "Submitting..." 
            : currentStep === 5 
              ? "Submit Application" 
              : "Next"
          }
        </Button>
      </div>
    </form>
  );
};