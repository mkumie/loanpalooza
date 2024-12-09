import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";

interface DashboardHeaderProps {
  userEmail: string | undefined;
  isAdmin?: boolean;
  onSignOut: () => void;
}

export const DashboardHeader = ({ userEmail, isAdmin, onSignOut }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isAdmin ? "Admin Dashboard" : "My Applications"}
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {userEmail}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          onClick={() => navigate("/apply")}
          className="shadow-sm"
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