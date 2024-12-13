import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusUpdateControls } from "@/components/loan/StatusUpdateControls";
import { LoanApplication } from "@/types/loan";
import { StatusBadge } from "./StatusBadge";

interface StatusSectionProps {
  application: LoanApplication;
  isAdmin?: boolean;
  onUpdate: () => void;
}

export const StatusSection = ({ application, isAdmin, onUpdate }: StatusSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Application Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">Current Status:</p>
            <StatusBadge status={application.status} />
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Admin Comments</p>
            {application.admin_comments ? (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{application.admin_comments}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No admin comments yet.</p>
            )}
          </div>

          {isAdmin && (
            <div className="mt-6">
              <StatusUpdateControls
                applicationId={application.id}
                currentStatus={application.status}
                currentComments={application.admin_comments}
                onUpdate={onUpdate}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};