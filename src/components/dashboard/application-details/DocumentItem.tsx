import { Button } from "@/components/ui/button";
import { Eye, FileIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentItemProps {
  fileName: string;
  fileType: string;
  uploadedAt: string;
  onView: () => void;
  viewUrl: string | null;
}

export const DocumentItem = ({
  fileName,
  fileType,
  uploadedAt,
  onView,
  viewUrl,
}: DocumentItemProps) => {
  return (
    <Card className="group hover:bg-muted/50 transition-colors">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-primary/10 p-2 rounded-lg">
            <FileIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="font-medium truncate">{fileName}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{fileName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{fileType.toUpperCase()}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(uploadedAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {viewUrl ? (
            <Button asChild variant="outline" size="sm">
              <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                View
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};