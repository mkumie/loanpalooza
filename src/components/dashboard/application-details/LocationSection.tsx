import { LoanApplication } from "@/types/loan";

interface LocationSectionProps {
  application: LoanApplication;
}

export const LocationSection = ({ application }: LocationSectionProps) => {
  return (
    <section>
      <h3 className="font-semibold mb-2">Location</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground">District</label>
          <p>{application.district}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Village</label>
          <p>{application.village}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Home Province</label>
          <p>{application.home_province}</p>
        </div>
      </div>
    </section>
  );
};