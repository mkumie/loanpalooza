import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentChecklist } from "../DocumentChecklist";
import { DocumentUploadForm } from "../DocumentUploadForm";
import { REQUIRED_DOCUMENTS } from "@/constants/documentRequirements";
import { DocumentType, DocumentUploadStatus } from "@/types/documents";
import { useDocumentQueries } from "./useDocumentQueries";
import { useDocumentUpload } from "./useDocumentUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
    handleCopyPrevious 
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

  // Notify parent component about validation status
  React.useEffect(() => {
    onValidationChange?.(areRequiredDocumentsUploaded);
  }, [areRequiredDocumentsUploaded, onValidationChange]);

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold">Required Documents</h3>
      
      {recentApplicationId && previousDocuments?.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Documents from your previous application are available. Click "Copy from previous application" to reuse them.
          </AlertDescription>
        </Alert>
      )}

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
  );
};