import { LoanApplication } from "@/types/loan";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StatusUpdateControls } from "@/components/loan/StatusUpdateControls";
import { DocumentUpload } from "@/components/loan/DocumentUpload";

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
    <TableRow key={application.id}>
      <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
      <TableCell>${application.loan_amount.toLocaleString()}</TableCell>
      <TableCell>{application.loan_purpose}</TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            application.status === "approved"
              ? "bg-green-100 text-green-800"
              : application.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {application.status}
        </span>
        {application.admin_comments && (
          <p className="text-sm text-gray-600 mt-1">{application.admin_comments}</p>
        )}
      </TableCell>
      <TableCell className="space-x-2">
        {isAdmin && (
          <StatusUpdateControls
            applicationId={application.id}
            currentStatus={application.status}
            currentComments={application.admin_comments}
            onUpdate={onUpdate}
          />
        )}
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