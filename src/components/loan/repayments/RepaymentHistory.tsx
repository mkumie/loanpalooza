import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Repayment } from "@/types/repayment";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface RepaymentHistoryProps {
  loanId: string;
}

export const RepaymentHistory = ({ loanId }: RepaymentHistoryProps) => {
  const { data: repayments, isLoading } = useQuery({
    queryKey: ["repayments", loanId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repayments")
        .select("*")
        .eq("loan_application_id", loanId)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data as Repayment[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment History</h3>
      <div className="grid gap-4">
        {repayments?.map((repayment) => (
          <Card key={repayment.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Reference</p>
                <p className="font-medium">{repayment.reference_number}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(repayment.payment_date), "PPP")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">K {repayment.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{repayment.payment_method}</p>
              </div>
              <Badge
                variant={
                  repayment.status === "confirmed"
                    ? "success"
                    : repayment.status === "failed"
                    ? "destructive"
                    : "default"
                }
              >
                {repayment.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};