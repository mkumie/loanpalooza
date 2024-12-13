import { Button } from "@/components/ui/button";
import { Eye, FileIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { REQUIRED_DOCUMENTS } from "@/constants/documentRequirements";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface DocumentItemProps {
  fileName: string;
  fileType: string;
  uploadedAt: string;
  documentType: string;
  onView: () => void;
  viewUrl: string | null;
}

export const DocumentItem = ({
  fileName,
  fileType,
  uploadedAt,
  documentType,
  onView,
  viewUrl,
}: DocumentItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const documentRequirement = REQUIRED_DOCUMENTS.find(doc => doc.type === documentType);
  const displayLabel = documentRequirement?.label || documentType;

  const handleView = () => {
    onView();
    setIsOpen(true);
  };

  return (
    <>
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
                    <div>
                      <p className="font-medium truncate">{displayLabel}</p>
                      <p className="text-sm text-muted-foreground truncate">{fileName}</p>
                    </div>
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
            <Button variant="outline" size="sm" onClick={handleView}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{fileName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 relative overflow-hidden rounded-lg">
            {viewUrl && (
              fileType.startsWith('image/') ? (
                <img 
                  src={viewUrl} 
                  alt={fileName}
                  className="w-full h-auto"
                />
              ) : (
                <iframe
                  src={viewUrl}
                  className="w-full h-[70vh]"
                  title={fileName}
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};