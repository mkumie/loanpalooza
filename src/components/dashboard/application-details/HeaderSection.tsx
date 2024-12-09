import { Clock, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ApplicationPDF } from "@/components/loan/ApplicationPDF";
import { LoanApplication } from "@/types/loan";

interface HeaderSectionProps {
  application: LoanApplication;
}

export const HeaderSection = ({ application }: HeaderSectionProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="text-sm">
          Submitted on {new Date(application.created_at).toLocaleDateString()}
        </span>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            View Summary
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[80vh]">
          <ApplicationPDF application={application} />
        </DialogContent>
      </Dialog>
    </div>
  );
};