import { LoanApplication } from "@/types/loan";

interface EmploymentSectionProps {
  application: LoanApplication;
}

export const EmploymentSection = ({ application }: EmploymentSectionProps) => {
  return (
    <section>
      <h3 className="font-semibold mb-2">Employment Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground">Employment Status</label>
          <p>{application.employment_status}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Employer</label>
          <p>{application.employer_name || "N/A"}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Occupation</label>
          <p>{application.occupation || "N/A"}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Monthly Income</label>
          <p>${application.monthly_income.toLocaleString()}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Employment Length</label>
          <p>{application.employment_length || "N/A"}</p>
        </div>
      </div>
    </section>
  );
};