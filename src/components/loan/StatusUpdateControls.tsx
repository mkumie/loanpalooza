import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoanStatus } from "@/types/loan";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StatusUpdateControlsProps {
  applicationId: string;
  currentStatus: LoanStatus;
  currentComments: string | null;
  onUpdate: () => void;
}

export const StatusUpdateControls = ({
  applicationId,
  currentStatus,
  currentComments,
  onUpdate,
}: StatusUpdateControlsProps) => {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [adminComments, setAdminComments] = useState(currentComments || "");
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: LoanStatus) => {
    const { error } = await supabase
      .from("loan_applications")
      .update({ 
        status: newStatus,
        admin_comments: adminComments,
        updated_at: new Date().toISOString()
      })
      .eq("id", applicationId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update application status",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Application status updated successfully",
    });
    
    setSelectedApplication(null);
    setAdminComments("");
    onUpdate();
  };

  return (
    <div className="space-y-2">
      {selectedApplication === applicationId ? (
        <div className="space-y-2">
          <Select
            onValueChange={(value) => handleStatusChange(value as LoanStatus)}
            defaultValue={currentStatus}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Add comments..."
            value={adminComments}
            onChange={(e) => setAdminComments(e.target.value)}
            className="w-full"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedApplication(null);
              setAdminComments("");
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedApplication(applicationId);
            setAdminComments(currentComments || "");
          }}
        >
          Update Status
        </Button>
      )}
    </div>
  );
};