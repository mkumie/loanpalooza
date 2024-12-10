import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LoanApplicationData } from "@/contexts/LoanApplicationContext";

export const useFormSubmission = (formData: LoanApplicationData, setIsSubmitting: (value: boolean) => void) => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      toast.error("You must be logged in to submit an application");
      setIsSubmitting(false);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("loan_applications")
        .insert({
          ...formData,
          user_id: user.id,
          is_draft: false,
          status: "pending" as const,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Application submitted successfully!");
      navigate("/dashboard");
      return data.id;
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "Failed to submit application");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return handleSubmit;
};