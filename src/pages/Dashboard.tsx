import { useNavigate } from "react-router-dom";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, userEmail, isAdmin } = useSessionCheck();

  const handleSignOut = async () => {
    try {
      if (!session) {
        navigate("/login");
        return;
      }

      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
      navigate("/login");
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6 pt-24">
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