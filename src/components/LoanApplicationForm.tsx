import { Navigation } from "./Navigation";
import { LoanApplicationProvider } from "@/contexts/LoanApplicationContext";
import { LoanFormContent } from "./loan-form/LoanFormContent";

const LoanApplicationFormContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <LoanFormContent />
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