import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoanAmountFieldsProps {
  loanAmount: string;
  repaymentPeriod: string;
  setFormData: (data: any) => void;
  validationErrors: Record<string, string>;
}

export const LoanAmountFields = ({ 
  loanAmount, 
  repaymentPeriod, 
  setFormData,
  validationErrors 
}: LoanAmountFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="loanAmount">Loan Amount Required (K)</Label>
        <Input
          id="loanAmount"
          type="number"
          value={loanAmount}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, loanAmount: e.target.value }))
          }
          error={!!validationErrors.loanAmount}
          errorMessage={validationErrors.loanAmount}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="repaymentPeriod">
          Repayment Period (Years)
          <span className="block text-sm text-gray-500">
            Payments will be made fortnightly
          </span>
        </Label>
        <Input
          id="repaymentPeriod"
          type="number"
          value={repaymentPeriod}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, repaymentPeriod: e.target.value }))
          }
          error={!!validationErrors.repaymentPeriod}
          errorMessage={validationErrors.repaymentPeriod}
        />
        {repaymentPeriod && (
          <p className="text-sm text-gray-500">
            Total of {Math.round(parseFloat(repaymentPeriod) * 26)} fortnightly payments
          </p>
        )}
      </div>
    </>
  );
};