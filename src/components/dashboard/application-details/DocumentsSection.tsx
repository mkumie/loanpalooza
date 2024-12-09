import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

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
        .createSignedUrl(filePath, 60); // URL valid for 60 seconds

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
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{doc.file_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(doc.file_path, doc.file_name, doc.file_type)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                  <DialogTitle>Document Preview</DialogTitle>
                  <DialogDescription>
                    Viewing: {selectedDoc?.name}
                  </DialogDescription>
                  {viewUrl && selectedDoc && (
                    selectedDoc.type.startsWith('image/') ? (
                      <img 
                        src={viewUrl} 
                        alt={selectedDoc.name}
                        className="w-full h-auto"
                      />
                    ) : (
                      <iframe
                        src={viewUrl}
                        className="w-full h-[80vh]"
                        title={selectedDoc.name}
                      />
                    )
                  )}
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No documents uploaded yet.</p>
      )}
    </section>
  );
};