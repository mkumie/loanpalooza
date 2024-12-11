import { Check, AlertCircle, Copy } from "lucide-react";
import { DocumentUploadStatus, RequiredDocument } from "@/types/documents";
import { Button } from "@/components/ui/button";

interface DocumentChecklistProps {
  documents: RequiredDocument[];
  documentStatus: DocumentUploadStatus[];
  onCopyPrevious?: (documentType: string, previousFilePath: string) => void;
}

export const DocumentChecklist = ({ documents, documentStatus, onCopyPrevious }: DocumentChecklistProps) => {
  return (
    <div className="space-y-4">
      {documents.map((doc) => {
        const status = documentStatus.find((s) => s.type === doc.type);
        return (
          <div key={doc.type} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
            <div className="mt-1">
              {status?.uploaded ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : doc.required ? (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              ) : (
                <div className="h-5 w-5 border-2 rounded-full border-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">{doc.label}</h4>
                {doc.required && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                    Required
                  </span>
                )}
                {doc.teacherOnly && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Teachers Only
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{doc.description}</p>
              {status?.fileName && (
                <p className="text-sm text-green-600 mt-1">
                  Uploaded: {status.fileName}
                </p>
              )}
              {!status?.uploaded && status?.previousFileName && onCopyPrevious && status?.previousFilePath && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => onCopyPrevious(doc.type, status.previousFilePath!)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy from previous application
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};