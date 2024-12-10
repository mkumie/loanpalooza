import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export const useSessionCheck = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [userEmail, setUserEmail] = useState<string>();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (!session) {
        navigate("/login");
        return;
      }

      try {
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
        navigate("/login");
      }
    };

    checkSession();
  }, [session, navigate]);

  return { session, userEmail, isAdmin };
};