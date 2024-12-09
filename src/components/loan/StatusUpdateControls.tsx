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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [status, setStatus] = useState<LoanStatus>(currentStatus);
  const [comments, setComments] = useState(currentComments || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("loan_applications")
        .update({ 
          status,
          admin_comments: comments,
          updated_at: new Date().toISOString()
        })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "The application status has been updated successfully.",
      });
      
      onUpdate();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update application status. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Application Status</CardTitle>
        <CardDescription>
          Change the status and add any relevant comments for this application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onValueChange={(value) => setStatus(value as LoanStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Comments</label>
          <Textarea
            placeholder="Add any comments or notes about this decision..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <Button 
          onClick={handleStatusUpdate}
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? "Updating..." : "Update Status"}
        </Button>
      </CardContent>
    </Card>
  );
};