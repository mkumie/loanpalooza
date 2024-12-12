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
        // Check if the user still exists in auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User not found:", userError);
          await supabase.auth.signOut();
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return;
        }

        setUserEmail(session.user.email);

        // First check if profile exists
        const { data: profileExists, error: checkError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .single();

        if (checkError || !profileExists) {
          // If profile doesn't exist, sign out the user
          await supabase.auth.signOut();
          toast.error("User profile not found. Please login again.");
          navigate("/login");
          return;
        }

        // Fetch admin status if profile exists
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          await supabase.auth.signOut();
          toast.error("Error loading profile. Please login again.");
          navigate("/login");
          return;
        }

        setIsAdmin(profile?.is_admin || false);
      } catch (error) {
        console.error("Error in session check:", error);
        await supabase.auth.signOut();
        toast.error("Session error. Please login again.");
        navigate("/login");
      }
    };

    checkSession();
  }, [session, navigate]);

  return { session, userEmail, isAdmin };
};