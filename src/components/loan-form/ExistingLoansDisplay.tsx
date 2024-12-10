import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ExistingLoansDisplayProps {
  existingLoanDetails: string;
  setFormData: (data: any) => void;
}

export const ExistingLoansDisplay = ({ existingLoanDetails, setFormData }: ExistingLoansDisplayProps) => {
  const session = useSession();

  const { data: existingLoans } = useQuery({
    queryKey: ['existingLoans', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('loan_applications')
        .select('loan_amount, loan_purpose, created_at, reference_number, status')
        .eq('user_id', session.user.id)
        .eq('is_draft', false)
        .not('status', 'eq', 'rejected')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const formattedLoans = existingLoans?.map(loan => 
    `YES Finance - Reference: ${loan.reference_number}\n` +
    `Amount: K${loan.loan_amount.toLocaleString()}\n` +
    `Purpose: ${loan.loan_purpose}\n` +
    `Status: ${loan.status}\n`
  ).join('\n');

  return (
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
        value={formattedLoans + (existingLoanDetails ? '\n\nOther Loans:\n' + existingLoanDetails : '')}
        className="min-h-[120px]"
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            existingLoanDetails: e.target.value.replace(formattedLoans, '').replace('\n\nOther Loans:\n', ''),
          }))
        }
      />
    </div>
  );
};