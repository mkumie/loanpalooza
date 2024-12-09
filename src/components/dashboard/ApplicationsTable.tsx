import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusUpdateControls } from "@/components/loan/StatusUpdateControls";
import { LoanApplication } from "@/types/loan";

interface ApplicationsTableProps {
  applications: LoanApplication[];
  isAdmin?: boolean;
  onUpdate: () => void;
}

export const ApplicationsTable = ({ applications, isAdmin, onUpdate }: ApplicationsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Status</TableHead>
          {isAdmin && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications?.map((app) => (
          <TableRow key={app.id}>
            <TableCell>
              {new Date(app.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>${app.loan_amount.toLocaleString()}</TableCell>
            <TableCell>{app.loan_purpose}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  app.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : app.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {app.status}
              </span>
              {app.admin_comments && (
                <p className="text-sm text-gray-600 mt-1">
                  {app.admin_comments}
                </p>
              )}
            </TableCell>
            {isAdmin && (
              <TableCell>
                <StatusUpdateControls
                  applicationId={app.id}
                  currentStatus={app.status}
                  currentComments={app.admin_comments}
                  onUpdate={onUpdate}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
        {applications?.length === 0 && (
          <TableRow>
            <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-8">
              No applications found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};