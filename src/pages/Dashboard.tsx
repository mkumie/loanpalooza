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
      if (!session) {
        // If there's no session, just redirect to login
        navigate("/login");
        return;
      }

      // Attempt to sign out
      await supabase.auth.signOut();
      
      // Always navigate to login after attempting sign out
      navigate("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
      // Navigate to login even if there's an error
      navigate("/login");
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