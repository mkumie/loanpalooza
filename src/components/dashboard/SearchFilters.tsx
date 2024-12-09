import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export const SearchFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: SearchFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        placeholder="Search by purpose or amount..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
  );
};