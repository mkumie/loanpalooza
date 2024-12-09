import { LoanApplication } from "@/types/loan";

interface PersonalInfoSectionProps {
  application: LoanApplication;
}

export const PersonalInfoSection = ({ application }: PersonalInfoSectionProps) => {
  return (
    <section>
      <h3 className="font-semibold mb-2">Personal Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          <p>{application.first_name} {application.surname}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Date of Birth</label>
          <p>{new Date(application.date_of_birth).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Gender</label>
          <p>{application.gender}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Marital Status</label>
          <p>{application.marital_status}</p>
        </div>
      </div>
    </section>
  );
};