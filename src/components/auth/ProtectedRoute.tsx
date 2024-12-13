import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session check error:", error);
        toast.error("Session expired. Please login again.");
        window.location.href = '/';
      }
      
      if (!currentSession) {
        toast.error("Please login to continue");
        window.location.href = '/';
      }
    };

    checkSession();
  }, []);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};