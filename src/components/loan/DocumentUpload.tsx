import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DocumentType, DocumentUploadStatus } from "@/types/documents";
import { useQuery } from "@tanstack/react-query";
import { REQUIRED_DOCUMENTS } from "@/constants/documentRequirements";
import { DocumentChecklist } from "./DocumentChecklist";
import { DocumentUploadForm } from "./DocumentUploadForm";
import * as React from "react";

interface DocumentUploadProps {
  applicationId: string;
  onUploadComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const DocumentUpload = ({ applicationId, onUploadComplete, onValidationChange }: DocumentUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Query to get the most recent application ID for prefilling documents
  const { data: recentApplicationId } = useQuery({
    queryKey: ["recentApplication"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("loan_applications")
        .select("id")
        .eq("user_id", user.id)
        .neq("status", "draft")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;
      return data.id;
    },
    enabled: !applicationId // Only run if we don't have a current application ID
  });

  // Query for current application documents
  const { data: uploadedDocuments, refetch: refetchDocuments } = useQuery({
    queryKey: ["loanDocuments", applicationId],
    queryFn: async () => {
      if (!applicationId?.trim()) {
        return [];
      }

      const { data, error } = await supabase
        .from("loan_documents")
        .select("*")
        .eq("loan_application_id", applicationId);

      if (error) throw error;
      return data;
    },
    enabled: Boolean(applicationId?.trim()),
  });

  // Query for previous application documents
  const { data: previousDocuments } = useQuery({
    queryKey: ["previousDocuments", recentApplicationId],
    queryFn: async () => {
      if (!recentApplicationId) return [];

      const { data, error } = await supabase
        .from("loan_documents")
        .select("*")
        .eq("loan_application_id", recentApplicationId);

      if (error) throw error;
      return data;
    },
    enabled: Boolean(recentApplicationId),
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

  const handleUpload = async (file: File, documentType: DocumentType) => {
    if (!applicationId?.trim()) {
      toast({
        title: "Error",
        description: "Invalid application ID",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // First insert the document metadata
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

      // Then upload the file to storage
      const { error: uploadError } = await supabase.storage
        .from("loan_documents")
        .upload(filePath, file);

      if (uploadError) {
        // If upload fails, clean up the database entry
        await supabase
          .from("loan_documents")
          .delete()
          .eq("file_path", filePath);
        throw uploadError;
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      refetchDocuments();
      if (onUploadComplete) onUploadComplete();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyPrevious = async (documentType: DocumentType, previousFilePath: string) => {
    if (!applicationId?.trim() || !previousFilePath) {
      toast({
        title: "Error",
        description: "Invalid application or file information",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Download the previous file
      const { data, error: downloadError } = await supabase.storage
        .from("loan_documents")
        .download(previousFilePath);

      if (downloadError) throw downloadError;

      // Create a new file object
      const file = new File([data], previousFilePath.split("/").pop() || "document", {
        type: "application/octet-stream",
      });

      // Upload to the new application
      await handleUpload(file, documentType);

      toast({
        title: "Success",
        description: "Document copied from previous application",
      });
    } catch (error: any) {
      console.error("Copy error:", error);
      toast({
        title: "Error",
        description: "Failed to copy document from previous application",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold">Required Documents</h3>
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