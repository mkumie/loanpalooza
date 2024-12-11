import { Check, FileText, Copy, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentType } from "@/types/documents";

interface DocumentChecklistProps {
  documents: Array<{
    type: DocumentType;
    label: string;
    description: string;
    required: boolean;
    teacherOnly?: boolean;
  }>;
  documentStatus: Array<{
    type: DocumentType;
    uploaded: boolean;
    fileName?: string;
    previousFileName?: string;
    previousFilePath?: string;
  }>;
  onCopyPrevious?: (documentType: DocumentType, previousFilePath: string) => void;
}

export const DocumentChecklist = ({ 
  documents, 
  documentStatus,
  onCopyPrevious 
}: DocumentChecklistProps) => {
  return (
    <div className="space-y-4">
      {documents.map((doc) => {
        const status = documentStatus.find(s => s.type === doc.type);
        return (
          <Card key={doc.type} className="relative overflow-hidden group">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{doc.label}</h3>
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
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  {status?.fileName && (
                    <div className="mt-2 p-2 bg-green-50 rounded-md">
                      <p className="text-sm text-green-700 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Uploaded: {status.fileName}
                      </p>
                    </div>
                  )}
                  {!status?.uploaded && status?.previousFileName && onCopyPrevious && status?.previousFilePath && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto bg-primary/5 hover:bg-primary/10 border-primary/20"
                        onClick={() => onCopyPrevious(doc.type, status.previousFilePath!)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Previous: {status.previousFileName}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};