import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ApplicationProgressProps {
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const ApplicationProgress = ({ status, createdAt, updatedAt }: ApplicationProgressProps) => {
  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "pending":
        return 25;
      case "reviewing":
        return 50;
      case "approved":
        return 100;
      case "rejected":
        return 100;
      default:
        return 0;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      case "reviewing":
        return "text-blue-500";
      default:
        return "text-amber-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          {getStatusIcon(status)}
          <div>
            <p className={`font-medium capitalize ${getStatusColor(status)}`}>
              {status}
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Progress value={getProgressPercentage(status)} className="h-2" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Submitted</p>
            <p className="font-medium">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Processing Time</p>
            <p className="font-medium">
              {Math.ceil(
                (new Date(updatedAt).getTime() - new Date(createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};