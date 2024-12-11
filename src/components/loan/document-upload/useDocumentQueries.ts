import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDocumentQueries = (applicationId: string) => {
  // Query to get the most recent application ID
  const { data: recentApplicationId } = useQuery({
    queryKey: ["recentApplication"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("loan_applications")
        .select("id")
        .eq("user_id", user.id)
        .neq("status", "draft")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;
      return data.id;
    },
    enabled: !applicationId // Only run if we don't have a current application ID
  });

  // Query for current application documents
  const { data: uploadedDocuments, refetch: refetchDocuments } = useQuery({
    queryKey: ["loanDocuments", applicationId],
    queryFn: async () => {
      if (!applicationId?.trim()) {
        return [];
      }

      const { data, error } = await supabase
        .from("loan_documents")
        .select("*")
        .eq("loan_application_id", applicationId);

      if (error) throw error;
      return data;
    },
    enabled: Boolean(applicationId?.trim()),
  });

  // Query for previous application documents
  const { data: previousDocuments } = useQuery({
    queryKey: ["previousDocuments", recentApplicationId],
    queryFn: async () => {
      if (!recentApplicationId) return [];

      const { data, error } = await supabase
        .from("loan_documents")
        .select("*")
        .eq("loan_application_id", recentApplicationId);

      if (error) throw error;
      return data;
    },
    enabled: Boolean(recentApplicationId),
  });

  return {
    uploadedDocuments,
    previousDocuments,
    refetchDocuments,
    recentApplicationId
  };
};