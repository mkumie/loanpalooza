import { DocumentUploadSection } from "./document-upload/DocumentUploadSection";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

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
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      toast.error("You must be logged in to view documents");
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return (
    <DocumentUploadSection
      applicationId={applicationId}
      onValidationChange={onValidationChange}
    />
  );
};