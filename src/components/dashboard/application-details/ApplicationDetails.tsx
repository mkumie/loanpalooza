import { ScrollArea } from "@/components/ui/scroll-area";
import { LoanApplication } from "@/types/loan";
import { StatusUpdateControls } from "@/components/loan/StatusUpdateControls";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { LocationSection } from "./LocationSection";
import { EmploymentSection } from "./EmploymentSection";
import { DocumentsSection } from "./DocumentsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApplicationDetailsProps {
  application: LoanApplication;
  isAdmin?: boolean;
  onUpdate: () => void;
}

export const ApplicationDetails = ({ application, isAdmin, onUpdate }: ApplicationDetailsProps) => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6">
        <PersonalInfoSection application={application} />
        <LocationSection application={application} />
        <EmploymentSection application={application} />
        <DocumentsSection applicationId={application.id} />

        {/* Show admin comments to all users, but only allow admins to update */}
        <section>
          <h3 className="font-semibold mb-2">Status Information</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Status: {application.status}</CardTitle>
            </CardHeader>
            <CardContent>
              {application.admin_comments ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Admin Comments:</p>
                  <p className="text-sm">{application.admin_comments}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No admin comments yet.</p>
              )}

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
            </CardContent>
          </Card>
        </section>
      </div>
    </ScrollArea>
  );
};