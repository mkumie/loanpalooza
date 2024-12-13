import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RepaymentSchedule as RepaymentScheduleType } from "@/types/repayment";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface RepaymentScheduleProps {
  loanId: string;
}

export const RepaymentSchedule = ({ loanId }: RepaymentScheduleProps) => {
  const { data: schedules, isLoading } = useQuery({
    queryKey: ["repayment-schedules", loanId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repayment_schedules")
        .select("*")
        .eq("loan_application_id", loanId)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as RepaymentScheduleType[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Repayment Schedule</h3>
      <div className="grid gap-4">
        {schedules?.map((schedule) => (
          <Card key={schedule.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium">
                  {format(new Date(schedule.due_date), "PPP")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">K {schedule.amount.toFixed(2)}</p>
              </div>
              <Badge variant={getStatusVariant(schedule.status)}>
                {schedule.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};