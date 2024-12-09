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
    <>
      <TableRow key={application.id} className="group">
        <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
        <TableCell>${application.loan_amount.toLocaleString()}</TableCell>
        <TableCell>{application.loan_purpose}</TableCell>
        <TableCell>
          <Badge
            variant={
              application.status === "approved"
                ? "success"
                : application.status === "rejected"
                ? "destructive"
                : "secondary"
            }
          >
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

                  <section>
                    <h3 className="font-semibold mb-2">Loan Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Loan Amount</label>
                        <p>${application.loan_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Purpose</label>
                        <p>{application.loan_purpose}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Repayment Period</label>
                        <p>{application.repayment_period} months</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Existing Loans</label>
                        <p>{application.existing_loans ? "Yes" : "No"}</p>
                      </div>
                      {application.existing_loans && (
                        <div className="col-span-2">
                          <label className="text-sm text-muted-foreground">Existing Loan Details</label>
                          <p>{application.existing_loan_details}</p>
                        </div>
                      )}
                    </div>
                  </section>

                  <section>
                    <h3 className="font-semibold mb-2">Reference Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Full Name</label>
                        <p>{application.reference_full_name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Relationship</label>
                        <p>{application.reference_relationship}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Address</label>
                        <p>{application.reference_address}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Phone</label>
                        <p>{application.reference_phone}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Occupation</label>
                        <p>{application.reference_occupation}</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-semibold mb-2">Bank Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Bank Name</label>
                        <p>{application.bank_name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Account Number</label>
                        <p>{application.account_number}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Account Type</label>
                        <p>{application.account_type}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Branch Name</label>
                        <p>{application.branch_name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Account Holder</label>
                        <p>{application.account_holder_name}</p>
                      </div>
                    </div>
                  </section>

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
    </>
  );
};