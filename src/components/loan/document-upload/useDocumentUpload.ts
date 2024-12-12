import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DocumentType, DocumentUploadStatus } from "@/types/documents";
import { toast } from "sonner";

export const useDocumentUpload = (applicationId: string, onUploadComplete?: () => void) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File, documentType: DocumentType) => {
    if (!applicationId?.trim()) {
      toast.error("Invalid application ID");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${applicationId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: dbError } = await supabase.from("loan_documents").insert({
        loan_application_id: applicationId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        document_type: documentType,
      });

      if (dbError) throw dbError;

      const { error: uploadError } = await supabase.storage
        .from("loan_documents")
        .upload(filePath, file);

      if (uploadError) {
        await supabase
          .from("loan_documents")
          .delete()
          .eq("file_path", filePath);
        throw uploadError;
      }

      toast.success("Document uploaded successfully");
      if (onUploadComplete) onUploadComplete();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyPrevious = async (documentType: DocumentType, previousFilePath: string) => {
    // Validate inputs before setting loading state
    if (!applicationId?.trim() || !previousFilePath) {
      toast.error("Invalid application or file information");
      return;
    }

    setIsUploading(true);
    try {
      const { data, error: downloadError } = await supabase.storage
        .from("loan_documents")
        .download(previousFilePath);

      if (downloadError) throw downloadError;

      const file = new File([data], previousFilePath.split("/").pop() || "document", {
        type: "application/octet-stream",
      });

      // Instead of calling handleUpload directly, we'll do the upload here
      const fileExt = file.name.split(".").pop();
      const filePath = `${applicationId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: dbError } = await supabase.from("loan_documents").insert({
        loan_application_id: applicationId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        document_type: documentType,
      });

      if (dbError) throw dbError;

      const { error: uploadError } = await supabase.storage
        .from("loan_documents")
        .upload(filePath, file);

      if (uploadError) {
        await supabase
          .from("loan_documents")
          .delete()
          .eq("file_path", filePath);
        throw uploadError;
      }

      toast.success("Document copied successfully");
      if (onUploadComplete) onUploadComplete();
    } catch (error: any) {
      console.error("Copy error:", error);
      toast.error("Failed to copy document from previous application");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyAllPrevious = async (documentStatus: DocumentUploadStatus[]) => {
    const documentsToProcess = documentStatus.filter(
      doc => !doc.uploaded && doc.previousFilePath
    );

    if (documentsToProcess.length === 0) {
      toast.info("No previous documents available to copy");
      return;
    }

    setIsUploading(true);
    let successCount = 0;

    for (const doc of documentsToProcess) {
      if (doc.previousFilePath) {
        try {
          await handleCopyPrevious(doc.type, doc.previousFilePath);
          successCount++;
        } catch (error) {
          console.error(`Failed to copy document: ${doc.type}`, error);
        }
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      toast.success(`Successfully copied ${successCount} document${successCount !== 1 ? 's' : ''}`);
    }
  };

  return {
    isUploading,
    handleUpload,
    handleCopyPrevious,
    handleCopyAllPrevious
  };
};