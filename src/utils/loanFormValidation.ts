import { LoanApplicationData } from '@/contexts/LoanApplicationContext';
import { toast } from '@/components/ui/use-toast';

const requiredFields: { [key: number]: (keyof LoanApplicationData)[] } = {
  1: ["firstName", "surname", "dateOfBirth", "gender", "maritalStatus", "district", "village", "homeProvince"],
  2: ["employmentStatus", "monthlyIncome"],
  3: ["loanAmount", "loanPurpose", "repaymentPeriod"],
  4: ["referenceFullName", "referenceRelationship", "referenceAddress", "referencePhone", "referenceOccupation"],
  5: ["bankName", "accountNumber", "accountType", "branchName", "accountHolderName"],
};

export const validateCurrentStep = (currentStep: number, formData: LoanApplicationData): boolean => {
  const currentFields = requiredFields[currentStep];
  const emptyFields = currentFields.filter(field => !formData[field]);

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