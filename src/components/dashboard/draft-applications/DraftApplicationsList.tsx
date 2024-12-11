import { LoanApplication } from "@/types/loan";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileEdit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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

interface DraftApplicationsListProps {
  draftApplications: LoanApplication[];
  onDraftDeleted: () => void;
}

export const DraftApplicationsList = ({ 
  draftApplications,
  onDraftDeleted
}: DraftApplicationsListProps) => {
  const navigate = useNavigate();

  const handleDeleteDraft = async (draftId: string) => {
    try {
      const { data: result, error: rpcError } = await supabase
        .rpc('delete_draft_application', {
          draft_id: draftId,
          user_id_input: (await supabase.auth.getSession()).data.session?.user.id
        });

      if (rpcError) {
        console.error("Error in delete_draft_application RPC:", rpcError);
        throw rpcError;
      }

      toast.success("Draft application deleted successfully");
      onDraftDeleted();
    } catch (error: any) {
      console.error("Error in handleDeleteDraft:", error);
      toast.error(error.message || "Failed to delete draft application");
    }
  };

  if (draftApplications.length === 0) return null;

  return (
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
  );
};