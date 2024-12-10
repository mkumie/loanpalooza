import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface ExistingLoansDisplayProps {
  existingLoanDetails: string;
  setFormData: (data: any) => void;
}

export const ExistingLoansDisplay = ({ existingLoanDetails, setFormData }: ExistingLoansDisplayProps) => {
  const session = useSession();

  const { data: existingLoans, isLoading } = useQuery({
    queryKey: ['existingLoans', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('loan_applications')
        .select('loan_amount, loan_purpose, created_at, reference_number, status')
        .eq('user_id', session.user.id)
        .neq('status', 'draft')
        .neq('status', 'rejected')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const formattedLoans = existingLoans && existingLoans.length > 0
    ? existingLoans.map(loan => 
        `YES Finance - Reference: ${loan.reference_number}\n` +
        `Amount: K${loan.loan_amount.toLocaleString()}\n` +
        `Purpose: ${loan.loan_purpose}\n` +
        `Status: ${loan.status}\n`
      ).join('\n')
    : "No active YES Finance loans found.";

  return (
    <div className="space-y-4">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Your YES Finance loans are automatically listed below. Please add details of any other loans in the text area.
        </AlertDescription>
      </Alert>
      
      <div className="bg-gray-50 p-4 rounded-lg border">
        <Label htmlFor="existingLoanDetails">
          Your existing loans
        </Label>
        <Textarea
          id="existingLoanDetails"
          placeholder="For other loans, please include:
1. Lender name
2. Loan amount
3. Remaining balance
4. Monthly payments"
          value={formattedLoans + (existingLoanDetails ? '\n\nOther Loans:\n' + existingLoanDetails : '')}
          className="min-h-[120px] mt-2"
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              existingLoanDetails: e.target.value.replace(formattedLoans, '').replace('\n\nOther Loans:\n', ''),
            }))
          }
        />
      </div>
    </div>
  );
};