import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DocumentType, DocumentUploadStatus } from "@/types/documents";
import { useQuery } from "@tanstack/react-query";
import { REQUIRED_DOCUMENTS } from "@/constants/documentRequirements";
import { DocumentChecklist } from "./DocumentChecklist";
import { DocumentUploadForm } from "./DocumentUploadForm";

interface DocumentUploadProps {
  applicationId: string;
  onUploadComplete?: () => void;
}

export const DocumentUpload = ({ applicationId, onUploadComplete }: DocumentUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Fetch existing documents
  const { data: uploadedDocuments, refetch: refetchDocuments } = useQuery({
    queryKey: ["loanDocuments", applicationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_documents")
        .select("*")
        .eq("loan_application_id", applicationId);

      if (error) throw error;
      return data;
    },
  });

  // Calculate document status
  const documentStatus: DocumentUploadStatus[] = REQUIRED_DOCUMENTS.map((doc) => ({
    type: doc.type,
    uploaded: uploadedDocuments?.some((uploaded) => uploaded.document_type === doc.type) ?? false,
    fileName: uploadedDocuments?.find((uploaded) => uploaded.document_type === doc.type)?.file_name,
  }));

  const handleUpload = async (file: File, documentType: DocumentType) => {
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

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold">Required Documents</h3>
      <DocumentChecklist documents={REQUIRED_DOCUMENTS} documentStatus={documentStatus} />
      <DocumentUploadForm 
        documents={REQUIRED_DOCUMENTS}
        onUpload={handleUpload}
        isUploading={isUploading}
      />
    </div>
  );
};