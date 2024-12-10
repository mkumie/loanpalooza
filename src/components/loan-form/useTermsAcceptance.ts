import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTermsAcceptance = (draftId: string | null) => {
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

  const recordTermsAcceptance = async () => {
    try {
      // Get the latest terms version
      const { data: latestTerms, error: termsError } = await supabase
        .from("terms_versions")
        .select("id")
        .order('effective_date', { ascending: false })
        .limit(1)
        .single();

      if (termsError) {
        console.error("Error fetching terms version:", termsError);
        toast.error("Failed to record terms acceptance");
        return false;
      }

      // If we have a draft ID, check if terms were already accepted
      if (draftId) {
        const { data: existingAcceptance, error: existingError } = await supabase
          .from("terms_acceptances")
          .select("id")
          .eq("loan_application_id", draftId)
          .maybeSingle();

        if (existingError && existingError.code !== 'PGRST116') {
          console.error("Error checking existing terms acceptance:", existingError);
          toast.error("Failed to verify terms acceptance");
          return false;
        }

        // If terms were already accepted for this draft, no need to record again
        if (existingAcceptance) {
          return true;
        }
      }

      return true;
    } catch (error) {
      console.error("Error in recordTermsAcceptance:", error);
      toast.error("Failed to record terms acceptance");
      return false;
    }
  };

  return {
    termsAgreed,
    setTermsAgreed,
    recordTermsAcceptance,
  };
};