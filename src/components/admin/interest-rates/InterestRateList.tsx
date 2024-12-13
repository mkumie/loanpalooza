import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { format } from "date-fns";

export const InterestRateList = ({ onUpdate }: { onUpdate: () => void }) => {
  const { data: rates, isLoading } = useQuery({
    queryKey: ["interest-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interest_rates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("interest_rates")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Interest rate status updated");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rate (%)</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Effective From</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rates?.map((rate) => (
          <TableRow key={rate.id}>
            <TableCell>{rate.rate_percentage}%</TableCell>
            <TableCell>{rate.description || "-"}</TableCell>
            <TableCell>
              {format(new Date(rate.effective_from), "PPP")}
            </TableCell>
            <TableCell>
              <Switch
                checked={rate.is_active}
                onCheckedChange={() => toggleStatus(rate.id, rate.is_active)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};