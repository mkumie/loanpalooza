import { RepaymentSchedule } from "./RepaymentSchedule";
import { RepaymentHistory } from "./RepaymentHistory";
import { Card } from "@/components/ui/card";

interface RepaymentSectionProps {
  loanId: string;
}

export const RepaymentSection = ({ loanId }: RepaymentSectionProps) => {
  return (
    <Card className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold">Loan Repayments</h2>
      <RepaymentSchedule loanId={loanId} />
      <RepaymentHistory loanId={loanId} />
    </Card>
  );
};