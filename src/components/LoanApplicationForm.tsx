import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormHeader } from "./loan-form/FormHeader";
import { PersonalDetailsSection } from "./loan-form/PersonalDetailsSection";
import { EmploymentDetailsSection } from "./loan-form/EmploymentDetailsSection";
import { LoanDetailsSection } from "./loan-form/LoanDetailsSection";
import { ReferenceDetailsSection } from "./loan-form/ReferenceDetailsSection";
import { PaymentDetailsSection } from "./loan-form/PaymentDetailsSection";

export const LoanApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log(formData);
      // Handle final form submission
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
        <Button type="submit" className="bg-primary hover:bg-primary-600">
          {currentStep === 5 ? "Submit Application" : "Next"}
        </Button>
      </div>
    </form>
  );
};