import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const DashboardChart = () => {
  const { data: chartData } = useQuery({
    queryKey: ["loanChartData"],
    queryFn: async () => {
      const { data: applications } = await supabase
        .from("loan_applications")
        .select("created_at, loan_amount, status")
        .order("created_at");

      if (!applications) return [];

      // Group applications by month
      const monthlyData = applications.reduce((acc: any, app) => {
        const month = new Date(app.created_at).toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
          acc[month] = {
            month,
            amount: 0,
            count: 0,
            approved: 0,
            rejected: 0,
            pending: 0
          };
        }
        acc[month].amount += Number(app.loan_amount);
        acc[month].count += 1;
        acc[month][app.status] += 1;
        return acc;
      }, {});

      return Object.values(monthlyData);
    }
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Loan Applications Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip 
                formatter={(value: any) => {
                  if (typeof value === 'number') {
                    return value.toLocaleString();
                  }
                  return value;
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" name="Loan Amount ($)" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="approved" stackId="status" name="Approved" fill="#4ade80" />
              <Bar yAxisId="right" dataKey="pending" stackId="status" name="Pending" fill="#fbbf24" />
              <Bar yAxisId="right" dataKey="rejected" stackId="status" name="Rejected" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};