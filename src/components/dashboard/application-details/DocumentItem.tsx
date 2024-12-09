import { FileText } from "lucide-react";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";

interface DocumentItemProps {
  fileName: string;
  fileType: string;
  uploadedAt: string;
  onView: () => void;
  viewUrl: string | null;
}

export const DocumentItem = ({ fileName, fileType, uploadedAt, onView, viewUrl }: DocumentItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <FileText className="h-5 w-5 text-gray-500" />
        <div>
          <p className="font-medium">{fileName}</p>
          <p className="text-sm text-gray-500">
            {new Date(uploadedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <DocumentPreviewDialog
        fileName={fileName}
        onView={onView}
        viewUrl={viewUrl}
        fileType={fileType}
      />
    </div>
  );
};