import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ApplicationsTable } from "@/components/dashboard/ApplicationsTable";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { ApplicationProgress } from "@/components/dashboard/ApplicationProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile",
        });
        return null;
      }
      return data;
    },
  });

  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch loan applications",
        });
        return [];
      }
      return data;
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!session) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const latestApplication = applications?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
        <DashboardHeader
          userEmail={session.user.email}
          isAdmin={profile?.is_admin}
          onSignOut={handleSignOut}
        />
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {latestApplication && (
                <ApplicationProgress
                  status={latestApplication.status}
                  createdAt={latestApplication.created_at}
                  updatedAt={latestApplication.updated_at}
                />
              )}
              <DashboardStats />
              <div className="md:col-span-2">
                <DashboardChart />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card className="p-6">
              <ApplicationsTable
                applications={applications || []}
                isAdmin={profile?.is_admin}
                onUpdate={refetch}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;