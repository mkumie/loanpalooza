import { useNavigate } from "react-router-dom";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, userEmail, isAdmin } = useSessionCheck();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }
      navigate("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
      // Still navigate to login page even if there's an error
      // as the session might be invalid anyway
      navigate("/login");
      toast.error("There was an issue signing out. Please try again.");
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader
          userEmail={userEmail}
          isAdmin={isAdmin}
          onSignOut={handleSignOut}
        />
        <DashboardContent isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default Dashboard;