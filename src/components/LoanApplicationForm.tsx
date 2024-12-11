import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClientFeedbackForm } from "./ClientFeedbackForm";
import { LoanFormContent } from "./loan-form/LoanFormContent";
import { LoanApplicationProvider } from "@/contexts/LoanApplicationContext";

export const LoanApplicationForm = () => {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmitSuccess = () => {
    setShowFeedback(true);
  };

  if (showFeedback) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <ClientFeedbackForm onClose={() => navigate("/dashboard")} />
        </div>
      </div>
    );
  }

  return (
    <LoanApplicationProvider>
      <LoanFormContent onSubmitSuccess={handleSubmitSuccess} />
    </LoanApplicationProvider>
  );
};