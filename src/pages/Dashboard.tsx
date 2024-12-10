import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ApplicationsTable } from "@/components/dashboard/ApplicationsTable";
import { FileManagement } from "@/components/dashboard/FileManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string>();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        setUserEmail(user.email);

        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        setIsAdmin(profile?.is_admin || false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile information",
        });
      }
    };

    getProfile();
  }, [navigate, toast]);

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
              <ApplicationsTable isAdmin={isAdmin} />
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