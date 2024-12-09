import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusUpdateControls } from "@/components/loan/StatusUpdateControls";
import { LoanApplication } from "@/types/loan";

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
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Current Status</p>
            <p className="text-sm font-medium">{application.status}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Admin Comments</p>
            {application.admin_comments ? (
              <p className="text-sm">{application.admin_comments}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No admin comments yet.</p>
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