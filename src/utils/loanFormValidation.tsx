import { toast } from "sonner";

export const validateCurrentStep = (step: number, formData: any) => {
  const errors: Record<string, string> = {};

  switch (step) {
    case 1: // Personal Details
      if (!formData.firstName?.trim()) {
        errors.firstName = "First name is required";
      }
      if (!formData.surname?.trim()) {
        errors.surname = "Surname is required";
      }
      if (!formData.dateOfBirth) {
        errors.dateOfBirth = "Date of birth is required";
      }
      if (!formData.gender) {
        errors.gender = "Gender is required";
      }
      if (!formData.maritalStatus) {
        errors.maritalStatus = "Marital status is required";
      }
      if (!formData.district?.trim()) {
        errors.district = "District is required";
      }
      if (!formData.village?.trim()) {
        errors.village = "Village is required";
      }
      if (!formData.homeProvince?.trim()) {
        errors.homeProvince = "Home province is required";
      }
      break;

    case 2: // Employment Details
      if (!formData.employmentStatus) {
        errors.employmentStatus = "Employment status is required";
      }
      if (!formData.monthlyIncome) {
        errors.monthlyIncome = "Monthly income is required";
      }
      break;

    case 3: // Loan Details
      if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0) {
        errors.loanAmount = "Valid loan amount is required";
      }
      if (!formData.loanPurpose) {
        errors.loanPurpose = "Loan purpose is required";
      }
      if (!formData.repaymentPeriod || parseInt(formData.repaymentPeriod) <= 0) {
        errors.repaymentPeriod = "Valid repayment period is required";
      }
      break;

    case 4: // Reference Details
      if (!formData.referenceFullName?.trim()) {
        errors.referenceFullName = "Reference full name is required";
      }
      if (!formData.referenceRelationship?.trim()) {
        errors.referenceRelationship = "Reference relationship is required";
      }
      if (!formData.referenceAddress?.trim()) {
        errors.referenceAddress = "Reference address is required";
      }
      if (!formData.referencePhone?.trim()) {
        errors.referencePhone = "Reference phone number is required";
      }
      if (!formData.referenceOccupation?.trim()) {
        errors.referenceOccupation = "Reference occupation is required";
      }
      break;

    case 5: // Payment Details
      if (!formData.bankName?.trim()) {
        errors.bankName = "Bank name is required";
      }
      if (!formData.accountNumber?.trim()) {
        errors.accountNumber = "Account number is required";
      }
      if (!formData.accountType?.trim()) {
        errors.accountType = "Account type is required";
      }
      if (!formData.branchName?.trim()) {
        errors.branchName = "Branch name is required";
      }
      if (!formData.accountHolderName?.trim()) {
        errors.accountHolderName = "Account holder name is required";
      }
      break;
  }

  return errors;
};

export const validateAllSteps = (formData: any) => {
  const allErrors = [];
  for (let step = 1; step <= 5; step++) {
    const stepErrors = validateCurrentStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      allErrors.push(`Step ${step} has missing or invalid information`);
    }
  }
  return allErrors;
};

export const showValidationErrors = (errors: string[]) => {
  errors.forEach((error) => {
    toast.error(error);
  });
};