import { LoanApplication } from "@/types/loan";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Upload, Eye } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StatusUpdateControls } from "@/components/loan/StatusUpdateControls";
import { DocumentUpload } from "@/components/loan/DocumentUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PersonalInfoSection } from "./application-details/PersonalInfoSection";
import { LocationSection } from "./application-details/LocationSection";
import { EmploymentSection } from "./application-details/EmploymentSection";

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
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <TableRow key={application.id} className="group">
      <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
      <TableCell>${application.loan_amount.toLocaleString()}</TableCell>
      <TableCell>{application.loan_purpose}</TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(application.status)}>
          {application.status}
        </Badge>
      </TableCell>
      <TableCell className="space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Loan Application Details</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                <PersonalInfoSection application={application} />
                <LocationSection application={application} />
                <EmploymentSection application={application} />

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
          </DialogContent>
        </Dialog>

        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExpandRow(expandedRow === application.id ? null : application.id)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Documents
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <DocumentUpload applicationId={application.id} onUploadComplete={onUpdate} />
          </CollapsibleContent>
        </Collapsible>
      </TableCell>
    </TableRow>
  );
};