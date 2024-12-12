import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { LoanApplicationData } from "@/contexts/LoanApplicationContext";

export const useApplicationSubmission = (draftId: string | null) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const session = useSession();

  const checkPendingApplications = async (): Promise<boolean> => {
    if (!session?.user?.id) return false;

    const { data: pendingApps, error } = await supabase
      .from("loan_applications")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("status", "pending")
      .limit(2);

    if (error) {
      console.error("Error checking pending applications:", error);
      toast.error("Failed to verify application status");
      return false;
    }

    if (pendingApps.length >= 2) {
      toast.error("You can only have 2 pending applications at a time");
      return false;
    }

    return true;
  };

  const cleanupDraft = async () => {
    if (!draftId) return true;
    
    try {
      const { data: result, error: rpcError } = await supabase
        .rpc('delete_draft_application', {
          draft_id: draftId,
          user_id_input: session?.user?.id
        });

      if (rpcError) throw rpcError;
      return true;
    } catch (error) {
      console.error("Error cleaning up draft:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Check pending applications limit
      const canSubmit = await checkPendingApplications();
      if (!canSubmit) {
        setIsSubmitting(false);
        return false;
      }

      // Clean up draft
      const cleanupSuccess = await cleanupDraft();
      if (!cleanupSuccess) {
        toast.error("Failed to process application");
        return false;
      }

      toast.success("Application submitted successfully!");
      navigate("/dashboard?showFeedback=true");
      return true;
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Failed to submit application");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};