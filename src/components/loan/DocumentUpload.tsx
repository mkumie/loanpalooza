import { DocumentUploadSection } from "./document-upload/DocumentUploadSection";

interface DocumentUploadProps {
  applicationId: string;
  onUploadComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const DocumentUpload = ({ 
  applicationId, 
  onUploadComplete, 
  onValidationChange 
}: DocumentUploadProps) => {
  return (
    <DocumentUploadSection
      applicationId={applicationId}
      onValidationChange={onValidationChange}
    />
  );
};