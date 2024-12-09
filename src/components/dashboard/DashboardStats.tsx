import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

export const DashboardStats = () => {
  const { data: stats } = useQuery({
    queryKey: ["loanStats"],
    queryFn: async () => {
      const { data: applications } = await supabase
        .from("loan_applications")
        .select("status, loan_amount");

      if (!applications) return null;

      const totalApplications = applications.length;
      const totalAmount = applications.reduce((sum, app) => sum + Number(app.loan_amount), 0);
      const approved = applications.filter(app => app.status === "approved").length;
      const pending = applications.filter(app => app.status === "pending").length;
      const rejected = applications.filter(app => app.status === "rejected").length;

      return {
        totalApplications,
        totalAmount,
        approved,
        pending,
        rejected
      };
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
          <p className="text-xs text-muted-foreground">All time applications</p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats?.totalAmount?.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground">Total loan value</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.approved || 0}</div>
          <p className="text-xs text-muted-foreground">Approved applications</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.rejected || 0}</div>
          <p className="text-xs text-muted-foreground">Rejected applications</p>
        </CardContent>
      </Card>
    </div>
  );
};