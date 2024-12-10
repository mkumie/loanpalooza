import { LoanApplication } from "@/types/loan";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Upload, Eye, Calendar, DollarSign, FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DocumentUpload } from "@/components/loan/DocumentUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "./application-details/StatusBadge";
import { ApplicationDetails } from "./application-details/ApplicationDetails";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const canUploadDocuments = application.is_draft || application.status === 'pending';

  return (
    <TableRow key={application.id} className="group hover:bg-muted/50">
      <TableCell className="hidden sm:table-cell">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(application.created_at).toLocaleDateString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Application Date</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>K {application.loan_amount.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Loan Amount</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="hidden md:table-cell max-w-[200px]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{application.loan_purpose}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{application.loan_purpose}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <StatusBadge status={application.status} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="hover:bg-primary/10">
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

          {canUploadDocuments && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExpandRow(expandedRow === application.id ? null : application.id)}
                  className="hover:bg-primary/10"
                >
                  <Upload className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Documents</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <DocumentUpload applicationId={application.id} onUploadComplete={onUpdate} />
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};