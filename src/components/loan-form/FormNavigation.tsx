import React from 'react';
import { Button } from "@/components/ui/button";
import { useLoanApplication } from '@/contexts/LoanApplicationContext';

export const FormNavigation = () => {
  const { currentStep, setCurrentStep, isSubmitting } = useLoanApplication();

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

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
      <Button 
        type="submit" 
        className="bg-primary hover:bg-primary-600"
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? "Submitting..." 
          : currentStep === 5 
            ? "Submit Application" 
            : "Next"
        }
      </Button>
    </div>
  );
};