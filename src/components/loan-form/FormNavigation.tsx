import React from 'react';
import { Button } from "@/components/ui/button";
import { useLoanApplication } from '@/contexts/LoanApplicationContext';
import { validateAllSteps } from '@/utils/loanFormValidation';
import { useFormSubmission } from './useFormSubmission';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

export const FormNavigation = () => {
  const { currentStep, setCurrentStep, isSubmitting, formData } = useLoanApplication();
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const handleSaveDraft = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your application.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const { error } = await supabase.from("loan_applications").insert({
        ...formData,
        user_id: session.user.id,
        is_draft: true,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: "Draft Saved",
        description: "Your application has been saved as a draft. You can continue later from your dashboard.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "There was an error saving your draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const missingRequirements = currentStep === 6 ? validateAllSteps(formData) : [];
  const isSubmitDisabled = isSubmitting || (currentStep === 6 && missingRequirements.length > 0);

  return (
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
      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          Save Draft
        </Button>
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary-600"
          disabled={isSubmitDisabled}
        >
          {isSubmitting 
            ? "Submitting..." 
            : currentStep === 6
              ? "Submit Application" 
              : "Next"
          }
        </Button>
      </div>
    </div>
  );
};