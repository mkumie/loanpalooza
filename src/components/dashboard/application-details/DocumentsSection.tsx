import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { DocumentItem } from "./DocumentItem";

interface DocumentsSectionProps {
  applicationId: string;
}

export const DocumentsSection = ({ applicationId }: DocumentsSectionProps) => {
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<{ name: string; type: string } | null>(null);

  const { data: documents, isLoading } = useQuery({
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

  const handleView = async (filePath: string, fileName: string, fileType: string) => {
    try {
      const { data: { signedUrl }, error } = await supabase.storage
        .from("loan_documents")
        .createSignedUrl(filePath, 60);

      if (error) throw error;
      setViewUrl(signedUrl);
      setSelectedDoc({ name: fileName, type: fileType });
    } catch (error) {
      console.error("View error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Documents</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">Documents</h3>
      {documents && documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc) => (
            <DocumentItem
              key={doc.id}
              fileName={doc.file_name}
              fileType={doc.file_type}
              uploadedAt={doc.uploaded_at}
              onView={() => handleView(doc.file_path, doc.file_name, doc.file_type)}
              viewUrl={selectedDoc?.name === doc.file_name ? viewUrl : null}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No documents uploaded yet.</p>
      )}
    </section>
  );
};