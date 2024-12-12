import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DashboardHeaderProps {
  userEmail: string | undefined;
  firstName?: string | null;
  surname?: string | null;
  isAdmin?: boolean;
  onSignOut: () => void;
}

export const DashboardHeader = ({ 
  userEmail, 
  firstName, 
  surname,
  isAdmin, 
  onSignOut 
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  
  const displayName = firstName && surname 
    ? `${firstName} ${surname}`
    : firstName || userEmail;

  // Query to check pending applications for the current user (skip for admins)
  const { data: pendingApplications } = useQuery({
    queryKey: ["pending-applications", isAdmin],
    queryFn: async () => {
      // Skip the check for admin users
      if (isAdmin) return [];

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];

      const { data, error } = await supabase
        .from("loan_applications")
        .select("id")
        .eq("status", "pending")
        .eq("user_id", userData.user.id);
      
      if (error) {
        console.error("Error fetching pending applications:", error);
        toast.error("Failed to check pending applications");
        return [];
      }
      return data;
    },
    enabled: !isAdmin, // Only run the query for non-admin users
  });

  const hasTwoPendingApplications = (pendingApplications?.length || 0) >= 2;

  const handleNewApplication = () => {
    // Admin users can always create new applications
    if (isAdmin) {
      navigate("/apply");
      return;
    }

    if (hasTwoPendingApplications) {
      toast.error("You can only have 2 pending applications at a time");
      return;
    }
    navigate("/apply");
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isAdmin ? "Admin Dashboard" : "My Applications"}
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {displayName}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          onClick={handleNewApplication}
          className="shadow-sm"
          disabled={!isAdmin && hasTwoPendingApplications}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Application
        </Button>
        <Button 
          variant="outline" 
          onClick={onSignOut}
          className="shadow-sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};