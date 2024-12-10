import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTermsAcceptance = (applicationId: string | null) => {
  const [termsAgreed, setTermsAgreed] = useState(false);

  const recordTermsAcceptance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to accept terms');
        return false;
      }

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
          user_id: user.id,
          loan_application_id: applicationId,
          terms_version_id: latestTerms.id,
          ip_address: window.location.hostname,
        });

      if (error) {
        console.error('Error recording terms acceptance:', error);
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error recording terms acceptance:', error);
      toast.error('Failed to record terms acceptance');
      return false;
    }
  };

  return {
    termsAgreed,
    setTermsAgreed,
    recordTermsAcceptance
  };
};