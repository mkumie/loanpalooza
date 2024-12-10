import { useLoanApplication } from "@/contexts/LoanApplicationContext";

export const ProgressStepper = () => {
  const { currentStep } = useLoanApplication();

  const steps = [
    "Personal Details",
    "Employment",
    "Loan Details",
    "References",
    "Bank Account",
    "Documents"
  ];

  return (
    <div className="relative">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 text-center ${
              index === steps.length - 1 ? "" : "border-r"
            } ${currentStep === index + 1 ? "text-primary font-medium" : "text-gray-500"}`}
          >
            <div className="relative">
              <div
                className={`w-6 h-6 mx-auto rounded-full mb-2 flex items-center justify-center ${
                  currentStep === index + 1
                    ? "bg-primary text-white"
                    : currentStep > index + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {currentStep > index + 1 ? "✓" : index + 1}
              </div>
              <span className="text-sm">{step}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
    </div>
  );
};