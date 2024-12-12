import { useNavigate } from "react-router-dom";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, userEmail, isAdmin } = useSessionCheck();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      // First check if profile exists
      const { data: profileExists, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", session.user.id)
        .single();

      if (checkError || !profileExists) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ 
            id: session.user.id,
            first_name: null,
            surname: null
          }]);

        if (insertError) throw insertError;
        return { first_name: null, surname: null };
      }

      // Fetch profile data
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, surname")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

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
          firstName={profile?.first_name}
          surname={profile?.surname}
          isAdmin={isAdmin}
          onSignOut={handleSignOut}
        />
        <DashboardContent isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default Dashboard;