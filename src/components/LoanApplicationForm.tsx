import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientFeedbackForm } from "./ClientFeedbackForm";
import { LoanFormContent } from "./loan-form/LoanFormContent";
import { LoanApplicationProvider } from "@/contexts/LoanApplicationContext";
import { Card, CardContent } from "@/components/ui/card";

export const LoanApplicationForm = () => {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmitSuccess = () => {
    setShowFeedback(true);
  };

  const handleFeedbackClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {showFeedback ? (
          <Card>
            <CardContent>
              <ClientFeedbackForm onClose={handleFeedbackClose} />
            </CardContent>
          </Card>
        ) : (
          <LoanApplicationProvider>
            <LoanFormContent onSubmitSuccess={handleSubmitSuccess} />
          </LoanApplicationProvider>
        )}
      </div>
    </div>
  );
};