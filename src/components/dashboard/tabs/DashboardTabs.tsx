import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "../DashboardStats";
import { ApplicationsTable } from "../ApplicationsTable";
import { FileManagement } from "../FileManagement";
import { DownloadableFiles } from "@/components/home/DownloadableFiles";
import { LoanApplication } from "@/types/loan";

interface DashboardTabsProps {
  isAdmin: boolean;
  applications: LoanApplication[] | undefined;
  isLoading: boolean;
  onUpdate: () => void;
}

export const DashboardTabs = ({
  isAdmin,
  applications,
  isLoading,
  onUpdate
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="applications">
      <TabsList>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        {isAdmin && <TabsTrigger value="files">File Management</TabsTrigger>}
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>

      <TabsContent value="applications" className="space-y-8">
        <DashboardStats isAdmin={isAdmin} />
        <ApplicationsTable 
          applications={applications || []} 
          isAdmin={isAdmin}
          onUpdate={onUpdate}
          isLoading={isLoading}
        />
      </TabsContent>

      {isAdmin && (
        <TabsContent value="files">
          <FileManagement />
        </TabsContent>
      )}

      <TabsContent value="resources">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Important Resources</h2>
          <p className="text-muted-foreground">
            Access important documents and resources for your loan application.
          </p>
          <DownloadableFiles />
        </div>
      </TabsContent>
    </Tabs>
  );
};