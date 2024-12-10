import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoanApplicationData } from "@/contexts/LoanApplicationContext";

export const useFormSubmission = (
  formData: LoanApplicationData,
  setIsSubmitting: (value: boolean) => void
) => {
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your loan application.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data: { id }, error } = await supabase.from("loan_applications").insert({
        ...formData,
        user_id: session.user.id,
        is_draft: false,
        status: 'pending'
      }).select('id').single();

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully!",
      });

      navigate(`/dashboard`);
      return id;
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return handleSubmit;
};