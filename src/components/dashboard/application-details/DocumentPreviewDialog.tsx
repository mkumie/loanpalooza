import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface DocumentPreviewDialogProps {
  fileName: string;
  onView: () => void;
  viewUrl: string | null;
  fileType: string;
}

export const DocumentPreviewDialog = ({ fileName, onView, viewUrl, fileType }: DocumentPreviewDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] pt-10">
        <DialogTitle>Document Preview</DialogTitle>
        <DialogDescription>
          Viewing: {fileName}
        </DialogDescription>
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
              className="w-full h-[80vh]"
              title={fileName}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
};