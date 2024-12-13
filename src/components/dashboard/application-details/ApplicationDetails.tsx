import { LoanApplication } from "@/types/loan";
import { HeaderSection } from "./HeaderSection";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { LocationSection } from "./LocationSection";
import { EmploymentSection } from "./EmploymentSection";
import { DocumentsSection } from "./DocumentsSection";
import { StatusSection } from "./StatusSection";
import { RepaymentSection } from "@/components/loan/repayments/RepaymentSection";

interface ApplicationDetailsProps {
  application: LoanApplication;
  onUpdate: () => void;
  isAdmin?: boolean;
}

export const ApplicationDetails = ({
  application,
  onUpdate,
  isAdmin,
}: ApplicationDetailsProps) => {
  return (
    <div className="space-y-6">
      <HeaderSection application={application} />
      <PersonalInfoSection application={application} />
      <LocationSection application={application} />
      <EmploymentSection application={application} />
      {application.status === "approved" && (
        <RepaymentSection loanId={application.id} />
      )}
      <DocumentsSection
        applicationId={application.id}
        status={application.status}
      />
      {isAdmin && (
        <StatusSection
          applicationId={application.id}
          currentStatus={application.status}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};