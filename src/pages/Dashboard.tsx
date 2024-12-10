import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ApplicationsTable } from "@/components/dashboard/ApplicationsTable";
import { FileManagement } from "@/components/dashboard/FileManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { LoanApplication } from "@/types/loan";
import { useSession } from "@supabase/auth-helpers-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();
  const [userEmail, setUserEmail] = useState<string>();
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch loan applications
  const { data: applications, refetch: refetchApplications } = useQuery({
    queryKey: ["loan-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as LoanApplication[];
    },
    enabled: !!session, // Only run query if session exists
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!session) {
          navigate("/login");
          return;
        }

        setUserEmail(session.user.email);

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setIsAdmin(profile?.is_admin || false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile information",
        });
        navigate("/login");
      }
    };

    checkSession();
  }, [session, navigate, toast]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    }
  };

  if (!session) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader
          userEmail={userEmail}
          isAdmin={isAdmin}
          onSignOut={handleSignOut}
        />

        <div className="mt-8">
          <Tabs defaultValue="applications">
            <TabsList>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              {isAdmin && <TabsTrigger value="files">File Management</TabsTrigger>}
            </TabsList>

            <TabsContent value="applications" className="space-y-8">
              <DashboardStats isAdmin={isAdmin} />
              <ApplicationsTable 
                applications={applications || []} 
                isAdmin={isAdmin}
                onUpdate={refetchApplications}
              />
            </TabsContent>

            {isAdmin && (
              <TabsContent value="files">
                <FileManagement />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;