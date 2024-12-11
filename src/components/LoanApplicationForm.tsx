import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClientFeedbackForm } from "./ClientFeedbackForm";
import { LoanFormContent } from "./loan-form/LoanFormContent";
import { LoanApplicationProvider } from "@/contexts/LoanApplicationContext";

export const LoanApplicationForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmitSuccess = () => {
    setShowFeedback(true);
  };

  if (showFeedback) {
    return (
      <div className="max-w-2xl mx-auto">
        <ClientFeedbackForm onClose={() => navigate("/dashboard")} />
      </div>
    );
  }

  return (
    <LoanApplicationProvider>
      <LoanFormContent />
    </LoanApplicationProvider>
  );
};