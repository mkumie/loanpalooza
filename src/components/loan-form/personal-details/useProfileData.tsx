import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLoanApplication } from "@/contexts/LoanApplicationContext";

export const useProfileData = () => {
  const { formData, setFormData } = useLoanApplication();
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch profile data",
            variant: "destructive",
          });
          return;
        }

        if (profile) {
          setFormData(prev => ({
            ...prev,
            firstName: profile.first_name || prev.firstName,
            surname: profile.surname || prev.surname,
            dateOfBirth: profile.date_of_birth || prev.dateOfBirth,
            gender: profile.gender || prev.gender,
          }));
        }
      }
    };

    fetchProfileData();
  }, [session, setFormData, toast]);

  return { formData, setFormData };
};