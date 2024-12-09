import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { DocumentType, RequiredDocument } from "@/types/documents";

interface DocumentUploadFormProps {
  documents: RequiredDocument[];
  onUpload: (file: File, documentType: DocumentType) => Promise<void>;
  isUploading: boolean;
}

export const DocumentUploadForm = ({ documents, onUpload, isUploading }: DocumentUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("loan_application");

  const handleUpload = async () => {
    if (file && documentType) {
      await onUpload(file, documentType);
      setFile(null);
    }
  };

  return (
    <div className="space-y-4 border-t pt-4 mt-6">
      <h4 className="font-medium">Upload New Document</h4>
      <div>
        <Label htmlFor="document-type">Document Type</Label>
        <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {documents.map((doc) => (
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
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
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
  );
};