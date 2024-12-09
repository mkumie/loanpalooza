import { ScrollArea } from "@/components/ui/scroll-area";
import { LoanApplication } from "@/types/loan";
import { StatusUpdateControls } from "@/components/loan/StatusUpdateControls";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { LocationSection } from "./LocationSection";
import { EmploymentSection } from "./EmploymentSection";
import { DocumentsSection } from "./DocumentsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, FileText, User, MapPin, Briefcase, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ApplicationPDF } from "@/components/loan/ApplicationPDF";

interface ApplicationDetailsProps {
  application: LoanApplication;
  isAdmin?: boolean;
  onUpdate: () => void;
}

export const ApplicationDetails = ({ application, isAdmin, onUpdate }: ApplicationDetailsProps) => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6">
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

        <section>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Personal Information</h3>
          </div>
          <PersonalInfoSection application={application} />
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Location Details</h3>
          </div>
          <LocationSection application={application} />
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Employment Information</h3>
          </div>
          <EmploymentSection application={application} />
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Documents</h3>
          </div>
          <DocumentsSection applicationId={application.id} />
        </section>

        <Separator />

        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Current Status</p>
                  <p className="text-sm font-medium">{application.status}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Admin Comments</p>
                  {application.admin_comments ? (
                    <p className="text-sm">{application.admin_comments}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No admin comments yet.</p>
                  )}
                </div>

                {isAdmin && (
                  <div className="mt-6">
                    <StatusUpdateControls
                      applicationId={application.id}
                      currentStatus={application.status}
                      currentComments={application.admin_comments}
                      onUpdate={onUpdate}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ScrollArea>
  );
};