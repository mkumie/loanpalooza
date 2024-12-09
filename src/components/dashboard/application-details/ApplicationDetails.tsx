import { ScrollArea } from "@/components/ui/scroll-area";
import { LoanApplication } from "@/types/loan";
import { StatusUpdateControls } from "@/components/loan/StatusUpdateControls";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { LocationSection } from "./LocationSection";
import { EmploymentSection } from "./EmploymentSection";
import { DocumentsSection } from "./DocumentsSection";

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

        {isAdmin && (
          <section>
            <h3 className="font-semibold mb-2">Admin Actions</h3>
            <StatusUpdateControls
              applicationId={application.id}
              currentStatus={application.status}
              currentComments={application.admin_comments}
              onUpdate={onUpdate}
            />
          </section>
        )}
      </div>
    </ScrollArea>
  );
};