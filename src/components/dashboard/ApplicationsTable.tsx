import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusUpdateControls } from "@/components/loan/StatusUpdateControls";
import { LoanApplication } from "@/types/loan";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ApplicationsTableProps {
  applications: LoanApplication[];
  isAdmin?: boolean;
  onUpdate: () => void;
}

export const ApplicationsTable = ({ applications, isAdmin, onUpdate }: ApplicationsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter applications based on search term and status
  const filteredApplications = applications?.filter((app) => {
    const matchesSearch =
      app.loan_purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.loan_amount.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil((filteredApplications?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by purpose or amount..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
          {paginatedApplications?.map((app) => (
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
          {(!paginatedApplications || paginatedApplications.length === 0) && (
            <TableRow>
              <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-8">
                No applications found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};