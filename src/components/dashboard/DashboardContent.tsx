import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "./DashboardStats";
import { ApplicationsTable } from "./ApplicationsTable";
import { FileManagement } from "./FileManagement";
import { DownloadableFiles } from "@/components/home/DownloadableFiles";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoanApplication } from "@/types/loan";
import { useSession } from "@supabase/auth-helpers-react";

interface DashboardContentProps {
  isAdmin: boolean;
}

export const DashboardContent = ({ isAdmin }: DashboardContentProps) => {
  const session = useSession();

  const { data: applications, refetch: refetchApplications } = useQuery({
    queryKey: ["loan-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as LoanApplication[];
    },
    enabled: !!session,
  });

  return (
    <div className="mt-8">
      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          {isAdmin && <TabsTrigger value="files">File Management</TabsTrigger>}
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-8">
          <DashboardStats isAdmin={isAdmin} />
          <ApplicationsTable 
            applications={applications || []} 
            isAdmin={isAdmin}
            onUpdate={refetchApplications}
          />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="files">
            <FileManagement />
          </TabsContent>
        )}

        <TabsContent value="resources">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">Important Resources</h2>
            <p className="text-muted-foreground">
              Access important documents and resources for your loan application.
            </p>
            <DownloadableFiles />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};