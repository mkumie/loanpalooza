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
import { FileEdit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const draftApplications = applications?.filter(app => app.status === 'draft') || [];

  const handleDeleteDraft = async (draftId: string) => {
    try {
      console.log("Attempting to delete draft:", draftId);
      
      // Start a transaction using RPC to ensure atomic operations
      const { data: result, error: rpcError } = await supabase
        .rpc('delete_draft_application', {
          draft_id: draftId,
          user_id_input: session?.user?.id || ''
        });

      if (rpcError) {
        console.error("Error in delete_draft_application RPC:", rpcError);
        throw rpcError;
      }

      console.log("Draft deletion result:", result);
      toast.success("Draft application deleted successfully");
      refetchApplications();
    } catch (error: any) {
      console.error("Error in handleDeleteDraft:", error);
      toast.error(error.message || "Failed to delete draft application");
    }
  };

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
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate(`/apply?draft=${draft.id}`)}
                    variant="outline"
                    className="gap-2"
                  >
                    <FileEdit className="h-4 w-4" />
                    Continue
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Draft Application</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this draft application? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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