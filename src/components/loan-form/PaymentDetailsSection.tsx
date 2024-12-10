import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BankDetailsFields } from "./payment-details/BankDetailsFields";

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
  return (
    <Card>
      <CardHeader className="bg-primary text-white">
        <CardTitle>Client's Bank Account Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <BankDetailsFields
          formData={formData}
          setFormData={setFormData}
          validationErrors={validationErrors}
        />
      </CardContent>
    </Card>
  );
};