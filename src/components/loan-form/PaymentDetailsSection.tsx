import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { useLoanApplication } from "@/contexts/LoanApplicationContext";

interface PaymentDetailsSectionProps {
  formData: {
    bankName: string;
    accountNumber: string;
    accountType: string;
    branchName: string;
    accountHolderName: string;
  };
  setFormData: (data: any) => void;
  validationErrors: Record<string, string>;
}

export const PaymentDetailsSection = ({
  formData,
  setFormData,
  validationErrors,
}: PaymentDetailsSectionProps) => {
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draft');
  const { setCurrentStep, isSubmitting, setIsSubmitting } = useLoanApplication();

  const handleNextStep = async () => {
    // Validate required fields
    if (!formData.bankName || !formData.accountNumber || !formData.accountType || 
        !formData.branchName || !formData.accountHolderName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("loan_applications")
        .update({
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          account_type: formData.accountType,
          branch_name: formData.branchName,
          account_holder_name: formData.accountHolderName,
        })
        .eq('id', draftId);

      if (error) throw error;

      toast.success("Bank details saved successfully");
      setCurrentStep(6); // Proceed to document upload
    } catch (error: any) {
      console.error("Error saving bank details:", error);
      toast.error(error.message || "Failed to save bank details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-primary text-white">
        <CardTitle>Client's Bank Account Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            value={formData.bankName}
            onChange={(e) =>
              setFormData({ ...formData, bankName: e.target.value })
            }
            error={!!validationErrors.bankName}
            errorMessage={validationErrors.bankName}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            value={formData.accountNumber}
            onChange={(e) =>
              setFormData({ ...formData, accountNumber: e.target.value })
            }
            error={!!validationErrors.accountNumber}
            errorMessage={validationErrors.accountNumber}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type</Label>
          <Select
            value={formData.accountType}
            onValueChange={(value) =>
              setFormData({ ...formData, accountType: value })
            }
          >
            <SelectTrigger id="accountType" className={validationErrors.accountType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="checking">Checking Account</SelectItem>
              <SelectItem value="current">Current Account</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.accountType && (
            <p className="text-sm text-red-500">{validationErrors.accountType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="branchName">Branch Name</Label>
          <Input
            id="branchName"
            value={formData.branchName}
            onChange={(e) =>
              setFormData({ ...formData, branchName: e.target.value })
            }
            error={!!validationErrors.branchName}
            errorMessage={validationErrors.branchName}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountHolderName">Account Holder Name</Label>
          <Input
            id="accountHolderName"
            value={formData.accountHolderName}
            onChange={(e) =>
              setFormData({ ...formData, accountHolderName: e.target.value })
            }
            error={!!validationErrors.accountHolderName}
            errorMessage={validationErrors.accountHolderName}
          />
        </div>
      </CardContent>
    </Card>
  );
};