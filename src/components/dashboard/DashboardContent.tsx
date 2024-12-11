import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoanApplication } from "@/types/loan";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DraftApplicationsList } from "./draft-applications/DraftApplicationsList";
import { DashboardTabs } from "./tabs/DashboardTabs";

interface DashboardContentProps {
  isAdmin: boolean;
}

export const DashboardContent = ({ isAdmin }: DashboardContentProps) => {
  const session = useSession();

  const { data: applications, refetch: refetchApplications, isLoading } = useQuery({
    queryKey: ["loan-applications", session?.user?.id, isAdmin],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // For admin users, fetch all applications with pagination
      if (isAdmin) {
        const { data, error } = await supabase
          .from("loan_applications")
          .select("*")
          .order('created_at', { ascending: false })
          .limit(50); // Limit to 50 most recent applications for initial load
        
        if (error) {
          toast.error("Failed to fetch applications");
          throw error;
        }
        return data as LoanApplication[];
      }
      
      // For regular users, fetch only their applications
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error("Failed to fetch applications");
        throw error;
      }
      return data as LoanApplication[];
    },
    enabled: !!session,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes (renamed from cacheTime)
  });

  const draftApplications = applications?.filter(app => app.status === 'draft') || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <DraftApplicationsList 
        draftApplications={draftApplications}
        onDraftDeleted={refetchApplications}
      />
      <DashboardTabs 
        isAdmin={isAdmin}
        applications={applications}
        isLoading={isLoading}
        onUpdate={refetchApplications}
      />
    </div>
  );
};