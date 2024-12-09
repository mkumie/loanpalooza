import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormHeader } from "./loan-form/FormHeader";
import { PersonalDetailsSection } from "./loan-form/PersonalDetailsSection";
import { EmploymentDetailsSection } from "./loan-form/EmploymentDetailsSection";
import { LoanDetailsSection } from "./loan-form/LoanDetailsSection";
import { ReferenceDetailsSection } from "./loan-form/ReferenceDetailsSection";

export const LoanApplicationForm = () => {
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-8">
      <FormHeader logoUrl="/lovable-uploads/58b13019-da3c-47e4-8458-ebac6ebf7cee.png" />
      
      <PersonalDetailsSection formData={formData} setFormData={setFormData} />
      <EmploymentDetailsSection formData={formData} setFormData={setFormData} />
      <LoanDetailsSection formData={formData} setFormData={setFormData} />
      <ReferenceDetailsSection formData={formData} setFormData={setFormData} />

      <div className="flex justify-end">
        <Button type="submit" className="bg-primary hover:bg-primary-600">
          Submit Application
        </Button>
      </div>
    </form>
  );
};