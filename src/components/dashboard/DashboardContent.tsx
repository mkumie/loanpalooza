import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "./DashboardStats";
import { ApplicationsTable } from "./ApplicationsTable";
import { FileManagement } from "./FileManagement";
import { DownloadableFiles } from "@/components/home/DownloadableFiles";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoanApplication } from "@/types/loan";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { FileEdit } from "lucide-react";

interface DashboardContentProps {
  isAdmin: boolean;
}

export const DashboardContent = ({ isAdmin }: DashboardContentProps) => {
  const session = useSession();
  const navigate = useNavigate();

  const { data: applications, refetch: refetchApplications } = useQuery({
    queryKey: ["loan-applications"],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LoanApplication[];
    },
    enabled: !!session,
  });

  const draftApplications = applications?.filter(app => app.is_draft) || [];

  return (
    <div className="mt-8">
      {draftApplications.length > 0 && (
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Draft Applications</h2>
          <div className="space-y-4">
            {draftApplications.map((draft) => (
              <div key={draft.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Loan Amount: K {draft.loan_amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(draft.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  onClick={() => navigate(`/apply?draft=${draft.id}`)}
                  variant="outline"
                  className="gap-2"
                >
                  <FileEdit className="h-4 w-4" />
                  Continue Application
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

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