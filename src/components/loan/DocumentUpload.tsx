import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Check, AlertCircle } from "lucide-react";
import { DocumentType, RequiredDocument, DocumentUploadStatus } from "@/types/documents";
import { useQuery } from "@tanstack/react-query";

const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  {
    type: "id",
    label: "ID Document",
    description: "National ID, Passport, or Driver's License",
    required: true,
  },
  {
    type: "proof_of_income",
    label: "Proof of Income",
    description: "Pay slip or employment letter",
    required: true,
  },
  {
    type: "bank_statement",
    label: "Bank Statement",
    description: "Last 3 months of bank statements",
    required: true,
  },
  {
    type: "utility_bill",
    label: "Utility Bill",
    description: "Recent utility bill for proof of address",
    required: false,
  },
];

interface DocumentUploadProps {
  applicationId: string;
  onUploadComplete?: () => void;
}

export const DocumentUpload = ({ applicationId, onUploadComplete }: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("id");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !documentType) {
      toast({
        title: "Error",
        description: "Please select a file and document type",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${applicationId}/${crypto.randomUUID()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("loan_documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save document metadata
      const { error: dbError } = await supabase.from("loan_documents").insert({
        loan_application_id: applicationId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        document_type: documentType,
      });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      // Reset form and refresh documents
      setFile(null);
      setDocumentType("id");
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
      
      {/* Document Checklist */}
      <div className="space-y-4">
        {REQUIRED_DOCUMENTS.map((doc) => {
          const status = documentStatus.find((s) => s.type === doc.type);
          return (
            <div key={doc.type} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
              <div className="mt-1">
                {status?.uploaded ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : doc.required ? (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                ) : (
                  <div className="h-5 w-5 border-2 rounded-full border-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{doc.label}</h4>
                  {doc.required && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{doc.description}</p>
                {status?.fileName && (
                  <p className="text-sm text-green-600 mt-1">
                    Uploaded: {status.fileName}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Form */}
      <div className="space-y-4 border-t pt-4 mt-6">
        <h4 className="font-medium">Upload New Document</h4>
        <div>
          <Label htmlFor="document-type">Document Type</Label>
          <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {REQUIRED_DOCUMENTS.map((doc) => (
                <SelectItem key={doc.type} value={doc.type}>
                  {doc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="file">Select File</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || !documentType || isUploading}
          className="w-full"
        >
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
      </div>
    </div>
  );
};