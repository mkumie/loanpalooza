import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
              is_admin: false // Default to non-admin
            }]);

          if (insertError) throw insertError;
          setIsAdmin(false);
        } else {
          // Fetch admin status if profile exists
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();

          if (error) throw error;
          setIsAdmin(profile?.is_admin || false);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error loading profile");
        navigate("/login");
      }
    };

    checkSession();
  }, [session, navigate]);

  return { session, userEmail, isAdmin };
};