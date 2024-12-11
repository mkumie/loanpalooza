import { Check, FileText, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="mb-6">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Required Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {documents.map((doc) => {
            const status = documentStatus.find(s => s.type === doc.type);
            return (
              <div key={doc.type} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="mt-1">
                  {status?.uploaded ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 border-2 rounded-full border-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
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
                    <p className="text-sm text-green-600 mt-1">
                      Uploaded: {status.fileName}
                    </p>
                  )}
                  {!status?.uploaded && status?.previousFileName && onCopyPrevious && status?.previousFilePath && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-white hover:bg-primary/5"
                      onClick={() => onCopyPrevious(doc.type, status.previousFilePath!)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Previous: {status.previousFileName}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};