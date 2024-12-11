import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClientFeedbackForm } from "./ClientFeedbackForm";

export const LoanApplicationForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmitSuccess = () => {
    setShowFeedback(true);
  };

  const submitLoanApplication = async () => {
    // This is a placeholder for the actual loan application submission
    // The real implementation should be in a separate hook or utility
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitLoanApplication();
      handleSubmitSuccess();
    } catch (error) {
      console.error("Error submitting loan application:", error);
      toast.error("Failed to submit loan application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showFeedback) {
    return (
      <div className="max-w-2xl mx-auto">
        <ClientFeedbackForm onClose={() => navigate("/dashboard")} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Loan application fields go here */}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
};
