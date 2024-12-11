import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentChecklist } from "../DocumentChecklist";
import { DocumentUploadForm } from "../DocumentUploadForm";
import { REQUIRED_DOCUMENTS } from "@/constants/documentRequirements";
import { DocumentType, DocumentUploadStatus } from "@/types/documents";
import { useDocumentQueries } from "./useDocumentQueries";
import { useDocumentUpload } from "./useDocumentUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DocumentUploadSectionProps {
  applicationId: string;
  onValidationChange?: (isValid: boolean) => void;
}

export const DocumentUploadSection = ({ 
  applicationId, 
  onValidationChange 
}: DocumentUploadSectionProps) => {
  const { 
    uploadedDocuments, 
    previousDocuments, 
    refetchDocuments, 
    recentApplicationId 
  } = useDocumentQueries(applicationId);

  const { 
    isUploading, 
    handleUpload, 
    handleCopyPrevious,
    handleCopyAllPrevious 
  } = useDocumentUpload(applicationId, () => {
    refetchDocuments();
    toast.success("Documents updated successfully");
  });

  // Calculate document status including previous documents info
  const documentStatus: DocumentUploadStatus[] = REQUIRED_DOCUMENTS.map((doc) => {
    const currentDoc = uploadedDocuments?.find((uploaded) => uploaded.document_type === doc.type);
    const previousDoc = previousDocuments?.find((uploaded) => uploaded.document_type === doc.type);
    
    return {
      type: doc.type,
      uploaded: Boolean(currentDoc),
      fileName: currentDoc?.file_name,
      previousFileName: previousDoc?.file_name,
      previousFilePath: previousDoc?.file_path,
    };
  });

  // Check if all required documents are uploaded
  const areRequiredDocumentsUploaded = REQUIRED_DOCUMENTS
    .filter(doc => doc.required)
    .every(doc => documentStatus.find(status => status.type === doc.type)?.uploaded);

  // Check if there are any documents available to copy
  const hasPreviousDocuments = previousDocuments && previousDocuments.length > 0;

  // Notify parent component about validation status
  useEffect(() => {
    onValidationChange?.(areRequiredDocumentsUploaded);
  }, [areRequiredDocumentsUploaded, onValidationChange]);

  return (
    <div className="space-y-6">
      {recentApplicationId && hasPreviousDocuments && (
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary font-medium text-lg">Previous Documents Available!</AlertTitle>
          <AlertDescription className="mt-3">
            <div className="space-y-4">
              <p className="text-base">
                We found {previousDocuments.length} document{previousDocuments.length !== 1 ? 's' : ''} from your previous application. 
                You can copy them to save time.
              </p>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                onClick={() => handleCopyAllPrevious(documentStatus)}
              >
                <Copy className="mr-2 h-5 w-5" />
                Copy All Previous Documents
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Required Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <DocumentChecklist 
            documents={REQUIRED_DOCUMENTS} 
            documentStatus={documentStatus}
            onCopyPrevious={handleCopyPrevious}
          />
          
          <DocumentUploadForm 
            documents={REQUIRED_DOCUMENTS}
            onUpload={handleUpload}
            isUploading={isUploading}
          />
        </CardContent>
      </Card>
    </div>
  );
};