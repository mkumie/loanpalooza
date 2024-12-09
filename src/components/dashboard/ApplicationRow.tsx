import { LoanApplication } from "@/types/loan";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Upload, Eye } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DocumentUpload } from "@/components/loan/DocumentUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "./application-details/StatusBadge";
import { ApplicationDetails } from "./application-details/ApplicationDetails";

interface ApplicationRowProps {
  application: LoanApplication;
  isAdmin?: boolean;
  expandedRow: string | null;
  onExpandRow: (id: string | null) => void;
  onUpdate: () => void;
}

export const ApplicationRow = ({
  application,
  isAdmin,
  expandedRow,
  onExpandRow,
  onUpdate,
}: ApplicationRowProps) => {
  return (
    <TableRow key={application.id} className="group">
      <TableCell className="hidden sm:table-cell">
        {new Date(application.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>${application.loan_amount.toLocaleString()}</TableCell>
      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
        {application.loan_purpose}
      </TableCell>
      <TableCell>
        <StatusBadge status={application.status} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Details</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Loan Application Details</DialogTitle>
              </DialogHeader>
              <ApplicationDetails 
                application={application}
                isAdmin={isAdmin}
                onUpdate={onUpdate}
              />
            </DialogContent>
          </Dialog>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExpandRow(expandedRow === application.id ? null : application.id)}
              >
                <Upload className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Documents</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <DocumentUpload applicationId={application.id} onUploadComplete={onUpdate} />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </TableCell>
    </TableRow>
  );
};