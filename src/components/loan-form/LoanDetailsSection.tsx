import { Input } from "@/components/ui/input";
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

const loanPurposes = [
  "Business Startup",
  "Business Expansion",
  "Equipment Purchase",
  "Working Capital",
  "Inventory Finance",
  "Debt Consolidation",
  "Property Purchase",
  "Vehicle Finance",
  "Education",
  "Personal Use",
];

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
        <div className="space-y-2">
          <Label htmlFor="loanAmount">Loan Amount Required (K)</Label>
          <Input
            id="loanAmount"
            type="number"
            value={formData.loanAmount}
            onChange={(e) =>
              setFormData({ ...formData, loanAmount: e.target.value })
            }
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
            value={formData.repaymentPeriod}
            onChange={(e) =>
              setFormData({ ...formData, repaymentPeriod: e.target.value })
            }
          />
          {formData.repaymentPeriod && (
            <p className="text-sm text-gray-500">
              Total of {Math.round(parseFloat(formData.repaymentPeriod) * 26)} fortnightly payments
            </p>
          )}
        </div>

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
            <div className="space-y-2">
              <Label htmlFor="existingLoanDetails">
                Please provide details of existing loans
              </Label>
              <Input
                id="existingLoanDetails"
                value={formData.existingLoanDetails}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    existingLoanDetails: e.target.value,
                  })
                }
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};