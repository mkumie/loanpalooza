import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentChecklist } from "../DocumentChecklist";
import { DocumentUploadForm } from "../DocumentUploadForm";
import { REQUIRED_DOCUMENTS } from "@/constants/documentRequirements";
import { DocumentType, DocumentUploadStatus } from "@/types/documents";
import { useDocumentQueries } from "./useDocumentQueries";
import { useDocumentUpload } from "./useDocumentUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-medium">Previous Documents Available</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="space-y-3">
              <p>
                We found documents from your previous application. You can copy them to save time.
              </p>
              <Button
                variant="outline"
                className="bg-white hover:bg-primary/5"
                onClick={() => handleCopyAllPrevious(documentStatus)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy All Previous Documents
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="p-4 border rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-6">Required Documents</h3>
        
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
      </div>
    </div>
  );
};