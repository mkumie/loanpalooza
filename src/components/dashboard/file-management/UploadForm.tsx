import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileCategory, FileUploadForm } from "@/types/files";
import { FileUp } from "lucide-react";

interface UploadFormProps {
  formData: FileUploadForm;
  onFormChange: (updates: Partial<FileUploadForm>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isUploading: boolean;
}

export const UploadForm = ({ formData, onFormChange, onSubmit, isUploading }: UploadFormProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFormChange({ file: e.target.files[0] });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onFormChange({ title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: FileCategory) => onFormChange({ category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="policy">Policy</SelectItem>
              <SelectItem value="form">Form</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => onFormChange({ description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          required
        />
      </div>

      <Button type="submit" disabled={isUploading}>
        <FileUp className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>
    </form>
  );
};