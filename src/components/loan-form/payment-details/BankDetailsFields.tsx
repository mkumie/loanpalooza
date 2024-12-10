import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BankDetailsFieldsProps {
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

export const BankDetailsFields = ({
  formData,
  setFormData,
  validationErrors,
}: BankDetailsFieldsProps) => {
  return (
    <>
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
    </>
  );
};