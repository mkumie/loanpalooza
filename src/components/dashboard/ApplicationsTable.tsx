import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoanApplication } from "@/types/loan";
import { useState } from "react";
import { SearchFilters } from "./SearchFilters";
import { Pagination } from "./Pagination";
import { ApplicationRow } from "./ApplicationRow";

interface ApplicationsTableProps {
  applications: LoanApplication[];
  isAdmin?: boolean;
  onUpdate: () => void;
}

export const ApplicationsTable = ({ applications, isAdmin, onUpdate }: ApplicationsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
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
  const paginatedApplications = filteredApplications?.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedApplications?.map((app) => (
            <ApplicationRow
              key={app.id}
              application={app}
              isAdmin={isAdmin}
              expandedRow={expandedRow}
              onExpandRow={setExpandedRow}
              onUpdate={onUpdate}
            />
          ))}
          {(!paginatedApplications || paginatedApplications.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No applications found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};