import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { DocumentItem } from "./DocumentItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileX } from "lucide-react";

interface DocumentsSectionProps {
  applicationId: string;
}

export const DocumentsSection = ({ applicationId }: DocumentsSectionProps) => {
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<{ name: string; type: string } | null>(null);

  const { data: documents, isLoading } = useQuery({
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
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {documents && documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <DocumentItem
                key={doc.id}
                fileName={doc.file_name}
                fileType={doc.file_type}
                documentType={doc.document_type}
                uploadedAt={doc.uploaded_at}
                onView={() => handleView(doc.file_path, doc.file_name, doc.file_type)}
                viewUrl={selectedDoc?.name === doc.file_name ? viewUrl : null}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <FileX className="h-12 w-12 mb-4" />
            <p className="text-sm">No documents uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};