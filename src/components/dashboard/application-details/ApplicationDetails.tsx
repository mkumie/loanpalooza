import { ScrollArea } from "@/components/ui/scroll-area";
import { LoanApplication } from "@/types/loan";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { LocationSection } from "./LocationSection";
import { EmploymentSection } from "./EmploymentSection";
import { DocumentsSection } from "./DocumentsSection";
import { StatusSection } from "./StatusSection";
import { HeaderSection } from "./HeaderSection";
import { Separator } from "@/components/ui/separator";
import { FileText, User, MapPin, Briefcase } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";

interface ApplicationDetailsProps {
  application: LoanApplication;
  isAdmin?: boolean;
  onUpdate: () => void;
}

export const ApplicationDetails = ({ application, isAdmin, onUpdate }: ApplicationDetailsProps) => {
  const showStatusControls = isAdmin && !application.is_draft;
  const prevStatusRef = useRef(application.status);
  const prevCommentsRef = useRef(application.admin_comments);
  const session = useSession();

  useEffect(() => {
    // Only show notifications to the applicant, not the admin
    if (!isAdmin && session?.user?.id === application.user_id) {
      // Check if status has changed
      if (prevStatusRef.current !== application.status) {
        toast.info(`Application status updated to ${application.status}`, {
          description: "The status of your loan application has been updated.",
        });
        prevStatusRef.current = application.status;
      }

      // Check if admin comments have changed
      if (prevCommentsRef.current !== application.admin_comments && application.admin_comments) {
        toast.info("New admin feedback received", {
          description: application.admin_comments,
        });
        prevCommentsRef.current = application.admin_comments;
      }
    }
  }, [application.status, application.admin_comments, isAdmin, session?.user?.id, application.user_id]);

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6">
        <HeaderSection application={application} />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Personal Information</h3>
          </div>
          <PersonalInfoSection application={application} />
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Location Details</h3>
          </div>
          <LocationSection application={application} />
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Employment Information</h3>
          </div>
          <EmploymentSection application={application} />
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Documents</h3>
          </div>
          <DocumentsSection applicationId={application.id} />
        </section>

        <Separator />

        {showStatusControls && (
          <section>
            <StatusSection 
              application={application}
              isAdmin={isAdmin}
              onUpdate={onUpdate}
            />
          </section>
        )}
      </div>
    </ScrollArea>
  );
};