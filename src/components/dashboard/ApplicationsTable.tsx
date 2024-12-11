import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoanApplication } from "@/types/loan";
import { useState } from "react";
import { SearchFilters } from "./SearchFilters";
import { Pagination } from "./Pagination";
import { ApplicationRow } from "./ApplicationRow";
import { Card } from "@/components/ui/card";
import { FileX, Loader2 } from "lucide-react";

interface ApplicationsTableProps {
  applications: LoanApplication[];
  isAdmin?: boolean;
  onUpdate: () => void;
  isLoading?: boolean;
}

export const ApplicationsTable = ({ applications, isAdmin, onUpdate, isLoading }: ApplicationsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Filter applications based on search term and status
  const filteredApplications = applications?.filter((app) => {
    const matchesSearch =
      app.loan_purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `K ${app.loan_amount}`.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil((filteredApplications?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications?.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 space-y-4">
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileX className="h-10 w-10 mb-2" />
                      <p>No applications found</p>
                      {searchTerm || statusFilter !== "all" ? (
                        <p className="text-sm">Try adjusting your filters</p>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Card>
  );
};