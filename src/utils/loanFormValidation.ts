import { LoanApplicationData } from '@/contexts/LoanApplicationContext';
import { toast } from '@/components/ui/use-toast';
import { DocumentUploadStatus } from '@/types/documents';

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

export const validateAllSteps = (formData: LoanApplicationData): string[] => {
  const missingRequirements: string[] = [];

  // Check all form fields
  Object.entries(requiredFields).forEach(([step, fields]) => {
    const emptyFields = fields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
      missingRequirements.push(`Step ${step}: Missing ${emptyFields.length} required field(s)`);
    }
  });

  return missingRequirements;
};

export const showValidationErrors = (missingRequirements: string[]) => {
  if (missingRequirements.length > 0) {
    toast({
      title: "Missing Requirements",
      description: (
        <div className="space-y-2">
          <p>Please complete the following before submitting:</p>
          <ul className="list-disc pl-4">
            {missingRequirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      ),
      variant: "destructive",
    });
  }
};