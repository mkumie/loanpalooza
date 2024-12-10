import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTermsAcceptance = (applicationId: string | null) => {
  const [termsAgreed, setTermsAgreed] = useState(false);

  const recordTermsAcceptance = async () => {
    try {
      const { data: latestTerms } = await supabase
        .from('terms_versions')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!latestTerms) {
        throw new Error('No terms version found');
      }

      const { error } = await supabase
        .from('terms_acceptances')
        .insert({
          loan_application_id: applicationId,
          terms_version_id: latestTerms.id,
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error recording terms acceptance:', error);
      toast.error('Failed to record terms acceptance');
      return false;
    }
    return true;
  };

  return {
    termsAgreed,
    setTermsAgreed,
    recordTermsAcceptance
  };
};