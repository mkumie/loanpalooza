import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoanAmountFields } from "./LoanAmountFields";
import { ExistingLoansDisplay } from "./ExistingLoansDisplay";

const loanPurposes = [
  "Personal Loan",
  "School Fee Loan",
  "Refinancing Loan"
];

interface LoanDetailsSectionProps {
  formData: {
    loanAmount: string;
    loanPurpose: string;
    repaymentPeriod: string;
    existingLoans: boolean;
    existingLoanDetails: string;
  };
  setFormData: (data: any) => void;
}

export const LoanDetailsSection = ({
  formData,
  setFormData,
}: LoanDetailsSectionProps) => {
  return (
    <Card>
      <CardHeader className="bg-primary text-white">
        <CardTitle>Loan Amount Request</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <LoanAmountFields
          loanAmount={formData.loanAmount}
          repaymentPeriod={formData.repaymentPeriod}
          setFormData={setFormData}
        />

        <div className="col-span-2 space-y-2">
          <Label htmlFor="loanPurpose">Purpose of Loan</Label>
          <Select
            value={formData.loanPurpose}
            onValueChange={(value) =>
              setFormData({ ...formData, loanPurpose: value })
            }
          >
            <SelectTrigger id="loanPurpose">
              <SelectValue placeholder="Select the purpose of your loan" />
            </SelectTrigger>
            <SelectContent>
              {loanPurposes.map((purpose) => (
                <SelectItem key={purpose} value={purpose}>
                  {purpose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="existingLoans"
              checked={formData.existingLoans}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, existingLoans: checked as boolean })
              }
            />
            <Label htmlFor="existingLoans">
              Do you have any existing loans?
            </Label>
          </div>

          {formData.existingLoans && (
            <ExistingLoansDisplay
              existingLoanDetails={formData.existingLoanDetails}
              setFormData={setFormData}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};