import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoanApplication } from "@/types/loan";

interface DashboardStatsProps {
  isAdmin?: boolean;
}

export const DashboardStats = ({ isAdmin }: DashboardStatsProps) => {
  const { data: applications } = useQuery({
    queryKey: ["loan-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as LoanApplication[];
    },
  });

  // Calculate statistics
  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(app => app.status === "pending").length || 0;
  const approvedApplications = applications?.filter(app => app.status === "approved").length || 0;
  const rejectedApplications = applications?.filter(app => app.status === "rejected").length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <div className="p-6">
          <div className="text-2xl font-bold">{totalApplications}</div>
          <div className="text-muted-foreground">Total Applications</div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="text-2xl font-bold">{pendingApplications}</div>
          <div className="text-muted-foreground">Pending Review</div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="text-2xl font-bold">{approvedApplications}</div>
          <div className="text-muted-foreground">Approved</div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="text-2xl font-bold">{rejectedApplications}</div>
          <div className="text-muted-foreground">Rejected</div>
        </div>
      </Card>
    </div>
  );
};