import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DashboardChart = () => {
  const { data: chartData } = useQuery({
    queryKey: ["loanChartData"],
    queryFn: async () => {
      const { data: applications } = await supabase
        .from("loan_applications")
        .select("created_at, loan_amount")
        .order("created_at");

      if (!applications) return [];

      // Group applications by month
      const monthlyData = applications.reduce((acc: any, app) => {
        const month = new Date(app.created_at).toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
          acc[month] = {
            month,
            amount: 0,
            count: 0
          };
        }
        acc[month].amount += Number(app.loan_amount);
        acc[month].count += 1;
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
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="amount" name="Loan Amount" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="count" name="Application Count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};