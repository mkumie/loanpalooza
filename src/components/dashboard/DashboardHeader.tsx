import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  userEmail: string | undefined;
  isAdmin?: boolean;
  onSignOut: () => void;
}

export const DashboardHeader = ({ userEmail, isAdmin, onSignOut }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">
          {isAdmin ? "Admin Dashboard" : "My Applications"}
        </h1>
        <p className="text-gray-600">
          Welcome back, {userEmail}
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/apply")}>New Application</Button>
        <Button variant="outline" onClick={onSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};