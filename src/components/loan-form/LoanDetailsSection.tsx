import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

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
  "Personal Loan",
  "School Fee Loan",
  "Refinancing Loan"
];

export const LoanDetailsSection = ({
  formData,
  setFormData,
}: LoanDetailsSectionProps) => {
  const session = useSession();

  const { data: existingLoans } = useQuery({
    queryKey: ['existingLoans', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('loan_applications')
        .select('loan_amount, loan_purpose, created_at, reference_number, status')
        .eq('user_id', session.user.id)
        .not('status', 'eq', 'rejected')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id && formData.existingLoans,
  });

  useEffect(() => {
    if (formData.existingLoans && existingLoans?.length) {
      const existingLoansText = existingLoans
        .map(loan => 
          `YES Finance - Reference: ${loan.reference_number}\n` +
          `Amount: K${loan.loan_amount.toLocaleString()}\n` +
          `Purpose: ${loan.purpose}\n` +
          `Status: ${loan.status}\n`
        )
        .join('\n');

      setFormData(prev => ({
        ...prev,
        existingLoanDetails: existingLoansText + 
          (prev.existingLoanDetails ? '\n\nOther Loans:\n' + prev.existingLoanDetails : '')
      }));
    }
  }, [existingLoans, formData.existingLoans]);

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
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border">
              <Label htmlFor="existingLoanDetails">
                Your existing loans
                <span className="block text-sm text-gray-500">
                  Your YES Finance loans are automatically listed above. Please add details of any other loans below:
                </span>
              </Label>
              <Textarea
                id="existingLoanDetails"
                placeholder="For other loans, please include:
1. Lender name
2. Loan amount
3. Remaining balance
4. Monthly payments"
                value={formData.existingLoanDetails}
                className="min-h-[120px]"
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